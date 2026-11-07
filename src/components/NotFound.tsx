import { ui } from '../lib/content';

export function NotFound() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
      <h1 className="text-lg font-semibold">{ui.notFound.title}</h1>
      <p className="mt-1 text-stone-600">{ui.notFound.body}</p>
      <a href="#/" className="mt-4 inline-block rounded-xl bg-teal-700 px-4 py-2 font-medium text-white">
        {ui.notFound.home}
      </a>
    </div>
  );
}
