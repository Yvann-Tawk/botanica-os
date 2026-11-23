// A LIMITED, educational Power Query M evaluator. It runs a documented subset of M against the sample model
// (model.ts) — not Power Query's engine, and lessons say so. Supported: let…in, if…then…else, each (implicit _),
// numbers/text/true/false/null, list {…} and record […] literals, column projection Table[Col], record field
// access rec[Field], list item access list{i}, operators + - * / & and/or/not comparisons ?? , and a curated
// library (List.*, Text.*, Number.*, Table.*, Record.*). Anything else raises a clear "not supported" error.

import { MODEL, type MFunc, type MRecord, type MTable, type MValue } from './model';

export interface MResult { ok: boolean; value?: MValue; error?: string; display?: string }

/* ---------------- tokenizer ---------------- */
type Tok = { k: 'num' | 'str' | 'ident' | 'op' | 'punct' | 'kw'; v: string };
const KW = new Set(['let', 'in', 'if', 'then', 'else', 'each', 'true', 'false', 'null', 'and', 'or', 'not']);
const isId = (c: string) => /[A-Za-z_]/.test(c);

function tokenize(src: string): Tok[] {
  const t: Tok[] = []; let i = 0;
  const two = ['<>', '<=', '>=', '??'];
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '"') { let s = ''; i++; while (i < src.length && src[i] !== '"') s += src[i++]; i++; t.push({ k: 'str', v: s }); continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) { let s = ''; while (i < src.length && /[0-9.]/.test(src[i])) s += src[i++]; t.push({ k: 'num', v: s }); continue; }
    if (isId(c)) { let s = ''; while (i < src.length && /[A-Za-z0-9_.]/.test(src[i])) s += src[i++]; t.push({ k: KW.has(s.toLowerCase()) ? 'kw' : 'ident', v: s }); continue; }
    const t2 = src.slice(i, i + 2);
    if (two.includes(t2)) { t.push({ k: 'op', v: t2 }); i += 2; continue; }
    if ('+-*/&=<>'.includes(c)) { t.push({ k: 'op', v: c }); i++; continue; }
    if ('(){}[],'.includes(c)) { t.push({ k: 'punct', v: c }); i++; continue; }
    throw new Error(`Unexpected character “${c}”.`);
  }
  return t;
}

/* ---------------- parser ---------------- */
type Node =
  | { t: 'num'; v: number } | { t: 'str'; v: string } | { t: 'bool'; v: boolean } | { t: 'null' }
  | { t: 'name'; v: string } | { t: 'list'; items: Node[] } | { t: 'record'; fields: { k: string; v: Node }[] }
  | { t: 'field'; obj: Node; name: string } | { t: 'index'; obj: Node; idx: Node } | { t: 'call'; fn: Node; args: Node[] }
  | { t: 'unary'; op: string; e: Node } | { t: 'bin'; op: string; l: Node; r: Node }
  | { t: 'if'; c: Node; a: Node; b: Node } | { t: 'let'; binds: { k: string; v: Node }[]; body: Node } | { t: 'each'; body: Node };

class Parser {
  i = 0;
  constructor(private ts: Tok[]) {}
  peek() { return this.ts[this.i]; }
  eat() { return this.ts[this.i++]; }
  is(k: Tok['k'], v?: string) { const t = this.peek(); return !!t && t.k === k && (v == null || t.v.toLowerCase() === v.toLowerCase()); }
  expect(k: Tok['k'], v?: string) { if (!this.is(k, v)) throw new Error(`Expected ${v ?? k}.`); return this.eat(); }
  parse(): Node { const n = this.expr(); if (this.i < this.ts.length) throw new Error('Unexpected trailing input.'); return n; }

