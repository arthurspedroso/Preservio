'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  FilePlus2,
  Files,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  MessagesSquare,
  UserRound,
} from 'lucide-react';
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
import { barLinkClassName, listLinkClassName, NavGroup } from './nav-link';
import { MAIN_CONTENT_ID, SkipLink } from './skip-link';

const NEW_REPORT_HREF = '/denuncias/nova';
const PROFILE_HREF = '/perfil';

const reportLinks = [
  { href: '/painel', key: 'dashboard', icon: LayoutDashboard },
  { href: '/denuncias', key: 'myReports', icon: Files },
] as const;

const helpLinks = [
  { href: '/assistente', key: 'assistant', icon: MessagesSquare },
  { href: '/orientacoes', key: 'guidance', icon: BookOpen },
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
  const helpActive = helpLinks.some(({ href }) => isActive(href));

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DemoBanner />
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 md:gap-6">
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
            <SheetContent side="left" className="gap-6 overflow-y-auto p-5 pt-5">
              <SheetTitle className="sr-only">{t('navLabel')}</SheetTitle>
              <Logo href="/painel" className="self-start" />
              <nav aria-label={t('navLabel')} className="space-y-5">
                <NavGroup label={t('groups.reports')}>
                  {reportLinks.map(({ href, key, icon: Icon }) => (
                    <li key={href}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          aria-current={isActive(href) ? 'page' : undefined}
                          className={listLinkClassName(isActive(href))}
                        >
                          <Icon aria-hidden />
                          {t(`nav.${key}`)}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                  <li>
                    <SheetClose asChild>
                      <Link
                        href={NEW_REPORT_HREF}
                        aria-current={isActive(NEW_REPORT_HREF) ? 'page' : undefined}
                        className={listLinkClassName(isActive(NEW_REPORT_HREF))}
                      >
                        <FilePlus2 aria-hidden />
                        {t('newReport')}
                      </Link>
                    </SheetClose>
                  </li>
                </NavGroup>
                <NavGroup label={t('groups.help')}>
                  {helpLinks.map(({ href, key, icon: Icon }) => (
                    <li key={href}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          aria-current={isActive(href) ? 'page' : undefined}
                          className={listLinkClassName(isActive(href))}
                        >
                          <Icon aria-hidden />
                          {t(`nav.${key}`)}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </NavGroup>
                <NavGroup label={t('groups.account')}>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href={PROFILE_HREF}
                        aria-current={isActive(PROFILE_HREF) ? 'page' : undefined}
                        className={listLinkClassName(isActive(PROFILE_HREF))}
                      >
                        <UserRound aria-hidden />
                        {t('profile')}
                      </Link>
                    </SheetClose>
                  </li>
                </NavGroup>
              </nav>
              <div className="mt-auto space-y-3 border-t pt-4">
                <div className="px-1">
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
              {reportLinks.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className={barLinkClassName(isActive(href))}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Menu>
                  <MenuTrigger className={cn(barLinkClassName(helpActive), 'group')}>
                    {t('groups.help')}
                    <ChevronDown
                      className="size-3.5 transition-transform group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </MenuTrigger>
                  <MenuContent align="start">
                    {helpLinks.map(({ href, key, icon: Icon }) => (
                      <MenuItem key={href} asChild>
                        <Link
                          href={href}
                          aria-current={isActive(href) ? 'page' : undefined}
                          className={cn(isActive(href) && 'bg-secondary font-medium')}
                        >
                          <Icon aria-hidden />
                          {t(`nav.${key}`)}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuContent>
                </Menu>
              </li>
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
                  className="hidden h-9 items-center gap-1.5 rounded-full border bg-card pl-1 pr-2 transition-colors hover:bg-muted md:flex"
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
                  <Link href={PROFILE_HREF}>
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
