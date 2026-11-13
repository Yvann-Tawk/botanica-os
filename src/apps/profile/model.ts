// Pilot logbook values: a port of the prototype's profile section of renderVals(), fed by the real event log.

import { ACHIEVEMENTS } from '../../content/achievements';
import { lessonMetaForConcept, REGIONS } from '../../content/curriculum';
import { MISSIONS, reinforcing } from '../../content/missions';
import { spriteFlags, stageForLevel, type Mood, type SproutSprite, type Stage } from '../../mascot/sproutSprite';
import { conceptEvidence, levelOf, masteryLevel, masteryScore, streak, totalXP, unlockedAt, weekFlags, type Progression } from '../../progression/engine';
import { currentPosition, regionStatus, type Progress } from '../../progression/progress';
import { relativeTime } from '../terminal/workspace';

const D = (b: boolean) => (b ? 'inline' : 'none');
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

type Gal = SproutSprite & { size: number; sizeH: number; cap: string; note: string };
export interface ProfileVals {
  lvNum: number; lvName: string; lvAria: string; ringDash: string; ringLeaves: { tf: string }[];
  xpText: string; xpNext: string; streakText: string; streakAria: string;
  week: { l: string; bg: string; ring: string; dash: string; dOn: string }[];
  masteredCount: string; recent: { name: string; where: string; when: string }[];
  sproutStage: string; gallery: Gal[];
  masteredOf: string; constAria: string;
  cBranches: { d: string; c: string; w: number; dash: string }[]; cLeaves: { tf: string }[];
  cNodes: { x: string; y: string; r: number; f: string; s: string }[]; cLabels: { x: string; y: string; a: 'start' | 'middle' | 'end'; t: string; c: string }[];
  constDone: string; constList: { t: string; c: string; bg: string; b: string }[];
  badgeCount: string; badges: Record<string, string>[];
  artCount: string; artifacts: { name: string; desc: string; op: number; ink: string; g0: string; g1: string; g2: string; g3: string }[];
}

const ART_GLYPH: Record<string, number> = { hello: 0, label: 1, vault: 2, care: 3 };

