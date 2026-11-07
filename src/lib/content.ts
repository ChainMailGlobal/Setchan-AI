/**
 * The only module that touches content/. Everything the app shows comes through here.
 */
import arrival from '../../content/journey/arrival.json';
import personas from '../../content/personas.json';
import uiJson from '../../content/ui.json';
import shiftChangeMd from '../../content/checklists/shift-change.md?raw';
import { parseChecklist, type Checklist } from './checklist';
import type { Caregiver, Phase, Resident } from './types';

export const ui = uiJson;
export const phases: Phase[] = [arrival as Phase];
export const caregiver: Caregiver = personas.caregiver;
export const residents: Resident[] = personas.residents;

const checklistSources: Record<string, string> = {
  'checklists/shift-change.md': shiftChangeMd,
};
const checklistCache = new Map<string, Checklist>();

export function getPhase(id: string): Phase | undefined {
  return phases.find((p) => p.id === id);
}

export function getResident(id: string): Resident | undefined {
  return residents.find((r) => r.id === id);
}

export function getChecklist(source: string): Checklist | null {
  const raw = checklistSources[source];
  if (raw === undefined) return null;
  let parsed = checklistCache.get(source);
  if (!parsed) {
    parsed = parseChecklist(raw);
    checklistCache.set(source, parsed);
  }
  return parsed;
}

/** Fill `{placeholders}` in a content string. Unknown keys are left visible so they get noticed. */
export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in vars ? String(vars[key]) : whole));
}
