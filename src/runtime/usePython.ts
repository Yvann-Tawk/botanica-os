import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ConLine, LineKind } from '../editor/Console';
import { explain, interruptionNote } from './explain';
import { getRuntime, type PythonRuntime, type RunResult } from './PythonRuntime';

const runListeners = new Set<() => void>();
/** Called whenever the learner runs or checks code anywhere (for streaks and First Light). Returns an unsubscribe. */
export function onAnyRun(fn: () => void) { runListeners.add(fn); return () => { runListeners.delete(fn); }; }
const notifyRun = () => runListeners.forEach((f) => f());

/** Subscribe a component to the shared interpreter's status. */
export function useRuntimeStatus(rt: PythonRuntime = getRuntime()) {
  return useSyncExternalStore((f) => rt.subscribe(f), () => rt.status, () => rt.status);
}

interface ConsoleSink { write(text: string, k: LineKind): void; line(s: string, k: LineKind): void }

/**
 * Glue between an editor surface and the interpreter: runs code, streams output into a console, handles
 * input() prompts and produces Sprout's tip. Used by the Terminal now and by the Academy and Missions later.
 */
export function usePythonSession(con: ConsoleSink, opts: { onResult?: (r: RunResult) => void; rt?: PythonRuntime } = {}) {
  const rt = opts.rt ?? getRuntime();
  const status = useRuntimeStatus(rt);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [tip, setTip] = useState('');
  const onResult = useRef(opts.onResult);
  onResult.current = opts.onResult;

  const handlers = {
    onOutput: (stream: 'stdout' | 'stderr', text: string) => con.write(text, stream === 'stderr' ? 'err' : 'out'),
    onInputRequest: (p: string) => setPrompt(p),
  };

  const finish = useCallback((r: RunResult) => {
    setPrompt(null);
    const note = interruptionNote(r, rt.timeoutMs);
    if (note) con.line(note, 'sys');
    else if (r.error) { r.error.text.split('\n').forEach((l) => con.line(l, 'err')); setTip(explain(r.error)); }
    if (r.truncated) con.line(`Output was cut off after ${(200_000).toLocaleString()} characters.`, 'sys');
    onResult.current?.(r);
    return r;
  }, [con, rt]);

  const run = useCallback(async (code: string, filename: string): Promise<RunResult | null> => {
    if (rt.status === 'running' || rt.status === 'waiting-input') return null;
    setTip('');
    if (rt.status !== 'ready') con.line('Waking the interpreter… (the first start downloads Python, about 10 MB)', 'sys');
    con.line(`› python ${filename}`, 'sys');
    try {
      const r = await rt.run(code, filename, handlers);
      notifyRun();
      if (!r.error && !r.interrupted) con.line('› finished without errors', 'ok');
      return finish(r);
    } catch (e) {
      con.line(String((e as Error).message), 'err');
      return null;
    }
  }, [rt, con, finish]);

  const repl = useCallback(async (line: string) => {
    if (rt.status === 'running' || rt.status === 'waiting-input') return null;
    setTip('');
    con.line('>>> ' + line, 'in');
    try { return finish(await rt.repl(line, handlers)); } catch (e) { con.line(String((e as Error).message), 'err'); return null; }
  }, [rt, con, finish]);

  /** Validate silently, then show what the program printed (first case) and any traceback. */
  const check = useCallback(async (code: string, filename: string, spec: { checks: unknown[]; inputs?: string[] }): Promise<RunResult | null> => {
    if (rt.status === 'running' || rt.status === 'waiting-input') return null;
    setTip('');
    if (rt.status !== 'ready') con.line('Waking the interpreter… (the first start downloads Python, about 10 MB)', 'sys');
    con.line(`› check ${filename}` + (spec.inputs?.length ? `  (answering input() with: ${spec.inputs.join(', ')})` : ''), 'sys');
    try {
      const r = await rt.check(code, filename, spec);
      notifyRun();
      if (r.report) {
        if (r.report.output) con.write(r.report.output.endsWith('\n') ? r.report.output : r.report.output + '\n', 'out');
        if (r.report.error) { r.report.error.text.split('\n').forEach((l) => con.line(l, 'err')); setTip(explain(r.report.error)); }
      }
      return finish({ ...r, error: null });
    } catch (e) { con.line(String((e as Error).message), 'err'); return null; }
  }, [rt, con, finish]);

  const answer = useCallback((text: string) => { setPrompt(null); rt.provideInput(text); }, [rt]);
  const stop = useCallback(() => rt.stop('stopped'), [rt]);
  const warm = useCallback(() => { rt.start().catch(() => {}); }, [rt]);

  useEffect(() => { if (status === 'error' && rt.lastError) con.line(`Python could not start: ${rt.lastError}`, 'err'); }, [status]);

  return { status, prompt, tip, setTip, run, repl, check, answer, stop, warm, rt, isolated: rt.isolated };
}

export type { ConLine };
