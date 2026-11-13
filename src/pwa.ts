// Service-worker state for the UI. main.tsx wires vite-plugin-pwa's register hook into this store,
// so the shell (and tests) never import the virtual module directly.

type Listener = () => void;
const listeners = new Set<Listener>();
export const pwa = {
  needRefresh: false,
  offlineReady: false,
  update: (): void => {},
};
export function setPwa(p: Partial<typeof pwa>) { Object.assign(pwa, p); listeners.forEach((f) => f()); }
export function subscribePwa(f: Listener) { listeners.add(f); return () => { listeners.delete(f); }; }

export const PYODIDE_FILES = ['pyodide.mjs', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
const pyUrl = (f: string) => new URL(`${import.meta.env.BASE_URL}pyodide/${f}`, location.href).href;

/** True when every Python file is in the service worker's cache. */
export async function pythonCached(): Promise<boolean> {
  if (typeof caches === 'undefined') return false;
  try {
    const c = await caches.open('pyodide');
    const hits = await Promise.all(PYODIDE_FILES.map((f) => c.match(pyUrl(f), { ignoreVary: true })));
    return hits.every(Boolean);
  } catch { return false; }
}
/** Download Python into the cache so the interpreter works offline. */
export async function cachePython(): Promise<void> {
  if (typeof caches === 'undefined') throw new Error('This browser has no offline cache.');
  const c = await caches.open('pyodide');
  await c.addAll(PYODIDE_FILES.map(pyUrl));
}
