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

// "há 2 dias", "ontem"… (fica em data absoluta a partir de 1 ano)
export function formatRelative(value: string): string {
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
  const minutes = Math.round((new Date(value).getTime() - Date.now()) / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return rtf.format(days, 'day');
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return rtf.format(months, 'month');
  return formatDate(value);
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '')
  ).toUpperCase();
}
