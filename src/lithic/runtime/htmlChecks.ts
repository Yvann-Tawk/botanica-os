// HTML validation engine for the Lithic Foundation (HTML) lessons. Learner markup is parsed with DOMParser —
// which never executes scripts, loads resources, or touches the parent page — and assertions run against the
// resulting inert Document. (The live *preview* renders in a sandboxed iframe; see HtmlPreview.) This keeps
// validation safe by construction and behaviour-based: any markup that produces the required DOM passes.

export interface HtmlCheckResult { label: string; ok: boolean; detail?: string }

/** Whitespace-collapsed, trimmed text for forgiving text comparisons. */
const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

/** Behaviour-based checks over the learner's parsed DOM (and, for `source`, the raw markup). */
export type HtmlCheck =
  /** At least `min` (default 1) elements match the selector. */
  | { kind: 'has'; label: string; sel: string; min?: number; fail?: string }
  /** Exactly `equals`, or within `min`/`max`, elements match. */
  | { kind: 'count'; label: string; sel: string; equals?: number; min?: number; max?: number; fail?: string }
  /** The first match's text equals / contains / is non-empty. */
  | { kind: 'text'; label: string; sel: string; equals?: string; contains?: string; nonEmpty?: boolean; fail?: string }
  /** The first match's attribute is present / equals / contains. */
  | { kind: 'attr'; label: string; sel: string; name: string; equals?: string; contains?: string; present?: boolean; fail?: string }
  /** No element matches the selector (e.g. no inline styles, no deprecated tags). */
  | { kind: 'absent'; label: string; sel: string; fail?: string }
  /** Every element matching `sel` has a non-empty `name` attribute (accessibility, e.g. img → alt). */
  | { kind: 'every'; label: string; sel: string; name: string; fail?: string }
  /** The first `before` match precedes the first `after` match in document order. */
  | { kind: 'order'; label: string; before: string; after: string; fail?: string }
  /** Raw-source checks; use sparingly, prefer DOM behaviour. `matches`/`notMatches` are regex sources (i flag). */
  | { kind: 'source'; label: string; contains?: string; matches?: string; notMatches?: string; fail?: string }
  /** The document declares <!doctype html>. */
  | { kind: 'doctype'; label: string; fail?: string };

/** Parse learner HTML into an inert Document. Never executes scripts or loads resources. */
export function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

function one(check: HtmlCheck, doc: Document, raw: string): HtmlCheckResult {
  // On failure the author's own `fail` note wins; otherwise fall back to a computed detail.
  const ok = (v: boolean, detail?: string): HtmlCheckResult => ({ label: check.label, ok: v, detail: v ? undefined : (check.fail ?? detail) });
  try {
    switch (check.kind) {
      case 'has': {
        const n = doc.querySelectorAll(check.sel).length;
        return ok(n >= (check.min ?? 1), `Expected at least ${check.min ?? 1} ${check.sel}, found ${n}.`);
      }
      case 'count': {
        const n = doc.querySelectorAll(check.sel).length;
        if (check.equals != null) return ok(n === check.equals, `Expected ${check.equals} ${check.sel}, found ${n}.`);
        const okMin = check.min == null || n >= check.min, okMax = check.max == null || n <= check.max;
        return ok(okMin && okMax, `Found ${n} ${check.sel}.`);
      }
      case 'text': {
        const el = doc.querySelector(check.sel);
        if (!el) return ok(false, `No ${check.sel} to read text from.`);
        const t = norm(el.textContent);
        if (check.equals != null) return ok(t === norm(check.equals), `${check.sel} reads “${t}”.`);
        if (check.contains != null) return ok(t.toLowerCase().includes(norm(check.contains).toLowerCase()), `${check.sel} reads “${t}”.`);
        if (check.nonEmpty) return ok(t.length > 0, `${check.sel} is empty.`);
        return ok(true);
      }
      case 'attr': {
        const el = doc.querySelector(check.sel);
        if (!el) return ok(false, `No ${check.sel} found.`);
        const has = el.hasAttribute(check.name), val = el.getAttribute(check.name) ?? '';
        if (check.equals != null) return ok(has && norm(val) === norm(check.equals), `${check.sel}'s ${check.name} is “${val}”.`);
        if (check.contains != null) return ok(has && val.toLowerCase().includes(check.contains.toLowerCase()), `${check.sel}'s ${check.name} is “${val}”.`);
        return ok(check.present === false ? !has : has, `${check.sel} is ${has ? 'missing' : 'not missing'} ${check.name}.`);
      }
      case 'absent':
        return ok(doc.querySelectorAll(check.sel).length === 0, `Found ${check.sel}, which should not be there.`);
      case 'every': {
        const els = Array.from(doc.querySelectorAll(check.sel));
        const bad = els.filter((e) => norm(e.getAttribute(check.name)).length === 0);
        return ok(els.length > 0 && bad.length === 0, els.length === 0 ? `No ${check.sel} found.` : `${bad.length} ${check.sel} missing a non-empty ${check.name}.`);
      }
      case 'order': {
        const b = doc.querySelector(check.before), a = doc.querySelector(check.after);
        if (!b || !a) return ok(false, `Need both ${check.before} and ${check.after}.`);
        return ok(!!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING), `${check.before} should come before ${check.after}.`);
      }
      case 'source': {
        const s = raw;
        if (check.contains != null && !s.toLowerCase().includes(check.contains.toLowerCase())) return ok(false);
        if (check.matches != null && !new RegExp(check.matches, 'i').test(s)) return ok(false);
        if (check.notMatches != null && new RegExp(check.notMatches, 'i').test(s)) return ok(false);
        return ok(true);
      }
      case 'doctype':
        return ok(/<!doctype\s+html/i.test(raw), 'Add <!doctype html> at the top.');
    }
  } catch (e) {
    return ok(false, `Check could not run: ${(e as Error).message}`);
  }
}

/** Run every check against the learner's HTML. Returns one result per check, in order. */
export function runHtmlChecks(html: string, checks: HtmlCheck[]): HtmlCheckResult[] {
  const doc = parseHtml(html);
  return checks.map((c) => one(c, doc, html));
}

/** True when every check passes. */
export const allPass = (results: HtmlCheckResult[]) => results.every((r) => r.ok);
