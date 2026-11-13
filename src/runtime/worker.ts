/// <reference lib="webworker" />
// The Python worker. Owns one Pyodide instance; the main thread terminates and replaces it when a run must be
// killed. Learner code never leaves this device.

import { loadPyodide, version as pyodideVersion } from 'pyodide';
import { createRunner, type Runner } from './pyCore';
import { INPUT_EOF, INPUT_WAITING, MAX_OUTPUT_CHARS, type FromWorker, type ToWorker } from './protocol';

declare const self: DedicatedWorkerGlobalScope;
const post = (m: FromWorker) => self.postMessage(m);

let runner: Runner | null = null;
let inputState: Int32Array | null = null, inputBytes: Uint8Array | null = null;

// per-run state
let runId = 0, queued: string[] = [], pending = '', pendingStream: 'stdout' | 'stderr' = 'stdout', lastFlush = 0, written = 0, truncated = false;
const FLUSH_MS = 40;

function flush() {
  if (pending) post({ type: 'output', id: runId, stream: pendingStream, text: pending });
  pending = ''; lastFlush = Date.now();
}

function write(stream: 'stdout' | 'stderr', text: string) {
  if (!text) return;
  if (written >= MAX_OUTPUT_CHARS) { truncated = true; return; }
  if (written + text.length > MAX_OUTPUT_CHARS) { text = text.slice(0, MAX_OUTPUT_CHARS - written); truncated = true; }
  written += text.length;
  if (stream !== pendingStream) flush();
  pendingStream = stream; pending += text;
  // Python blocks this thread, so timers never fire mid-run: flush on writes instead.
  if (Date.now() - lastFlush >= FLUSH_MS || pending.length > 8192) flush();
}

function input(prompt: string): string | null {
  flush();
  if (inputState && inputBytes) {
    Atomics.store(inputState, 0, INPUT_WAITING);
    post({ type: 'input-request', id: runId, prompt });
    Atomics.wait(inputState, 0, INPUT_WAITING);
    if (Atomics.load(inputState, 0) === INPUT_EOF) return null;
    const len = Atomics.load(inputState, 1);
    return new TextDecoder().decode(inputBytes.slice(0, len));
  }
  // Without cross-origin isolation the worker cannot block: answer from lines supplied before the run.
  return queued.length ? queued.shift()! : null;
}

self.onmessage = async (e: MessageEvent<ToWorker>) => {
  const m = e.data;
  if (m.type === 'init') {
    try {
      const py = await loadPyodide({ indexURL: m.indexURL });
      if (m.inputSab) { inputState = new Int32Array(m.inputSab, 0, 2); inputBytes = new Uint8Array(m.inputSab, 8); }
      if (m.interruptSab) py.setInterruptBuffer(new Uint8Array(m.interruptSab));
      runner = await createRunner(py, { write, input });
      post({ type: 'ready', pythonVersion: runner.pythonVersion, pyodideVersion });
    } catch (err) {
      post({ type: 'init-error', message: String((err as Error)?.message ?? err) });
    }
    return;
  }
  if (m.type === 'run' && runner) {
    runId = m.id; queued = m.inputs.slice(); pending = ''; written = 0; truncated = false; lastFlush = Date.now();
    if (m.kind === 'check') {
      const report = await runner.check(m.code, m.filename, m.spec ?? '{"checks":[]}');
      flush();
      post({ type: 'done', id: m.id, error: null, truncated, report });
      return;
    }
    const error = m.kind === 'file' ? await runner.runFile(m.code, m.filename) : await runner.repl(m.code);
    flush();
    post({ type: 'done', id: m.id, error, truncated });
  }
};

export {};
