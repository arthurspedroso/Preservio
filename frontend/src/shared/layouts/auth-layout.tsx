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
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <SkipLink />
      {/* Painel fixo na tela enquanto o formulário rola */}
      <div className="sticky top-0 hidden h-screen lg:block">
        <div className="relative h-full">
          <Image
            src={heroForest}
            alt={t('imageAlt')}
            fill
            priority
            sizes="45vw"
            placeholder="blur"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-hero-fade" aria-hidden />
          <p className="absolute inset-x-10 bottom-10 font-display text-2xl font-semibold leading-snug text-brand-foreground">
            {t('quote')}
          </p>
        </div>
      </div>

      {/* Logo no mesmo eixo do formulário */}
      <main id={MAIN_CONTENT_ID} className="flex items-center justify-center px-4 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo variant="stacked" imageClassName="h-32" />
          </div>
          <h1 className="text-center text-2xl font-bold sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-2 text-center text-sm text-muted-foreground">{description}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
