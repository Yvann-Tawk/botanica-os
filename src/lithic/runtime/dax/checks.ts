// Validation for Lithic DAX exercises. Two kinds, both honest: `value`/`runs` actually evaluate the learner's
// formula with the limited engine and compare the result; `uses`/`source` are syntax-level checks for concepts
// the limited engine does not execute (e.g. relationship modelling). Lessons label which is which.

import { evaluateDax } from './evaluate';
import { SALES_MODEL, type Cell, type DaxModel } from './model';

export interface DaxCheckResult { label: string; ok: boolean; detail?: string }

export type DaxCheck =
  /** The formula evaluates (in the limited engine) to this value; numbers compare within `approx` (default 0.001). */
  | { kind: 'value'; label: string; expect: number | string; approx?: number; fail?: string }
  /** The formula evaluates without error. */
  | { kind: 'runs'; label: string; fail?: string }
  /** The formula calls this DAX function (case-insensitive). */
  | { kind: 'uses'; label: string; fn: string; fail?: string }
  /** Raw-source check: `matches`/`notMatches` are regex sources (i flag), `contains` a substring. */
  | { kind: 'source'; label: string; matches?: string; contains?: string; notMatches?: string; fail?: string };

const fmt = (v: Cell | undefined) => (typeof v === 'number' ? (Math.round(v * 1000) / 1000).toString() : JSON.stringify(v));

export function runDaxChecks(src: string, checks: DaxCheck[], model: DaxModel = SALES_MODEL): DaxCheckResult[] {
  const result = evaluateDax(src, model); // evaluate once, reuse
  return checks.map((c) => {
    const ok = (v: boolean, detail?: string): DaxCheckResult => ({ label: c.label, ok: v, detail: v ? undefined : (c.fail ?? detail) });
    try {
      switch (c.kind) {
        case 'runs':
          return ok(result.ok, result.error ?? 'The formula did not evaluate.');
        case 'value': {
          if (!result.ok) return ok(false, result.error);
          if (typeof c.expect === 'number' && typeof result.value === 'number') return ok(Math.abs(result.value - c.expect) <= (c.approx ?? 0.001), `Got ${fmt(result.value)}, expected ${c.expect}.`);
          return ok(result.value === c.expect, `Got ${fmt(result.value)}, expected ${fmt(c.expect)}.`);
        }
        case 'uses':
          return ok(new RegExp(`\\b${c.fn}\\s*\\(`, 'i').test(src), `Use the ${c.fn}() function.`);
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

export const allDaxPass = (rs: DaxCheckResult[]) => rs.every((r) => r.ok);
