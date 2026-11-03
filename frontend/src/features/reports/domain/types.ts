// Fluxo de status do protótipo. Diverge do enum StatusDenuncia do UML por decisão da equipe
// (ver referencias/decisoes-e-refinamentos.md): nomes mais claros para o cidadão.
export const REPORT_STATUSES = [
  'received',
  'in_review',
  'in_progress',
  'resolved',
  'not_upheld',
] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

// Regras de negócio da tramitação: o admin só avança o fluxo; estados finais não mudam mais
export const ALLOWED_TRANSITIONS: Record<ReportStatus, readonly ReportStatus[]> = {
  received: ['in_review', 'not_upheld'],
  in_review: ['in_progress', 'resolved', 'not_upheld'],
  in_progress: ['resolved', 'not_upheld'],
  resolved: [],
  not_upheld: [],
};
export const isFinalStatus = (status: ReportStatus) => ALLOWED_TRANSITIONS[status].length === 0;

// Etapas exibidas na linha do tempo; a última é "resolved" ou "not_upheld"
export const STATUS_FLOW = ['received', 'in_review', 'in_progress'] as const;
export const FINAL_STATUSES = ['resolved', 'not_upheld'] as const;

export const REPORT_CATEGORIES = [
  'waste_disposal',
  'deforestation',
  'water_pollution',
  'air_pollution',
  'fire',
  'other',
] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

// Value object Localizacao do UML (latitude/longitude adiadas nesta versão)
export interface ReportLocation {
  state: string;
  city: string;
  address: string;
  reference?: string;
}

// Evidencia do UML; no protótipo guardamos só uma prévia reduzida da foto
export interface ReportEvidence {
  id: string;
  kind: 'photo' | 'video';
  name: string;
  size: number;
  mimeType: string;
  previewDataUrl?: string;
  uploadedAt: string;
}

// Histórico: mudanças de status e respostas do órgão (RespostaDenuncia)
export interface ReportHistoryEntry {
  id: string;
  kind: 'created' | 'status' | 'response';
  status?: ReportStatus;
  message?: string;
  authorRole: 'citizen' | 'admin';
  // Órgão que respondeu (exibido ao cidadão no lugar do nome da pessoa)
  authorName?: string;
  createdAt: string;
}

// Registro de cada vez que um administrador exibiu o CPF completo do denunciante (LGPD)
export interface DataAccessEntry {
  id: string;
  adminName: string;
  at: string;
}

// Dados do denunciante vistos pelo admin; o CPF completo só sai por revealCpf
export interface CitizenIdentity {
  name: string;
  email: string;
  phone: string | null;
  cpfMasked: string;
}

export interface Report {
  id: string;
  protocol: string;
  // null = denúncia anônima (enviada sem login)
  citizenId: string | null;
  title: string;
  category: ReportCategory;
  description: string;
  occurredOn: string;
  location: ReportLocation;
  evidences: ReportEvidence[];
  status: ReportStatus;
  history: ReportHistoryEntry[];
  accessLog?: DataAccessEntry[];
  createdAt: string;
  updatedAt: string;
}

export const isAnonymous = (report: Report) => report.citizenId === null;

export const hasOrgResponse = (report: Report) =>
  report.history.some((entry) => entry.authorRole === 'admin' && entry.message);

export interface CreateReportInput {
  title: string;
  category: ReportCategory;
  description: string;
  occurredOn: string;
  location: ReportLocation;
  files: File[];
}

// Limites de evidências exibidos ao usuário e validados no envio
export const EVIDENCE_LIMITS = {
  maxFiles: 5,
  photo: { types: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 10 * 1024 * 1024 },
  video: { types: ['video/mp4', 'video/webm', 'video/quicktime'], maxBytes: 50 * 1024 * 1024 },
} as const;

export function evidenceKindOf(mimeType: string): ReportEvidence['kind'] | null {
  if ((EVIDENCE_LIMITS.photo.types as readonly string[]).includes(mimeType)) return 'photo';
  if ((EVIDENCE_LIMITS.video.types as readonly string[]).includes(mimeType)) return 'video';
  return null;
}