export function buildProfile(p: Progress, g: Progression, now = new Date()): ProfileVals {
  const xp = totalXP(g), lv = levelOf(xp), stage = stageForLevel(lv.n);
  const status = regionStatus(p), m = status.map((s) => s.done);
  const here = currentPosition(p);

  /* level ring */
  const frac = clamp((xp - lv.lo) / (lv.hi - lv.lo), 0, 1), circ = 2 * Math.PI * 62;
  const nL = Math.floor(frac * 8), ringLeaves = [];
  for (let i = 0; i < nL; i++) { const ra = -90 + (i + 0.5) * (360 * frac / Math.max(nL, 1)), rr = (ra * Math.PI) / 180; ringLeaves.push({ tf: `translate(${(Math.cos(rr) * 62).toFixed(1)} ${(Math.sin(rr) * 62).toFixed(1)}) rotate(${ra + (i % 2 ? 140 : 40)})` }); }

  /* streak week */
  const flags = weekFlags(g, now), today = (now.getDay() + 6) % 7, days = streak(g, now);
  const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => ({ l, bg: flags[i] ? '#3e6510' : '#f6f2e8', ring: flags[i] ? '#242820' : '#9a9f92', dash: i > today ? '2 3' : '0', dOn: D(flags[i]) }));

  /* concepts, newest first, with mastery from evidence */
  const done = Object.entries(p.completed).sort((a, b) => b[1].localeCompare(a[1]));
  let masteredN = 0;
  const recent = done.slice(0, 5).map(([id, at]) => {
    const region = REGIONS.find((r) => r.concepts.some((c) => c.id === id))!, c = region.concepts.find((x) => x.id === id)!;
    const lesson = lessonMetaForConcept(id);
    const level = lesson ? masteryLevel(masteryScore(conceptEvidence(g, lesson.id, reinforcing(id)))) : 'mastered';
    return { name: `${c.name} · ${level}`, where: region.name, when: relativeTime(at, now.getTime()) };
  });
  for (const [id] of done) {
    const lesson = lessonMetaForConcept(id);
    if (!lesson || masteryLevel(masteryScore(conceptEvidence(g, lesson.id, reinforcing(id)))) === 'mastered') masteredN++;
  }
  if (!recent.length) recent.push({ name: 'Nothing yet. Your first concept is one lesson away.', where: 'Origins', when: 'today' });

  /* gallery */
  const snake = (mood: Mood, st: Stage, cap: string, note: string): Gal => ({ ...spriteFlags(mood, st, false), size: 76, sizeH: Math.round(76 * 108 / 124), cap, note });
  const gallery: Gal[] = [
    ...([['hatchling', 'Hatchling', 'Lv 1–3'], ['sprout', 'Sprout', 'Lv 4–6'], ['vine', 'Vine', 'Lv 7–9'], ['canopy', 'Canopy serpent', 'Lv 10']] as [Stage, string, string][])
      .map(([s, cap, lvls]) => snake(s === stage ? 'happy' : 'idle', s, cap, s === stage ? 'you are here' : lvls)),
    ...([['idle', 'Idle'], ['sleeping', 'Napping'], ['happy', 'Happy'], ['confused', 'Confused'], ['celebrating', 'Celebrating'], ['error', 'Traceback'], ['petted', 'Petted']] as [Mood, string][])
      .map(([mood, cap]) => snake(mood, stage, cap, '')),
  ];

  /* mastery constellation */
  const cBranches: ProfileVals['cBranches'] = [], cNodes: ProfileVals['cNodes'] = [], cLeaves: ProfileVals['cLeaves'] = [], cLabels: ProfileVals['cLabels'] = [];
  REGIONS.forEach((r, i) => {
    const base = -90 + i * 45, pts: [number, number][] = [];
    for (let j = 0; j < 6; j++) { const a = ((base + Math.sin(j * 0.9) * 7) * Math.PI) / 180, rad = 46 + j * 29; pts.push([Math.cos(a) * rad, Math.sin(a) * rad]); }
    const path = (ps: [number, number][]) => 'M0 0 ' + ps.map((q) => `L${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
    cBranches.push({ d: path(pts), c: '#c9c0a6', w: 2, dash: '3 5' });
    const litIdx = r.concepts.map((c, j) => (p.completed[c.id] ? j : -1)).filter((j) => j >= 0);
    if (m[i] > 0) cBranches.push({ d: path(pts.slice(0, Math.max(...litIdx) + 1)), c: '#3e6510', w: 3.5, dash: '0' });
    pts.forEach((q, j) => {
      const lit = !!p.completed[r.concepts[j].id], cur = here?.region === i && here.concept === j;
      cNodes.push({ x: q[0].toFixed(1), y: q[1].toFixed(1), r: lit ? 6.5 : cur ? 6 : 4, f: lit ? '#e2a93b' : cur ? '#c95851' : '#f6f2e8', s: lit || cur ? '#242820' : '#9a9f92' });
      if (lit && j % 2 === 0) { const la = base + (j % 4 ? 60 : -60); cLeaves.push({ tf: `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)}) rotate(${la + 90})` }); }
    });
    const ea = (base * Math.PI) / 180;
    cLabels.push({ x: (Math.cos(ea) * 222).toFixed(1), y: (Math.sin(ea) * 222 + 5).toFixed(1), a: (Math.abs(Math.cos(ea)) < 0.2 ? 'middle' : Math.cos(ea) > 0 ? 'start' : 'end') as 'start' | 'middle' | 'end', t: r.name.replace('The ', ''), c: status[i].sealed ? '#777c70' : '#242820' });
  });
  const total = m.reduce((a, b) => a + b, 0);
  const constList = REGIONS.map((r, i) => { const full = m[i] >= 6, part = m[i] > 0 && !full; return { t: r.constellation + (full ? '' : part ? ` · ${m[i]}/6` : ''), c: full ? '#f6f2e8' : part ? '#8a6000' : '#777c70', bg: full ? '#345a04' : part ? '#f3e6c4' : 'transparent', b: full ? '#345a04' : part ? '#b47e00' : '#c9c0a6' }; });

  /* patches and artifacts */
  const badges = ACHIEVEMENTS.map((a) => {
    const on = !!unlockedAt(g, a.id), ink = on ? '#f6f2e8' : '#b9b19c';
    const flags: Record<string, string> = {};
    for (let k = 0; k <= 6; k++) flags['g' + k] = D(a.glyph === k);
    return { name: a.name, desc: a.desc, cls: on ? '' : 'locked', fill: on ? a.color : '#eae4d5', stroke: on ? '#242820' : '#b9b19c', stitch: on ? '#f6f2e8' : '#c9c0a6', ink, ...flags };
  });
  const doneMissions = new Set(g.events.filter((e) => e.type === 'mission').map((e) => e.ref));
  const artifacts = MISSIONS.filter((x) => x.reward || x.id === 'care').map((x) => {
    const on = doneMissions.has(x.id), gi = ART_GLYPH[x.id] ?? 0;
    return { name: on ? x.reward!.artifact : 'Unknown artifact', desc: on ? x.reward!.desc : `Earned from ${x.title}`, op: on ? 1 : 0.35, ink: on ? '#b47e00' : '#9a9f92', g0: D(gi === 0), g1: D(gi === 1), g2: D(gi === 2), g3: D(gi === 3) };
  });

  return {
    lvNum: lv.n, lvName: lv.name, lvAria: `Level ${lv.n}, ${Math.round(frac * 100)} percent of the way to level ${lv.n + 1}`,
    ringDash: `${(circ * frac).toFixed(1)} ${circ.toFixed(1)}`, ringLeaves,
    xpText: xp.toLocaleString('en'), xpNext: `${(lv.hi - xp).toLocaleString('en')} XP until ${lv.nextName}, level ${lv.n + 1}`,
    streakText: days ? `${days}-day streak` : 'No streak yet. Run some code today.', streakAria: `Learning days this week: ${flags.filter(Boolean).length} of 7`,
    week, masteredCount: `${done.length} complete`, recent,
    sproutStage: `${stage[0].toUpperCase()}${stage.slice(1)} stage`, gallery,
    masteredOf: `${total} of 48 complete · ${masteredN} mastered`, constAria: `Mastery constellation: ${total} of 48 concepts complete, ${masteredN} mastered.`,
    cBranches, cLeaves, cNodes, cLabels,
    constDone: `${m.filter((x) => x >= 6).length} of 8 complete`, constList,
    badgeCount: `${badges.filter((b) => !b.cls).length} of ${badges.length}`, badges,
    artCount: `${artifacts.filter((a) => a.op === 1).length} of ${artifacts.length}`, artifacts,
  };
}
