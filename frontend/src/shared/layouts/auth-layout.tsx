import { type ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Logo } from '@/shared/ui/logo';
import { MAIN_CONTENT_ID, SkipLink } from './skip-link';
import heroForest from '@/shared/assets/images/hero-forest.jpg';

interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

// Tela dividida: foto da marca à esquerda (só em telas grandes) e formulário centralizado
export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  const t = useTranslations('layout.auth');

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <SkipLink />
      {/* Painel fixo na tela enquanto o formulário rola */}
      <div className="sticky top-0 hidden h-screen lg:block">
        <div className="relative h-full">
          <Image
            src={heroForest}
            alt={t('imageAlt')}
            fill
            priority
            sizes="50vw"
            placeholder="blur"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-hero-overlay" aria-hidden />
          <p className="absolute inset-x-10 bottom-10 font-display text-3xl font-semibold leading-tight text-brand-foreground">
            {t('quote')}
          </p>
        </div>
      </div>

      <div className="flex flex-col px-4 py-8 sm:px-10">
        <Logo />
        <main id={MAIN_CONTENT_ID} className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-semibold">{title}</h1>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
