// Copies the Pyodide runtime into public/pyodide so it is served from our own origin (no CDN, works offline later).
import { copyFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const src = dirname(require.resolve('pyodide/package.json'));
const out = join(process.cwd(), 'public', 'pyodide');
const FILES = ['pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json', 'pyodide.mjs'];

mkdirSync(out, { recursive: true });
for (const f of FILES) {
  const from = join(src, f), to = join(out, f);
  if (existsSync(to) && statSync(to).size === statSync(from).size) continue;
  copyFileSync(from, to);
}
console.log(`pyodide ${require('pyodide/package.json').version} → public/pyodide`);
