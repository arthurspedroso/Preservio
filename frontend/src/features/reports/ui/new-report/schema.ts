import { z } from 'zod';
import { todayLocal } from '@/shared/lib/format';
import { REPORT_CATEGORIES } from '../../domain/types';

type Translate = (key: string) => string;

export const LIMITS = { title: 120, description: 4000, reference: 500 } as const;

export function createReportSchema(t: Translate) {
  return z.object({
    // String (e não enum) para aceitar o valor inicial vazio do formulário
    category: z
      .string()
      .refine((v) => (REPORT_CATEGORIES as readonly string[]).includes(v), t('categoryRequired')),
    title: z.string().trim().min(5, t('titleMin')).max(LIMITS.title, t('titleMax')),
    description: z
      .string()
      .trim()
      .min(20, t('descriptionMin'))
      .max(LIMITS.description, t('descriptionMax')),
    occurredOn: z
      .string()
      .min(1, t('dateRequired'))
      .refine((v) => !v || v <= todayLocal(), t('dateFuture'))
      .refine((v) => !v || v >= '2000-01-01', t('dateTooOld')),
    state: z.string().min(1, t('stateRequired')),
    city: z.string().trim().min(2, t('cityRequired')),
    address: z.string().trim().min(5, t('addressRequired')),
    reference: z.string().trim().max(LIMITS.reference, t('referenceMax')),
  });
}

export type ReportFormValues = z.input<ReturnType<typeof createReportSchema>>;

// Campos validados ao avançar de cada etapa; evidências e revisão não bloqueiam
export const STEP_FIELDS = [
  ['category', 'title', 'description'],
  ['occurredOn', 'state', 'city', 'address', 'reference'],
  [],
  [],
] as const satisfies readonly (readonly (keyof ReportFormValues)[])[];

export const STEPS = ['occurrence', 'location', 'evidence', 'review'] as const;
export type StepKey = (typeof STEPS)[number];
