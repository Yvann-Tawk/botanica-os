import { lazy, Suspense, useEffect, useState, type KeyboardEvent } from 'react';
import { hlBlock } from './highlight';

const MonacoEditor = lazy(() => import('./MonacoEditor'));

export interface EditorProps {
  value: string;
  onChange: (code: string) => void;
  onRun: () => void;
  ariaLabel: string;
  /** 'auto' uses Monaco on screens 760px and wider; 'simple' always uses the lightweight editor. */
  mode?: 'auto' | 'simple';
}

const wide = () => typeof window !== 'undefined' && window.matchMedia?.('(min-width: 760px)').matches;
// jsdom has no layout engine for Monaco; tests exercise the simple editor.
const canMonaco = () => typeof navigator !== 'undefined' && !/jsdom/i.test(navigator.userAgent);

/** The prototype's editor shows instantly; Monaco replaces it once loaded (wide screens only). */
export function CodeEditor(p: EditorProps) {
  const [useMonaco, setUseMonaco] = useState(false);
  useEffect(() => {
    const decide = () => setUseMonaco((p.mode ?? 'auto') === 'auto' && !!wide() && canMonaco());
    decide();
    const mq = window.matchMedia?.('(min-width: 760px)');
    mq?.addEventListener?.('change', decide);
    return () => mq?.removeEventListener?.('change', decide);
  }, [p.mode]);

  if (!useMonaco) return <SimpleEditor {...p} />;
  return <Suspense fallback={<SimpleEditor {...p} />}><MonacoEditor {...p} /></Suspense>;
}

/** Ported from the prototype: a transparent textarea over a highlighted layer. */
export function SimpleEditor({ value, onChange, onRun, ariaLabel }: EditorProps) {
  const lines = hlBlock(value);
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); onRun(); return; }
    if (e.key === 'Tab' && !e.shiftKey && !e.altKey) {
      // Tab indents; Escape then Tab moves focus on (WCAG: no keyboard trap).
      if ((e.currentTarget.dataset.escaped ?? '') === '1') { e.currentTarget.dataset.escaped = ''; return; }
      e.preventDefault();
      const ta = e.currentTarget, s = ta.selectionStart, en = ta.selectionEnd;
      onChange(value.slice(0, s) + '    ' + value.slice(en));
      requestAnimationFrame(() => { try { ta.selectionStart = ta.selectionEnd = s + 4; } catch { /* detached */ } });
    }
    if (e.key === 'Escape') e.currentTarget.dataset.escaped = '1';
  };
  return (
    <div className="ed-scroll scroll-d">
      <div className="ed-gutter mono" aria-hidden="true">{lines.map((ln) => <div key={ln.n}>{ln.n}</div>)}</div>
      <div className="ed-area">
        <div className="ed-hl mono" aria-hidden="true">{lines.map((ln) => <div className="ed-ln" key={ln.n}>{ln.toks.map((tk, i) => <span key={i} style={{ color: tk.c }}>{tk.t}</span>)}</div>)}</div>
        <textarea className="ed-ta mono" aria-label={ariaLabel} aria-describedby="ed-help" spellCheck={false} wrap="off" value={value}
          onChange={(e) => onChange(e.target.value)} onKeyDown={onKey}></textarea>
        <span id="ed-help" hidden>Tab indents. Press Escape, then Tab, to leave the editor. Command or Control plus Enter runs the code.</span>
      </div>
    </div>
  );
}
