// Sandboxed live preview for HTML lessons. The learner's markup is rendered in an iframe via `srcdoc` with an
// empty `sandbox` — scripts never run, and the frame is a unique, opaque origin, so it cannot reach the parent
// app's DOM, storage, cookies, or execution context (EXERCISE_UI_SPEC security). A restrictive CSP is injected
// as well. Rendering is debounced so typing stays smooth.

import { useEffect, useRef, useState } from 'react';

/** Wrap a learner fragment in a minimal document when they haven't written a full one, and inject a CSP that
 *  blocks scripts and network except inline styles and data/blob images. */
function frame(html: string): string {
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; font-src data:">`;
  const hasHtml = /<html[\s>]/i.test(html);
  if (hasHtml) {
    // inject the CSP just after <head> (or <html>) without disturbing the learner's document
    if (/<head[\s>]/i.test(html)) return html.replace(/<head([^>]*)>/i, `<head$1>${csp}`);
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${csp}</head>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8">${csp}<style>body{font-family:system-ui,sans-serif;margin:16px;color:#17130d}</style></head><body>${html}</body></html>`;
}

interface Props {
  html: string;
  /** ms to wait after the last keystroke before re-rendering. */
  debounce?: number;
  title?: string;
}

export function HtmlPreview({ html, debounce = 250, title = 'Live preview' }: Props) {
  const [doc, setDoc] = useState(() => frame(html));
  const ref = useRef<number | undefined>(undefined);
  useEffect(() => {
    clearTimeout(ref.current);
    ref.current = window.setTimeout(() => setDoc(frame(html)), debounce);
    return () => clearTimeout(ref.current);
  }, [html, debounce]);
  return (
    <iframe
      title={title}
      srcDoc={doc}
      sandbox=""
      referrerPolicy="no-referrer"
      style={{ width: '100%', height: '100%', border: 0, background: '#ffffff', display: 'block' }}
    />
  );
}
