// A LIMITED, educational DAX evaluator. It runs a documented subset of DAX against the fixed SALES_MODEL — not
// a general DAX engine. Supported: arithmetic (+ - * / &), comparisons, column references (Table[Col] / [Col]),
// VAR … RETURN, the aggregations SUM/AVERAGE/MIN/MAX/COUNT/COUNTA/DISTINCTCOUNT/COUNTROWS, DIVIDE, the iterators
// SUMX/AVERAGEX/COUNTX/MINX/MAXX, CALCULATE with simple filters, FILTER, ALL, and RELATED across the one
// relationship. Anything else raises a clear "not supported in this limited engine" error. Lessons label this.

import type { Cell, DaxModel } from './model';

export interface DaxResult { ok: boolean; value?: Cell; error?: string }

/* ---------------- tokenizer ---------------- */
type Tok = { k: 'num' | 'str' | 'ident' | 'col' | 'op' | 'punct' | 'kw'; v: string };
const KEYWORDS = new Set(['var', 'return']);

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const two = ['<>', '<=', '>='];
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '"') { let s = ''; i++; while (i < src.length && src[i] !== '"') s += src[i++]; i++; toks.push({ k: 'str', v: s }); continue; }
    if (c === '[') { let s = ''; i++; while (i < src.length && src[i] !== ']') s += src[i++]; i++; toks.push({ k: 'col', v: s }); continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) { let s = ''; while (i < src.length && /[0-9.]/.test(src[i])) s += src[i++]; toks.push({ k: 'num', v: s }); continue; }
    if (/[A-Za-z_]/.test(c)) { let s = ''; while (i < src.length && /[A-Za-z0-9_]/.test(src[i])) s += src[i++]; toks.push({ k: KEYWORDS.has(s.toLowerCase()) ? 'kw' : 'ident', v: s }); continue; }
    const t2 = src.slice(i, i + 2);
    if (two.includes(t2)) { toks.push({ k: 'op', v: t2 }); i += 2; continue; }
    if ('+-*/&=<>'.includes(c)) { toks.push({ k: 'op', v: c }); i++; continue; }
    if ('(),'.includes(c)) { toks.push({ k: 'punct', v: c }); i++; continue; }
    throw new Error(`Unexpected character “${c}”.`);
  }
  return toks;
}

/* ---------------- parser (recursive descent) ---------------- */
type Node =
  | { t: 'num'; v: number }
  | { t: 'str'; v: string }
  | { t: 'col'; table?: string; name: string }
  | { t: 'name'; name: string }
  | { t: 'call'; name: string; args: Node[] }
  | { t: 'unary'; op: string; e: Node }
  | { t: 'bin'; op: string; l: Node; r: Node }
  | { t: 'let'; binds: { name: string; expr: Node }[]; body: Node };

class Parser {
  i = 0;
  constructor(private toks: Tok[]) {}
  peek() { return this.toks[this.i]; }
  next() { return this.toks[this.i++]; }
  expect(k: Tok['k'], v?: string) { const t = this.next(); if (!t || t.k !== k || (v != null && t.v.toLowerCase() !== v.toLowerCase())) throw new Error(`Expected ${v ?? k}.`); return t; }
  parse(): Node { const n = this.expr(); if (this.i < this.toks.length) throw new Error('Unexpected trailing input.'); return n; }

