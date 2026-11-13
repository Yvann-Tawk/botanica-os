import { IDBFactory } from 'fake-indexeddb';
import { boot, resolveStart } from '../src/boot';
import { exportBackup, importBackup, memoryKV, MIGRATIONS, openIDB, openKV } from '../src/storage/db';
import { DEFAULT_SETTINGS, normalizeSettings } from '../src/storage/settings';

beforeEach(() => { globalThis.indexedDB = new IDBFactory(); localStorage.clear(); });

describe('key-value store', () => {
  it('uses IndexedDB when available and persists across opens', async () => {
    const a = await openKV();
    expect(a.kind).toBe('indexeddb');
    await a.set('settings', { motion: 'reduce' });
    const b = await openKV();
    expect(await b.get('settings')).toEqual({ motion: 'reduce' });
  });

  it('falls back to localStorage when IndexedDB is missing', async () => {
    const saved = globalThis.indexedDB;
    // @ts-expect-error simulate a browser without IndexedDB
    delete globalThis.indexedDB;
    try {
      const kv = await openKV();
      expect(kv.kind).toBe('localstorage');
      await kv.set('x', [1, 2]);
      expect(await kv.get('x')).toEqual([1, 2]);
    } finally { globalThis.indexedDB = saved; }
  });

  it('runs every migration step on a fresh database', async () => {
    const db = await openIDB('migr-test', 1);
    expect(Array.from(db.objectStoreNames)).toContain('kv');
    expect(Object.keys(MIGRATIONS).map(Number)).toEqual([1]);
    db.close();
  });
});

describe('settings', () => {
  it('fills defaults and drops invalid values', () => {
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ motion: 'wild', openOnStart: 'settings', sproutChatty: 'yes' })).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ motion: 'reduce', openOnStart: 'terminal', sproutChatty: false })).toMatchObject({ motion: 'reduce', openOnStart: 'terminal', sproutChatty: false });
  });
});

describe('backup', () => {
  it('exports and re-imports everything', async () => {
    const a = memoryKV();
    await a.set('settings', { motion: 'reduce' });
    const file = JSON.parse(JSON.stringify(await exportBackup(a)));
    const b = memoryKV();
    expect(await importBackup(b, file)).toBe(1);
    expect(await b.get('settings')).toEqual({ motion: 'reduce' });
  });
  it('rejects files that are not backups', async () => {
    await expect(importBackup(memoryKV(), { hello: 1 })).rejects.toThrow(/not a Botanica OS backup/);
  });
});

describe('launch state', () => {
  it('?start= wins over settings', () => {
    expect(resolveStart('?start=missions', { ...DEFAULT_SETTINGS, openOnStart: 'desktop' }, null).focus).toBe('missions');
  });
  it('first visit opens the Universe like the prototype', () => {
    expect(resolveStart('', DEFAULT_SETTINGS, undefined).focus).toBe('universe');
  });
  it('a fixed start app ignores the saved layout', () => {
    expect(resolveStart('', { ...DEFAULT_SETTINGS, openOnStart: 'academy' }, { wins: {} }).focus).toBe('academy');
  });
  it('boot survives a store that throws', async () => {
    const kv = { ...memoryKV(), get: () => Promise.reject(new Error('quota')) };
    const r = await boot(kv, '');
    expect(r.settings).toEqual(DEFAULT_SETTINGS);
  });
});
