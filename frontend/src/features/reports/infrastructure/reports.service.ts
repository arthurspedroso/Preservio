import { authService, readToken } from '@/features/auth/infrastructure/auth.service';
import { ApiError } from '@/shared/infrastructure/http-client';
import {
  generateId,
  readCollection,
  simulateLatency,
  writeCollection,
} from '@/shared/infrastructure/mock-db';
import { formatCpf, formatPhone, maskCpf } from '@/shared/lib/masks';
import { todayLocal } from '@/shared/lib/format';
import {
  ALLOWED_TRANSITIONS,
  EVIDENCE_LIMITS,
  evidenceKindOf,
  type CitizenIdentity,
  type CreateReportInput,
  type Report,
  type ReportEvidence,
  type ReportStatus,
} from '../domain/types';
import { createPhotoPreview } from './evidence-preview';
import { buildSeedReports } from './seed';

// Simula o Módulo de Denúncias + Módulo de Evidências (POST /denuncias do diagrama de sequência)

const COLLECTION = 'reports';

// Na primeira visita, carrega as denúncias de exemplo
function getReports(): Report[] {
  const stored = readCollection<Report>(COLLECTION);
  if (stored) return stored;
  const seeded = buildSeedReports();
  try {
    writeCollection(COLLECTION, seeded);
  } catch {
    // Sem espaço: segue com os dados em memória nesta chamada
  }
  return seeded;
}

const notFound = () => new ApiError('Denúncia não encontrada.', 404);

function requireAdmin(token: string) {
  const session = readToken(token);
  if (session.role !== 'admin') {
    throw new ApiError('Acesso restrito a administradores autorizados.', 403);
  }
  return session;
}

// Falha de gravação vira erro visível: nunca exibir confirmação falsa (regra de negócio 10)
function persist(reports: Report[]) {
  try {
    writeCollection(COLLECTION, reports);
  } catch {
    throw new ApiError(
      'Não foi possível salvar a alteração: o armazenamento deste navegador está cheio.',
      507,
    );
  }
}

function replace(reports: Report[], updated: Report): Report[] {
  return reports.map((r) => (r.id === updated.id ? updated : r));
}

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
  // Cidadão: só as próprias denúncias (RF18). Administrador: todas as recebidas (RF10, RF11).
  async list(token: string): Promise<Report[]> {
    const { sub, role } = readToken(token);
    await simulateLatency(450);
    const all = getReports();
    const visible = role === 'admin' ? all : all.filter((r) => r.citizenId === sub);
    return [...visible].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  // Denúncia de outra conta responde "não encontrada", sem revelar que ela existe
  async get(token: string, protocol: string): Promise<Report> {
    const { sub, role } = readToken(token);
    await simulateLatency(350);
    const report = getReports().find((r) => r.protocol === protocol);
    if (!report || (role !== 'admin' && report.citizenId !== sub)) throw notFound();
    return role === 'admin' ? report : { ...report, accessLog: undefined };
  },

  async updateStatus(
    token: string,
    reportId: string,
    status: ReportStatus,
    message?: string,
  ): Promise<Report> {
    const { sub } = requireAdmin(token);
    await simulateLatency(600);
    const reports = getReports();
    const report = reports.find((r) => r.id === reportId);
    if (!report) throw notFound();

    if (!ALLOWED_TRANSITIONS[report.status].includes(status)) {
      throw new ApiError('Esta alteração de status não é permitida.', 409);
    }
    const note = message?.trim();
    if (status === 'not_upheld' && (note?.length ?? 0) < 10) {
      throw new ApiError(
        'Informe a justificativa para marcar a denúncia como não procedente.',
        422,
      );
    }

    const admin = await authService.findSummary(sub);
    const now = new Date().toISOString();
    const updated: Report = {
      ...report,
      status,
      updatedAt: now,
      history: [
        ...report.history,
        {
          id: generateId(),
          kind: 'status',
          status,
          message: note || undefined,
          authorRole: 'admin',
          authorName: admin?.agency,
          createdAt: now,
        },
      ],
    };
    persist(replace(reports, updated));
    return updated;
  },

  async respond(token: string, reportId: string, message: string): Promise<Report> {
    const { sub } = requireAdmin(token);
    await simulateLatency(500);
    const text = message.trim();
    if (text.length < 10 || text.length > 1000) {
      throw new ApiError('A resposta deve ter entre 10 e 1000 caracteres.', 422);
    }
    const reports = getReports();
    const report = reports.find((r) => r.id === reportId);
    if (!report) throw notFound();

    const admin = await authService.findSummary(sub);
    const now = new Date().toISOString();
    const updated: Report = {
      ...report,
      updatedAt: now,
      history: [
        ...report.history,
        {
          id: generateId(),
          kind: 'response',
          message: text,
          authorRole: 'admin',
          authorName: admin?.agency,
          createdAt: now,
        },
      ],
    };
    persist(replace(reports, updated));
    return updated;
  },

  // Dados do denunciante para análise: CPF sempre mascarado (minimização, RNF02)
  async getIdentity(token: string, reportId: string): Promise<CitizenIdentity> {
    requireAdmin(token);
    await simulateLatency(300);
    const report = getReports().find((r) => r.id === reportId);
    const citizen = report && (await authService.findSummary(report.citizenId));
    if (!citizen) throw notFound();
    return {
      name: citizen.name,
      email: citizen.email,
      phone: citizen.phone ? formatPhone(citizen.phone) : null,
      cpfMasked: maskCpf(citizen.cpf ?? ''),
    };
  },

  // O CPF completo só sai aqui, e cada acesso fica registrado na própria denúncia
  async revealCpf(token: string, reportId: string): Promise<{ cpf: string }> {
    const { sub } = requireAdmin(token);
    await simulateLatency(300);
    const reports = getReports();
    const report = reports.find((r) => r.id === reportId);
    const citizen = report && (await authService.findSummary(report.citizenId));
    if (!report || !citizen?.cpf) throw notFound();

    const admin = await authService.findSummary(sub);
    persist(
      replace(reports, {
        ...report,
        accessLog: [
          ...(report.accessLog ?? []),
          {
            id: generateId(),
            adminName: admin?.name ?? 'Administrador',
            at: new Date().toISOString(),
          },
        ],
      }),
    );
    return { cpf: formatCpf(citizen.cpf) };
  },

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
