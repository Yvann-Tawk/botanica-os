// Main-thread client for the Python worker: lazy start, one run at a time, input, stop, timeout and recovery.
//
// Limits, stated plainly:
// - Code runs in a Web Worker with the page's origin. That keeps the UI responsive and the code on this device,
//   but it is not a security sandbox; it is meant for running your own code.
// - Stopping uses a KeyboardInterrupt when the page is cross-origin isolated. If Python does not stop (or the
//   page is not isolated) the worker is terminated and replaced, and all Python state from that session is lost.

import type { CheckReport } from './pyCore';
import { INPUT_EOF, INPUT_READY, INPUT_SAB_SIZE, type FromWorker, type PyError, type RunKind, type ToWorker } from './protocol';

export type RuntimeStatus = 'idle' | 'loading' | 'ready' | 'running' | 'waiting-input' | 'error';

export interface RunHandlers {
  onOutput(stream: 'stdout' | 'stderr', text: string): void;
  /** Called when Python waits for input(). Answer with runtime.provideInput(). */
  onInputRequest?(prompt: string): void;
}

export interface RunResult {
  error: PyError | null;
  /** 'stopped' = the learner pressed Stop; 'timeout' = the time limit ran out. */
  interrupted: null | 'stopped' | 'timeout';
  /** True when the worker had to be replaced, so earlier variables are gone. */
  restarted: boolean;
  truncated: boolean;
  /** Present for check runs that finished. */
  report?: CheckReport;
}

export interface RuntimeOptions {
  createWorker?: () => Worker;
  indexURL?: string;
  /** Run-time limit in ms. Time spent waiting for input() does not count. */
  timeoutMs?: number;
  /** How long a KeyboardInterrupt gets before the worker is terminated. */
  graceMs?: number;
  /** Override detection (tests). */
  isolated?: boolean;
}

const defaultWorker = () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

interface Active {
  id: number; handlers: RunHandlers; resolve: (r: RunResult) => void;
  interrupted: RunResult['interrupted']; elapsed: number; startedAt: number | null; timer: ReturnType<typeof setTimeout> | null;
  grace: ReturnType<typeof setTimeout> | null;
}

export class PythonRuntime {
  status: RuntimeStatus = 'idle';
  pythonVersion = '';
  pyodideVersion = '';
  lastError = '';
  readonly isolated: boolean;
  readonly timeoutMs: number;
  private opts: Required<Pick<RuntimeOptions, 'createWorker' | 'indexURL' | 'graceMs'>>;
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private inputSab: SharedArrayBuffer | null = null;
  private interruptSab: SharedArrayBuffer | null = null;
  private active: Active | null = null;
  private nextId = 1;
  private listeners = new Set<() => void>();

  constructor(o: RuntimeOptions = {}) {
    this.isolated = o.isolated ?? (typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated && typeof SharedArrayBuffer !== 'undefined');
    this.timeoutMs = o.timeoutMs ?? 10_000;
    this.opts = {
      createWorker: o.createWorker ?? defaultWorker,
      indexURL: o.indexURL ?? new URL(`${import.meta.env.BASE_URL}pyodide/`, location.href).href,
      graceMs: o.graceMs ?? 1500,
    };
  }

