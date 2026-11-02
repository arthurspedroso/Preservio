'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, FilePlus2, LogOut, Menu as MenuIcon, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { initialsOf } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { DemoBanner } from '@/shared/ui/demo-banner';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Logo } from '@/shared/ui/logo';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { MAIN_CONTENT_ID, SkipLink } from './skip-link';

const NEW_REPORT_HREF = '/denuncias/nova';

const links = [
  { href: '/painel', key: 'dashboard' },
  { href: '/denuncias', key: 'myReports' },
  { href: '/assistente', key: 'assistant' },
  { href: '/orientacoes', key: 'guidance' },
] as const;

interface CitizenShellProps {
  user: { name: string; email: string };
  onLogout: () => void;
  children: ReactNode;
}

// Cidadão: navegação no topo, igual ao site público (consistência) e com poucos itens (Lei de Hick)
export function CitizenShell({ user, onLogout, children }: CitizenShellProps) {
  const t = useTranslations('layout.citizen');
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/denuncias') {
      return pathname === href || (pathname.startsWith(`${href}/`) && pathname !== NEW_REPORT_HREF);
    }
    return pathname === href;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DemoBanner />
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 md:hidden"
                aria-label={t('openMenu')}
              >
                <MenuIcon className="!size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="gap-6 p-6 pt-16">
              <SheetTitle className="sr-only">{t('navLabel')}</SheetTitle>
              <nav aria-label={t('navLabel')}>
                <ul className="space-y-1">
                  {links.map(({ href, key }) => (
                    <li key={href}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          aria-current={isActive(href) ? 'page' : undefined}
                          className={cn(
                            'block rounded-lg px-3 py-2.5 text-base transition-colors hover:bg-muted',
                            isActive(href) && 'bg-secondary font-medium text-secondary-foreground',
                          )}
                        >
                          {t(`nav.${key}`)}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/perfil"
                        aria-current={pathname === '/perfil' ? 'page' : undefined}
                        className={cn(
                          'block rounded-lg px-3 py-2.5 text-base transition-colors hover:bg-muted',
                          pathname === '/perfil' &&
                            'bg-secondary font-medium text-secondary-foreground',
                        )}
                      >
                        {t('profile')}
                      </Link>
                    </SheetClose>
                  </li>
                </ul>
              </nav>
              <div className="mt-auto space-y-3">
                <div className="rounded-xl border p-3">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" className="w-full" onClick={onLogout}>
                  <LogOut aria-hidden />
                  {t('logout')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Logo href="/painel" />

          <nav aria-label={t('navLabel')} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {links.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
                      isActive(href) && 'font-medium text-foreground',
                    )}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild size="sm">
              <Link href={NEW_REPORT_HREF}>
                <FilePlus2 aria-hidden />
                <span className="hidden sm:inline">{t('newReport')}</span>
                <span className="sm:hidden">{t('newReportShort')}</span>
              </Link>
            </Button>

            <Menu>
              <MenuTrigger asChild>
                <button
                  type="button"
                  aria-label={t('account')}
                  className="hidden items-center gap-1.5 rounded-full border bg-card py-1 pl-1 pr-2 transition-colors hover:bg-secondary/60 md:flex"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
                    {initialsOf(user.name)}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
                </button>
              </MenuTrigger>
              <MenuContent align="end">
                <MenuLabel className="px-3 py-2">
                  <span className="block truncate text-sm font-medium">{user.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                </MenuLabel>
                <MenuSeparator />
                <MenuItem asChild>
                  <Link href="/perfil">
                    <UserRound aria-hidden />
                    {t('profile')}
                  </Link>
                </MenuItem>
                <MenuItem onSelect={onLogout}>
                  <LogOut aria-hidden />
                  {t('logout')}
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </div>
      </header>

      <main
        id={MAIN_CONTENT_ID}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-10"
      >
        {children}
      </main>
    </div>
  );
}
