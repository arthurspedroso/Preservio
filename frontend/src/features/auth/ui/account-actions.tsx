'use client';

import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { GuestActions } from '@/shared/layouts/site-header';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { SheetClose } from '@/shared/ui/sheet';
import { useSessionStore } from '../application/session-store';
import { homeFor } from '../domain/routes';

// Botões de conta do header público, conforme a sessão
export function AccountActions({ mobile = false }: { mobile?: boolean }) {
  const t = useTranslations('nav');
  const { hydrated, user } = useSessionStore();

  // Reserva o espaço até ler a sessão, para os botões não "piscarem"
  if (!hydrated) {
    return <div className={cn(mobile ? 'h-11' : 'h-8 w-48')} aria-hidden />;
  }
  if (!user) return <GuestActions mobile={mobile} />;

  const button = (
    <Button asChild size={mobile ? 'lg' : 'sm'}>
      <Link href={homeFor(user.role)}>
        <LayoutDashboard aria-hidden />
        {t('myArea')}
      </Link>
    </Button>
  );

  return mobile ? <SheetClose asChild>{button}</SheetClose> : button;
}
