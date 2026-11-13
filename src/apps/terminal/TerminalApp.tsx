// Terminal: the prototype's layout (files, tabs, editor, console, >>> line, status bar) on real Python.
import { useEffect, useMemo, useRef, useState } from 'react';
import { CodeEditor } from '../../editor/CodeEditor';
import { Console, useConsole } from '../../editor/Console';
import { usePythonSession } from '../../runtime/usePython';
import type { KV } from '../../storage/db';
import { codeOf, deleteSnippet, normalizeWorkspace, relativeTime, resetFile, saveSnippet, setCode, STARTERS, type Workspace } from './workspace';

interface Props { kv: KV; editorMode: 'auto' | 'simple'; onToast: (text: string, sub?: string) => void; onActiveFile?: (name: string) => void }

const SAVE_MS = 500;
const STATUS_TEXT = { idle: 'asleep', loading: 'waking up…', ready: 'ready', running: 'running', 'waiting-input': 'waiting for input', error: 'could not start' } as const;

export default function TerminalApp({ kv, editorMode, onToast, onActiveFile }: Props) {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [hint, setHint] = useState(false);
  const [replIn, setReplIn] = useState('');
  const con = useConsole([{ s: 'Botanica terminal · real Python, running on this device', k: 'sys' }, { s: 'Run a file, or type Python after >>>', k: 'sys' }]);
  const py = usePythonSession(con);
  const replRef = useRef<HTMLInputElement>(null);

  // load, then warm the interpreter so the first Run is quick
  useEffect(() => {
    let alive = true;
    kv.get('terminal').catch(() => undefined).then((raw) => { if (alive) setWs(normalizeWorkspace(raw)); });
    py.warm();
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (!ws) return;
    const t = setTimeout(() => { kv.set('terminal', ws).catch(() => onToast('Your code could not be saved on this device')); }, SAVE_MS);
    return () => clearTimeout(t);
  }, [ws, kv, onToast]);

  const starter = ws ? STARTERS.find((s) => s.id === ws.active) : undefined;
  const snippet = ws?.snippets.find((s) => s.id === ws.active);
  const fileName = starter?.name ?? snippet?.name ?? '';
  useEffect(() => { if (fileName) onActiveFile?.(fileName); }, [fileName, onActiveFile]);
  const code = ws ? codeOf(ws, ws.active) : '';
  const busy = py.status === 'running' || py.status === 'waiting-input';
  const tabs = useMemo(() => (ws ? [...STARTERS.map((s) => ({ id: s.id, name: s.name })), ...(snippet ? [{ id: snippet.id, name: snippet.name }] : [])] : []), [ws, snippet]);

  useEffect(() => { if (py.prompt !== null) replRef.current?.focus(); }, [py.prompt]);

  if (!ws) return <div className="wbody" style={{ background: '#171d12' }} />;

  const open = (id: string) => { setHint(false); setWs({ ...ws, active: id }); };
  const run = () => { if (!busy) py.run(code, fileName); };
  const replKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (py.prompt !== null) { py.answer(replIn); setReplIn(''); return; }
    if (!replIn.trim() || busy) return;
    py.repl(replIn); setReplIn('');
  };
  const lines = code.split('\n').length;

  return (
    <div className="wbody">
      <div className="tm">
        <nav className="tm-side" aria-label="Files">
          <p className="tm-sh">Greenhouse workspace</p>
          {STARTERS.map((f) => {
            const on = f.id === ws.active;
            return <button key={f.id} className={'tm-file ' + (on ? 'is-on' : '')} aria-current={on ? 'page' : undefined} onClick={() => open(f.id)}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5 H 8.5 L 11.5 4.5 V 12.5 H 3 Z" fill="none" stroke={on ? '#f0c06a' : '#8e9584'} strokeWidth="1.4"></path></svg>{f.name}</button>;
          })}
          <p className="tm-sh" style={{ marginTop: '18px' }}>Saved snippets</p>
          {!ws.snippets.length && <div style={{ padding: '6px 8px', fontSize: '12px', color: '#8e9584' }}>None yet. “Save snippet” keeps a copy of the open file.</div>}
          {ws.snippets.map((sn) => (
            <div key={sn.id} className="tm-snip">
              <button className={'tm-file ' + (sn.id === ws.active ? 'is-on' : '')} onClick={() => open(sn.id)} aria-current={sn.id === ws.active ? 'page' : undefined}>
                <span><span className="mono" style={{ color: '#ece6d6' }}>{sn.name}</span><span style={{ display: 'block', color: '#8e9584', fontSize: '11.5px', fontFamily: 'Figtree, sans-serif' }}>{relativeTime(sn.savedAt)}</span></span>
              </button>
              <button className="tm-del" aria-label={`Delete snippet ${sn.name}`} onClick={() => { setWs(deleteSnippet(ws, sn.id)); onToast('Snippet deleted', sn.name); }}>×</button>
            </div>
          ))}
          <div style={{ marginTop: 'auto', padding: '12px 8px 4px', fontSize: '12px', color: '#8e9584', lineHeight: 1.45 }}>Files and snippets are saved on this device as you type.</div>
        </nav>
        <div className="tm-main" style={{ position: 'relative' }}>
          <div className="tm-tabs" role="tablist" aria-label="Open files">
            {tabs.map((f) => <button key={f.id} role="tab" aria-selected={f.id === ws.active} className={'tm-tab ' + (f.id === ws.active ? 'is-on' : '')} onClick={() => open(f.id)}>{f.name}</button>)}
          </div>
          <div className="ed-bar" style={{ paddingLeft: '12px' }}>
            <span style={{ fontSize: '12.5px', color: '#a3a893' }}>{starter?.task ?? 'Saved snippet'}</span>
            <div className="ed-actions">
              {starter && <button className="btn-g" onClick={() => setHint(!hint)} aria-expanded={hint}>Hint</button>}
              <button className="btn-g" onClick={() => { const r = saveSnippet(ws); setWs(r.w); onToast('Snippet saved', r.name); }}>Save snippet</button>
              {starter && <button className="btn-g" onClick={() => setWs(resetFile(ws, ws.active))} disabled={!(ws.active in ws.drafts)}>Reset</button>}
              {busy
                ? <button className="btn-run" onClick={py.stop}><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="1" width="8" height="8" rx="1" fill="#12180e"></rect></svg>Stop</button>
                : <button className="btn-run" onClick={run}><svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1 L 9 6 L 1 11 Z" fill="#12180e"></path></svg>Run<span className="kbd">⌘↵</span></button>}
            </div>
          </div>
          {hint && starter && <div className="tm-pop" role="note"><p className="disp" style={{ margin: '0 0 4px', fontSize: '16px', color: '#3e6510' }}>Sprout's hint</p><p style={{ margin: 0 }}>{starter.hint}</p></div>}
          <CodeEditor value={code} onChange={(c) => setWs((w) => (w ? setCode(w, w.active, c) : w))} onRun={run} ariaLabel={`Python code editor, ${fileName}`} mode={editorMode} />
          <Console lines={con.lines} tip={py.tip} title={`Console · Python ${py.rt.pythonVersion || '3.12'}`} onClear={() => { con.clear(); py.setTip(''); }} style={{ height: '34%' }} />
          <div className="tm-repl">
            <label htmlFor="repl-in">{py.prompt !== null ? 'input ›' : '>>>'}</label>
            <input id="repl-in" ref={replRef} type="text" autoComplete="off" spellCheck={false}
              placeholder={py.prompt !== null ? 'type your answer, then Enter' : 'type(4.2)'}
              aria-label={py.prompt !== null ? `Answer for input(): ${py.prompt}` : 'Python prompt'}
              value={replIn} onChange={(e) => setReplIn(e.target.value)} onKeyDown={replKey} disabled={busy && py.prompt === null} />
          </div>
          <div className="tm-status" role="status">
            <span>Python {py.rt.pythonVersion || '3.12'}{py.rt.pyodideVersion ? ` · Pyodide ${py.rt.pyodideVersion}` : ''}</span><span>UTF-8</span><span>{STATUS_TEXT[py.status]}</span>
            {!py.isolated && <span title="This page is not cross-origin isolated, so input() cannot pause for you and Stop restarts Python.">limited mode</span>}
            <span style={{ marginLeft: 'auto' }}>{lines} lines</span>
          </div>
        </div>
      </div>
    </div>
  );
}
