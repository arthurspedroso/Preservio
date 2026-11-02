'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  LogOut,
  Menu as MenuIcon,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { DemoNotice } from '@/shared/ui/demo-notice';
import { Logo } from '@/shared/ui/logo';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { listLinkClassName, NavGroup } from './nav-link';
import { MAIN_CONTENT_ID, SkipLink } from './skip-link';

const groups: { key: string; items: { href: string; key: string; icon: LucideIcon }[] }[] = [
  { key: 'management', items: [{ href: '/admin', key: 'receivedReports', icon: Inbox }] },
  { key: 'account', items: [{ href: '/admin/perfil', key: 'profile', icon: UserRound }] },
];

interface AdminShellProps {
  user: { name: string; email: string; agency?: string };
  onLogout: () => void;
  children: ReactNode;
}

function SidebarContent({
  user,
  onLogout,
  inSheet = false,
}: Omit<AdminShellProps, 'children'> & { inSheet?: boolean }) {
  const t = useTranslations('layout.admin');
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/admin'
      ? pathname === '/admin' || pathname.startsWith('/admin/denuncias')
      : pathname === href;
  const wrap = (node: ReactNode) => (inSheet ? <SheetClose asChild>{node}</SheetClose> : node);

  return (
    <div className="flex h-full flex-col gap-7 p-4">
      <div className="space-y-1.5 px-2 pt-1">
        <Logo href="/admin" tone="dark" imageClassName="h-11" />
        <p className="flex items-center gap-1.5 text-xs font-medium text-sidebar-primary">
          <ShieldCheck className="size-3.5" aria-hidden />
          {t('badge')}
        </p>
      </div>

      <nav aria-label={t('navLabel')} className="space-y-5">
        {groups.map((group) => (
          <NavGroup key={group.key} label={t(`groups.${group.key}`)} tone="dark">
            {group.items.map(({ href, key, icon: Icon }) => (
              <li key={href}>
                {wrap(
                  <Link
                    href={href}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className={listLinkClassName(isActive(href), 'dark')}
                  >
                    <Icon aria-hidden />
                    {t(`nav.${key}`)}
                  </Link>,
                )}
              </li>
            ))}
          </NavGroup>
        ))}
      </nav>

      <div className="mt-auto space-y-3 border-t border-sidebar-border pt-4">
        <div className="px-2">
          <p className="truncate text-sm font-medium text-sidebar-accent-foreground">{user.name}</p>
          <p className="truncate text-xs text-sidebar-foreground/75">{user.email}</p>
          {user.agency && <p className="mt-1 text-xs text-sidebar-primary">{user.agency}</p>}
        </div>
        <Button variant="inverse-outline" className="w-full" onClick={onLogout}>
          <LogOut aria-hidden />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
}

// Admin: ferramenta de trabalho, com sidebar fixa e identificação clara de "ambiente de gestão"
export function AdminShell({ user, onLogout, children }: AdminShellProps) {
  const t = useTranslations('layout.admin');

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <SkipLink />
      <aside className="hidden bg-sidebar text-sidebar-foreground lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent user={user} onLogout={onLogout} />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Uma faixa só: ambiente restrito + dados simulados (regra de negócio 11) */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b bg-card px-4 py-2 sm:px-6 lg:px-8">
          <p className="flex items-center gap-1.5 text-xs font-medium text-brand">
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
            {t('ribbon')}
          </p>
          <DemoNotice />
        </div>

        <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2" aria-label={t('openMenu')}>
                <MenuIcon className="!size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent tone="dark">
              <SheetTitle className="sr-only">{t('navLabel')}</SheetTitle>
              <SidebarContent user={user} onLogout={onLogout} inSheet />
            </SheetContent>
          </Sheet>
          <Logo href="/admin" />
        </div>

        <main
          id={MAIN_CONTENT_ID}
          className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
