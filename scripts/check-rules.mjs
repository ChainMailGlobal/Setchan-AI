#!/usr/bin/env node
// Seven Rules build gate. See RULES.md. Fails the build on any violation.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const problems = [];
const rel = (p) => relative(root, p).replace(/\\/g, '/');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const srcFiles = walk(join(root, 'src')).filter((f) => ['.ts', '.tsx', '.css'].includes(extname(f)));

// 1. No outbound network from app code.
const netPatterns = [
  [/\bfetch\s*\(/, 'fetch()'],
  [/XMLHttpRequest/, 'XMLHttpRequest'],
  [/sendBeacon/, 'navigator.sendBeacon'],
  [/new\s+WebSocket/, 'WebSocket'],
  [/new\s+EventSource/, 'EventSource'],
  [/https?:\/\/(?!www\.w3\.org\/)/, 'external URL'],
];
for (const f of srcFiles) {
  const text = readFileSync(f, 'utf8');
  for (const [re, label] of netPatterns) {
    const m = text.match(re);
    if (m) problems.push(`${rel(f)}: ${label} found ("${m[0]}"). Setchan makes no network calls.`);
  }
}

// 2. CSP locks connections to self.
const html = readFileSync(join(root, 'index.html'), 'utf8');
if (!/Content-Security-Policy/.test(html) || !/connect-src 'self'/.test(html)) {
  problems.push("index.html: missing Content-Security-Policy with connect-src 'self'.");
}

// 3. Content externalized: required files exist and parse.
const required = [
  'content/journey/arrival.json',
  'content/checklists/shift-change.md',
  'content/ui.json',
  'content/personas.json',
];
for (const r of required) {
  const p = join(root, r);
  if (!existsSync(p)) {
    problems.push(`${r}: missing.`);
    continue;
  }
  const text = readFileSync(p, 'utf8');
  if (r.endsWith('.json')) {
    try {
      JSON.parse(text);
    } catch (e) {
      problems.push(`${r}: invalid JSON (${e.message}).`);
    }
  }
  if (r.endsWith('.md') && !text.startsWith('---')) problems.push(`${r}: checklist needs a front-matter block.`);
}

// 4. No PHI-shaped content.
const phiPatterns = [
  [/\b\d{3}-\d{2}-\d{4}\b/, 'SSN-like number'],
  [/\b(DOB|date of birth)\b/i, 'date of birth'],
  [/\bMRN\b/, 'medical record number'],
  [/\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/, 'phone number'],
  [/\bMoCA\b/, 'cognitive score'],
];
for (const f of walk(join(root, 'content'))) {
  const text = readFileSync(f, 'utf8');
  for (const [re, label] of phiPatterns) {
    if (re.test(text)) problems.push(`${rel(f)}: ${label}. Content stays administrative; no PHI.`);
  }
}

// 5. DEMO_TODAY is defined in one place only.
for (const f of srcFiles) {
  if (rel(f) === 'src/lib/clock.ts') continue;
  if (/DEMO_TODAY\s*=/.test(readFileSync(f, 'utf8'))) {
    problems.push(`${rel(f)}: DEMO_TODAY must be defined only in src/lib/clock.ts.`);
  }
}

if (problems.length) {
  console.error('Seven Rules check FAILED:\n' + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log(
  'Seven Rules check passed: no network calls, CSP locked, content externalized, no PHI patterns, DEMO_TODAY pinned once.',
);
