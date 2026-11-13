import type { CheckReport } from './pyCore';
// Messages between the main thread (PythonRuntime) and the Python worker.

export interface PyError {
  /** Exception class name, e.g. "NameError". */
  type: string;
  message: string;
  /** 1-based line in the user's file, when known. */
  line: number | null;
  /** Traceback text with the runtime's own frames removed. */
  text: string;
}

export type RunKind = 'file' | 'repl' | 'check';

export type ToWorker =
  | { type: 'init'; indexURL: string; inputSab: SharedArrayBuffer | null; interruptSab: SharedArrayBuffer | null }
  | { type: 'run'; id: number; kind: RunKind; code: string; filename: string; inputs: string[]; spec?: string };

export type FromWorker =
  | { type: 'ready'; pythonVersion: string; pyodideVersion: string }
  | { type: 'init-error'; message: string }
  | { type: 'output'; id: number; stream: 'stdout' | 'stderr'; text: string }
  | { type: 'input-request'; id: number; prompt: string }
  | { type: 'done'; id: number; error: PyError | null; truncated: boolean; report?: CheckReport };

/* Input channel layout (Int32 view): [0] state (0 = waiting, 1 = answered, 2 = no input / EOF), [1] byte length.
   Bytes start at offset 8. */
export const INPUT_BYTES = 64 * 1024;
export const INPUT_SAB_SIZE = 8 + INPUT_BYTES;
export const INPUT_WAITING = 0, INPUT_READY = 1, INPUT_EOF = 2;

/** Output beyond this per run is dropped (protects the UI from runaway print loops). */
export const MAX_OUTPUT_CHARS = 200_000;
