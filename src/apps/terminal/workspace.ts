// Terminal workspace: three starter files (from the prototype) plus snippets the learner saves.
// Persisted as one record so drafts survive reloads.

export interface StarterFile { id: string; name: string; task: string; hint: string; code: string }
export interface Snippet { id: string; name: string; code: string; savedAt: string }
export interface Workspace {
  v: 1;
  active: string;
  /** Edited contents of starter files; missing = unchanged starter code. */
  drafts: Record<string, string>;
  snippets: Snippet[];
}

export const STARTERS: StarterFile[] = [
  { id: 'seed_bank', name: 'seed_bank.py', task: 'Sandbox · a seed bank inventory',
    hint: 'Everything here already works. Try changing packets to "12" in quotes and run it. Then fix it with int().',
    code: '# Seed bank inventory: Hortensia, deck 3\nvault = "Moonfern Archive"\npackets = 12\nseeds_per_packet = 40\ntotal_seeds = packets * seeds_per_packet\nhumidity = 0.62\n\nprint(vault)\nprint(f"{total_seeds} seeds stored at {humidity:.0%} humidity")\n' },
  { id: 'greenhouse', name: 'greenhouse.py', task: 'Sandbox · floats, comparisons and bools',
    hint: 'difference > 2 gives a bool. Change target_c to see the answer flip.',
    code: '# Greenhouse climate log\ntemperature_c = 24.5\ntarget_c = 22\ndifference = temperature_c - target_c\n\nprint("Running warm by", difference, "degrees")\nprint(type(difference))\nis_too_warm = difference > 2\nprint("Vent the greenhouse?", is_too_warm)\n' },
  { id: 'scratch', name: 'scratch.py', task: 'Scratchpad · input() asks you in the console',
    hint: 'Run it and answer in the console. Then try name.upper(), len(name) or name * 3 in the >>> line below.',
    code: '# Your scratchpad: any Python works here\nname = input("Pilot name: ")\nprint("Welcome aboard,", name.title())\n' },
];

export const EMPTY_WORKSPACE: Workspace = { v: 1, active: 'seed_bank', drafts: {}, snippets: [] };
export const MAX_SNIPPETS = 20;

export function normalizeWorkspace(raw: unknown): Workspace {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Workspace>;
  const snippets = Array.isArray(r.snippets)
    ? r.snippets.filter((s): s is Snippet => !!s && typeof s.id === 'string' && typeof s.name === 'string' && typeof s.code === 'string').slice(0, MAX_SNIPPETS)
    : [];
  const drafts: Record<string, string> = {};
  if (r.drafts && typeof r.drafts === 'object') for (const [k, v] of Object.entries(r.drafts)) if (typeof v === 'string' && STARTERS.some((s) => s.id === k)) drafts[k] = v;
  const ids = [...STARTERS.map((s) => s.id), ...snippets.map((s) => s.id)];
  return { v: 1, active: typeof r.active === 'string' && ids.includes(r.active) ? r.active : 'seed_bank', drafts, snippets };
}

export function codeOf(w: Workspace, id: string): string {
  const sn = w.snippets.find((s) => s.id === id);
  if (sn) return sn.code;
  return w.drafts[id] ?? STARTERS.find((s) => s.id === id)?.code ?? '';
}

export function setCode(w: Workspace, id: string, code: string): Workspace {
  if (w.snippets.some((s) => s.id === id)) return { ...w, snippets: w.snippets.map((s) => (s.id === id ? { ...s, code } : s)) };
  return { ...w, drafts: { ...w.drafts, [id]: code } };
}

export function resetFile(w: Workspace, id: string): Workspace {
  const drafts = { ...w.drafts }; delete drafts[id];
  return { ...w, drafts };
}

/** Saves a copy of the active file as a new snippet named like seed_bank_2.py. */
export function saveSnippet(w: Workspace, now = new Date()): { w: Workspace; name: string } {
  const base = (STARTERS.find((s) => s.id === w.active)?.name ?? w.snippets.find((s) => s.id === w.active)?.name ?? 'snippet.py').replace(/(_\d+)?\.py$/, '');
  let n = 1, name: string;
  do { name = `${base}_${n++}.py`; } while (w.snippets.some((s) => s.name === name));
  const sn: Snippet = { id: 'sn-' + now.getTime().toString(36) + Math.random().toString(36).slice(2, 6), name, code: codeOf(w, w.active), savedAt: now.toISOString() };
  return { w: { ...w, snippets: [sn, ...w.snippets].slice(0, MAX_SNIPPETS) }, name };
}

export function deleteSnippet(w: Workspace, id: string): Workspace {
  return { ...w, snippets: w.snippets.filter((s) => s.id !== id), active: w.active === id ? 'seed_bank' : w.active };
}

export function relativeTime(iso: string, now = Date.now()): string {
  const s = Math.max(0, (now - Date.parse(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? 'yesterday' : `${d} days ago`;
}
