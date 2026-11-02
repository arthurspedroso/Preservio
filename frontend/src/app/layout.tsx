import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { defaultLocale, defaultTimeZone } from '@/shared/i18n/config';
import { Providers } from './providers';
import './globals.css';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' });
const display = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'Preservio — Registre e acompanhe denúncias ambientais',
    template: '%s — Preservio',
  },
  description:
    'Sistema web para registro e acompanhamento de denúncias ambientais. Protótipo acadêmico de Engenharia de Software.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();

  return (
    <html lang={defaultLocale}>
      <body className={`${sans.variable} ${display.variable}`}>
        <NextIntlClientProvider
          locale={defaultLocale}
          timeZone={defaultTimeZone}
          messages={messages}
        >
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
