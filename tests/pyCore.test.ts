// @vitest-environment node
// Integration tests against real Python (Pyodide in Node). Slower than the rest; covers what the worker runs.
import { loadPyodide } from 'pyodide';
import { createRunner, type Runner } from '../src/runtime/pyCore';

let runner: Runner;
let out = '', err = '';
let answers: (string | null)[] = [];

beforeAll(async () => {
  const py = await loadPyodide();
  runner = await createRunner(py, {
    write: (s, t) => { if (s === 'stdout') out += t; else err += t; },
    input: () => (answers.length ? answers.shift()! : null),
  });
}, 60000);
beforeEach(() => { out = ''; err = ''; answers = []; });

describe('python core', () => {
  it('runs real Python 3.12, with async support where the engine has JSPI', async () => {
    expect(runner.asyncSupported).toBe(true);
    expect(await runner.runFile('import asyncio\nasync def f():\n    await asyncio.sleep(0)\n    print("async ok")\nasyncio.run(f())', 'a.py')).toBeNull();
    out = '';
    expect(runner.pythonVersion).toMatch(/^3\.12/);
    expect(await runner.runFile('for i in range(3):\n    print(i * 2)\n', 'main.py')).toBeNull();
    expect(out).toBe('0\n2\n4\n');
  });

  it('reports runtime errors with the user line and a clean traceback', async () => {
    const e = (await runner.runFile('oxygen = "21"\nreserve = 4\ntotal = oxygen + reserve\n', 'lesson.py'))!;
    expect(e.type).toBe('TypeError');
    expect(e.line).toBe(3);
    expect(e.text).toContain('File "lesson.py", line 3');
    expect(e.text).not.toContain('<botanica>');
    expect(e.text).not.toContain('<exec>');
  });

  it('reports syntax errors with the line', async () => {
    const e = (await runner.runFile('print("hi"\n', 'a.py'))!;
    expect(e.type).toBe('SyntaxError');
    expect(e.line).toBe(1);
  });

  it('feeds input() and echoes the answer', async () => {
    answers = ['Ilse'];
    expect(await runner.runFile('name = input("Pilot name: ")\nprint("Welcome aboard,", name.title())\n', 'scratch.py')).toBeNull();
    expect(out).toBe('Pilot name: Ilse\nWelcome aboard, Ilse\n');
  });

  it('raises EOFError when no input is available', async () => {
    expect((await runner.runFile('input()', 'a.py'))!.type).toBe('EOFError');
  });

  it('starts each file run with fresh globals, and the REPL continues the last run', async () => {
    await runner.runFile('x = 41', 'a.py');
    expect(await runner.repl('x + 1')).toBeNull();
    expect(out).toBe('42\n');
    await runner.runFile('y = 1', 'b.py');
    expect((await runner.repl('x'))!.type).toBe('NameError');
  });

  it('REPL echoes expressions but not None, and accepts statements', async () => {
    expect(await runner.repl('None')).toBeNull();
    expect(await runner.repl('z = 5')).toBeNull();
    expect(await runner.repl('z')).toBeNull();
    expect(out).toBe('5\n');
  });

  it('exit() with no code is not an error', async () => {
    expect(await runner.runFile('print(1)\nexit()\nprint(2)', 'a.py')).toBeNull();
    expect(out).toBe('1\n');
  });

  it('stderr is captured separately', async () => {
    await runner.runFile('import sys\nsys.stderr.write("careful\\n")', 'a.py');
    expect(err).toBe('careful\n');
  });
});
