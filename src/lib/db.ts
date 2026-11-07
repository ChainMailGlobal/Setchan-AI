import Dexie, { type EntityTable } from 'dexie';

export interface CheckRow {
  /** `${checklistId}|${itemId}` */
  key: string;
  checklistId: string;
  itemId: string;
  checked: boolean;
  checkedAt: string | null;
}

export interface MetaRow {
  key: string;
  value: string;
}

export interface Backup {
  app: 'setchan-ai';
  schema: 1;
  exportedAt: string;
  checks: CheckRow[];
  meta: MetaRow[];
}

export const db = new Dexie('setchan-ai') as Dexie & {
  checks: EntityTable<CheckRow, 'key'>;
  meta: EntityTable<MetaRow, 'key'>;
};

db.version(1).stores({
  checks: 'key, checklistId',
  meta: 'key',
});

export const META_DEMO_MODE = 'demoMode';
export const handoffKey = (checklistId: string) => `handoff:${checklistId}`;

export async function setChecked(checklistId: string, itemId: string, checked: boolean, at: Date) {
  await db.checks.put({
    key: `${checklistId}|${itemId}`,
    checklistId,
    itemId,
    checked,
    checkedAt: checked ? at.toISOString() : null,
  });
}

export async function setMeta(key: string, value: string) {
  await db.meta.put({ key, value });
}

export async function resetChecklist(checklistId: string) {
  await db.transaction('rw', db.checks, db.meta, async () => {
    await db.checks.where('checklistId').equals(checklistId).delete();
    await db.meta.delete(handoffKey(checklistId));
  });
}

export async function clearAll() {
  await db.transaction('rw', db.checks, db.meta, async () => {
    await db.checks.clear();
    await db.meta.clear();
  });
}

export async function exportAll(): Promise<Backup> {
  const [checks, meta] = await Promise.all([db.checks.toArray(), db.meta.toArray()]);
  return { app: 'setchan-ai', schema: 1, exportedAt: new Date().toISOString(), checks, meta };
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function isBackup(x: unknown): x is Backup {
  if (!isRecord(x)) return false;
  if (x.app !== 'setchan-ai' || x.schema !== 1) return false;
  if (!Array.isArray(x.checks) || !Array.isArray(x.meta)) return false;
  return (
    x.checks.every(
      (c) =>
        isRecord(c) &&
        typeof c.key === 'string' &&
        typeof c.checklistId === 'string' &&
        typeof c.itemId === 'string' &&
        typeof c.checked === 'boolean',
    ) && x.meta.every((m) => isRecord(m) && typeof m.key === 'string' && typeof m.value === 'string')
  );
}

export async function importAll(data: unknown): Promise<{ checks: number; meta: number }> {
  if (!isBackup(data)) throw new Error('not a Setchan backup');
  await db.transaction('rw', db.checks, db.meta, async () => {
    await db.checks.clear();
    await db.meta.clear();
    await db.checks.bulkPut(data.checks);
    await db.meta.bulkPut(data.meta);
  });
  return { checks: data.checks.length, meta: data.meta.length };
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
