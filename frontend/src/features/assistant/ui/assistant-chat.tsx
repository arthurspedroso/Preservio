'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Bot, ExternalLink, FilePlus2, Send, Trash2, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Alert } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Spinner } from '@/shared/ui/spinner';
import { useAssistant } from '../application/use-assistant';
import { topicById } from '../domain/knowledge';
import { MAX_QUESTION_LENGTH, type ChatEntry } from '../infrastructure/assistant.service';

const SUGGESTION_COUNT = 5;

function Bubble({ side, children }: { side: 'bot' | 'user'; children: React.ReactNode }) {
  return (
    <div className={cn('flex gap-2.5', side === 'user' && 'flex-row-reverse')}>
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-full',
          side === 'bot' ? 'bg-brand text-brand-foreground' : 'bg-secondary text-primary',
        )}
        aria-hidden
      >
        {side === 'bot' ? <Bot className="size-4" /> : <UserRound className="size-4" />}
      </span>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          side === 'bot'
            ? 'rounded-tl-sm bg-muted'
            : 'rounded-tr-sm bg-primary text-primary-foreground',
        )}
      >
        {children}
      </div>
    </div>
  );
}

function BotAnswer({ entry }: { entry: ChatEntry }) {
  const t = useTranslations('assistant');
  const topic = topicById(entry.topicId);

  return (
    <Bubble side="bot">
      <p className="whitespace-pre-line">{t(`topics.${topic.id}`)}</p>
      {topic.sources && (
        <div className="mt-3 border-t border-border/60 pt-2">
          <p className="text-xs font-medium text-muted-foreground">{t('sources')}</p>
          <ul className="mt-1 space-y-0.5">
            {topic.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  {source.label}
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {topic.category && (
        <Button asChild size="sm" className="mt-3">
          <Link href={`/denuncias/nova?categoria=${topic.category}`}>
            <FilePlus2 aria-hidden />
            {t('reportCta')}
          </Link>
        </Button>
      )}
    </Bubble>
  );
}

export function AssistantChat() {
  const t = useTranslations('assistant');
  const { history, ask, clear } = useAssistant();
  const [question, setQuestion] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const entries = history.data ?? [];

  // Mantém a última mensagem à vista
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries.length, ask.isPending]);

  const send = (text: string) => {
    if (!text.trim() || ask.isPending) return;
    ask.mutate(text);
    setQuestion('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(question);
  };

  return (
    <div className="space-y-4">
      <Alert variant="warning" title={t('disclaimerTitle')}>
        {t('disclaimer')}
      </Alert>

      <section
        aria-label={t('title')}
        className="overflow-hidden rounded-2xl border bg-card shadow-soft"
      >
        <header className="flex items-center justify-between gap-3 border-b px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-brand text-brand-foreground">
              <Bot className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">{t('title')}</p>
              <Badge variant="warning" className="mt-0.5">
                {t('badge')}
              </Badge>
            </div>
          </div>
          {entries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear.mutate()}
              disabled={clear.isPending || ask.isPending}
              className="text-muted-foreground"
            >
              <Trash2 aria-hidden />
              {t('clear')}
            </Button>
          )}
        </header>

        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-label={t('conversation')}
          className="h-[26rem] space-y-4 overflow-y-auto p-5"
        >
          <Bubble side="bot">{t('intro')}</Bubble>

          {entries.map((entry) => (
            <div key={entry.id} className="space-y-4">
              <Bubble side="user">{entry.question}</Bubble>
              <BotAnswer entry={entry} />
            </div>
          ))}

          {ask.isPending && (
            <div className="space-y-4">
              <Bubble side="user">{ask.variables}</Bubble>
              <Bubble side="bot">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Spinner />
                  {t('typing')}
                </span>
              </Bubble>
            </div>
          )}

          {ask.isError && <Alert variant="destructive">{t('error')}</Alert>}
        </div>

        <div className="border-t bg-muted/30 p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">{t('suggestionsTitle')}</p>
          <ul className="mb-3 flex flex-wrap gap-2">
            {Array.from({ length: SUGGESTION_COUNT }, (_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => send(t(`suggestions.${i}`))}
                  disabled={ask.isPending}
                  className="rounded-full border bg-card px-3 py-1.5 text-xs transition-colors hover:border-primary/40 hover:bg-secondary disabled:opacity-50"
                >
                  {t(`suggestions.${i}`)}
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={onSubmit} className="flex gap-2">
            <label htmlFor="assistant-question" className="sr-only">
              {t('label')}
            </label>
            <Input
              id="assistant-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('placeholder')}
              maxLength={MAX_QUESTION_LENGTH}
              autoComplete="off"
            />
            <Button type="submit" disabled={!question.trim() || ask.isPending}>
              <Send aria-hidden />
              <span className="hidden sm:inline">{t('send')}</span>
              <span className="sr-only sm:hidden">{t('send')}</span>
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
