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
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { DemoBanner } from '@/shared/ui/demo-banner';
import { Logo } from '@/shared/ui/logo';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { MAIN_CONTENT_ID, SkipLink } from './skip-link';

const items: { href: string; key: string; icon: LucideIcon }[] = [
  { href: '/admin', key: 'receivedReports', icon: Inbox },
  { href: '/admin/perfil', key: 'profile', icon: UserRound },
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
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="space-y-3 px-2 pt-2">
        <Logo href="/admin" />
        <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-brand-foreground">
          <ShieldCheck className="size-3.5" aria-hidden />
          {t('badge')}
        </p>
      </div>

      <nav aria-label={t('navLabel')}>
        <ul className="space-y-1">
          {items.map(({ href, key, icon: Icon }) => (
            <li key={href}>
              {wrap(
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive(href)
                      ? 'bg-secondary font-medium text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {t(`nav.${key}`)}
                </Link>,
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-xl border bg-muted/40 p-3">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          {user.agency && <p className="mt-1 text-xs text-primary">{user.agency}</p>}
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
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
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <div className="flex items-center justify-center gap-2 bg-brand px-4 py-1.5 text-xs font-medium text-brand-foreground">
        <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
        {t('ribbon')}
      </div>
      <DemoBanner />

      <div className="flex flex-1 lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="hidden border-r bg-card lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <SidebarContent user={user} onLogout={onLogout} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2" aria-label={t('openMenu')}>
                  <MenuIcon className="!size-5" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle className="sr-only">{t('navLabel')}</SheetTitle>
                <SidebarContent user={user} onLogout={onLogout} inSheet />
              </SheetContent>
            </Sheet>
            <Logo href="/admin" />
          </div>

          <main
            id={MAIN_CONTENT_ID}
            className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
