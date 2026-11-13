import { REGIONS } from '../src/content/curriculum';
import { complete, currentPosition, demoProgress, EMPTY_PROGRESS, isAvailable, normalizeProgress, regionStatus, type Progress } from '../src/progression/progress';
import { buildUniverse, INITIAL_CAMERA, zoomAt } from '../src/apps/universe/model';

const origins = REGIONS[0].concepts.map((c) => c.id);
const doneAll = (ids: string[]) => ids.reduce<Progress>((p, id) => complete(p, id), EMPTY_PROGRESS);

describe('curriculum gating', () => {
  it('a new learner can reach Origins only, starting at Hello, Python!', () => {
    const st = regionStatus(EMPTY_PROGRESS);
    expect(st[0]).toMatchObject({ open: true, done: 0, mastered: false });
    expect(st.slice(1).every((s) => s.sealed)).toBe(true);
    expect(currentPosition(EMPTY_PROGRESS)).toEqual({ region: 0, concept: 0 });
  });

  it('respects prerequisites inside a region', () => {
    expect(isAvailable(EMPTY_PROGRESS, 'origins.hello')).toBe(true);
    expect(isAvailable(EMPTY_PROGRESS, 'origins.variables')).toBe(false);
    expect(isAvailable(complete(EMPTY_PROGRESS, 'origins.hello'), 'origins.variables')).toBe(true);
  });

  it('the Origins project needs all five lessons', () => {
    const p = doneAll(origins.slice(0, 4));
    expect(isAvailable(p, 'origins.project')).toBe(false);
    expect(isAvailable(complete(p, 'origins.input'), 'origins.project')).toBe(true);
  });

  it('two Origins concepts chart the route to The Flow; all six open it', () => {
    expect(regionStatus(doneAll(origins.slice(0, 2)))[1]).toMatchObject({ charted: true, open: false });
    const all = regionStatus(doneAll(origins));
    expect(all[0].mastered).toBe(true);
    expect(all[1].open).toBe(true);
    expect(currentPosition(doneAll(origins))).toEqual({ region: 1, concept: 0 });
  });

  it('completion is idempotent and keeps the first timestamp', () => {
    const p = complete(EMPTY_PROGRESS, 'origins.hello', 'A');
    expect(complete(p, 'origins.hello', 'B')).toBe(p);
    expect(complete(p, 'not.a.concept')).toBe(p);
  });

  it('normalize drops unknown concepts and bad values', () => {
    expect(normalizeProgress({ completed: { 'origins.hello': 'x', 'zzz': 'y', 'origins.types': 3 } })).toEqual({ v: 1, completed: { 'origins.hello': 'x' } });
    expect(normalizeProgress(null)).toEqual(EMPTY_PROGRESS);
  });

  it('demo presets reproduce the prototype journeys', () => {
    expect(regionStatus(demoProgress('current')!).map((s) => s.done)).toEqual([2, 0, 0, 0, 0, 0, 0, 0]);
    expect(regionStatus(demoProgress('seasoned')!).map((s) => s.done)).toEqual([6, 6, 6, 6, 4, 0, 0, 0]);
    expect(demoProgress('nope')).toBeNull();
  });
});

describe('universe view-model', () => {
  const view = { ...INITIAL_CAMERA, hov: null, sel: null, panning: false, glide: false };
  const cb = { select: vi.fn(), hover: vi.fn(), openLesson: vi.fn(), openMission: vi.fn() };

  it('zooming keeps the point under the cursor fixed', () => {
    const c = zoomAt(INITIAL_CAMERA, 1.1, 400, 300);
    const before = (400 - INITIAL_CAMERA.ux) / INITIAL_CAMERA.us, after = (400 - c.ux) / c.us;
    expect(after).toBeCloseTo(before);
    expect(zoomAt({ ...INITIAL_CAMERA, us: 1.5 }, 2, 0, 0).us).toBe(1.5);
  });

  it('shows real counts and puts "you are here" on the first lesson', () => {
    const v = buildUniverse(EMPTY_PROGRESS, view, { w: 1060, h: 604 }, cb);
    expect(v.uvSummary).toBe('0 of 48 concepts complete · 1 of 8 systems reachable');
    expect(v.hereConcept).toBe('Hello, Python!');
    expect(v.planets[0].statusText).toBe('0 of 6 concepts');
    expect(v.planets[1].statusText).toBe('Sealed');
    expect(v.routes[0].cls).toBe('');
  });

  it('the Origins sheet routes concepts to their lessons', () => {
    const v = buildUniverse(EMPTY_PROGRESS, { ...view, sel: 'origins' }, { w: 1060, h: 604 }, cb);
    expect(v.pan.cta).toBe('Begin: Hello, Python!');
    v.pan.onLearn();
    expect(cb.openLesson).toHaveBeenCalledWith('g01-l01');
    v.pan.concepts[2].onOpen!();
    expect(cb.openLesson).toHaveBeenCalledWith('g01-l03');
  });

  it('sealed systems cannot be opened and say why', () => {
    const v = buildUniverse(EMPTY_PROGRESS, { ...view, sel: 'flow' }, { w: 1060, h: 604 }, cb);
    expect(v.pan.locked).toBe(true);
    expect(v.pan.canLearn).toBe(false);
    expect(v.pan.lockNote).toMatch(/Complete Origins/);
    expect(v.pan.concepts.every((c) => !c.onOpen)).toBe(true);
  });

  it('completed concepts grow sprouts and light the constellation', () => {
    const v = buildUniverse(doneAll(origins.slice(0, 2)), view, { w: 1060, h: 604 }, cb);
    expect(v.planets[0].sprouts).toHaveLength(2);
    expect(v.seedLabel).toBe('THE FIRST SEED · 2/6');
    expect(v.routes[0].c).toBe('#b4cfb6'); // charted
  });
});
