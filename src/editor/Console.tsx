import { useCallback, useEffect, useRef, useState } from 'react';

// Colors from the prototype's CON palette.
export const CON = { out: '#e9e3d3', sys: '#7f8a74', err: '#f0a79d', ok: '#bcd8be', in: '#f0c06a' } as const;
export type LineKind = keyof typeof CON;
export interface ConLine { s: string; k: LineKind }

const MAX_LINES = 2000;

/** Console buffer: streamed text is split into lines; a partial last line keeps growing. */
export function useConsole(initial: ConLine[] = []) {
  const [lines, setLines] = useState<ConLine[]>(initial);
  const open = useRef(false); // is the last line still being written by the program?

  const write = useCallback((text: string, k: LineKind) => {
    if (!text) return;
    // Decide outside the updater: StrictMode may call updaters twice, so they must stay pure.
    const wasOpen = open.current;
    open.current = !text.endsWith('\n');
    setLines((prev) => {
      const next = prev.slice();
      const parts = text.split('\n');
      if (parts[parts.length - 1] === '') parts.pop(); // text ended a line
      parts.forEach((part, i) => {
        const last = next[next.length - 1];
        if (i === 0 && wasOpen && last && last.k === k) next[next.length - 1] = { s: last.s + part, k };
        else next.push({ s: part, k });
      });
      return next.length > MAX_LINES ? next.slice(-MAX_LINES) : next;
    });
  }, []);
  const line = useCallback((s: string, k: LineKind) => { open.current = false; setLines((p) => p.concat([{ s, k }]).slice(-MAX_LINES)); }, []);
  const clear = useCallback(() => { open.current = false; setLines([]); }, []);
  return { lines, write, line, clear };
}

interface Props {
  lines: ConLine[];
  title: string;
  onClear: () => void;
  tip?: string;
  empty?: string;
  style?: React.CSSProperties;
  /** When set, the program is waiting on input(): show an answer field. */
  inputPrompt?: string | null;
  onInput?: (text: string) => void;
}

export function Console({ lines, title, onClear, tip, empty, style, inputPrompt, onInput }: Props) {
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => { const b = body.current; if (b) b.scrollTop = b.scrollHeight; }, [lines, tip]);
  return (
    <div className="con" style={style}>
      <div className="con-bar"><span>{title}</span><button onClick={onClear}>Clear</button></div>
      <div className="con-body mono scroll-d" ref={body} role="log" aria-live="polite" aria-label="Console output" tabIndex={0}>
        {!lines.length && empty && <div style={{ color: '#6f7a63' }}>{empty}</div>}
        {lines.map((o, i) => <div className="con-ln" key={i} style={{ color: CON[o.k] }}>{o.s}</div>)}
        {tip && <div className="con-tip"><b style={{ fontFamily: "'Young Serif', Georgia, serif", fontWeight: 400 }}>Sprout reads the traceback:</b> {tip}</div>}
      </div>
      {inputPrompt != null && onInput && <InputRow prompt={inputPrompt} onSubmit={onInput} />}
    </div>
  );
}

function InputRow({ prompt, onSubmit }: { prompt: string; onSubmit: (t: string) => void }) {
  const [v, setV] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className="tm-repl">
      <label htmlFor="con-in">input ›</label>
      <input id="con-in" ref={ref} type="text" autoComplete="off" spellCheck={false} value={v} placeholder="type your answer, then Enter"
        aria-label={`Answer for input(): ${prompt}`} onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(v); setV(''); } }} />
    </div>
  );
}
