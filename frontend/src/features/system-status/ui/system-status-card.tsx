'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useSystemStatusQuery } from '../application/use-system-status-query';

export function SystemStatusCard() {
  const t = useTranslations('systemStatus');
  const { data, isPending, isError } = useSystemStatusQuery();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending && <p className="text-sm text-muted-foreground">{t('checking')}</p>}
        {isError && <Badge variant="destructive">{t('unreachable')}</Badge>}
        {data && (
          <ul className="space-y-2">
            {Object.entries(data.components).map(([name, status]) => (
              <li key={name} className="flex items-center justify-between text-sm">
                <span>{name}</span>
                <Badge variant={status === 'up' ? 'success' : 'destructive'}>{status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
