'use client';

import { useEffect, type RefObject } from 'react';

// Foca o primeiro campo inválido na ordem visual do formulário após cada envio.
// Substitui o shouldFocusError do react-hook-form, que segue a ordem de registro dos campos.
export function useFocusFirstError(
  formRef: RefObject<HTMLFormElement | null>,
  submitCount: number,
) {
  useEffect(() => {
    if (!submitCount) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [formRef, submitCount]);
}
