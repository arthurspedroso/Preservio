'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Files } from 'lucide-react';
import { REPORT_STATUSES, StatusBadge, StatusStepper } from '@/features/reports';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  DemoNotice,
  EmptyState,
  FormField,
  Input,
  PageHeader,
  PasswordInput,
  Select,
  Skeleton,
  Spinner,
  Textarea,
  toast,
} from '@/shared/ui';

const swatches = [
  ['brand', 'bg-brand'],
  ['primary', 'bg-primary'],
  ['secondary', 'bg-secondary'],
  ['accent', 'bg-accent'],
  ['muted', 'bg-muted'],
  ['warning', 'bg-warning'],
  ['info', 'bg-info'],
  ['success', 'bg-success'],
  ['destructive', 'bg-destructive'],
  ['sidebar', 'bg-sidebar'],
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function DesignSystemShowcase() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmOpen(false);
      toast.success('Status atualizado para “Em análise”.');
    }, 900);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="Fase 0"
        title="Design system do Preservio"
        description="Tokens, tipografia e componentes reutilizáveis usados em todas as telas do protótipo."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/design-system/auth">Layout de autenticação</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/design-system/app">Área do cidadão</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/design-system/app?area=admin">Área administrativa</Link>
            </Button>
          </>
        }
      />

      <Section title="Cores">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {swatches.map(([name, className]) => (
            <li key={name} className="overflow-hidden rounded-xl border bg-card">
              <div className={`h-16 ${className}`} />
              <p className="px-3 py-2 font-mono text-xs">{name}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tipografia">
        <Card>
          <CardContent className="space-y-3 pt-5">
            <p className="font-display text-5xl font-semibold text-brand">
              Plus Jakarta Sans — títulos
            </p>
            <p className="font-display text-2xl font-semibold text-brand">Como funciona</p>
            <p className="text-base">
              Instrument Sans — corpo de texto. Registre possíveis irregularidades ambientais e
              acompanhe cada etapa da análise.
            </p>
            <p className="text-sm text-muted-foreground">
              Texto auxiliar e descrições secundárias.
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section title="Botões">
        <div className="flex flex-wrap gap-3">
          <Button>Enviar denúncia</Button>
          <Button variant="brand">Brand</Button>
          <Button variant="outline">Voltar</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="destructive">Excluir</Button>
          <Button variant="link">Ver detalhes</Button>
          <Button disabled>
            <Spinner />
            Enviando…
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 rounded-xl bg-brand p-6">
          <Button variant="inverse" size="lg">
            Registrar denúncia
          </Button>
          <Button variant="inverse-outline" size="lg">
            Entrar
          </Button>
        </div>
      </Section>

      <Section title="Formulários">
        <Card>
          <CardContent className="grid gap-6 pt-5 md:grid-cols-2">
            <FormField
              id="ds-title"
              label="Título da ocorrência"
              required
              hint="Até 120 caracteres."
            >
              {(field) => <Input {...field} placeholder="Ex.: Descarte de entulho no córrego" />}
            </FormField>
            <FormField id="ds-email" label="E-mail" required error="Informe um e-mail válido.">
              {(field) => <Input {...field} type="email" defaultValue="maria@" />}
            </FormField>
            <FormField id="ds-category" label="Tipo de ocorrência" required>
              {(field) => (
                <Select {...field} defaultValue="">
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option>Desmatamento</option>
                  <option>Queimada</option>
                </Select>
              )}
            </FormField>
            <FormField
              id="ds-password"
              label="Senha"
              required
              labelAction={
                <button type="button" className="text-xs text-primary hover:underline">
                  Esqueci minha senha
                </button>
              }
            >
              {(field) => <PasswordInput {...field} />}
            </FormField>
            <FormField
              id="ds-reference"
              label="Ponto de referência"
              optional
              className="md:col-span-2"
            >
              {(field) => (
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="Ex.: atrás do galpão azul, perto da ponte"
                />
              )}
            </FormField>
            <label className="flex items-start gap-3 text-sm md:col-span-2">
              <Checkbox />
              Li e aceito a política de privacidade e os termos de uso.
            </label>
          </CardContent>
        </Card>
      </Section>

      <Section title="Status da denúncia">
        <div className="flex flex-wrap gap-2">
          {REPORT_STATUSES.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
        <div className="space-y-4">
          <StatusStepper status="in_review" />
          <StatusStepper status="resolved" />
          <StatusStepper status="not_upheld" />
        </div>
      </Section>

      <Section title="Mensagens e feedback">
        <div className="grid gap-3 md:grid-cols-2">
          <Alert variant="info" title="Seja específico no local">
            Informe rua, número ou pontos de referência próximos.
          </Alert>
          <Alert variant="success" title="Denúncia registrada com sucesso!">
            Protocolo PRV-2026-000123.
          </Alert>
          <Alert variant="warning" title="Recurso ainda não disponível">
            A recuperação de senha não faz parte desta versão.
          </Alert>
          <Alert variant="destructive" title="Não foi possível enviar">
            Verifique os campos destacados e tente novamente.
          </Alert>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => toast.success('Denúncia enviada.')}>
            Toast de sucesso
          </Button>
          <Button variant="outline" onClick={() => toast.error('Falha ao salvar.')}>
            Toast de erro
          </Button>
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>
            Modal de confirmação
          </Button>
          <DemoNotice />
        </div>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Alterar status da denúncia?"
          description="A alteração será registrada no histórico e ficará visível para o cidadão."
          confirmLabel="Alterar status"
          loading={loading}
          onConfirm={confirm}
        >
          <div className="flex items-center gap-2 text-sm">
            <StatusBadge status="received" />
            <span aria-hidden>→</span>
            <StatusBadge status="in_review" />
          </div>
        </ConfirmDialog>
      </Section>

      <Section title="Estados de carregamento e vazio">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Carregando</CardTitle>
              <CardDescription>Skeleton enquanto os dados são buscados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
          <EmptyState
            icon={Files}
            title="Você ainda não registrou nenhuma denúncia."
            description="Quando registrar uma ocorrência, ela aparecerá aqui com o status atualizado."
            action={<Button>Registrar primeira denúncia</Button>}
          />
        </div>
      </Section>
    </div>
  );
}
