'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { listLinkClassName } from './nav-link';

export interface SiteHeaderProps {
  // Botões de conta (entrar/criar conta ou "Meu painel"), injetados pela camada de app
  accountActions?: { desktop: ReactNode; mobile: ReactNode };
}

const links = [
  { href: '/', key: 'home' },
  { href: '/orientacoes', key: 'guidance' },
] as const;

// Na home o header começa transparente sobre a foto; os botões reagem a data-overlay via CSS
export const overlaySolidButtonClassName =
  'group-data-[overlay=true]/header:bg-brand-foreground group-data-[overlay=true]/header:text-brand group-data-[overlay=true]/header:hover:bg-brand-foreground/90';
const overlayGhostButtonClassName =
  'group-data-[overlay=true]/header:text-brand-foreground group-data-[overlay=true]/header:hover:bg-brand-foreground/15 group-data-[overlay=true]/header:hover:text-brand-foreground';

const headerLinkClassName = (active: boolean) =>
  cn(
    'relative inline-flex h-10 items-center px-3 text-sm font-medium transition-colors',
    'after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary after:transition-opacity',
    'group-data-[overlay=true]/header:after:bg-brand-foreground',
    active
      ? 'text-foreground group-data-[overlay=true]/header:text-brand-foreground'
      : 'text-muted-foreground after:opacity-0 hover:text-foreground hover:after:opacity-40 group-data-[overlay=true]/header:text-brand-foreground/80 group-data-[overlay=true]/header:hover:text-brand-foreground',
  );

export function SiteHeader({ accountActions }: SiteHeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!isHome) return;
    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [isHome]);
  const overlay = isHome && !scrolled;

  return (
    <header
      data-overlay={overlay}
      className={cn(
        'group/header sticky top-0 z-40 border-b transition-colors duration-200',
        overlay
          ? 'border-transparent bg-gradient-to-b from-hero-scrim/60 to-transparent'
          : 'bg-background/95 backdrop-blur',
        // A foto da home sobe para trás do header
        isHome && '-mb-[4.5rem]',
      )}
    >
      {/* Grade de 3 colunas: o menu fica no centro real, seja qual for a largura dos lados */}
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Logo tone={overlay ? 'dark' : 'light'} className="justify-self-start" />

        <nav aria-label={t('mainNav')} className="hidden md:block">
          <ul className="flex items-center gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={headerLinkClassName(isActive(link.href))}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center justify-end gap-2 md:flex">
          {accountActions?.desktop ?? <GuestActions />}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('md:hidden', overlayGhostButtonClassName)}
              aria-label={t('openMenu')}
            >
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
                        className={listLinkClassName(isActive(link.href))}
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
      <Button asChild variant="ghost" size="sm" className={overlayGhostButtonClassName}>
        <Link href="/entrar">{t('login')}</Link>
      </Button>
      <Button asChild size="sm" className={overlaySolidButtonClassName}>
        <Link href="/cadastro">{t('signup')}</Link>
      </Button>
    </>
  );
}
