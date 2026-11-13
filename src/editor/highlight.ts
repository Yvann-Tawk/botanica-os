// The prototype's lightweight Python highlighter, used by the simple editor and static code blocks.

export const HL = { kw: '#ec9a8f', cst: '#f0c06a', str: '#bcd8be', num: '#f0c06a', com: '#8e9584', bi: '#dccb8f', fn: '#e6dfcd', id: '#e9e3d3', op: '#ec9a8f', pun: '#b7bba9' } as const;
type Kind = keyof typeof HL;

const PY_KW = ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'];
const PY_BI = ['print', 'type', 'len', 'int', 'float', 'str', 'bool', 'round', 'input', 'range', 'list', 'dict', 'abs', 'min', 'max', 'sum'];

export interface Token { t: string; c: string }

export function hlLine(line: string): Token[] {
  const out: Token[] = [];
  let i = 0, m: RegExpExecArray | null;
  const n = line.length;
  const push = (t: string, k: Kind) => out.push({ t, c: HL[k] });
  while (i < n) {
    const ch = line[i];
    if (ch === '#') { push(line.slice(i), 'com'); break; }
    if (ch === '"' || ch === "'" || ((ch === 'f' || ch === 'F') && (line[i + 1] === '"' || line[i + 1] === "'"))) {
      const j = ch === '"' || ch === "'" ? i : i + 1;
      const q = line[j];
      let k = j + 1;
      while (k < n && line[k] !== q) { if (line[k] === '\\') k++; k++; }
      k = Math.min(n, k + 1);
      push(line.slice(i, k), 'str'); i = k; continue;
    }
    if (/[0-9]/.test(ch)) { m = /^[0-9][0-9._eE]*/.exec(line.slice(i))!; push(m[0], 'num'); i += m[0].length; continue; }
    if (/[A-Za-z_]/.test(ch)) {
      m = /^[A-Za-z_]\w*/.exec(line.slice(i))!;
      const w = m[0], nx = line[i + w.length];
      const kind: Kind = PY_KW.includes(w) ? (w === 'True' || w === 'False' || w === 'None' ? 'cst' : 'kw') : PY_BI.includes(w) ? 'bi' : nx === '(' ? 'fn' : 'id';
      push(w, kind); i += w.length; continue;
    }
    if (ch === ' ') { m = /^ +/.exec(line.slice(i))!; push(m[0], 'id'); i += m[0].length; continue; }
    push(ch, /[=+\-*/%<>!]/.test(ch) ? 'op' : 'pun'); i++;
  }
  return out;
}

export const hlBlock = (code: string) => code.split('\n').map((l, i) => ({ n: i + 1, toks: hlLine(l) }));
