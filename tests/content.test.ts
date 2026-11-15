// @vitest-environment node
// Every lesson in every galaxy, checked against real Python: model solutions (and alternatives) pass every check,
// starters and common wrong answers fail, and the worked examples run cleanly.
import { readFileSync } from 'node:fs';
import { loadPython } from './loadPython';
import { createRunner, type Runner } from '../src/runtime/pyCore';
import { ALL_LESSONS } from '../src/content/lessons';
import { LESSONS, REGIONS } from '../src/content/curriculum';
import type { Exercise } from '../src/content/lessons/types';
import { SOLUTIONS } from './solutions';
import { MISSION_SOLUTIONS } from './solutions/missions';
import { TIERS } from '../src/content/lessons/types';

let runner: Runner;
beforeAll(async () => {
  // The Network lessons fetch the app's own sample data with pyodide.http.open_url (sync XHR in the browser's
  // worker). Node has no XMLHttpRequest, so serve public/ files through a minimal stand-in.
  (globalThis as Record<string, unknown>).XMLHttpRequest = class {
    status = 0; responseText = ''; response = ''; private url = '';
    open(_m: string, url: string) { this.url = url; }
    overrideMimeType() {}
    setRequestHeader() {}
    getAllResponseHeaders() { return 'content-type: application/json\r\n'; }
    send() {
      const path = new URL(this.url, 'http://localhost/').pathname;
      try { this.responseText = this.response = readFileSync(`public${path}`, 'utf8'); this.status = 200; } catch { this.status = 404; this.responseText = this.response = 'Not found'; }
    }
  };
  runner = await createRunner(await loadPython(), { write: () => {}, input: () => null });
}, 60000);

const check = (ex: Exercise, code: string) => runner.check(code, 'lesson.py', JSON.stringify({ checks: ex.checks, inputs: ex.inputs ?? [] }));
const passes = async (ex: Exercise, code: string) => (await check(ex, code)).results.every(Boolean);

describe('curriculum', () => {
  it('every concept that names a lesson has content, and every lesson matches its index entry', () => {
    for (const meta of LESSONS) {
      const l = ALL_LESSONS.find((x) => x.id === meta.id);
      expect(l, `${meta.id} (${meta.title}) has no content`).toBeTruthy();
      expect([l!.conceptId, l!.number, l!.title, l!.xp, l!.minutes]).toEqual([meta.conceptId, meta.number, meta.title, meta.xp, meta.minutes]);
    }
    expect(ALL_LESSONS.map((l) => l.id)).toEqual(LESSONS.map((l) => l.id));
  });
  it('every region has six concepts', () => { for (const r of REGIONS) expect(r.concepts).toHaveLength(6); });
});

for (const lesson of ALL_LESSONS) {
  describe(`${lesson.id} ${lesson.title}`, () => {
    const sol = SOLUTIONS[lesson.id];
    it('is complete', () => {
      expect(sol, 'model solutions missing in tests/solutions').toBeTruthy();
      expect(lesson.objectives.length).toBeGreaterThan(0);
      for (const ex of [lesson.practice, lesson.challenge]) { expect(ex.checks.length).toBeGreaterThan(0); expect(ex.hints).toHaveLength(3); }
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(3);
      lesson.quiz.forEach((q) => expect(q.a).toBeLessThan(q.opts.length));
    });
    it('starter code does not pass yet', async () => {
      expect(await passes(lesson.practice, lesson.practice.starter)).toBe(false);
      expect(await passes(lesson.challenge, lesson.challenge.starter)).toBe(false);
    });
    it('model and alternative solutions pass every check', async () => {
      for (const code of sol.practice) expect((await check(lesson.practice, code)).results, code).toEqual(lesson.practice.checks.map(() => true));
      for (const code of sol.challenge) expect((await check(lesson.challenge, code)).results, code).toEqual(lesson.challenge.checks.map(() => true));
    });
    it('common wrong answers are caught', async () => {
      for (const code of sol.wrong?.practice ?? []) expect(await passes(lesson.practice, code), code).toBe(false);
      for (const code of sol.wrong?.challenge ?? []) expect(await passes(lesson.challenge, code), code).toBe(false);
    });
    it('the worked example and the experiment code run cleanly', async () => {
      const inputs = sol.inputs ?? ['Ilse', '5', '3', '2', '1'];
      for (const code of [lesson.discover.example, lesson.experiment.code]) {
        const r = await runner.check(code, 'lesson.py', JSON.stringify({ checks: [], inputs }));
        expect(r.error, `${r.error?.text}\n---\n${code}`).toBeNull();
      }
    });
  });
}

