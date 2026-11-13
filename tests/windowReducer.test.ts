import { fromLayout, geom, initialShell, shellReducer, toLayout } from '../src/shell/windowReducer';

describe('window manager', () => {
  it('starts with only the start app open and on top', () => {
    const s = initialShell('academy');
    expect(s.wins.academy.open).toBe(true);
    expect(s.wins.universe.open).toBe(false);
    expect(s.focus).toBe('academy');
    expect(s.wins.academy.z).toBe(s.ztop);
  });

  it('desktop start opens nothing', () => {
    const s = initialShell('desktop');
    expect(Object.values(s.wins).some((w) => w.open)).toBe(false);
    expect(s.focus).toBeNull();
  });

  it('opening raises the window above everything and closes menus', () => {
    let s = initialShell('universe');
    s = shellReducer(s, { type: 'menu', menu: 'go' });
    s = shellReducer(s, { type: 'open', id: 'terminal' });
    expect(s.focus).toBe('terminal');
    expect(s.wins.terminal.z).toBeGreaterThan(s.wins.universe.z);
    expect(s.menu).toBeNull();
  });

  it('focus is a no-op when already focused on top', () => {
    const s = initialShell('universe');
    expect(shellReducer(s, { type: 'focus', id: 'universe' })).toBe(s);
  });

  it('minimize and close clear focus; reopen un-minimizes', () => {
    let s = shellReducer(initialShell('universe'), { type: 'minimize', id: 'universe' });
    expect(s.wins.universe.min).toBe(true);
    expect(s.focus).toBeNull();
    s = shellReducer(s, { type: 'open', id: 'universe' });
    expect(s.wins.universe.min).toBe(false);
    s = shellReducer(s, { type: 'close', id: 'universe' });
    expect(s.wins.universe.open).toBe(false);
  });

  it('resize respects each app minimum width and the 340px minimum height', () => {
    const s = shellReducer(initialShell('academy'), { type: 'resize', id: 'academy', w: 10, h: 10 });
    expect(s.wins.academy.w).toBe(760);
    expect(s.wins.academy.h).toBe(340);
  });

  it('cascade arranges open windows only, in app order', () => {
    let s = shellReducer(initialShell('universe'), { type: 'open', id: 'missions' });
    s = shellReducer(s, { type: 'cascade' });
    expect([s.wins.universe.x, s.wins.universe.y]).toEqual([130, 50]);
    expect([s.wins.missions.x, s.wins.missions.y]).toEqual([170, 84]);
    expect(s.wins.academy.x).toBe(110);
  });

  it('minimize all hides every window', () => {
    const s = shellReducer(initialShell('universe'), { type: 'minimizeAll' });
    expect(Object.values(s.wins).every((w) => w.min)).toBe(true);
  });

  it('reset layout restores geometry but keeps which windows are open', () => {
    let s = shellReducer(initialShell('universe'), { type: 'move', id: 'universe', x: 900, y: 500 });
    s = shellReducer(s, { type: 'resetLayout' });
    expect([s.wins.universe.x, s.wins.universe.y]).toEqual([300, 54]);
    expect(s.wins.universe.open).toBe(true);
  });
});

describe('geometry', () => {
  const w = initialShell('universe').wins.universe;
  it('clamps windows so a title bar stays reachable', () => {
    const g = geom({ ...w, x: 5000, y: -400 }, 1440, 900);
    expect(g.x).toBe(1340);
    expect(g.y).toBe(34);
  });
  it('maximizes everything below 760px wide', () => {
    expect(geom(w, 700, 900)).toEqual({ x: 0, y: 34, w: 700, h: 774, max: true });
  });
  it('never exceeds the stage', () => {
    const g = geom(w, 900, 600);
    expect(g.w).toBe(884);
    expect(g.h).toBe(554);
  });
});

describe('layout persistence', () => {
  it('round-trips', () => {
    const s = shellReducer(initialShell('universe'), { type: 'move', id: 'universe', x: 400, y: 120 });
    const back = fromLayout(JSON.parse(JSON.stringify(toLayout(s))), initialShell('desktop'));
    expect(back.wins.universe).toEqual(s.wins.universe);
    expect(back.focus).toBe('universe');
  });
  it('ignores garbage and fills defaults per window', () => {
    const fb = initialShell('desktop');
    expect(fromLayout('nope', fb)).toBe(fb);
    const r = fromLayout({ wins: { universe: { x: 'a', w: 1, open: true } }, focus: 'hacker' }, fb);
    expect(r.wins.universe.x).toBe(300);
    expect(r.wins.universe.w).toBe(560);
    expect(r.focus).toBeNull();
  });
});