  expr(): Node {
    // VAR name = expr (VAR …)* RETURN expr
    if (this.peek()?.k === 'kw' && this.peek()!.v.toLowerCase() === 'var') {
      const binds: { name: string; expr: Node }[] = [];
      while (this.peek()?.k === 'kw' && this.peek()!.v.toLowerCase() === 'var') {
        this.next();
        const name = this.expect('ident').v;
        this.expect('op', '=');
        binds.push({ name, expr: this.comparison() });
      }
      this.expect('kw', 'return');
      return { t: 'let', binds, body: this.comparison() };
    }
    return this.comparison();
  }
  comparison(): Node {
    let l = this.additive();
    while (this.peek()?.k === 'op' && ['=', '<>', '<', '>', '<=', '>='].includes(this.peek()!.v)) { const op = this.next().v; l = { t: 'bin', op, l, r: this.additive() }; }
    return l;
  }
  additive(): Node {
    let l = this.multiplicative();
    while (this.peek()?.k === 'op' && ['+', '-', '&'].includes(this.peek()!.v)) { const op = this.next().v; l = { t: 'bin', op, l, r: this.multiplicative() }; }
    return l;
  }
  multiplicative(): Node {
    let l = this.unary();
    while (this.peek()?.k === 'op' && ['*', '/'].includes(this.peek()!.v)) { const op = this.next().v; l = { t: 'bin', op, l, r: this.unary() }; }
    return l;
  }
  unary(): Node {
    if (this.peek()?.k === 'op' && this.peek()!.v === '-') { this.next(); return { t: 'unary', op: '-', e: this.unary() }; }
    return this.primary();
  }
  primary(): Node {
    const t = this.peek();
    if (!t) throw new Error('Unexpected end of formula.');
    if (t.k === 'num') { this.next(); return { t: 'num', v: parseFloat(t.v) }; }
    if (t.k === 'str') { this.next(); return { t: 'str', v: t.v }; }
    if (t.k === 'col') { this.next(); return { t: 'col', name: t.v }; }
    if (t.k === 'punct' && t.v === '(') { this.next(); const e = this.comparison(); this.expect('punct', ')'); return e; }
    if (t.k === 'ident') {
      this.next();
      if (this.peek()?.k === 'punct' && this.peek()!.v === '(') { // function call
        this.next(); const args: Node[] = [];
        if (!(this.peek()?.k === 'punct' && this.peek()!.v === ')')) {
          args.push(this.comparison());
          while (this.peek()?.k === 'punct' && this.peek()!.v === ',') { this.next(); args.push(this.comparison()); }
        }
        this.expect('punct', ')');
        return { t: 'call', name: t.v, args };
      }
      if (this.peek()?.k === 'col') { const col = this.next().v; return { t: 'col', table: t.v, name: col }; } // Table[Col]
      return { t: 'name', name: t.v }; // a table name or a variable
    }
    throw new Error(`Unexpected token “${t.v}”.`);
  }
}

/* ---------------- evaluator ---------------- */
interface Ctx { model: DaxModel; visible: Record<string, Record<string, Cell>[]>; row: { table: string; row: Record<string, Cell> } | null; vars: Record<string, Cell> }

const num = (v: Cell): number => { if (typeof v === 'number') return v; const n = Number(v); if (Number.isNaN(n)) throw new Error(`“${v}” is not a number.`); return n; };

function columnTable(ctx: Ctx, node: { table?: string; name: string }): { table: string; name: string } {
  if (node.table) { if (!ctx.model.tables[node.table]) throw new Error(`Unknown table “${node.table}”.`); return { table: node.table, name: node.name }; }
  if (ctx.row) return { table: ctx.row.table, name: node.name }; // bare [Col] uses row context's table
  // otherwise find the (single) table that has the column
  const owners = Object.values(ctx.model.tables).filter((t) => t.columns.includes(node.name));
  if (owners.length === 1) return { table: owners[0].name, name: node.name };
  throw new Error(`Ambiguous or unknown column [${node.name}] — qualify it as Table[${node.name}].`);
}

function colValues(ctx: Ctx, node: { table?: string; name: string }): Cell[] {
  const { table, name } = columnTable(ctx, node);
  const t = ctx.model.tables[table];
  if (!t.columns.includes(name)) throw new Error(`Table “${table}” has no column [${name}].`);
  return (ctx.visible[table] ?? t.rows).map((r) => r[name]);
}

/** Resolve a node that must be a table expression (a table name, FILTER(...), or ALL(...)). */
function asTable(ctx: Ctx, node: Node): Record<string, Cell>[] {
  if (node.t === 'name') {
    const t = ctx.model.tables[node.name];
    if (t) return ctx.visible[node.name] ?? t.rows;
    throw new Error(`“${node.name}” is not a table.`);
  }
  if (node.t === 'call') {
    const fn = node.name.toUpperCase();
    if (fn === 'FILTER') { const rows = asTable(ctx, node.args[0]); const tableName = tableNameOf(ctx, node.args[0]); return rows.filter((r) => truthy(evalNode(node.args[1], { ...ctx, row: { table: tableName, row: r } }))); }
    if (fn === 'ALL') { const name = node.args[0]?.t === 'name' ? (node.args[0] as { name: string }).name : null; if (name && ctx.model.tables[name]) return ctx.model.tables[name].rows; throw new Error('ALL(Table) expects a table in this engine.'); }
    if (fn === 'VALUES' || fn === 'DISTINCT') throw new Error(`${fn} is not supported in this limited engine.`);
  }
  throw new Error('Expected a table expression (a table name, FILTER(…), or ALL(…)).');
}
function tableNameOf(ctx: Ctx, node: Node): string {
  if (node.t === 'name') return node.name;
  if (node.t === 'call' && node.name.toUpperCase() === 'FILTER') return tableNameOf(ctx, node.args[0]);
  if (node.t === 'call' && node.name.toUpperCase() === 'ALL' && node.args[0]?.t === 'name') return (node.args[0] as { name: string }).name;
  throw new Error('Cannot determine the table.');
}
const truthy = (v: Cell) => (typeof v === 'number' ? v !== 0 : v !== '' && v != null);