describe('recaps and optional missions', () => {
  it('mission ids are unique and tied to their lesson', () => {
    const ids = ALL_LESSONS.flatMap((l) => (l.missions ?? []).map((m) => m.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(ALL_LESSONS.length * 3);
  });
});

for (const lesson of ALL_LESSONS) {
  describe(`${lesson.id} ${lesson.title}: recap and missions`, () => {
    it('has a complete recap', () => {
      const r = lesson.recap;
      expect(r, 'recap missing in src/content/lessons/extras').toBeTruthy();
      expect(r.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(r.takeaways.length).toBeLessThanOrEqual(5);
      expect(r.syntaxExamples.length).toBeGreaterThanOrEqual(2);
      expect(r.commonMistakes.length).toBeGreaterThanOrEqual(2);
      expect(r.commonMistakes.length).toBeLessThanOrEqual(3);
      expect(r.knowledgeChecks.length).toBeGreaterThanOrEqual(2);
      expect(r.knowledgeChecks.length).toBeLessThanOrEqual(3);
      r.knowledgeChecks.forEach((q) => expect(q.a).toBeLessThan(q.opts.length));
    });
    it('cheat-sheet snippets run as written', async () => {
      for (const ex of lesson.recap.syntaxExamples) {
        // Snippets that call input() may want text or a number: try a name first, then digits.
        let r = await runner.check(ex.code, 'recap.py', JSON.stringify({ checks: [], inputs: SOLUTIONS[lesson.id]?.inputs ?? ['Ilse', '5', '3', '2', '1'] }));
        if (r.error) r = await runner.check(ex.code, 'recap.py', JSON.stringify({ checks: [], inputs: ['5', '3', '2', '1'] }));
        expect(r.error, `${r.error?.text}\n---\n${ex.code}`).toBeNull();
      }
    });
    it('has exactly three missions: Seed, Sprout, Bloom', () => {
      expect(lesson.missions).toHaveLength(3);
      lesson.missions.forEach((m, i) => {
        expect([m.id, m.lessonId, m.tier, m.difficulty, m.xpReward]).toEqual([`${lesson.id}-m${i + 1}`, lesson.id, TIERS[i].tier, TIERS[i].difficulty, TIERS[i].xp]);
        for (const text of [m.title, m.description, m.objective, m.expected]) expect(text.length).toBeGreaterThan(3);
        expect(m.hints.length).toBeGreaterThanOrEqual(2);
        expect(m.checks.length).toBeGreaterThan(0);
      });
    });
    for (const [i, tier] of TIERS.entries()) {
      it(`${tier.name}: solutions pass, the starter and wrong answers fail`, async () => {
        const m = lesson.missions[i], sol = MISSION_SOLUTIONS[m.id];
        expect(sol, `no model solution for ${m.id}`).toBeTruthy();
        const run = (code: string) => runner.check(code, 'mission.py', JSON.stringify({ checks: m.checks, inputs: m.inputs ?? [] }));
        expect((await run(m.starterCode)).results.every(Boolean), 'starter passes').toBe(false);
        for (const code of sol.ok) expect((await run(code)).results, code).toEqual(m.checks.map(() => true));
        for (const code of sol.wrong ?? []) expect((await run(code)).results.every(Boolean), code).toBe(false);
      });
    }
  });
}

describe('checker', () => {
  it('reports the first run output and errors', async () => {
    const r = await runner.check('print("a")\nboom', 'lesson.py', JSON.stringify({ checks: [{ kind: 'runs' }] }));
    expect(r.output).toBe('a\n');
    expect(r.error?.type).toBe('NameError');
    expect(r.results).toEqual([false]);
  });
  it('treats bool and int as different types', async () => {
    const r = await runner.check('x = True', 'a.py', JSON.stringify({ checks: [{ kind: 'var', name: 'x', type: 'int' }, { kind: 'var', name: 'x', equals: 1 }] }));
    expect(r.results).toEqual([false, false]);
  });
  it('checks function return values', async () => {
    const r = await runner.check('def double(n):\n    return n * 2\n', 'a.py', JSON.stringify({ checks: [{ kind: 'call', fn: 'double', calls: [{ args: [2], returns: 4 }, { args: [0.5], returns: 1.0 }] }] }));
    expect(r.results).toEqual([true]);
  });
});