  expr(): Node {
    if (this.is('kw', 'let')) {
      this.eat(); const binds: { k: string; v: Node }[] = [];
      do { const k = this.expect('ident').v; this.expect('op', '='); binds.push({ k, v: this.expr() }); } while (this.is('punct', ',') && this.eat());
      this.expect('kw', 'in'); return { t: 'let', binds, body: this.expr() };
    }
    if (this.is('kw', 'if')) { this.eat(); const c = this.expr(); this.expect('kw', 'then'); const a = this.expr(); this.expect('kw', 'else'); const b = this.expr(); return { t: 'if', c, a, b }; }
    if (this.is('kw', 'each')) { this.eat(); return { t: 'each', body: this.expr() }; }
    return this.or();
  }
  or(): Node { let l = this.and(); while (this.is('kw', 'or')) { this.eat(); l = { t: 'bin', op: 'or', l, r: this.and() }; } return l; }
  and(): Node { let l = this.cmp(); while (this.is('kw', 'and')) { this.eat(); l = { t: 'bin', op: 'and', l, r: this.cmp() }; } return l; }
  cmp(): Node { let l = this.coalesce(); while (this.is('op') && ['=', '<>', '<', '>', '<=', '>='].includes(this.peek()!.v)) { const op = this.eat().v; l = { t: 'bin', op, l, r: this.coalesce() }; } return l; }
  coalesce(): Node { let l = this.add(); while (this.is('op', '??')) { this.eat(); l = { t: 'bin', op: '??', l, r: this.add() }; } return l; }
  add(): Node { let l = this.mul(); while (this.is('op') && ['+', '-', '&'].includes(this.peek()!.v)) { const op = this.eat().v; l = { t: 'bin', op, l, r: this.mul() }; } return l; }
  mul(): Node { let l = this.unary(); while (this.is('op') && ['*', '/'].includes(this.peek()!.v)) { const op = this.eat().v; l = { t: 'bin', op, l, r: this.unary() }; } return l; }
  unary(): Node { if (this.is('op', '-')) { this.eat(); return { t: 'unary', op: '-', e: this.unary() }; } if (this.is('kw', 'not')) { this.eat(); return { t: 'unary', op: 'not', e: this.unary() }; } return this.postfix(); }
  postfix(): Node {
    let e = this.primary();
    for (;;) {
      if (this.is('punct', '[')) { this.eat(); const name = this.expect('ident').v; this.expect('punct', ']'); e = { t: 'field', obj: e, name }; }
      else if (this.is('punct', '{')) { this.eat(); const idx = this.expr(); this.expect('punct', '}'); e = { t: 'index', obj: e, idx }; }
      else if (this.is('punct', '(')) { this.eat(); const args: Node[] = []; if (!this.is('punct', ')')) { args.push(this.expr()); while (this.is('punct', ',') && this.eat()) args.push(this.expr()); } this.expect('punct', ')'); e = { t: 'call', fn: e, args }; }
      else break;
    }
    return e;
  }
  primary(): Node {
    const t = this.peek();
    if (!t) throw new Error('Unexpected end of formula.');
    if (t.k === 'num') { this.eat(); return { t: 'num', v: parseFloat(t.v) }; }
    if (t.k === 'str') { this.eat(); return { t: 'str', v: t.v }; }
    if (this.is('kw', 'true')) { this.eat(); return { t: 'bool', v: true }; }
    if (this.is('kw', 'false')) { this.eat(); return { t: 'bool', v: false }; }
    if (this.is('kw', 'null')) { this.eat(); return { t: 'null' }; }
    if (t.k === 'ident') { this.eat(); return { t: 'name', v: t.v }; }
    if (this.is('punct', '(')) { this.eat(); const e = this.expr(); this.expect('punct', ')'); return e; }
    if (this.is('punct', '{')) { this.eat(); const items: Node[] = []; if (!this.is('punct', '}')) { items.push(this.expr()); while (this.is('punct', ',') && this.eat()) items.push(this.expr()); } this.expect('punct', '}'); return { t: 'list', items }; }
    if (this.is('punct', '[')) {
      // record literal [A = 1, B = 2]  OR implicit field access [Field] (→ _[Field])
      const save = this.i; this.eat();
      if (this.is('ident') && this.ts[this.i + 1]?.k === 'op' && this.ts[this.i + 1]?.v === '=') {
        const fields: { k: string; v: Node }[] = [];
        do { const k = this.expect('ident').v; this.expect('op', '='); fields.push({ k, v: this.expr() }); } while (this.is('punct', ',') && this.eat());
        this.expect('punct', ']'); return { t: 'record', fields };
      }
      this.i = save; this.eat(); const name = this.expect('ident').v; this.expect('punct', ']'); // [Field] → _[Field]
      return { t: 'field', obj: { t: 'name', v: '_' }, name };
    }
    throw new Error(`Unexpected token “${t.v}”.`);
  }
}

