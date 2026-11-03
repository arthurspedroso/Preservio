'use client';

import { useId, useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Info, Play, Trash2, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatFileSize } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { EVIDENCE_LIMITS } from '../../domain/types';
import type { Rejection, SelectedFile } from './use-evidence-files';

const ACCEPT = [...EVIDENCE_LIMITS.photo.types, ...EVIDENCE_LIMITS.video.types].join(',');

interface StepEvidenceProps {
  files: SelectedFile[];
  rejections: Rejection[];
  onAdd: (files: FileList | File[]) => number;
  onRemove: (id: string) => void;
}

export function StepEvidence({ files, rejections, onAdd, onRemove }: StepEvidenceProps) {
  const t = useTranslations('reports.new.evidence');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const hintId = useId();
  const full = files.length >= EVIDENCE_LIMITS.maxFiles;

  const handleAdd = (list: FileList | File[]) => {
    const count = onAdd(list);
    if (count) setAnnouncement(t('added', { count }));
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) handleAdd(event.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <Alert variant="warning" title={t('safetyTitle')}>
        {t('safetyText')}
      </Alert>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={full ? (e) => e.preventDefault() : onDrop}
        className={cn(
          'flex flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging ? 'border-primary bg-secondary/60' : 'border-input bg-muted/40',
          full && 'opacity-60',
        )}
      >
        <span className="grid size-12 place-items-center rounded-full bg-card text-primary shadow-soft">
          <Upload className="size-5" aria-hidden />
        </span>
        <p className="mt-4 font-medium">{full ? t('fullTitle') : t('dropTitle')}</p>
        <p id={hintId} className="mt-1 max-w-md text-xs text-muted-foreground">
          {t('limits', {
            max: EVIDENCE_LIMITS.maxFiles,
            photoMb: EVIDENCE_LIMITS.photo.maxBytes / 1024 / 1024,
            videoMb: EVIDENCE_LIMITS.video.maxBytes / 1024 / 1024,
          })}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          disabled={full}
          onClick={() => inputRef.current?.click()}
          aria-describedby={hintId}
        >
          <ImagePlus aria-hidden />
          {t('choose')}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            if (e.target.files?.length) handleAdd(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {rejections.length > 0 && (
        <Alert variant="destructive" title={t('rejectedTitle')}>
          <ul className="list-inside list-disc">
            {rejections.map((r, i) => (
              <li key={`${r.name}-${i}`}>
                <span className="font-medium">{r.name}</span>: {t(`reason.${r.reason}`)}
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {files.length > 0 ? (
        <section aria-labelledby="selected-title">
          <h3 id="selected-title" className="text-sm font-semibold text-foreground">
            {t('selected', { count: files.length, max: EVIDENCE_LIMITS.maxFiles })}
          </h3>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {files.map(({ id, file, kind, url }) => (
              <li key={id} className="group overflow-hidden rounded-xl border bg-card shadow-soft">
                <div className="relative aspect-[4/3] bg-muted">
                  {kind === 'photo' ? (
                    // Object URL local: next/image não se aplica
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="" className="size-full object-cover" />
                  ) : (
                    <>
                      <video
                        src={url}
                        muted
                        preload="metadata"
                        className="size-full object-cover"
                      />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid size-10 place-items-center rounded-full bg-brand/70 text-brand-foreground">
                          <Play className="size-4" aria-hidden />
                        </span>
                      </span>
                    </>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-card/90 px-2 py-0.5 text-[11px] font-medium">
                    {t(`kind.${kind}`)}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      onRemove(id);
                      setAnnouncement(t('removed', { name: file.name }));
                    }}
                    aria-label={t('remove', { name: file.name })}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="size-4 shrink-0" aria-hidden />
          {t('optionalNote')}
        </p>
      )}
    </div>
  );
}
