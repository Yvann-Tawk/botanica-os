// Local key-value persistence. IndexedDB first, then localStorage, then memory, so the app always runs.
// Schema changes go in MIGRATIONS; bump DB_VERSION and add a step. Steps run in order on upgrade.

export const DB_NAME = 'botanica';
export const DB_VERSION = 1;
const STORE = 'kv';
const LS_PREFIX = 'botanica:';

type Migration = (db: IDBDatabase, tx: IDBTransaction) => void;
export const MIGRATIONS: Record<number, Migration> = {
  1: (db) => { db.createObjectStore(STORE); },
};

export interface KV {
  readonly kind: 'indexeddb' | 'localstorage' | 'memory';
  get<T = unknown>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  entries(): Promise<Record<string, unknown>>;
  clear(): Promise<void>;
}

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
}

export function openIDB(name = DB_NAME, version = DB_VERSION): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    if (typeof indexedDB === 'undefined') return rej(new Error('IndexedDB unavailable'));
    const open = indexedDB.open(name, version);
    open.onupgradeneeded = (e) => {
      const db = open.result, tx = open.transaction!;
      for (let v = e.oldVersion + 1; v <= version; v++) MIGRATIONS[v]?.(db, tx);
    };
    open.onsuccess = () => res(open.result);
    open.onerror = () => rej(open.error);
    open.onblocked = () => rej(new Error('IndexedDB upgrade blocked by another tab'));
  });
}

function idbKV(db: IDBDatabase): KV {
  const store = (mode: IDBTransactionMode) => db.transaction(STORE, mode).objectStore(STORE);
  return {
    kind: 'indexeddb',
    get: (k) => req(store('readonly').get(k)),
    set: async (k, v) => { await req(store('readwrite').put(v, k)); },
    del: async (k) => { await req(store('readwrite').delete(k)); },
    entries: async () => {
      const s = store('readonly');
      const [keys, vals] = await Promise.all([req(s.getAllKeys()), req(s.getAll())]);
      return Object.fromEntries(keys.map((k, i) => [String(k), vals[i]]));
    },
    clear: async () => { await req(store('readwrite').clear()); },
  };
}

function localKV(): KV {
  const ls = window.localStorage;
  const probe = LS_PREFIX + '__probe';
  ls.setItem(probe, '1'); ls.removeItem(probe);
  const keys = () => Object.keys(ls).filter((k) => k.startsWith(LS_PREFIX));
  return {
    kind: 'localstorage',
    get: async (k) => { const v = ls.getItem(LS_PREFIX + k); return v == null ? undefined : JSON.parse(v); },
    set: async (k, v) => { ls.setItem(LS_PREFIX + k, JSON.stringify(v)); },
    del: async (k) => { ls.removeItem(LS_PREFIX + k); },
    entries: async () => Object.fromEntries(keys().map((k) => [k.slice(LS_PREFIX.length), JSON.parse(ls.getItem(k)!)])),
    clear: async () => { keys().forEach((k) => ls.removeItem(k)); },
  };
}

export function memoryKV(): KV {
  const m = new Map<string, unknown>();
  return {
    kind: 'memory',
    get: async (k) => structuredClone(m.get(k)) as never,
    set: async (k, v) => { m.set(k, structuredClone(v)); },
    del: async (k) => { m.delete(k); },
    entries: async () => Object.fromEntries(m),
    clear: async () => { m.clear(); },
  };
}

export async function openKV(): Promise<KV> {
  try { return idbKV(await openIDB()); } catch { /* fall through */ }
  try { return localKV(); } catch { /* fall through */ }
  return memoryKV();
}

/** Backup format. `app` + `format` let a future importer recognise and upgrade old files. */
export interface Backup { app: 'botanica-os'; format: 1; exportedAt: string; data: Record<string, unknown> }

export async function exportBackup(kv: KV): Promise<Backup> {
  return { app: 'botanica-os', format: 1, exportedAt: new Date().toISOString(), data: await kv.entries() };
}

export async function importBackup(kv: KV, raw: unknown): Promise<number> {
  const b = raw as Partial<Backup> | null;
  if (!b || b.app !== 'botanica-os' || b.format !== 1 || !b.data || typeof b.data !== 'object') {
    throw new Error('This file is not a Terraform OS (Botanica) backup.');
  }
  const entries = Object.entries(b.data);
  for (const [k, v] of entries) await kv.set(k, v);
  return entries.length;
}