/* ---------------- evaluator ---------------- */
const isRec = (v: MValue): v is MRecord => !!v && typeof v === 'object' && (v as MRecord).__rec === true;
const isTbl = (v: MValue): v is MTable => !!v && typeof v === 'object' && (v as MTable).__tbl === true;
const isFn = (v: MValue): v is MFunc => !!v && typeof v === 'object' && (v as MFunc).__fn === true;
const num = (v: MValue): number => { if (typeof v === 'number') return v; throw new Error(`Expected a number, got ${display(v)}.`); };

type Env = Record<string, MValue>;

function evalNode(n: Node, env: Env): MValue {
  switch (n.t) {
    case 'num': return n.v; case 'str': return n.v; case 'bool': return n.v; case 'null': return null;
    case 'list': return n.items.map((i) => evalNode(i, env));
    case 'record': { const f: Record<string, MValue> = {}; for (const { k, v } of n.fields) f[k] = evalNode(v, env); return { __rec: true, fields: f }; }
    case 'each': { const body = n.body; return { __fn: true, arity: 1, call: (args) => evalNode(body, { ...env, _: args[0] }) }; }
    case 'name': {
      if (n.v in env) return env[n.v];
      if (n.v in MODEL) return MODEL[n.v];
      if (n.v.includes('.') || LIBRARY[n.v]) return makeLibFn(n.v);
      throw new Error(`“${n.v}” is not defined.`);
    }
    case 'field': {
      const o = evalNode(n.obj, env);
      if (isTbl(o)) { if (!o.columns.includes(n.name)) throw new Error(`Table has no column [${n.name}].`); return o.rows.map((r) => r.fields[n.name]); }
      if (isRec(o)) { if (!(n.name in o.fields)) throw new Error(`Record has no field [${n.name}].`); return o.fields[n.name]; }
      throw new Error(`Cannot read [${n.name}] from ${display(o)}.`);
    }
    case 'index': { const o = evalNode(n.obj, env); const i = num(evalNode(n.idx, env)); if (isTbl(o)) return o.rows[i]; if (!Array.isArray(o)) throw new Error('Item access {…} needs a list or table.'); return o[i]; }
    case 'call': { const f = evalNode(n.fn, env); const args = n.args.map((a) => evalNode(a, env)); if (!isFn(f)) throw new Error('Tried to call a non-function.'); return f.call(args); }
    case 'unary': { if (n.op === '-') return -num(evalNode(n.e, env)); return !truthy(evalNode(n.e, env)); }
    case 'if': return truthy(evalNode(n.c, env)) ? evalNode(n.a, env) : evalNode(n.b, env);
    case 'let': { const e: Env = { ...env }; for (const b of n.binds) e[b.k] = evalNode(b.v, e); return evalNode(n.body, e); }
    case 'bin': return evalBin(n.op, n.l, n.r, env);
  }
}
const truthy = (v: MValue) => v === true || (typeof v === 'number' && v !== 0) || (typeof v === 'string' && v !== '');

