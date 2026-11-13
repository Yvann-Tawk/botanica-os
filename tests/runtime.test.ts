import { PythonRuntime } from '../src/runtime/PythonRuntime';
import { explain, interruptionNote } from '../src/runtime/explain';
import { codeOf, deleteSnippet, EMPTY_WORKSPACE, normalizeWorkspace, relativeTime, resetFile, saveSnippet, setCode, STARTERS } from '../src/apps/terminal/workspace';
import { FakeWorker, fakeFactory } from './fakeWorker';

const noop = { onOutput: () => {} };
beforeEach(() => { FakeWorker.instances = []; });

describe('PythonRuntime', () => {
  it('starts lazily, once, and reports versions', async () => {
    const rt = new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false });
    expect(rt.status).toBe('idle');
    await Promise.all([rt.start(), rt.start()]);
    expect(FakeWorker.instances).toHaveLength(1);
    expect(rt.status).toBe('ready');
    expect(rt.pythonVersion).toBe('3.12.7');
  });

  it('streams output and resolves with the result', async () => {
    const rt = new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false });
    let out = '';
    const r = await rt.run('print(1)', 'a.py', { onOutput: (_, t) => { out += t; } });
    expect(out).toBe('ok\n');
    expect(r).toEqual({ error: null, interrupted: null, restarted: false, truncated: false });
    expect(rt.status).toBe('ready');
  });

  it('returns Python errors', async () => {
    const rt = new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false });
    const r = await rt.run('boom', 'a.py', noop);
    expect(r.error?.type).toBe('NameError');
  });

  it('refuses a second run while one is active', async () => {
    const rt = new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false, timeoutMs: 50 });
    const first = rt.run('while True: pass', 'a.py', noop);
    await vi.waitFor(() => expect(rt.status).toBe('running'));
    await expect(rt.run('print(1)', 'b.py', noop)).rejects.toThrow(/already running/);
    await first;
  });

  it('times out endless code, replaces the worker, and keeps working', async () => {
    const rt = new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false, timeoutMs: 30 });
    const r = await rt.run('while True: pass', 'a.py', noop);
    expect(r).toMatchObject({ interrupted: 'timeout', restarted: true });
    expect(FakeWorker.instances[0].terminated).toBe(true);
    const again = await rt.run('print(1)', 'a.py', noop);
    expect(again.error).toBeNull();
    expect(FakeWorker.instances).toHaveLength(2);
  });

  it('Stop ends the run', async () => {
    const rt = new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false });
    const p = rt.run('while True: pass', 'a.py', noop);
    await vi.waitFor(() => expect(rt.status).toBe('running'));
    rt.stop();
    expect(await p).toMatchObject({ interrupted: 'stopped', restarted: true });
  });

  it('without isolation, input() is answered from lines given up front', async () => {
    const rt = new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false });
    let out = '';
    await rt.run('input()', 'a.py', { onOutput: (_, t) => { out += t; } }, ['Ilse']);
    expect(out).toBe('hi Ilse\n');
  });

  it('with isolation, input() pauses the clock and waits for an answer', async () => {
    const rt = new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: true, timeoutMs: 40 });
    const asked = vi.fn();
    const p = rt.run('input()', 'a.py', { onOutput: () => {}, onInputRequest: asked });
    await vi.waitFor(() => expect(asked).toHaveBeenCalledWith('Name: '));
    expect(rt.status).toBe('waiting-input');
    await new Promise((r) => setTimeout(r, 80)); // longer than the time limit: waiting must not count
    expect(rt.status).toBe('waiting-input');
    rt.stop();
    expect(await p).toMatchObject({ interrupted: 'stopped' });
  });

  it('a worker that cannot start reports an error instead of throwing', async () => {
    const rt = new PythonRuntime({ createWorker: () => { throw new Error('no workers'); }, indexURL: '/py/', isolated: false });
    await expect(rt.start()).rejects.toThrow(/no workers/);
    expect(rt.status).toBe('error');
  });
});

describe('explanations', () => {
  const e = (type: string, message: string, line: number | null = 3) => explain({ type, message, line, text: '' });
  it('covers the common beginner errors', () => {
    expect(e('TypeError', 'can only concatenate str (not "int") to str')).toMatch(/gluing text to a number/);
    expect(e('NameError', "name 'x' is not defined")).toMatch(/never seen that name/);
    expect(e('SyntaxError', "'(' was never closed")).toMatch(/never closed on line 3/);
    expect(e('SyntaxError', "expected ':'")).toMatch(/colon/);
    expect(e('ValueError', "invalid literal for int() with base 10: 'abc'")).toMatch(/cannot become a number/);
    expect(e('ModuleNotFoundError', "No module named 'requests'")).toMatch(/not available/);
    expect(e('Weird', '')).toMatch(/last line of the traceback/);
  });
  it('notes interruptions', () => {
    expect(interruptionNote({ error: null, interrupted: 'timeout', restarted: true, truncated: false }, 10000)).toMatch(/10 seconds.*restarted/);
    expect(interruptionNote({ error: null, interrupted: null, restarted: false, truncated: false }, 10000)).toBeNull();
  });
});

describe('terminal workspace', () => {
  it('edits drafts and resets to the starter', () => {
    let w = setCode(EMPTY_WORKSPACE, 'seed_bank', 'print(1)');
    expect(codeOf(w, 'seed_bank')).toBe('print(1)');
    w = resetFile(w, 'seed_bank');
    expect(codeOf(w, 'seed_bank')).toBe(STARTERS[0].code);
  });
  it('saves numbered snippets that can be edited and deleted', () => {
    let { w, name } = saveSnippet(EMPTY_WORKSPACE);
    expect(name).toBe('seed_bank_1.py');
    ({ w, name } = saveSnippet(w));
    expect(name).toBe('seed_bank_2.py');
    const id = w.snippets[0].id;
    w = setCode({ ...w, active: id }, id, 'x = 1');
    expect(codeOf(w, id)).toBe('x = 1');
    w = deleteSnippet(w, id);
    expect(w.snippets).toHaveLength(1);
    expect(w.active).toBe('seed_bank');
  });
  it('normalizes stored data', () => {
    expect(normalizeWorkspace({ active: 'nope', drafts: { seed_bank: 'a', evil: 'b' }, snippets: [{ id: 1 }] })).toEqual({ ...EMPTY_WORKSPACE, drafts: { seed_bank: 'a' } });
  });
  it('formats relative times', () => {
    const now = Date.parse('2026-11-13T12:00:00Z');
    expect(relativeTime('2026-11-13T11:59:30Z', now)).toBe('just now');
    expect(relativeTime('2026-11-12T11:00:00Z', now)).toBe('yesterday');
  });
});
