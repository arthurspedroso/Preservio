import { useTranslations } from 'next-intl';
import { Logo } from '@/shared/ui/logo';

export function SiteFooter() {
  const t = useTranslations('layout.footer');

  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo tone="dark" imageClassName="h-12" />
          <p className="text-sm text-brand-foreground/80">{t('about')}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('privacyTitle')}</p>
          <p className="text-sm text-brand-foreground/80">{t('privacy')}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('teamTitle')}</p>
          <ul className="space-y-1 text-sm text-brand-foreground/80">
            {(t.raw('team') as string[]).map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
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