function evalBin(op: string, ln: Node, rn: Node, env: Env): MValue {
  if (op === 'and') return truthy(evalNode(ln, env)) && truthy(evalNode(rn, env));
  if (op === 'or') return truthy(evalNode(ln, env)) || truthy(evalNode(rn, env));
  if (op === '??') { const l = evalNode(ln, env); return l == null ? evalNode(rn, env) : l; }
  const l = evalNode(ln, env), r = evalNode(rn, env);
  switch (op) {
    case '&': return Array.isArray(l) && Array.isArray(r) ? [...l, ...r] : String(l) + String(r);
    case '+': return num(l) + num(r); case '-': return num(l) - num(r); case '*': return num(l) * num(r); case '/': return num(l) / num(r);
    case '=': return eq(l, r); case '<>': return !eq(l, r);
    case '<': return num(l) < num(r); case '>': return num(l) > num(r); case '<=': return num(l) <= num(r); case '>=': return num(l) >= num(r);
  }
  throw new Error(`Unknown operator ${op}.`);
}
const eq = (a: MValue, b: MValue) => a === b;

/* ---------------- library ---------------- */
const asList = (v: MValue): MValue[] => { if (Array.isArray(v)) return v; if (isTbl(v)) return v.rows; throw new Error('Expected a list.'); };
const nums = (v: MValue): number[] => asList(v).filter((x) => x != null).map(num);
const callFn = (f: MValue, arg: MValue): MValue => { if (!isFn(f)) throw new Error('Expected a function (use each …).'); return f.call([arg]); };
const str = (v: MValue): string => { if (typeof v === 'string') return v; throw new Error(`Expected text, got ${display(v)}.`); };

