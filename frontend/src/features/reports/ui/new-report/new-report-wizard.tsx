'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { ApiError } from '@/shared/infrastructure/http-client';
import { focusFirstInvalid } from '@/shared/lib/use-focus-first-error';
import { cn } from '@/shared/lib/utils';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { toast } from '@/shared/ui/toaster';
import { useCreateReport } from '../../application/use-create-report';
import type { Report, ReportCategory } from '../../domain/types';
import { ReportSubmitted } from './report-submitted';
import { createReportSchema, STEP_FIELDS, STEPS, type ReportFormValues } from './schema';
import { StepEvidence } from './step-evidence';
import { StepLocation } from './step-location';
import { StepOccurrence } from './step-occurrence';
import { StepReview } from './step-review';
import { StepTips } from './step-tips';
import { useEvidenceFiles } from './use-evidence-files';
import { WizardProgress } from './wizard-progress';

const DEFAULT_VALUES: ReportFormValues = {
  category: '',
  title: '',
  description: '',
  occurredOn: '',
  state: '',
  city: '',
  address: '',
  reference: '',
};

// Etapa que contém o primeiro campo com erro (usado na validação final)
const stepOfFirstError = (errors: FieldErrors<ReportFormValues>) =>
  STEP_FIELDS.findIndex((fields) => fields.some((field) => field in errors));

