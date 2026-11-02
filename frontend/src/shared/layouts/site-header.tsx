'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';

export interface SiteHeaderProps {
  // Botões de conta (entrar/criar conta ou "Meu painel"), injetados pela camada de app
  accountActions?: { desktop: ReactNode; mobile: ReactNode };
}

const links = [
  { href: '/', key: 'home' },
  { href: '/orientacoes', key: 'guidance' },
] as const;

export function SiteHeader({ accountActions }: SiteHeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label={t('mainNav')} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
                    isActive(link.href) && 'font-medium text-foreground',
                  )}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {accountActions?.desktop ?? <GuestActions />}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label={t('openMenu')}>
              <Menu className="!size-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="gap-6 p-6 pt-16">
            <SheetTitle className="sr-only">{t('mainNav')}</SheetTitle>
            <nav aria-label={t('mainNav')}>
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                        className={cn(
                          'block rounded-lg px-3 py-2.5 text-base transition-colors hover:bg-muted',
                          isActive(link.href) &&
                            'bg-secondary font-medium text-secondary-foreground',
                        )}
                      >
                        {t(link.key)}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto grid gap-2">
              {accountActions?.mobile ?? <GuestActions mobile />}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function GuestActions({ mobile = false }: { mobile?: boolean }) {
  const t = useTranslations('nav');

  if (mobile) {
    return (
      <>
        <SheetClose asChild>
          <Button asChild variant="outline" size="lg">
            <Link href="/entrar">{t('login')}</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button asChild size="lg">
            <Link href="/cadastro">{t('signup')}</Link>
          </Button>
        </SheetClose>
      </>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link href="/entrar">{t('login')}</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/cadastro">{t('signup')}</Link>
      </Button>
    </>
  );
}
