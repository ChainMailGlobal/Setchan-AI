import { getPhase, getResident, t, ui } from '../lib/content';
import { href } from '../lib/router';
import { Avatar } from '../components/Avatar';
import { NotFound } from '../components/NotFound';

export function PhaseView({ phaseId }: { phaseId: string }) {
  const phase = getPhase(phaseId);
  if (!phase) return <NotFound />;
  const resident = getResident(phase.residentId);

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {t(ui.home.phaseLabel, { n: phase.phase })} · {phase.pillar}
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{phase.title}</h1>
        <p className="mt-2 text-stone-600">{phase.description}</p>
      </header>

      {resident && (
        <section className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <Avatar initials={resident.initials} />
          <div className="min-w-0">
            <div className="text-xs text-stone-500">{ui.phase.residentLabel}</div>
            <div className="font-semibold">{resident.name}</div>
            <div className="text-sm text-stone-600">
              {resident.unit} · {resident.room}
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">{ui.phase.flowsHeading}</h2>
        <ul className="space-y-3">
          {phase.flows.map((flow) => (
            <li key={flow.id}>
              <a
                href={href(phase.id, flow.id)}
                className="block rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm transition active:scale-[0.99]"
              >
                <div className="text-lg font-semibold text-teal-900">{flow.title}</div>
                <p className="mt-1 text-teal-900/80">{flow.summary}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-teal-700">{flow.when}</span>
                  <span className="rounded-full bg-teal-700 px-3 py-1 font-medium text-white">{ui.phase.open}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