export function NewReportWizard({ initialCategory }: { initialCategory?: ReportCategory }) {
  const t = useTranslations('reports.new');
  const tv = useTranslations('reports.new.validation');
  const router = useRouter();
  const schema = useMemo(() => createReportSchema(tv), [tv]);

  // Um único formulário para todas as etapas: voltar não perde nada do que foi preenchido
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...DEFAULT_VALUES, category: initialCategory ?? '' },
    mode: 'onTouched',
    shouldFocusError: false,
  });
  const evidence = useEvidenceFiles();
  const createReport = useCreateReport();

  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [submitted, setSubmitted] = useState<Report | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);
  // Campos de etapas em que o usuário já tentou avançar com erro
  const attemptedFields = useRef(new Set<string>());

  // Depois de uma tentativa, o erro some assim que o campo é corrigido (sem esperar o blur)
  const { subscribe, trigger } = form;
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ name }) => {
          if (name && attemptedFields.current.has(name)) {
            void trigger(name as keyof ReportFormValues);
          }
        },
      }),
    [subscribe, trigger],
  );

  const stepKey = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const hasChanges = form.formState.isDirty || evidence.files.length > 0;

  // Avisa antes de fechar/recarregar a aba com dados não enviados
  useEffect(() => {
    if (!hasChanges || submitted) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasChanges, submitted]);

  // Ao trocar de etapa: rola para o topo do formulário e anuncia o novo título
  useEffect(() => {
    if (!stepChanged.current) return;
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const goTo = (index: number) => {
    stepChanged.current = true;
    setDirection(index > step ? 'next' : 'prev');
    setStep(index);
    setReached((r) => Math.max(r, index));
  };

  const focusErrorSoon = () => setTimeout(() => focusFirstInvalid(containerRef.current), 0);

  const next = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await form.trigger([...fields]);
    if (!valid) {
      fields.forEach((field) => attemptedFields.current.add(field));
      return focusErrorSoon();
    }
    goTo(step + 1);
  };

  const send = (values: ReportFormValues) =>
    createReport.mutate(
      {
        title: values.title,
        category: values.category as ReportCategory,
        description: values.description,
        occurredOn: values.occurredOn,
        location: {
          state: values.state,
          city: values.city,
          address: values.address,
          reference: values.reference,
        },
        files: evidence.files.map((f) => f.file),
      },
      {
        onSuccess: (report) => {
          setSubmitted(report);
          toast.success(t('submitted.toast'));
          window.scrollTo({ top: 0 });
        },
      },
    );

  // Alguém pulou etapas pelo indicador: volta para a primeira com erro
  const onInvalid = (errors: FieldErrors<ReportFormValues>) => {
    Object.keys(errors).forEach((field) => attemptedFields.current.add(field));
    const target = stepOfFirstError(errors);
    if (target >= 0 && target !== step) goTo(target);
    focusErrorSoon();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (isLast) return form.handleSubmit(send, onInvalid)(event);
    event.preventDefault();
    void next();
  };

  const cancel = () => (hasChanges ? setCancelOpen(true) : router.push('/painel'));

  if (submitted) return <ReportSubmitted report={submitted} />;

  const submitError =
    createReport.error instanceof ApiError
      ? createReport.error.message
      : createReport.error
        ? t('submitError')
        : null;

  return (
    <FormProvider {...form}>
      <PageHeader title={t('title')} description={t('description')} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div ref={containerRef} className="min-w-0 scroll-mt-24 space-y-5">
          <WizardProgress current={step} reached={reached} onSelect={goTo} />

          <form
            onSubmit={onSubmit}
            noValidate
            aria-labelledby="step-title"
            className="rounded-xl border bg-card shadow-soft"
          >
            <div
              key={stepKey}
              className={cn(
                'p-5 sm:p-8',
                direction === 'next' ? 'animate-step-in-next' : 'animate-step-in-prev',
              )}
            >
              <header className="mb-6">
                <p className="text-xs font-semibold text-primary">
                  {t('progress.stepOf', { current: step + 1, total: STEPS.length })}
                </p>
                <h2
                  id="step-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-1 text-xl font-semibold focus:outline-none"
                >
                  {t(`steps.${stepKey}.title`)}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t(`steps.${stepKey}.description`)}
                </p>
              </header>

              {stepKey === 'occurrence' && <StepOccurrence />}
              {stepKey === 'location' && <StepLocation />}
              {stepKey === 'evidence' && (
                <StepEvidence
                  files={evidence.files}
                  rejections={evidence.rejections}
                  onAdd={evidence.add}
                  onRemove={evidence.remove}
                />
              )}
              {stepKey === 'review' && <StepReview files={evidence.files} onEdit={goTo} />}

              {isLast && submitError && (
                <Alert variant="destructive" title={t('submitErrorTitle')} className="mt-6">
                  {submitError}
                </Alert>
              )}
            </div>

            {/* No celular a barra de ações acompanha a rolagem */}
            <div className="sticky bottom-0 flex items-center gap-2 rounded-b-xl border-t bg-card/95 px-5 py-4 backdrop-blur sm:px-8">
              <Button
                type="button"
                variant="ghost"
                onClick={cancel}
                disabled={createReport.isPending}
                className="text-muted-foreground"
              >
                {t('actions.cancel')}
              </Button>
              <div className="ml-auto flex gap-2">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goTo(step - 1)}
                    disabled={createReport.isPending}
                  >
                    <ArrowLeft aria-hidden />
                    <span className="hidden sm:inline">{t('actions.back')}</span>
                    <span className="sr-only sm:hidden">{t('actions.back')}</span>
                  </Button>
                )}
                {isLast ? (
                  <Button type="submit" disabled={createReport.isPending}>
                    {createReport.isPending ? <Spinner /> : <Send aria-hidden />}
                    {createReport.isPending ? t('actions.submitting') : t('actions.submit')}
                  </Button>
                ) : (
                  <Button type="submit">
                    {stepKey === 'evidence' && evidence.files.length === 0
                      ? t('actions.skipEvidence')
                      : t('actions.next')}
                    <ArrowRight aria-hidden />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="lg:sticky lg:top-24">
          <StepTips step={stepKey} />
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title={t('cancelDialog.title')}
        description={t('cancelDialog.description')}
        confirmLabel={t('cancelDialog.confirm')}
        cancelLabel={t('cancelDialog.keep')}
        destructive
        onConfirm={() => router.push('/painel')}
      />
    </FormProvider>
  );
}
