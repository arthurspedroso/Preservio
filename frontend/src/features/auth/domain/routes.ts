import type { UserRole } from './types';

export const homeFor = (role: UserRole) => (role === 'admin' ? '/admin' : '/painel');

const isAdminPath = (path: string) => path === '/admin' || path.startsWith('/admin/');

// Aceita só caminhos internos e compatíveis com o perfil; o resto cai na área do usuário
export function resolveRedirect(redirect: string | null | undefined, role: UserRole): string {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) return homeFor(role);
  if (role === 'admin' ? !isAdminPath(redirect) : isAdminPath(redirect)) return homeFor(role);
  return redirect;
}
