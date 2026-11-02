import { type ReactNode } from 'react';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { MAIN_CONTENT_ID, SkipLink } from './skip-link';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <SiteHeader />
      <main id={MAIN_CONTENT_ID} className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
