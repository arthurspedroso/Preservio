'use client';

import { Toaster as Sonner } from 'sonner';

export { toast } from 'sonner';

export function Toaster() {
  return (
    // Canto inferior: no topo o aviso cobriria o menu logo depois do login
    <Sonner
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{ className: 'font-sans' }}
    />
  );
}
