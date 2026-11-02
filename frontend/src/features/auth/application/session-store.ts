'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SessionUser } from '../domain/types';

interface SessionState {
  token: string | null;
  user: SessionUser | null;
  // false até ler o localStorage; evita redirecionar antes de saber se há sessão
  hydrated: boolean;
  // true após "Sair": o guarda leva à página inicial em vez de pedir login de novo
  signedOut: boolean;
  setSession: (token: string, user: SessionUser) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      signedOut: false,
      setSession: (token, user) => set({ token, user, signedOut: false }),
      clearSession: () => set({ token: null, user: null, signedOut: true }),
    }),
    {
      name: 'preservio:v1:session',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ token, user }) => ({ token, user }),
      // Hidratação manual no cliente (SessionHydrator) para não divergir do HTML do servidor
      skipHydration: true,
      onRehydrateStorage: () => () => useSessionStore.setState({ hydrated: true }),
    },
  ),
);
