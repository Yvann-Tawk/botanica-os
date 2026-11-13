// Runs learner code inside a Pyodide instance. Environment-agnostic: used by the Web Worker in the browser
// and directly by the Node test suite.

import type { PyodideInterface } from 'pyodide';
import type { PyError } from './protocol';

export interface CoreHooks {
  write(stream: 'stdout' | 'stderr', text: string): void;
  /** Return the line the learner typed, or null for end-of-input. Called synchronously from Python. */
  input(prompt: string): string | null;
}

// The harness lives in its own module so its frames can be stripped from learner tracebacks.
const HARNESS = String.raw`
import builtins, contextlib, io, json, re, sys, traceback

def _input(prompt=''):
    prompt = str(prompt)
    sys.stdout.write(prompt)
    sys.stdout.flush()
    line = _botanica_input(prompt)
    if line is None:
        raise EOFError('input() found no more lines to read')
    sys.stdout.write(line + '\n')
    sys.stdout.flush()
    return line

builtins.input = _input
_ns = {}

def _fresh():
    global _ns
    _ns = {'__name__': '__main__', '__builtins__': builtins}

def _describe(e, filename):
    frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == filename]
    if isinstance(e, SyntaxError):
        text = ''.join(traceback.format_exception_only(type(e), e))
        line = e.lineno
    else:
        head = 'Traceback (most recent call last):\n' if frames else ''
        text = head + ''.join(traceback.format_list(frames)) + ''.join(traceback.format_exception_only(type(e), e))
        line = frames[-1].lineno if frames else None
    msg = str(e) if not isinstance(e, SyntaxError) else (e.msg or '')
    return json.dumps({'type': type(e).__name__, 'message': msg, 'line': line, 'text': text.rstrip('\n')})

def _finish():
    try:
        sys.stdout.flush(); sys.stderr.flush()
    except Exception:
        pass

def _run(src, filename):
    _fresh()
    try:
        exec(compile(src, filename, 'exec'), _ns)
        return None
    except SystemExit as e:
        return None if e.code in (None, 0) else _describe(e, filename)
    except BaseException as e:
        return _describe(e, filename)
    finally:
        _finish()

def _repl(src):
    try:
        try:
            code, is_expr = compile(src, '<stdin>', 'eval'), True
        except SyntaxError:
            code, is_expr = compile(src, '<stdin>', 'exec'), False
        if is_expr:
            value = eval(code, _ns)
            if value is not None:
                print(repr(value))
        else:
            exec(code, _ns)
        return None
    except BaseException as e:
        return _describe(e, '<stdin>')
    finally:
        _finish()

_fresh()

# ---- exercise checker ----
# Runs the learner's program silently (stdin from a list, stdout captured) and evaluates check specs.
# Everything here ships to the browser, so a determined learner can read it: checks guide, they don't police.

def _exec_case(src, filename, inputs, prelude=None):
    queue = list(inputs)
    buf = io.StringIO()
    def fake_input(prompt=''):
        buf.write(str(prompt))
        if not queue:
            raise EOFError('input() found no more lines to read')
        v = queue.pop(0)
        buf.write(v + '\n')
        return v
    if prelude:
        src = prelude(src)
    ns = {'__name__': '__main__', '__builtins__': builtins}
    old, err = builtins.input, None
    builtins.input = fake_input
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(src, filename, 'exec'), ns)
    except SystemExit as e:
        if e.code not in (None, 0):
            err = json.loads(_describe(e, filename))
    except BaseException as e:
        err = json.loads(_describe(e, filename))
    finally:
        builtins.input = old
    return {'ns': ns, 'out': buf.getvalue(), 'err': err}

def _lines(text):
    out = [l.rstrip() for l in text.split('\n')]
    while out and out[-1] == '':
        out.pop()
    return out

def _same(a, b):
    # b is the expectation (from JSON). Lists stand for tuples, and for sets ignoring order.
    if isinstance(a, bool) or isinstance(b, bool):
        return type(a) is type(b) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) < 1e-9
    if isinstance(a, (set, frozenset)) and isinstance(b, list):
        return len(a) == len(set(map(_hashable, b))) and all(any(_same(x, y) for x in a) for y in b)
    if isinstance(a, (list, tuple)) and isinstance(b, list):
        return len(a) == len(b) and all(_same(x, y) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(_same(a[k], b[k]) for k in a)
    return a == b

def _hashable(x):
    return tuple(x) if isinstance(x, list) else x

def _py_value(v):
    # Starting values come from JSON; {"__set__": [...]} and {"__tuple__": [...]} stand for those types.
    if isinstance(v, dict) and set(v) == {'__set__'}:
        return set(_py_value(x) for x in v['__set__'])
    if isinstance(v, dict) and set(v) == {'__tuple__'}:
        return tuple(_py_value(x) for x in v['__tuple__'])
    if isinstance(v, dict) and set(v) == {'__date__'}:
        import datetime
        return datetime.date.fromisoformat(v['__date__'])
    if isinstance(v, list):
        return [_py_value(x) for x in v]
    if isinstance(v, dict):
        return {k: _py_value(x) for k, x in v.items()}
    return v

def _set_first(src, name, value):
    value = _py_value(value)
    # The value may be a triple-quoted string spanning several lines: replace all of it.
    pat = re.compile(r'^(\s*)' + re.escape(name) + r'\s*=(?!=)\s*(?:"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\'|.*)$', re.M)
    return pat.sub(lambda m: m.group(1) + name + ' = ' + _source(value), src, count=1)

def _source(v):
    # Source text for a starting value; dates must not depend on how the program imported datetime.
    import datetime
    if isinstance(v, datetime.date):
        return f'__import__("datetime").date({v.year}, {v.month}, {v.day})'
    return repr(v)

def _eval(c, src, filename, first, inputs):
    k = c['kind']
    if k == 'runs':
        return first['err'] is None
    if k == 'output':
        if first['err'] is not None and not first['out']:
            return False
        out = first['out']
        if 'lines' in c:
            return _lines(out) == [l.rstrip() for l in c['lines']]
        if 'contains' in c:
            return c['contains'] in out
        if 'regex' in c:
            return re.search(c['regex'], out, re.M) is not None
        return True
    if k == 'var':
        ns = first['ns']
        if c['name'] not in ns:
            return False
        v = ns[c['name']]
        if 'type' in c and type(v).__name__ != c['type']:
            return False
        if 'equals' in c and not _same(v, c['equals']):
            return False
        if c.get('nonEmpty') and not (isinstance(v, str) and v.strip()):
            return False
        return True
    if k == 'source':
        if 'matches' in c and not re.search(c['matches'], src, re.M):
            return False
        if 'notMatches' in c and re.search(c['notMatches'], src, re.M):
            return False
        return True
    if k == 'cases':
        for case in c['cases']:
            r = _exec_case(src, filename, case['inputs'])
            if r['err'] is not None:
                return False
            if 'regex' in case and not re.search(case['regex'], r['out'], re.M):
                return False
            for name, want in case.get('expect', {}).items():
                if name not in r['ns'] or not _same(r['ns'][name], want):
                    return False
        return True
    if k == 'variants':
        for v in c['variants']:
            def prelude(s, v=v):
                for name, value in v['set'].items():
                    s = _set_first(s, name, value)
                return s
            r = _exec_case(src, filename, inputs, prelude)
            if r['err'] is not None:
                return False
            for name, want in v['expect'].items():
                if name not in r['ns'] or not _same(r['ns'][name], want):
                    return False
        return True
    if k == 'call':
        fn = first['ns'].get(c['fn'])
        if not callable(fn):
            return False
        for call in c['calls']:
            buf = io.StringIO()
            try:
                with contextlib.redirect_stdout(buf):
                    got = fn(*_py_value(call.get('args', [])), **_py_value(call.get('kwargs', {})))
            except BaseException:
                return False
            if 'returns' in call and not _same(got, call['returns']):
                return False
            if 'prints' in call and _lines(buf.getvalue()) != [l.rstrip() for l in call['prints']]:
                return False
        return True
    if k == 'expr':
        # Evaluate expressions (written by lesson authors) against the program's names: for classes and objects.
        for case in c['cases']:
            buf = io.StringIO()
            try:
                with contextlib.redirect_stdout(buf):
                    got = eval(case['expr'], dict(first['ns']))
            except BaseException:
                return False
            if 'equals' in case and not _same(got, case['equals']):
                return False
            if 'prints' in case and _lines(buf.getvalue()) != [l.rstrip() for l in case['prints']]:
                return False
        return True
    raise ValueError('unknown check kind: ' + k)

def _check(src, filename, spec_json):
    spec = json.loads(spec_json)
    inputs = spec.get('inputs', [])
    first = _exec_case(src, filename, inputs)
    results = []
    for c in spec['checks']:
        try:
            results.append(bool(_eval(c, src, filename, first, inputs)))
        except Exception:
            results.append(False)
    return json.dumps({'results': results, 'output': first['out'], 'error': first['err']})
`;

