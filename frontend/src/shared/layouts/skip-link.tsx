import { useTranslations } from 'next-intl';

export const MAIN_CONTENT_ID = 'conteudo';

export function SkipLink() {
  const t = useTranslations('nav');

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only z-[60] rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t('skipToContent')}
    </a>
  );
}
