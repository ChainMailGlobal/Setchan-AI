import { caregiver, phases, t, ui } from '../lib/content';
import { href } from '../lib/router';

export function Home() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">{t(ui.home.greeting, { caregiver: caregiver.name })}</h1>
        <p className="mt-1 text-stone-600">{ui.home.prompt}</p>
      </section>

      <ul className="space-y-3">
        {phases.map((phase) => (
          <li key={phase.id}>
            <a
              href={href(phase.id)}
              className="block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition active:scale-[0.99]"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                {t(ui.home.phaseLabel, { n: phase.phase })} · {phase.pillar}
              </div>
              <div className="mt-1 text-lg font-semibold">{phase.title}</div>
              <p className="mt-1 text-stone-600">{phase.tagline}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
