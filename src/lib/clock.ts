/**
 * The demo clock. DEMO_TODAY lives here and only here (enforced by scripts/check-rules.mjs).
 *
 * Pinned to Tuesday, November 17, 2026 at 2:45 PM local time: fifteen minutes before the
 * 3:00 PM shift change in the Arrival demo. Built from components, not an ISO string, so the
 * pinned moment reads the same on any device regardless of its timezone.
 */
export const DEMO_TODAY = new Date(2026, 10, 17, 14, 45, 0, 0);

export function formatDate(d: Date, withYear = false): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${formatDate(d, true)} ${formatTime(d)}`;
}

/** Today's occurrence of an "HH:MM" clock time, relative to `now`. */
export function todayAt(hhmm: string, now: Date): Date | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const target = new Date(now);
  target.setHours(Number(m[1]), Number(m[2]), 0, 0);
  return target;
}

/** Whole minutes from `now` until `target` (negative when it has passed). */
export function minutesUntil(target: Date, now: Date): number {
  return Math.round((target.getTime() - now.getTime()) / 60_000);
}