function applyFilter(ctx: Ctx, filter: Node): Ctx {
  // CALCULATE filter: a comparison on a column, or a table expression (FILTER/ALL)
  if (filter.t === 'bin' && ['=', '<>', '<', '>', '<=', '>='].includes(filter.op)) {
    const colNode = filter.l.t === 'col' ? filter.l : filter.r.t === 'col' ? filter.r : null;
    if (!colNode) throw new Error('A CALCULATE filter must compare a column to a value.');
    const { table, name } = columnTable(ctx, colNode);
    const valNode = filter.l === colNode ? filter.r : filter.l;
    const val = evalNode(valNode, { ...ctx, row: null });
    const base = ctx.model.tables[table].rows; // simple filters replace the column's filter (over all rows)
    const kept = base.filter((r) => compare(filter.op, r[name], val));
    return { ...ctx, visible: { ...ctx.visible, [table]: kept } };
  }
  if (filter.t === 'call' && (filter.name.toUpperCase() === 'FILTER' || filter.name.toUpperCase() === 'ALL')) {
    const rows = asTable(ctx, filter); const table = tableNameOf(ctx, filter);
    return { ...ctx, visible: { ...ctx.visible, [table]: rows } };
  }
  throw new Error('Unsupported CALCULATE filter in this limited engine.');
}
function compare(op: string, a: Cell, b: Cell): boolean {
  if (op === '=') return a === b || (typeof a !== 'string' && typeof b !== 'string' && num(a) === num(b));
  if (op === '<>') return !compare('=', a, b);
  const x = num(a), y = num(b);
  return op === '<' ? x < y : op === '>' ? x > y : op === '<=' ? x <= y : x >= y;
}

function related(ctx: Ctx, node: { table?: string; name: string }): Cell {
  if (!ctx.row) throw new Error('RELATED needs a row context (use it inside an iterator like SUMX).');
  const rel = ctx.model.relationships.find((r) => r.fromTable === ctx.row!.table && node.table === r.toTable);
  if (!rel) throw new Error(`No relationship from ${ctx.row.table} to ${node.table ?? '?'}.`);
  const key = ctx.row.row[rel.fromColumn];
  const target = ctx.model.tables[rel.toTable].rows.find((r) => r[rel.toColumn] === key);
  if (!target) throw new Error('Related row not found.');
  return target[node.name];
}

function aggColumn(ctx: Ctx, arg: Node): { table: string; name: string } {
  if (arg.t !== 'col') throw new Error('This function expects a column, e.g. SUM(Sales[Revenue]).');
  return columnTable(ctx, arg);
}

function evalNode(node: Node, ctx: Ctx): Cell {
  switch (node.t) {
    case 'num': return node.v;
    case 'str': return node.v;
    case 'name': {
      if (node.name in ctx.vars) return ctx.vars[node.name];
      throw new Error(`“${node.name}” is not a value here (a bare table or unknown name).`);
    }
    case 'col': {
      if (ctx.row) { const v = ctx.row.row[node.name]; if (v === undefined) throw new Error(`No column [${node.name}] in ${ctx.row.table}.`); return v; }
      throw new Error(`Column [${node.name}] can only be used inside a row context or an aggregation.`);
    }
    case 'unary': return -num(evalNode(node.e, ctx));
    case 'bin': {
      if (['=', '<>', '<', '>', '<=', '>='].includes(node.op)) return compare(node.op, evalNode(node.l, ctx), evalNode(node.r, ctx)) ? 1 : 0;
      if (node.op === '&') return String(evalNode(node.l, ctx)) + String(evalNode(node.r, ctx));
      const a = num(evalNode(node.l, ctx)), b = num(evalNode(node.r, ctx));
      return node.op === '+' ? a + b : node.op === '-' ? a - b : node.op === '*' ? a * b : a / b;
    }
    case 'let': {
      const vars = { ...ctx.vars };
      for (const b of node.binds) vars[b.name] = evalNode(b.expr, { ...ctx, vars });
      return evalNode(node.body, { ...ctx, vars });
    }
    case 'call': return evalCall(node, ctx);
  }
}

