import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('layout.footer');

  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-2">
          <p className="font-display text-xl font-semibold">Preservio</p>
          <p className="text-sm text-brand-foreground/80">{t('about')}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('privacyTitle')}</p>
          <p className="text-sm text-brand-foreground/80">{t('privacy')}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('teamTitle')}</p>
          <p className="text-sm text-brand-foreground/80">{t('team')}</p>
        </div>
      </div>
      <div className="border-t border-brand-foreground/15">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-brand-foreground/70 sm:px-6">
          {t('disclaimer')}
        </p>
      </div>
    </footer>
  );
}
