// Static wallpaper decoration, computed once with the prototype's seeded RNG so positions match exactly.

export function rng(seed: number): () => number {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const R3 = rng(99);

export const WALL_STARS = [[140, 160], [300, 90], [520, 70], [760, 120], [860, 60], [1180, 90], [1420, 160], [1240, 230], [620, 300], [1400, 340], [90, 300], [380, 260]].map((p, i) => {
  const s = 0.5 + R3() * 0.7;
  return { tf: 'translate(' + p[0] + ' ' + p[1] + ') scale(' + s.toFixed(2) + ')', c: i % 3 === 0 ? '#c95851' : '#b47e00', cls: i % 2 ? 'twk' : '' };
});

export const WALL_TICKS = Array.from({ length: 72 }, (_, ti) => {
  const ang = (ti * 5 * Math.PI) / 180, big = ti % 6 === 0, r1 = big ? 452 : 462;
  return {
    x1: (1010 + Math.cos(ang) * r1).toFixed(1), y1: (420 + Math.sin(ang) * r1).toFixed(1),
    x2: (1010 + Math.cos(ang) * 470).toFixed(1), y2: (420 + Math.sin(ang) * 470).toFixed(1), o: big ? 0.35 : 0.18,
  };
});

const f1 = (n: number) => n.toFixed(1);
export const FROND: { d: string }[] = [];
for (let k = 0; k < 11; k++) {
  const yy = -12 - k * 10.5, sc = 1 - k * 0.07, xo = Math.sin(k * 0.3) * 1.5;
  FROND.push({ d: 'M' + f1(xo) + ' ' + f1(yy) + ' c ' + f1(-10 * sc) + ' ' + f1(-1 * sc) + ' ' + f1(-20 * sc) + ' ' + f1(-7 * sc) + ' ' + f1(-24 * sc) + ' ' + f1(-14 * sc) + ' c ' + f1(9 * sc) + ' ' + f1(0 * sc) + ' ' + f1(18 * sc) + ' ' + f1(5 * sc) + ' ' + f1(24 * sc) + ' ' + f1(11 * sc) + ' z' });
  FROND.push({ d: 'M' + f1(xo) + ' ' + f1(yy - 4) + ' c ' + f1(10 * sc) + ' ' + f1(-1 * sc) + ' ' + f1(20 * sc) + ' ' + f1(-7 * sc) + ' ' + f1(24 * sc) + ' ' + f1(-14 * sc) + ' c ' + f1(-9 * sc) + ' 0 ' + f1(-18 * sc) + ' ' + f1(5 * sc) + ' ' + f1(-24 * sc) + ' ' + f1(11 * sc) + ' z' });
}

export const FERNS = ([[40, 742, 60, 140, -8, '#345a04'], [92, 760, 48, 112, 6, '#2a4708'], [560, 760, 52, 120, -4, '#2a4708'], [610, 772, 40, 92, 10, '#345a04'], [1290, 730, 62, 146, 6, '#345a04'], [1350, 756, 46, 108, -10, '#2a4708'], [880, 790, 44, 100, 4, '#345a04'], [1110, 770, 40, 96, -6, '#2a4708']] as [number, number, number, number, number, string][]).map((f) => ({
  x: f[0], y: f[1], w: f[2], h: f[3], tf: 'rotate(' + f[4] + ' ' + (f[0] + f[2] / 2) + ' ' + (f[1] + f[3]) + ')', c: f[5],
}));
