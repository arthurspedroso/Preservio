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
