'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ApiError } from '@/shared/infrastructure/http-client';
import { useFocusFirstError } from '@/shared/lib/use-focus-first-error';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';
import { Spinner } from '@/shared/ui/spinner';
import { toast } from '@/shared/ui/toaster';
import { useSessionStore } from '../application/session-store';
import { useLoginMutation } from '../application/use-auth-mutations';
import { resolveRedirect } from '../domain/routes';
import { DEMO_ACCOUNTS } from '../infrastructure/auth.service';
import { DemoAccounts } from './demo-accounts';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const tv = useTranslations('auth.validation');
  const router = useRouter();
  const redirect = useSearchParams().get('redirect');
  const { hydrated, user } = useSessionStore();
  const login = useLoginMutation();

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .trim()
          .min(1, tv('emailRequired'))
          .pipe(z.email(tv('emailInvalid'))),
        password: z.string().min(1, tv('passwordRequired')),
      }),
    [tv],
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
    shouldFocusError: false,
  });
  const { errors, submitCount } = form.formState;
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, submitCount);

  // Quem já está logado não precisa ver o login
  useEffect(() => {
    if (hydrated && user && login.isIdle) router.replace(resolveRedirect(redirect, user.role));
  }, [hydrated, user, login.isIdle, redirect, router]);

  const onSubmit = form.handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: ({ user: signedIn }) => {
        toast.success(t('welcome', { name: signedIn.name.split(' ')[0] }));
        router.replace(resolveRedirect(redirect, signedIn.role));
      },
    }),
  );

  const fillDemo = (account: keyof typeof DEMO_ACCOUNTS) => {
    form.reset(DEMO_ACCOUNTS[account]);
    login.reset();
  };

  const submitError =
    login.error instanceof ApiError ? login.error.message : login.error ? t('genericError') : null;

  return (
    <div className="space-y-8">
      {redirect && (
        <Alert variant="info" title={t('redirectTitle')}>
          {redirect.startsWith('/denuncias/nova') ? t('redirectReport') : t('redirectGeneric')}
        </Alert>
      )}

      <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField id="login-email" label={t('email')} error={errors.email?.message}>
          {(field) => (
            <Input
              {...field}
              {...form.register('email')}
              type="email"
              autoComplete="email"
              inputMode="email"
            />
          )}
        </FormField>

        <FormField
          id="login-password"
          label={t('password')}
          error={errors.password?.message}
          labelAction={
            <button
              type="button"
              onClick={() => toast.info(t('forgotUnavailable'))}
              className="rounded text-xs font-medium text-primary hover:underline"
            >
              {t('forgot')}
            </button>
          }
        >
          {(field) => (
            <PasswordInput
              {...field}
              {...form.register('password')}
              autoComplete="current-password"
            />
          )}
        </FormField>

        {submitError && <Alert variant="destructive">{submitError}</Alert>}

        <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
          {login.isPending && <Spinner />}
          {login.isPending ? t('submitting') : t('submit')}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t('noAccount')}{' '}
          <Link
            href={redirect ? `/cadastro?redirect=${encodeURIComponent(redirect)}` : '/cadastro'}
            className="font-semibold text-primary hover:underline"
          >
            {t('createAccount')}
          </Link>
        </p>
      </form>

      <DemoAccounts onSelect={fillDemo} />
    </div>
  );
}
