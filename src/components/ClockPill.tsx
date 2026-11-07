import { formatDate, formatTime } from '../lib/clock';
import { ui } from '../lib/content';

export function ClockPill({ now, demoMode }: { now: Date; demoMode: boolean }) {
  return (
    <a
      href="#/settings"
      aria-label={ui.nav.settings}
      className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700 shadow-sm"
    >
      <span className="font-medium">{formatDate(now)}</span>
      <span className="text-stone-300">·</span>
      <span className="tabular-nums">{formatTime(now)}</span>
      {demoMode && (
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-800">
          {ui.app.demoBadge}
        </span>
      )}
    </a>
  );
}
