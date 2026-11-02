'use client';

import { useMutation } from '@tanstack/react-query';
import type { LoginInput, RegisterCitizenInput } from '../domain/types';
import { authService } from '../infrastructure/auth.service';
import { useSessionStore } from './session-store';

// Login e "GET /auth/me" em sequência, como o front faria com a API real
async function signIn(input: LoginInput) {
  const { accessToken } = await authService.login(input);
  const user = await authService.me(accessToken);
  return { token: accessToken, user };
}

export function useLoginMutation() {
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: signIn,
    onSuccess: ({ token, user }) => setSession(token, user),
  });
}

// O cadastro do backend não devolve token: cria a conta e entra em seguida
export function useRegisterMutation() {
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (input: RegisterCitizenInput) => {
      await authService.registerCitizen(input);
      return signIn({ email: input.email, password: input.password });
    },
    onSuccess: ({ token, user }) => setSession(token, user),
  });
}
