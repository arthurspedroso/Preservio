import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Report } from '../domain/types';
import { StatusBadge } from './status-badge';

export function ReportBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-5 inline-flex items-center gap-1.5 rounded text-sm font-medium text-primary hover:underline"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {label}
    </Link>
  );
}

export function ReportHeader({ report }: { report: Report }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1.5">
        <p className="font-mono text-sm text-muted-foreground">{report.protocol}</p>
        <h1 className="text-2xl font-bold sm:text-3xl">{report.title}</h1>
      </div>
      <StatusBadge status={report.status} className="self-start px-3 py-1 text-sm sm:mt-7" />
    </header>
  );
}
