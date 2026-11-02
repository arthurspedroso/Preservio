import Image from 'next/image';
import Link from 'next/link';
import { Activity, ClipboardList, Eye, MapPin, ShieldCheck, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import heroForest from '@/shared/assets/images/hero-forest.jpg';
import { Button } from '@/shared/ui/button';

const steps = [
  { key: 'register', icon: ClipboardList },
  { key: 'details', icon: MapPin },
  { key: 'follow', icon: Activity },
] as const;

const pillars = [
  { key: 'identified', icon: Users },
  { key: 'restricted', icon: ShieldCheck },
  { key: 'transparency', icon: Eye },
] as const;

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image
          src={heroForest}
          alt={t('hero.imageAlt')}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" aria-hidden />
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <p className="inline-flex rounded-full bg-brand-foreground/15 px-3 py-1 text-xs font-medium text-brand-foreground backdrop-blur">
            {t('hero.eyebrow')}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] text-brand-foreground sm:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-foreground/90">
            {t('hero.description')}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="inverse" size="xl">
              <Link href="/denuncias/nova">{t('hero.primaryCta')}</Link>
            </Button>
            <Button asChild variant="inverse-outline" size="xl">
              <Link href="/entrar">{t('hero.secondaryCta')}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 id="how-it-works" className="text-3xl font-semibold sm:text-4xl">
          {t('steps.title')}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t('steps.description')}</p>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(({ key, icon: Icon }, index) => (
            <li key={key} className="rounded-xl border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-display text-3xl font-semibold text-primary/40" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">
                <span className="sr-only">{t('steps.stepLabel', { n: index + 1 })} </span>
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`steps.${key}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="participation" className="bg-secondary/60">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 id="participation" className="text-3xl font-semibold sm:text-4xl">
              {t('participation.title')}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t('participation.description')}
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/cadastro">{t('participation.cta')}</Link>
            </Button>
          </div>
          <ul className="grid gap-4">
            {pillars.map(({ key, icon: Icon }) => (
              <li key={key} className="flex gap-4 rounded-xl border bg-card p-5 shadow-soft">
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="font-medium">{t(`participation.${key}.title`)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`participation.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
