export interface Flow {
  id: string;
  title: string;
  summary: string;
  when: string;
  /** Path under content/, e.g. "checklists/shift-change.md". */
  source: string;
}

export interface Phase {
  id: string;
  phase: number;
  pillar: string;
  title: string;
  tagline: string;
  description: string;
  residentId: string;
  flows: Flow[];
}

export interface Resident {
  id: string;
  name: string;
  initials: string;
  unit: string;
  room: string;
  communication: string;
}

export interface Caregiver {
  id: string;
  name: string;
  role: string;
}
