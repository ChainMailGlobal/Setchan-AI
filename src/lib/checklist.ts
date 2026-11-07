/**
 * Parser for content/checklists/*.md.
 *
 *   ---                     front matter: key: value lines
 *   ---
 *   ## Heading              section
 *   - [ ] text              item
 *   - [ ] !text             flagged item
 *     detail line           (indented two+ spaces) detail for the item above
 *   **bold**                highlighted name inside item text
 *
 * Anything else (the H1, HTML comments, blank lines) is ignored.
 */

export interface ChecklistItem {
  id: string;
  text: string;
  flagged: boolean;
  detail?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Checklist {
  id: string;
  title?: string;
  resident?: string;
  intro?: string;
  handoffTime?: string;
  completeLabel?: string;
  completeMessage?: string;
  sections: ChecklistSection[];
}

export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\*\*/g, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function parseChecklist(md: string): Checklist {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const meta: Record<string, string> = {};
  let i = 0;

  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') {
      const m = /^([\w-]+):\s*(.*)$/.exec(lines[i]);
      if (m) meta[m[1]] = m[2].trim().replace(/^"(.*)"$/, '$1');
      i++;
    }
    i++; // closing ---
  }

  const sections: ChecklistSection[] = [];
  let current: ChecklistSection | null = null;
  let lastItem: ChecklistItem | null = null;
  let inComment = false;

  for (; i < lines.length; i++) {
    const line = lines[i];
    if (inComment) {
      if (line.includes('-->')) inComment = false;
      continue;
    }
    if (line.trimStart().startsWith('<!--')) {
      inComment = !line.includes('-->');
      continue;
    }
    if (!line.trim()) continue;

    const heading = /^##\s+(.*)$/.exec(line);
    if (heading) {
      const title = heading[1].trim();
      current = { id: slug(title), title, items: [] };
      sections.push(current);
      lastItem = null;
      continue;
    }

    const item = /^-\s+\[[ xX]?\]\s*(!)?\s*(.*)$/.exec(line);
    if (item && current) {
      const text = item[2].trim();
      lastItem = { id: `${current.id}/${slug(text)}`, text, flagged: item[1] === '!' };
      current.items.push(lastItem);
      continue;
    }

    const detail = /^\s{2,}>?\s*(.*)$/.exec(line);
    if (detail && lastItem) {
      const extra = detail[1].trim();
      lastItem.detail = lastItem.detail ? `${lastItem.detail} ${extra}` : extra;
      continue;
    }
  }

  return {
    id: meta.id ?? 'checklist',
    title: meta.title,
    resident: meta.resident,
    intro: meta.intro,
    handoffTime: meta.handoff_time,
    completeLabel: meta.complete_label,
    completeMessage: meta.complete_message,
    sections,
  };
}
