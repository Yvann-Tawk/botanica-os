/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite/client" />

// Monaco's ESM entry points ship without their own .d.ts; they expose the same API as the package root.
declare module 'monaco-editor/esm/vs/editor/edcore.main.js' {
  export * from 'monaco-editor';
}
declare module 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js';
