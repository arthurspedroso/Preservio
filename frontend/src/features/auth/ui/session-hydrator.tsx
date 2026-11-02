'use client';

import { useEffect } from 'react';
import { useSessionStore } from '../application/session-store';

export function SessionHydrator() {
  useEffect(() => {
    void useSessionStore.persist.rehydrate();
  }, []);

  return null;
}
