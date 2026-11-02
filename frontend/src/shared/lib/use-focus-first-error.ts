'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'input:not([type=hidden]), select, textarea, button';

// Se o inválido for um grupo (ex.: radiogroup), foca o primeiro controle dentro dele
export function focusFirstInvalid(container: HTMLElement | null) {
  const invalid = container?.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (!invalid) return;
  const target = invalid.matches(FOCUSABLE)
    ? invalid
    : invalid.querySelector<HTMLElement>(FOCUSABLE);
  target?.focus();
}

// Foca o primeiro campo inválido na ordem visual do formulário após cada envio.
// Substitui o shouldFocusError do react-hook-form, que segue a ordem de registro dos campos.
export function useFocusFirstError(
  formRef: RefObject<HTMLFormElement | null>,
  submitCount: number,
) {
  useEffect(() => {
    if (submitCount) focusFirstInvalid(formRef.current);
  }, [formRef, submitCount]);
}
