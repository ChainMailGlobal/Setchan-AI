import { useRef, useState, type ChangeEvent } from 'react';
import { clearAll, downloadJson, exportAll, importAll } from '../lib/db';
import { DEMO_TODAY, formatDate, formatTime } from '../lib/clock';
import { t, ui } from '../lib/content';
import { useDemoMode } from '../lib/useClock';

function ymd(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

export function SettingsView() {
  const [demoMode, setDemoMode] = useDemoMode();
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onExport = async () => {
    downloadJson(await exportAll(), `setchan-backup-${ymd(new Date())}.json`);
    setStatus(ui.settings.exportOk);
  };

  const onImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await importAll(JSON.parse(await file.text()));
      setStatus(t(ui.settings.importOk, { checks: result.checks }));
    } catch {
      setStatus(ui.settings.importBad);
    } finally {
      e.target.value = '';
    }
  };

  const onClear = async () => {
    if (!window.confirm(ui.settings.clearConfirm)) return;
    await clearAll();
    setStatus(ui.settings.clearDone);
  };

  const button =
    'flex min-h-12 w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-4 font-medium text-stone-800 shadow-sm active:bg-stone-50';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{ui.settings.title}</h1>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">{ui.settings.clockHeading}</h2>
        <label className="mt-3 flex items-start gap-3">
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => void setDemoMode(e.target.checked)}
            className="mt-1 h-5 w-5 accent-teal-700"
          />
          <span>
            <span className="block font-medium">{ui.settings.demoMode}</span>
            <span className="block text-sm text-stone-600">
              {t(ui.settings.demoModeHelp, { date: formatDate(DEMO_TODAY, true), time: formatTime(DEMO_TODAY) })}
            </span>
          </span>
        </label>
      </section>

      <section className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">{ui.settings.dataHeading}</h2>
        <p className="text-sm text-stone-600">{ui.settings.storage}</p>
        <button type="button" onClick={() => void onExport()} className={button}>
          {ui.settings.export}
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={button}>
          {ui.settings.import}
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void onImport(e)} />
        <button type="button" onClick={() => void onClear()} className={`${button} text-red-700`}>
          {ui.settings.clearAll}
        </button>
        {status && (
          <p role="status" className="rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-700">
            {status}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">{ui.settings.aboutHeading}</h2>
        <p className="mt-2 text-sm text-stone-600">{ui.settings.about}</p>
      </section>
    </div>
  );
}
