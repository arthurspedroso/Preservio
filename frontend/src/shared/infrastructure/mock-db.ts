// Persistência simulada do protótipo: coleções JSON no localStorage deste navegador.
// Substitui o backend nesta versão; os serviços que a usam mantêm os contratos da API real.

const PREFIX = 'preservio:v1:';

export function readCollection<T>(name: string): T[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + name);
    return raw ? (JSON.parse(raw) as T[]) : null;
  } catch {
    return null;
  }
}

export function writeCollection<T>(name: string, items: T[]): void {
  window.localStorage.setItem(PREFIX + name, JSON.stringify(items));
}

// Latência artificial para que os estados de carregamento apareçam na demonstração
export function simulateLatency(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 300));
}

export function generateId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// SHA-256 quando disponível; o fallback cobre acesso por IP na rede local (sem contexto seguro)
export async function hashSecret(secret: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(secret);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 5381;
  for (let i = 0; i < secret.length; i++) hash = (hash * 33) ^ secret.charCodeAt(i);
  return `djb2-${(hash >>> 0).toString(16)}`;
}

// Apaga as coleções e a sessão deste navegador; a próxima visita recria os dados de exemplo
export function resetDemoData(): void {
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => window.localStorage.removeItem(key));
}
