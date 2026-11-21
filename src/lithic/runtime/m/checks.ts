// Validation for Lithic Power Query M exercises. `value`/`rows`/`list`/`runs` actually evaluate the learner's
// expression in the limited engine and compare; `uses`/`source` are syntax checks. Lessons label which is which.

import { evaluateM, toPlain } from './evaluate';
import type { MValue } from './model';

export interface MCheckResult { label: string; ok: boolean; detail?: string }

export type MCheck =
  /** Evaluates to this scalar (numbers within `approx`, default 0.001). */
  | { kind: 'value'; label: string; expect: number | string | boolean; approx?: number; fail?: string }
  /** The result is a table with this many rows, or a list of this length. */
  | { kind: 'rows'; label: string; expect: number; fail?: string }
  /** The result is a list deep-equal to this array. */
  | { kind: 'list'; label: string; expect: (number | string | boolean | null)[]; fail?: string }
  /** The expression evaluates without error. */
  | { kind: 'runs'; label: string; fail?: string }
  /** The source calls this function (case-insensitive, dotted ok e.g. Table.SelectRows). */
  | { kind: 'uses'; label: string; fn: string; fail?: string }
  | { kind: 'source'; label: string; matches?: string; contains?: string; notMatches?: string; fail?: string };

const rowsOf = (v: MValue): number | null => {
  const p = toPlain(v) as { __rows?: number };
  if (p && typeof p === 'object' && '__rows' in p) return p.__rows!;
  if (Array.isArray(v)) return v.length;
  return null;
};

export function runMChecks(src: string, checks: MCheck[]): MCheckResult[] {
  const res = evaluateM(src); // evaluate once
  return checks.map((c) => {
    const ok = (v: boolean, detail?: string): MCheckResult => ({ label: c.label, ok: v, detail: v ? undefined : (c.fail ?? detail) });
    try {
      switch (c.kind) {
        case 'runs': return ok(res.ok, res.error ?? 'Did not evaluate.');
        case 'value': {
          if (!res.ok) return ok(false, res.error);
          if (typeof c.expect === 'number' && typeof res.value === 'number') return ok(Math.abs(res.value - c.expect) <= (c.approx ?? 0.001), `Got ${res.display}, expected ${c.expect}.`);
          return ok(res.value === c.expect, `Got ${res.display}, expected ${JSON.stringify(c.expect)}.`);
        }
        case 'rows': {
          if (!res.ok) return ok(false, res.error);
          const n = rowsOf(res.value as MValue);
          return ok(n === c.expect, n == null ? 'Result is not a table or list.' : `Got ${n} rows, expected ${c.expect}.`);
        }
        case 'list': {
          if (!res.ok) return ok(false, res.error);
          return ok(JSON.stringify(toPlain(res.value as MValue)) === JSON.stringify(c.expect), `Got ${res.display}.`);
        }
        case 'uses': return ok(new RegExp(`\\b${c.fn.replace('.', '\\.')}\\s*\\(`, 'i').test(src), `Use ${c.fn}(…).`);
        case 'source': {
          if (c.contains != null && !src.toLowerCase().includes(c.contains.toLowerCase())) return ok(false);
          if (c.matches != null && !new RegExp(c.matches, 'i').test(src)) return ok(false);
          if (c.notMatches != null && new RegExp(c.notMatches, 'i').test(src)) return ok(false);
          return ok(true);
        }
      }
    } catch (e) {
      return ok(false, `Check could not run: ${(e as Error).message}`);
    }
  });
}

export const allMPass = (rs: MCheckResult[]) => rs.every((r) => r.ok);
