'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FilePlus2,
  Files,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { DemoNotice } from '@/shared/ui/demo-notice';
import { Logo } from '@/shared/ui/logo';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { MAIN_CONTENT_ID, SkipLink } from './skip-link';

export type AppArea = 'citizen' | 'admin';

interface NavItem {
  href: string;
  key: string;
  icon: LucideIcon;
}

const navigation: Record<AppArea, NavItem[]> = {
  citizen: [
    { href: '/painel', key: 'dashboard', icon: LayoutDashboard },
    { href: '/denuncias', key: 'myReports', icon: Files },
    { href: '/assistente', key: 'assistant', icon: MessagesSquare },
    { href: '/orientacoes', key: 'guidance', icon: BookOpen },
    { href: '/perfil', key: 'profile', icon: UserRound },
  ],
  admin: [
    { href: '/admin', key: 'receivedReports', icon: Inbox },
    { href: '/admin/perfil', key: 'profile', icon: UserRound },
  ],
};

const NEW_REPORT_HREF = '/denuncias/nova';

interface AppShellProps {
  area: AppArea;
  user: { name: string; email: string };
  onLogout: () => void;
  children: ReactNode;
}

// O item ativo é o de href mais longo que casa com a rota atual
// (assim "/denuncias/nova" não acende "Minhas denúncias")
function useActiveHref(items: NavItem[]) {
  const pathname = usePathname();
  if (pathname === NEW_REPORT_HREF) return NEW_REPORT_HREF;
  return items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

function SidebarContent({
  area,
  user,
  onLogout,
  activeHref,
  inSheet = false,
}: Omit<AppShellProps, 'children'> & { activeHref?: string; inSheet?: boolean }) {
  const t = useTranslations('layout.app');
  const items = navigation[area];
  // Dentro do menu mobile cada link fecha o painel ao navegar
  const wrap = (node: ReactNode) => (inSheet ? <SheetClose asChild>{node}</SheetClose> : node);

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="space-y-3 px-2 pt-2">
        <Logo href={area === 'admin' ? '/admin' : '/painel'} tone="dark" />
        {area === 'admin' && (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sidebar-primary px-2.5 py-1 text-xs font-semibold text-sidebar-primary-foreground">
            <ShieldCheck className="size-3.5" aria-hidden />
            {t('adminBadge')}
          </p>
        )}
      </div>

      {area === 'citizen' &&
        wrap(
          <Button
            asChild
            size="lg"
            className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          >
            <Link
              href={NEW_REPORT_HREF}
              aria-current={activeHref === NEW_REPORT_HREF ? 'page' : undefined}
            >
              <FilePlus2 aria-hidden />
              {t('newReport')}
            </Link>
          </Button>,
        )}

      <nav aria-label={t(`navLabel.${area}`)}>
        <ul className="space-y-1">
          {items.map(({ href, key, icon: Icon }) => {
            const active = activeHref === href;
            return (
              <li key={href}>
                {wrap(
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {t(`nav.${key}`)}
                  </Link>,
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        <DemoNotice tone="dark" />
        <div className="rounded-xl border border-sidebar-border p-3">
          <p className="truncate text-sm font-medium text-sidebar-accent-foreground">{user.name}</p>
          <p className="truncate text-xs text-sidebar-foreground/75">{user.email}</p>
          <p className="mt-1 text-xs text-sidebar-primary">{t(`roles.${area}`)}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onLogout}
        >
          <LogOut aria-hidden />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ area, user, onLogout, children }: AppShellProps) {
  const t = useTranslations('layout.app');
  const activeHref = useActiveHref(navigation[area]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <SkipLink />

      <aside className="sticky top-0 hidden h-screen bg-sidebar text-sidebar-foreground lg:block">
        <SidebarContent area={area} user={user} onLogout={onLogout} activeHref={activeHref} />
      </aside>

      {/* Barra compacta para celular e tablet */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('openMenu')}>
              <Menu className="!size-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent tone="dark">
            <SheetTitle className="sr-only">{t(`navLabel.${area}`)}</SheetTitle>
            <SidebarContent
              area={area}
              user={user}
              onLogout={onLogout}
              activeHref={activeHref}
              inSheet
            />
          </SheetContent>
        </Sheet>
        <Logo href={area === 'admin' ? '/admin' : '/painel'} className="mr-auto" />
        {area === 'admin' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-brand-foreground">
            <ShieldCheck className="size-3.5" aria-hidden />
            {t('adminShort')}
          </span>
        ) : (
          <Button asChild size="sm">
            <Link href={NEW_REPORT_HREF}>
              <FilePlus2 aria-hidden />
              {t('newReportShort')}
            </Link>
          </Button>
        )}
      </div>

      <main
        id={MAIN_CONTENT_ID}
        className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10"
      >
        {children}
      </main>
    </div>
  );
}
