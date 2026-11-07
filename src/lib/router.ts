import { useEffect, useState } from 'react';

function parse(): string[] {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return hash ? hash.split('/').filter(Boolean).map(decodeURIComponent) : [];
}

export function useHashRoute(): string[] {
  const [route, setRoute] = useState<string[]>(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function href(...parts: string[]): string {
  return '#/' + parts.map(encodeURIComponent).join('/');
}
