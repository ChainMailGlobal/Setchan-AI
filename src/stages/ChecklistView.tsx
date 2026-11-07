import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, handoffKey, resetChecklist, setChecked, setMeta, type CheckRow, type MetaRow } from '../lib/db';
import { getChecklist, getPhase, getResident, t, ui } from '../lib/content';
import { formatTime, minutesUntil, todayAt } from '../lib/clock';
import { useClock } from '../lib/useClock';
import { Avatar } from '../components/Avatar';
import { NotFound } from '../components/NotFound';
import { RichText } from '../components/RichText';

export function ChecklistView({ phaseId, flowId }: { phaseId: string; flowId: string }) {
  const phase = getPhase(phaseId);
  const flow = phase?.flows.find((f) => f.id === flowId);
  const checklist = useMemo(() => (flow ? getChecklist(flow.source) : null), [flow]);
  const checklistId = checklist?.id;
  const { now } = useClock();

  const checks = useLiveQuery<CheckRow[]>(
    async () => (checklistId ? db.checks.where('checklistId').equals(checklistId).toArray() : []),
    [checklistId],
  );
  const handoff = useLiveQuery<MetaRow | undefined>(
    async () => (checklistId ? db.meta.get(handoffKey(checklistId)) : undefined),
    [checklistId],
  );

  if (!phase || !flow || !checklist) return <NotFound />;

  const resident = getResident(phase.residentId);
  const checkedIds = new Set((checks ?? []).filter((c) => c.checked).map((c) => c.itemId));
  const allItems = checklist.sections.flatMap((s) => s.items);
  const total = allItems.length;
  const done = allItems.filter((i) => checkedIds.has(i.id)).length;
  const allDone = total > 0 && done === total;
  const completedAt = handoff ? new Date(handoff.value) : null;

  const target = checklist.handoffTime ? todayAt(checklist.handoffTime, now) : null;
  let timing: string | null = null;
  if (target) {
    const mins = minutesUntil(target, now);
    const relative =
      mins > 0 ? t(ui.checklist.inMinutes, { n: mins }) : mins < 0 ? t(ui.checklist.minutesAgo, { n: -mins }) : ui.checklist.now;
    timing = `${t(ui.checklist.shiftChangeAt, { time: formatTime(target) })} · ${relative}`;
  }

  const toggle = (itemId: string) => setChecked(checklist.id, itemId, !checkedIds.has(itemId), now);
  const complete = () => setMeta(handoffKey(checklist.id), now.toISOString());
  const reset = () => {
    if (window.confirm(ui.checklist.resetConfirm)) void resetChecklist(checklist.id);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        {resident && <Avatar initials={resident.initials} size="lg" />}
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{checklist.title ?? flow.title}</h1>
          <div className="mt-0.5 text-stone-600">{checklist.resident ?? resident?.name}</div>
          {timing && <div className="mt-1 text-sm font-medium text-teal-700">{timing}</div>}
        </div>
      </header>

      {checklist.intro && !completedAt && (
        <p className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-teal-900">{checklist.intro}</p>
      )}

      <div>
        <div className="mb-1 flex items-center justify-between text-sm text-stone-600">
          <span>{t(ui.checklist.progress, { done, total })}</span>
          <span className="tabular-nums">{total ? Math.round((done / total) * 100) : 0}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${total ? (done / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {checklist.sections.map((section) => (
        <section key={section.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <h2 className="border-b border-stone-100 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
            {section.title}
          </h2>
          <ul className="divide-y divide-stone-100">
            {section.items.map((item) => {
              const checked = checkedIds.has(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => void toggle(item.id)}
                    className="flex min-h-14 w-full items-start gap-3 px-4 py-3 text-left active:bg-stone-50"
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                        checked ? 'border-teal-600 bg-teal-600 text-white' : 'border-stone-300 bg-white'
                      }`}
                    >
                      {checked && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block leading-snug ${checked ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                        <RichText text={item.text} />
                      </span>
                      {item.detail && <span className="mt-0.5 block text-sm text-stone-500">{item.detail}</span>}
                    </span>
                    {item.flagged && (
                      <span className="mt-0.5 shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                        {ui.checklist.flagged}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {completedAt ? (
        <section className="rounded-2xl border border-teal-200 bg-teal-50 p-5 text-center">
          <div className="text-lg font-semibold text-teal-900">{checklist.completeMessage ?? ui.checklist.allDone}</div>
          <div className="mt-1 text-sm text-teal-800">{t(ui.checklist.completedAt, { time: formatTime(completedAt) })}</div>
          <button type="button" onClick={reset} className="mt-4 text-sm font-medium text-teal-800 underline underline-offset-2">
            {ui.checklist.reset}
          </button>
        </section>
      ) : (
        <section>
          <button
            type="button"
            disabled={!allDone}
            onClick={() => void complete()}
            className="min-h-14 w-full rounded-2xl bg-teal-700 text-lg font-semibold text-white shadow-sm transition active:scale-[0.99] disabled:bg-stone-200 disabled:text-stone-500"
          >
            {checklist.completeLabel ?? ui.checklist.complete}
          </button>
          {!allDone && <p className="mt-2 text-center text-sm text-stone-500">{ui.checklist.completeHint}</p>}
          {done > 0 && (
            <div className="mt-3 text-center">
              <button type="button" onClick={reset} className="text-sm text-stone-500 underline underline-offset-2">
                {ui.checklist.reset}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
