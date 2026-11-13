// A stand-in for the Python worker: speaks the real protocol, "runs" a few recognisable programs.
import type { FromWorker, ToWorker } from '../src/runtime/protocol';

export class FakeWorker {
  onmessage: ((e: MessageEvent<FromWorker>) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  terminated = false;
  received: ToWorker[] = [];
  static instances: FakeWorker[] = [];
  constructor() { FakeWorker.instances.push(this); }
  private emit(m: FromWorker) { if (!this.terminated) setTimeout(() => this.onmessage?.({ data: m } as MessageEvent<FromWorker>), 0); }
  terminate() { this.terminated = true; }
  postMessage(m: ToWorker) {
    this.received.push(m);
    if (m.type === 'init') return this.emit({ type: 'ready', pythonVersion: '3.12.7', pyodideVersion: '0.27.8' });
    if (m.kind === 'check') {
      // "PASS" anywhere in the code passes every check; anything else fails them all.
      const n = JSON.parse(m.spec ?? '{"checks":[]}').checks.length, ok = m.code.includes('PASS');
      return this.emit({ type: 'done', id: m.id, error: null, truncated: false, report: { results: Array(n).fill(ok), output: 'checked\n', error: null } });
    }
    if (m.code.includes('while True')) return; // never finishes
    if (m.code.includes('input(')) {
      if (m.inputs.length) { this.emit({ type: 'output', id: m.id, stream: 'stdout', text: `hi ${m.inputs[0]}\n` }); return this.emit({ type: 'done', id: m.id, error: null, truncated: false }); }
      return this.emit({ type: 'input-request', id: m.id, prompt: 'Name: ' });
    }
    if (m.code.includes('boom')) return this.emit({ type: 'done', id: m.id, error: { type: 'NameError', message: "name 'boom' is not defined", line: 1, text: "Traceback (most recent call last):\n  File \"a.py\", line 1, in <module>\nNameError: name 'boom' is not defined" }, truncated: false });
    this.emit({ type: 'output', id: m.id, stream: 'stdout', text: 'ok\n' });
    this.emit({ type: 'done', id: m.id, error: null, truncated: false });
  }
}
export const fakeFactory = () => new FakeWorker() as unknown as Worker;
