import { readToken } from '@/features/auth/infrastructure/auth.service';
import { ApiError } from '@/shared/infrastructure/http-client';
import {
  generateId,
  readCollection,
  simulateLatency,
  writeCollection,
} from '@/shared/infrastructure/mock-db';
import { todayLocal } from '@/shared/lib/format';
import {
  EVIDENCE_LIMITS,
  evidenceKindOf,
  type CreateReportInput,
  type Report,
  type ReportEvidence,
} from '../domain/types';
import { createPhotoPreview } from './evidence-preview';

// Simula o Módulo de Denúncias + Módulo de Evidências (POST /denuncias do diagrama de sequência)

const COLLECTION = 'reports';

const getReports = () => readCollection<Report>(COLLECTION) ?? [];

// Protocolo sequencial por ano: PRV-2026-000001
function nextProtocol(reports: Report[], year: number): string {
  const prefix = `PRV-${year}-`;
  const last = reports
    .filter((r) => r.protocol.startsWith(prefix))
    .reduce((max, r) => Math.max(max, Number(r.protocol.slice(prefix.length))), 0);
  return `${prefix}${String(last + 1).padStart(6, '0')}`;
}

// Revalida no "servidor" o que o formulário já validou: o cliente nunca é a única barreira
function assertValid(input: CreateReportInput) {
  const fail = (message: string) => {
    throw new ApiError(message, 422);
  };
  if (input.title.trim().length < 5) fail('Título inválido.');
  if (input.description.trim().length < 20) fail('Descrição inválida.');
  if (!input.occurredOn || input.occurredOn > todayLocal()) fail('Data da ocorrência inválida.');
  const { state, city, address } = input.location;
  if (!state || city.trim().length < 2 || address.trim().length < 5) {
    fail('A localização da ocorrência é obrigatória.');
  }
  if (input.files.length > EVIDENCE_LIMITS.maxFiles) fail('Número máximo de evidências excedido.');
  for (const file of input.files) {
    const kind = evidenceKindOf(file.type);
    if (!kind || file.size > EVIDENCE_LIMITS[kind].maxBytes) fail(`Arquivo inválido: ${file.name}`);
  }
}

async function toEvidence(file: File): Promise<ReportEvidence> {
  const kind = evidenceKindOf(file.type)!;
  return {
    id: generateId(),
    kind,
    name: file.name,
    size: file.size,
    mimeType: file.type,
    previewDataUrl: kind === 'photo' ? await createPhotoPreview(file) : undefined,
    uploadedAt: new Date().toISOString(),
  };
}

export const reportsService = {
  async create(token: string, input: CreateReportInput): Promise<Report> {
    const { sub, role } = readToken(token);
    if (role !== 'citizen') throw new ApiError('Apenas cidadãos podem registrar denúncias.', 403);
    assertValid(input);

    await simulateLatency(900);
    const evidences = await Promise.all(input.files.map(toEvidence));
    const reports = getReports();
    const now = new Date();
    const createdAt = now.toISOString();

    const report: Report = {
      id: generateId(),
      protocol: nextProtocol(reports, now.getFullYear()),
      citizenId: sub,
      title: input.title.trim(),
      category: input.category,
      description: input.description.trim(),
      occurredOn: input.occurredOn,
      location: {
        state: input.location.state,
        city: input.location.city.trim(),
        address: input.location.address.trim(),
        reference: input.location.reference?.trim() || undefined,
      },
      evidences,
      status: 'received',
      history: [
        {
          id: generateId(),
          kind: 'created',
          status: 'received',
          authorRole: 'citizen',
          createdAt,
        },
      ],
      createdAt,
      updatedAt: createdAt,
    };

    // Falha de gravação vira erro visível: nunca exibir confirmação falsa (regra de negócio 10)
    try {
      writeCollection(COLLECTION, [...reports, report]);
    } catch {
      throw new ApiError(
        'Não foi possível salvar a denúncia: o armazenamento deste navegador está cheio. Remova algumas evidências e tente novamente.',
        507,
      );
    }
    return report;
  },
};
