// Formatação para exibição em pt-BR

// Datas "só dia" (YYYY-MM-DD) no fuso local, sem o deslocamento de toISOString()
export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const todayLocal = () => toLocalDateString(new Date());

export function daysAgoLocal(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toLocalDateString(date);
}

// Meio-dia evita que a data "volte um dia" ao formatar em fusos negativos
export const formatDate = (value: string) =>
  new Date(value.length === 10 ? `${value}T12:00:00` : value).toLocaleDateString('pt-BR');

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}
