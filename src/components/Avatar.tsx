export function Avatar({ initials, size = 'md' }: { initials: string; size?: 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-base';
  return (
    <div
      aria-hidden
      className={`${dims} shrink-0 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center justify-center ring-2 ring-white shadow-sm`}
    >
      {initials}
    </div>
  );
}