export interface CheckReport {
  /** One boolean per check, in order. */
  results: boolean[];
  /** Output of the first (default-input) run. */
  output: string;
  error: PyError | null;
}

export interface Runner {
  runFile(code: string, filename: string): Promise<PyError | null>;
  check(code: string, filename: string, specJson: string): Promise<CheckReport>;
  repl(line: string): Promise<PyError | null>;
  pythonVersion: string;
  /** True when learner code may use asyncio.run (needs WebAssembly stack switching, JSPI). */
  asyncSupported: boolean;
}

type PyFn = ((...a: unknown[]) => unknown) & { callPromising?: (...a: unknown[]) => Promise<unknown> };

export async function createRunner(py: PyodideInterface, hooks: CoreHooks): Promise<Runner> {
  const decoders = { stdout: new TextDecoder(), stderr: new TextDecoder() };
  for (const stream of ['stdout', 'stderr'] as const) {
    const opts = { write: (buf: Uint8Array) => { hooks.write(stream, decoders[stream].decode(buf, { stream: true })); return buf.length; } };
    if (stream === 'stdout') py.setStdout(opts); else py.setStderr(opts);
  }
  py.globals.set('_botanica_input', (prompt: string) => hooks.input(prompt));
  py.runPython(HARNESS, { filename: '<botanica>' } as never);
  // Show print() output as it happens rather than when a buffer fills.
  py.runPython('import sys\nsys.stdout.reconfigure(line_buffering=True)\nsys.stderr.reconfigure(line_buffering=True)');
  const run: PyFn = py.globals.get('_run'), repl: PyFn = py.globals.get('_repl'), check: PyFn = py.globals.get('_check');
  // Calling through callPromising lets Python suspend (asyncio.run, await) where the engine supports JSPI.
  // Probe once; without it, everything still runs synchronously and only asyncio.run is unavailable.
  let jspi = false;
  if (typeof run.callPromising === 'function') {
    try { await (py.globals.get('_fresh') as PyFn).callPromising!(); jspi = true; } catch { jspi = false; }
  }
  const call = async (fn: PyFn, ...args: unknown[]) => (jspi ? fn.callPromising!(...args) : fn(...args));
  const parse = (r: unknown): PyError | null => (r == null ? null : (JSON.parse(String(r)) as PyError));
  return {
    pythonVersion: String(py.runPython('import sys; sys.version.split()[0]')),
    asyncSupported: jspi,
    runFile: async (code, filename) => parse(await call(run, code, filename)),
    repl: async (line) => parse(await call(repl, line)),
    check: async (code, filename, specJson) => JSON.parse(String(await call(check, code, filename, specJson))) as CheckReport,
  };
}