const LIBRARY: Record<string, (a: MValue[]) => MValue> = {
  'List.Sum': (a) => nums(a[0]).reduce((s, x) => s + x, 0),
  'List.Average': (a) => { const n = nums(a[0]); return n.length ? n.reduce((s, x) => s + x, 0) / n.length : 0; },
  'List.Count': (a) => asList(a[0]).length,
  'List.Max': (a) => Math.max(...nums(a[0])),
  'List.Min': (a) => Math.min(...nums(a[0])),
  'List.Distinct': (a) => { const seen = new Set<string>(); const out: MValue[] = []; for (const x of asList(a[0])) { const k = JSON.stringify(x); if (!seen.has(k)) { seen.add(k); out.push(x); } } return out; },
  'List.Sort': (a) => [...asList(a[0])].sort((x, y) => (num(x) - num(y)) || String(x).localeCompare(String(y))),
  'List.Select': (a) => asList(a[0]).filter((x) => truthy(callFn(a[1], x))),
  'List.Transform': (a) => asList(a[0]).map((x) => callFn(a[1], x)),
  'List.Contains': (a) => asList(a[0]).some((x) => eq(x, a[1])),
  'Text.Upper': (a) => str(a[0]).toUpperCase(),
  'Text.Lower': (a) => str(a[0]).toLowerCase(),
  'Text.Proper': (a) => str(a[0]).replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  'Text.Trim': (a) => str(a[0]).trim(),
  'Text.Length': (a) => str(a[0]).length,
  'Text.Start': (a) => str(a[0]).slice(0, num(a[1])),
  'Text.End': (a) => str(a[0]).slice(-num(a[1])),
  'Text.Replace': (a) => str(a[0]).split(str(a[1])).join(str(a[2])),
  'Text.Contains': (a) => str(a[0]).includes(str(a[1])),
  'Text.Combine': (a) => asList(a[0]).map((x) => String(x)).join(a[1] != null ? str(a[1]) : ''),
  'Number.Round': (a) => { const d = a[1] != null ? num(a[1]) : 0; const f = 10 ** d; return Math.round(num(a[0]) * f) / f; },
  'Number.Abs': (a) => Math.abs(num(a[0])),
  'Number.From': (a) => Number(a[0] as string | number),
  'Record.Field': (a) => { const r = a[0]; if (!isRec(r)) throw new Error('Record.Field needs a record.'); return r.fields[str(a[1])]; },
  'Record.FieldNames': (a) => { const r = a[0]; if (!isRec(r)) throw new Error('Record.FieldNames needs a record.'); return Object.keys(r.fields); },
  'Table.RowCount': (a) => tbl(a[0]).rows.length,
  'Table.ColumnNames': (a) => tbl(a[0]).columns,
  'Table.SelectRows': (a) => { const t = tbl(a[0]); return { __tbl: true, columns: t.columns, rows: t.rows.filter((r) => truthy(callFn(a[1], r))) }; },
  'Table.SelectColumns': (a) => { const t = tbl(a[0]); const cols = colList(a[1]); return { __tbl: true, columns: cols, rows: t.rows.map((r) => ({ __rec: true, fields: Object.fromEntries(cols.map((c) => [c, r.fields[c]])) })) }; },
  'Table.RemoveColumns': (a) => { const t = tbl(a[0]); const drop = new Set(colList(a[1])); const cols = t.columns.filter((c) => !drop.has(c)); return { __tbl: true, columns: cols, rows: t.rows.map((r) => ({ __rec: true, fields: Object.fromEntries(cols.map((c) => [c, r.fields[c]])) })) }; },
  'Table.Distinct': (a) => { const t = tbl(a[0]); const seen = new Set<string>(); const rows: MRecord[] = []; for (const r of t.rows) { const k = JSON.stringify(r.fields); if (!seen.has(k)) { seen.add(k); rows.push(r); } } return { __tbl: true, columns: t.columns, rows }; },
  'Table.AddColumn': (a) => { const t = tbl(a[0]); const name = str(a[1]); const fn = a[2]; return { __tbl: true, columns: [...t.columns, name], rows: t.rows.map((r) => ({ __rec: true, fields: { ...r.fields, [name]: callFn(fn, r) } })) }; },
  'Table.Sort': (a) => { const t = tbl(a[0]); const col = str(a[1]); const rows = [...t.rows].sort((x, y) => { const xv = x.fields[col], yv = y.fields[col]; return typeof xv === 'number' && typeof yv === 'number' ? xv - yv : String(xv).localeCompare(String(yv)); }); return { __tbl: true, columns: t.columns, rows }; },
};
const tbl = (v: MValue): MTable => { if (isTbl(v)) return v; throw new Error('Expected a table.'); };
const colList = (v: MValue): string[] => (Array.isArray(v) ? v.map(str) : [str(v)]);
const makeLibFn = (name: string): MFunc => { const impl = LIBRARY[name]; if (!impl) throw new Error(`Function ${name}() is not supported in this limited engine.`); return { __fn: true, arity: impl.length, call: impl }; };

/* ---------------- display ---------------- */
export function display(v: MValue): string {
  if (v === null) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (isFn(v)) return '(function)';
  if (isTbl(v)) return `table [${v.columns.join(', ')}] · ${v.rows.length} rows`;
  if (isRec(v)) return `[${Object.entries(v.fields).map(([k, x]) => `${k} = ${display(x)}`).join(', ')}]`;
  if (Array.isArray(v)) return `{${v.map(display).join(', ')}}`;
  return String(v);
}

/** Evaluate an M expression (optionally a full `let … in`) against the sample model. */
export function evaluateM(src: string): MResult {
  try {
    const ast = new Parser(tokenize(src)).parse();
    const value = evalNode(ast, {});
    return { ok: true, value, display: display(value) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** A plain JS view of an M value, for comparing in checks (lists → arrays, tables → row count marker). */
export function toPlain(v: MValue): unknown {
  if (Array.isArray(v)) return v.map(toPlain);
  if (isTbl(v)) return { __rows: v.rows.length };
  if (isRec(v)) return Object.fromEntries(Object.entries(v.fields).map(([k, x]) => [k, toPlain(x)]));
  return v;
}
