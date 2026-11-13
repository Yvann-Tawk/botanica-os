import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

// Newer Node versions ship an experimental global localStorage that is undefined unless configured,
// which shadows jsdom's. Provide a minimal in-memory Storage so tests behave like a browser.
if (!globalThis.localStorage) {
  const m = new Map<string, string>();
  const storage = {
    get length() { return m.size; },
    key: (i: number) => Array.from(m.keys())[i] ?? null,
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => { m.set(k, String(v)); },
    removeItem: (k: string) => { m.delete(k); },
    clear: () => { m.clear(); },
  };
  // Object.keys(localStorage) must list stored keys, as in browsers.
  const proxy = new Proxy(storage, { ownKeys: () => Array.from(m.keys()), getOwnPropertyDescriptor: (_, k) => (m.has(String(k)) ? { enumerable: true, configurable: true, value: m.get(String(k)) } : undefined) });
  Object.defineProperty(globalThis, 'localStorage', { value: proxy, configurable: true });
}

// Lazy-loaded windows can take a moment under a loaded test run.
import { configure } from '@testing-library/react';
configure({ asyncUtilTimeout: 5000 });
