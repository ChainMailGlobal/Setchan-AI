import type { ReactNode } from 'react';
import { ui } from '../lib/content';
import { formatStamp } from '../lib/clock';
import { useClock } from '../lib/useClock';
import { useHashRoute, href } from '../lib/router';
import { ClockPill } from './ClockPill';

export function AppShell({ children }: { children: ReactNode }) {
  const { now, demoMode } = useClock();
  const route = useHashRoute();
  const parent = route.length ? href(...route.slice(0, -1)) : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-xl items-center gap-2 px-4">
          {parent !== null && (
            <a
              href={parent}
              aria-label={ui.nav.back}
              className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-stone-600 active:bg-stone-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
          <a href="#/" className="font-semibold tracking-tight text-teal-800">
            {ui.app.name}
          </a>
          <div className="ml-auto">
            <ClockPill now={now} demoMode={demoMode} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">{children}</main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-1 px-4 py-3 text-[11px] text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{ui.app.demoNotice}</span>
          <span className="flex items-center gap-2 tabular-nums">
            <span>
              {ui.app.builtLabel} {formatStamp(__BUILD_TIME__)} · v{__APP_VERSION__}
            </span>
            <a href="#/settings" className="underline decoration-stone-300 underline-offset-2">
              {ui.nav.settings}
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
