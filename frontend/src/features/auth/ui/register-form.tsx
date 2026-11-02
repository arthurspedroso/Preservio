'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { ApiError } from '@/shared/infrastructure/http-client';
import { useFocusFirstError } from '@/shared/lib/use-focus-first-error';
import { formatCpf, formatPhone, isValidCpf, onlyDigits } from '@/shared/lib/masks';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';
import { Spinner } from '@/shared/ui/spinner';
import { toast } from '@/shared/ui/toaster';
import { useSessionStore } from '../application/session-store';
import { useRegisterMutation } from '../application/use-auth-mutations';
import { resolveRedirect } from '../domain/routes';
import { ConflictError } from '../infrastructure/auth.service';
import { PASSWORD_RULES, PasswordRequirements } from './password-requirements';

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const tv = useTranslations('auth.validation');
  const router = useRouter();
  const redirect = useSearchParams().get('redirect');
  const { hydrated, user } = useSessionStore();
  const registration = useRegisterMutation();

  const schema = useMemo(
    () =>
      z
        .object({
          name: z
            .string()
            .trim()
            .min(1, tv('nameRequired'))
            .max(100, tv('nameTooLong'))
            .refine((v) => v.split(/\s+/).length >= 2, tv('nameFull')),
          email: z
            .string()
            .trim()
            .min(1, tv('emailRequired'))
            .pipe(z.email(tv('emailInvalid'))),
          cpf: z
            .string()
            .min(1, tv('cpfRequired'))
            .refine((v) => !v || isValidCpf(v), tv('cpfInvalid')),
          phone: z
            .string()
            .refine((v) => !v || [10, 11].includes(onlyDigits(v).length), tv('phoneInvalid')),
          password: z
            .string()
            .max(72, tv('passwordTooLong'))
            .refine((v) => PASSWORD_RULES.every((rule) => rule.test(v)), tv('passwordWeak')),
          confirmPassword: z.string().min(1, tv('confirmRequired')),
          acceptTerms: z.boolean().refine(Boolean, tv('termsRequired')),
        })
        .refine((d) => d.password === d.confirmPassword, {
          path: ['confirmPassword'],
          message: tv('passwordMismatch'),
        }),
    [tv],
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    mode: 'onTouched',
    shouldFocusError: false,
  });
  const { errors, submitCount } = form.formState;
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, submitCount);
  const password = useWatch({ control: form.control, name: 'password' });

  useEffect(() => {
    if (hydrated && user && registration.isIdle) {
      router.replace(resolveRedirect(redirect, user.role));
    }
  }, [hydrated, user, registration.isIdle, redirect, router]);

  const onSubmit = form.handleSubmit(({ name, email, cpf, phone, password }) =>
    registration.mutate(
      { name, email, cpf, phone: phone || undefined, password },
      {
        onSuccess: () => {
          toast.success(t('success'));
          router.replace(resolveRedirect(redirect, 'citizen'));
        },
        onError: (error) => {
          if (error instanceof ConflictError) {
            form.setError(error.field, { message: error.message }, { shouldFocus: true });
          }
        },
      },
    ),
  );

  const submitError =
    registration.error instanceof ConflictError
      ? null
      : registration.error instanceof ApiError
        ? registration.error.message
        : registration.error
          ? t('genericError')
          : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      <FormField id="register-name" label={t('name')} required error={errors.name?.message}>
        {(field) => <Input {...field} {...form.register('name')} autoComplete="name" />}
      </FormField>

      <FormField id="register-email" label={t('email')} required error={errors.email?.message}>
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
        id="register-cpf"
        label={t('cpf')}
        required
        hint={t('cpfHint')}
        error={errors.cpf?.message}
      >
        {(field) => (
          <Controller
            control={form.control}
            name="cpf"
            render={({ field: { onChange, ...rest } }) => (
              <Input
                {...field}
                {...rest}
                onChange={(e) => onChange(formatCpf(e.target.value))}
                inputMode="numeric"
                placeholder="000.000.000-00"
                autoComplete="off"
              />
            )}
          />
        )}
      </FormField>

      <FormField
        id="register-phone"
        label={t('phone')}
        optional
        hint={t('phoneHint')}
        error={errors.phone?.message}
      >
        {(field) => (
          <Controller
            control={form.control}
            name="phone"
            render={({ field: { onChange, ...rest } }) => (
              <Input
                {...field}
                {...rest}
                onChange={(e) => onChange(formatPhone(e.target.value))}
                type="tel"
                inputMode="tel"
                placeholder="(00) 00000-0000"
                autoComplete="tel-national"
              />
            )}
          />
        )}
      </FormField>

      <FormField
        id="register-password"
        label={t('password')}
        required
        hint={<PasswordRequirements value={password} />}
        error={errors.password?.message}
      >
        {(field) => (
          <PasswordInput {...field} {...form.register('password')} autoComplete="new-password" />
        )}
      </FormField>

      <FormField
        id="register-confirm"
        label={t('confirmPassword')}
        required
        error={errors.confirmPassword?.message}
      >
        {(field) => (
          <PasswordInput
            {...field}
            {...form.register('confirmPassword')}
            autoComplete="new-password"
          />
        )}
      </FormField>

      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <Checkbox
            {...form.register('acceptTerms')}
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={errors.acceptTerms ? 'register-terms-error' : undefined}
          />
          <span>{t('terms')}</span>
        </label>
        {errors.acceptTerms && (
          <p id="register-terms-error" className="text-xs font-medium text-destructive">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {submitError && <Alert variant="destructive">{submitError}</Alert>}

      <Button type="submit" size="lg" className="w-full" disabled={registration.isPending}>
        {registration.isPending && <Spinner />}
        {registration.isPending ? t('submitting') : t('submit')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('hasAccount')}{' '}
        <Link
          href={redirect ? `/entrar?redirect=${encodeURIComponent(redirect)}` : '/entrar'}
          className="font-semibold text-primary hover:underline"
        >
          {t('login')}
        </Link>
      </p>
    </form>
  );
}