function evalCall(node: { name: string; args: Node[] }, ctx: Ctx): Cell {
  const fn = node.name.toUpperCase(), a = node.args;
  const aggregate = (vals: Cell[], kind: string): number => {
    const nums = vals.map(num);
    if (kind === 'SUM') return nums.reduce((s, x) => s + x, 0);
    if (kind === 'AVERAGE') return nums.length ? nums.reduce((s, x) => s + x, 0) / nums.length : 0;
    if (kind === 'MIN') return Math.min(...nums);
    if (kind === 'MAX') return Math.max(...nums);
    return 0;
  };
  switch (fn) {
    case 'SUM': case 'AVERAGE': case 'MIN': case 'MAX': return aggregate(colValues(ctx, aggColumn(ctx, a[0])), fn);
    case 'COUNT': return colValues(ctx, aggColumn(ctx, a[0])).filter((v) => v !== '' && v != null).length;
    case 'COUNTA': return colValues(ctx, aggColumn(ctx, a[0])).filter((v) => v !== '' && v != null).length;
    case 'DISTINCTCOUNT': return new Set(colValues(ctx, aggColumn(ctx, a[0])).filter((v) => v !== '' && v != null)).size;
    case 'COUNTROWS': return asTable(ctx, a[0]).length;
    case 'DIVIDE': { const d = num(evalNode(a[1], ctx)); if (d === 0) return a[2] ? evalNode(a[2], ctx) : 0; return num(evalNode(a[0], ctx)) / d; }
    case 'SUMX': case 'AVERAGEX': case 'COUNTX': case 'MINX': case 'MAXX': {
      const rows = asTable(ctx, a[0]); const table = tableNameOf(ctx, a[0]);
      const vals = rows.map((r) => evalNode(a[1], { ...ctx, row: { table, row: r } }));
      if (fn === 'COUNTX') return vals.filter((v) => v !== '' && v != null).length;
      return aggregate(vals, fn.slice(0, -1)); // SUMX→SUM, etc.
    }
    case 'CALCULATE': { let c = ctx; for (let k = 1; k < a.length; k++) c = applyFilter(c, a[k]); return evalNode(a[0], c); }
    case 'RELATED': { if (a[0].t !== 'col') throw new Error('RELATED expects a related column, e.g. RELATED(Products[Category]).'); return related(ctx, a[0]); }
    case 'FILTER': case 'ALL': throw new Error(`${fn}(…) returns a table; use it inside CALCULATE or an iterator, not on its own.`);
    case 'ROUND': return Math.round(num(evalNode(a[0], ctx)) * 10 ** num(evalNode(a[1], ctx))) / 10 ** num(evalNode(a[1], ctx));
    case 'IF': return truthy(evalNode(a[0], ctx)) ? evalNode(a[1], ctx) : (a[2] ? evalNode(a[2], ctx) : 0);
    case 'BLANK': return 0;
    default: throw new Error(`Function ${node.name}() is not supported in this limited engine.`);
  }
}

/** Evaluate a DAX measure expression against the model. Returns a scalar value or a clear error. */
export function evaluateDax(src: string, model: DaxModel): DaxResult {
  try {
    // Allow a "Measure := expr" or a single leading "= expr"; never strip a leading VAR binding.
    const trimmed = src.replace(/^\s*[A-Za-z_][\w ]*:=/, '').replace(/^\s*=(?!=)/, '').trim();
    const toks = tokenize(trimmed || src);
    const ast = new Parser(toks).parse();
    const visible: Record<string, Record<string, Cell>[]> = {};
    for (const name of Object.keys(model.tables)) visible[name] = model.tables[name].rows;
    const value = evalNode(ast, { model, visible, row: null, vars: {} });
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
