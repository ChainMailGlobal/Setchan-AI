import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, META_DEMO_MODE, setMeta } from './db';
import { DEMO_TODAY } from './clock';

/**
 * Demo mode is on until someone turns it off. The toggle flips immediately (optimistic) and the
 * stored value catches up; once the live query agrees, the optimistic value is dropped.
 */
export function useDemoMode(): [boolean, (on: boolean) => Promise<void>] {
  const row = useLiveQuery(() => db.meta.get(META_DEMO_MODE), []);
  const stored = row === undefined ? true : row.value !== '0';
  const [pending, setPending] = useState<boolean | null>(null);
  useEffect(() => {
    if (pending !== null && pending === stored) setPending(null);
  }, [pending, stored]);
  const set = async (on: boolean) => {
    setPending(on);
    await setMeta(META_DEMO_MODE, on ? '1' : '0');
  };
  return [pending ?? stored, set];
}

export function useClock(): { now: Date; demoMode: boolean } {
  const [demoMode] = useDemoMode();
  const [tick, setTick] = useState(() => new Date());
  useEffect(() => {
    if (demoMode) return;
    setTick(new Date());
    const id = window.setInterval(() => setTick(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, [demoMode]);
  return { now: demoMode ? DEMO_TODAY : tick, demoMode };
}
