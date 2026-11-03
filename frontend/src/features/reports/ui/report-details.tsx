import { FileVideo, ImageOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { stateName } from '@/shared/lib/brazil-states';
import { formatDate, formatDateTime, formatFileSize } from '@/shared/lib/format';
import { DataItem as Item, Panel as Section } from '@/shared/ui/panel';
import type { Report } from '../domain/types';
import { categoryIcons } from './category-icons';

// Dados da denúncia, iguais para o cidadão e para o administrador
export function ReportDetails({ report }: { report: Report }) {
  const t = useTranslations('reports');
  const Icon = categoryIcons[report.category];

  return (
    <div className="space-y-5">
      <Section title={t('detail.summary')}>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Item label={t('detail.category')}>
            <span className="inline-flex items-center gap-2 font-medium">
              <Icon className="size-4 text-primary" aria-hidden />
              {t(`categories.${report.category}.label`)}
            </span>
          </Item>
          <Item label={t('detail.protocol')}>
            <span className="font-mono">{report.protocol}</span>
          </Item>
          <Item label={t('detail.occurredOn')}>{formatDate(report.occurredOn)}</Item>
          <Item label={t('detail.registeredAt')}>{formatDateTime(report.createdAt)}</Item>
        </dl>
      </Section>

      <Section title={t('detail.description')}>
        <p className="whitespace-pre-line text-sm leading-relaxed">{report.description}</p>
      </Section>

      <Section title={t('detail.location')}>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Item label={t('detail.city')}>
            {report.location.city} — {stateName(report.location.state)}
          </Item>
          <Item label={t('detail.address')}>{report.location.address}</Item>
          <Item label={t('detail.reference')}>
            {report.location.reference ?? (
              <span className="text-muted-foreground">{t('detail.none')}</span>
            )}
          </Item>
        </dl>
      </Section>

      <Section title={t('detail.evidence')}>
        {report.evidences.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {report.evidences.map((evidence) => (
              <li key={evidence.id} className="overflow-hidden rounded-xl border bg-card">
                <div className="grid aspect-[4/3] place-items-center bg-muted text-muted-foreground">
                  {evidence.previewDataUrl ? (
                    // Miniatura em data URL (protótipo): next/image não se aplica
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={evidence.previewDataUrl}
                      alt={evidence.name}
                      className="size-full object-cover"
                    />
                  ) : evidence.kind === 'video' ? (
                    <FileVideo className="size-8" aria-hidden />
                  ) : (
                    <ImageOff className="size-8" aria-hidden />
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium" title={evidence.name}>
                    {evidence.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t(`detail.${evidence.kind}`)} · {formatFileSize(evidence.size)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t('detail.noEvidence')}</p>
        )}
      </Section>
    </div>
  );
}
