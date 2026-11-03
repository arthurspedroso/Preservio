'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { generateId } from '@/shared/infrastructure/mock-db';
import { EVIDENCE_LIMITS, evidenceKindOf, type ReportEvidence } from '../../domain/types';

export interface SelectedFile {
  id: string;
  file: File;
  kind: ReportEvidence['kind'];
  // Object URL para prévia local; revogado ao remover para não vazar memória
  url: string;
}

export type Rejection = { name: string; reason: 'type' | 'size' | 'count' };

export function useEvidenceFiles() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [rejections, setRejections] = useState<Rejection[]>([]);
  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.url)), []);

  const add = useCallback((incoming: FileList | File[]) => {
    const accepted: SelectedFile[] = [];
    const rejected: Rejection[] = [];
    let slots = EVIDENCE_LIMITS.maxFiles - filesRef.current.length;

    for (const file of Array.from(incoming)) {
      const kind = evidenceKindOf(file.type);
      if (!kind) rejected.push({ name: file.name, reason: 'type' });
      else if (file.size > EVIDENCE_LIMITS[kind].maxBytes)
        rejected.push({ name: file.name, reason: 'size' });
      else if (slots <= 0) rejected.push({ name: file.name, reason: 'count' });
      else {
        accepted.push({ id: generateId(), file, kind, url: URL.createObjectURL(file) });
        slots--;
      }
    }

    setFiles((current) => [...current, ...accepted]);
    setRejections(rejected);
    return accepted.length;
  }, []);

  const remove = useCallback((id: string) => {
    setFiles((current) => {
      const target = current.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((f) => f.id !== id);
    });
    setRejections([]);
  }, []);

  return { files, rejections, add, remove, clearRejections: () => setRejections([]) };
}