  subscribe(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  private set(status: RuntimeStatus) { this.status = status; this.listeners.forEach((f) => f()); }

  /** Start the worker and load Python. Safe to call repeatedly; resolves when ready. */
  start(): Promise<void> {
    if (this.ready) return this.ready;
    this.set('loading');
    if (this.isolated) {
      this.inputSab = new SharedArrayBuffer(INPUT_SAB_SIZE);
      this.interruptSab = new SharedArrayBuffer(1);
    }
    let w: Worker;
    try { w = this.opts.createWorker(); } catch (e) {
      const msg = `This browser could not start a worker: ${(e as Error).message}`;
      this.fail(msg);
      return Promise.reject(new Error(msg));
    }
    this.worker = w;
    this.ready = new Promise<void>((resolve, reject) => {
      w.onmessage = (e: MessageEvent<FromWorker>) => {
        const m = e.data;
        if (m.type === 'ready') { this.pythonVersion = m.pythonVersion; this.pyodideVersion = m.pyodideVersion; this.set('ready'); resolve(); }
        else if (m.type === 'init-error') { this.fail(m.message); reject(new Error(m.message)); }
        else this.onMessage(m);
      };
      w.onerror = (e) => { const msg = e.message || 'The Python worker crashed.'; this.fail(msg); reject(new Error(msg)); };
    });
    this.ready.catch(() => {});
    this.send({ type: 'init', indexURL: this.opts.indexURL, inputSab: this.inputSab, interruptSab: this.interruptSab });
    return this.ready;
  }

  private fail(msg: string) {
    this.lastError = msg;
    this.worker?.terminate(); this.worker = null; this.ready = null;
    if (this.active) this.finish({ error: { type: 'RuntimeError', message: msg, line: null, text: msg }, truncated: false }, true);
    this.set('error');
  }

  private send(m: ToWorker) { this.worker!.postMessage(m); }

  run(code: string, filename: string, handlers: RunHandlers, inputs: string[] = []): Promise<RunResult> { return this.exec('file', code, filename, handlers, inputs); }
  repl(line: string, handlers: RunHandlers): Promise<RunResult> { return this.exec('repl', line, '<stdin>', handlers, []); }
  /** Validate a program against check specs. Runs silently with the given stdin lines; never prompts. */
  check(code: string, filename: string, spec: { checks: unknown[]; inputs?: string[] }): Promise<RunResult> {
    return this.exec('check', code, filename, { onOutput: () => {} }, [], JSON.stringify(spec));
  }

  private async exec(kind: RunKind, code: string, filename: string, handlers: RunHandlers, inputs: string[], spec?: string): Promise<RunResult> {
    if (this.active) throw new Error('Python is already running. Stop it first.');
    await this.start();
    if (this.interruptSab) new Uint8Array(this.interruptSab)[0] = 0;
    return new Promise<RunResult>((resolve) => {
      const id = this.nextId++;
      this.active = { id, handlers, resolve, interrupted: null, elapsed: 0, startedAt: null, timer: null, grace: null };
      this.resumeClock();
      this.set('running');
      this.send({ type: 'run', id, kind, code, filename, inputs, spec });
    });
  }

  private resumeClock() {
    const a = this.active; if (!a) return;
    a.startedAt = Date.now();
    a.timer = setTimeout(() => this.stop('timeout'), Math.max(0, this.timeoutMs - a.elapsed));
  }
  private pauseClock() {
    const a = this.active; if (!a || a.startedAt == null) return;
    a.elapsed += Date.now() - a.startedAt; a.startedAt = null;
    if (a.timer) clearTimeout(a.timer); a.timer = null;
  }

  private onMessage(m: FromWorker) {
    const a = this.active;
    if (!a || !('id' in m) || m.id !== a.id) return;
    if (m.type === 'output') a.handlers.onOutput(m.stream, m.text);
    else if (m.type === 'input-request') { this.pauseClock(); this.set('waiting-input'); a.handlers.onInputRequest?.(m.prompt); }
    else if (m.type === 'done') this.finish({ error: m.error, truncated: m.truncated, report: m.report }, false);
  }

  private finish(r: { error: PyError | null; truncated: boolean; report?: CheckReport }, restarted: boolean) {
    const a = this.active; if (!a) return;
    this.pauseClock();
    if (a.grace) clearTimeout(a.grace);
    this.active = null;
    a.resolve({ ...r, interrupted: a.interrupted, restarted });
    if (this.status !== 'error') this.set(this.worker ? 'ready' : 'idle');
  }

  /** Answer a pending input(). null sends end-of-input (EOFError in Python). */
  provideInput(text: string | null) {
    if (!this.active || this.status !== 'waiting-input' || !this.inputSab) return;
    const state = new Int32Array(this.inputSab, 0, 2);
    if (text == null) Atomics.store(state, 0, INPUT_EOF);
    else {
      const bytes = new TextEncoder().encode(text).slice(0, INPUT_SAB_SIZE - 8);
      new Uint8Array(this.inputSab, 8).set(bytes);
      Atomics.store(state, 1, bytes.length);
      Atomics.store(state, 0, INPUT_READY);
    }
    Atomics.notify(state, 0);
    this.set('running');
    this.resumeClock();
  }

  /** Stop the current run: interrupt politely, then terminate the worker if it does not respond. */
  stop(reason: 'stopped' | 'timeout' = 'stopped') {
    const a = this.active; if (!a || a.interrupted) return;
    a.interrupted = reason;
    this.pauseClock();
    const kill = () => {
      if (this.active !== a) return;
      this.worker?.terminate(); this.worker = null; this.ready = null; this.inputSab = null; this.interruptSab = null;
      this.finish({ error: null, truncated: false }, true);
    };
    if (this.interruptSab && this.inputSab && this.status !== 'waiting-input') {
      new Uint8Array(this.interruptSab)[0] = 2; // SIGINT → KeyboardInterrupt
      a.grace = setTimeout(kill, this.opts.graceMs);
    } else kill();
  }

  /** Throw away Python state by replacing the worker. */
  reset() {
    if (this.active) this.stop();
    this.worker?.terminate(); this.worker = null; this.ready = null;
    this.set('idle');
  }
}

let shared: PythonRuntime | null = null;
/** One interpreter for the whole app. */
export function getRuntime(): PythonRuntime { return (shared ??= new PythonRuntime()); }
/** Tests swap in a runtime backed by a fake worker. */
export function setRuntime(rt: PythonRuntime | null) { shared = rt; }
