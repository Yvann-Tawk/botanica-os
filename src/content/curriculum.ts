// The curriculum graph: 8 regions (planets) × 6 concepts (moons). Visual data (position, radius, palette, kind)
// is the prototype's REGIONS table. Concept ids are stable keys for progress; never rename one that has shipped.
//
// Origins' six moons are the Galaxy 01 curriculum: five lessons and the guided mini-project.

export type RegionKind = 'Seed' | 'Flow' | 'Arch' | 'Eng' | 'Mach' | 'Net' | 'Front' | 'Exp';

export interface Concept {
  id: string;
  name: string;
  /** Concept ids that must be completed first. Defaults to the previous concept in the region. */
  requires?: string[];
  /** Set when the concept has playable content; the Academy routes here. */
  lessonId?: string;
  /** Set when the concept is taught by a mission (projects); Missions routes here. */
  missionId?: string;
  /** Lesson length and XP, for the shell (the full lesson text loads with the Academy). */
  minutes?: number;
  xp?: number;
}

export interface Region {
  id: string; n: string; name: string; sub: string; blurb: string;
  x: number; y: number; R: number; kind: RegionKind;
  c: [string, string, string, string]; // body, light, dark, accent
  concepts: Concept[];
  /** Constellation that lights as concepts complete. */
  constellation: string;
}

/** Six lessons for a galaxy: concept ids stay `<region>.<n>`, lesson ids are `g<galaxy>-l<n>`. */
const seq = (prefix: string, galaxy: number, xp: number, lessons: [string, number][]): Concept[] =>
  lessons.map(([name, minutes], i) => ({ id: `${prefix}.${i + 1}`, name, lessonId: `g${String(galaxy).padStart(2, '0')}-l${String(i + 1).padStart(2, '0')}`, minutes, xp }));

export const REGIONS: Region[] = [
  { id: 'origins', n: '01', name: 'Origins', sub: 'Fundamentals', x: 440, y: 1010, R: 125, kind: 'Seed', constellation: 'The First Seed', blurb: 'Where every program begins: names, values and the shapes data takes.', c: ['#4f7a1c', '#8fb356', '#2a4708', '#b4cfb6'],
    concepts: [
      { id: 'origins.hello', name: 'Hello, Python!', lessonId: 'g01-l01', minutes: 10, xp: 100 },
      { id: 'origins.variables', name: 'Variables', lessonId: 'g01-l02', minutes: 12, xp: 120 },
      { id: 'origins.types', name: 'Data types', lessonId: 'g01-l03', minutes: 12, xp: 150 },
      { id: 'origins.operators', name: 'Operators', lessonId: 'g01-l04', minutes: 15, xp: 150 },
      { id: 'origins.input', name: 'User input', lessonId: 'g01-l05', minutes: 15, xp: 150 },
      { id: 'origins.project', name: 'Project: The Seed Vault', missionId: 'vault', requires: ['origins.hello', 'origins.variables', 'origins.types', 'origins.operators', 'origins.input'] },
    ] },
  { id: 'flow', n: '02', name: 'The Flow', sub: 'Control flow', x: 760, y: 690, R: 105, kind: 'Flow', constellation: 'The Braided River', blurb: 'Teach a program to decide and to repeat. Rivers that branch and loop back.', c: ['#6f9a78', '#b4cfb6', '#2f4f2a', '#e6efe3'],
    concepts: seq('flow', 2, 150, [['Booleans & comparisons', 15], ['if, elif, else', 15], ['while loops', 18], ['for loops & range()', 18], ['break & continue', 15], ['Nested logic', 20]]) },
  { id: 'archives', n: '03', name: 'The Archives', sub: 'Collections', x: 1040, y: 1080, R: 115, kind: 'Arch', constellation: 'The Herbarium', blurb: 'Lists, dictionaries, tuples and sets. Strata of stored things, catalogued.', c: ['#b47e00', '#dcae45', '#6b4b05', '#eae4d5'],
    concepts: seq('archives', 3, 175, [['Lists', 18], ['Tuples', 15], ['Dictionaries', 20], ['Sets', 15], ['Slicing', 15], ['Comprehensions', 20]]) },
  { id: 'engine', n: '04', name: 'The Engine', sub: 'Functions', x: 1290, y: 640, R: 100, kind: 'Eng', constellation: 'The Gearwort', blurb: 'Reusable machinery: functions, modules and the rules of scope.', c: ['#c95851', '#e38a7f', '#7a2f2a', '#dcae45'],
    concepts: seq('engine', 4, 175, [['Defining functions', 18], ['Parameters & return', 20], ['Scope', 18], ['*args & **kwargs', 20], ['Modules & imports', 18], ['Lambdas', 15]]) },
  { id: 'machines', n: '05', name: 'The Machines', sub: 'Object-oriented', x: 1560, y: 1020, R: 110, kind: 'Mach', constellation: 'The Glass Orchard', blurb: 'Build your own kinds of thing. Classes, objects and the glass orchard.', c: ['#8fae93', '#cfe0d0', '#3e5a42', '#345a04'],
    concepts: seq('machines', 5, 200, [['Classes & objects', 20], ['__init__ & attributes', 20], ['Methods', 20], ['Inheritance', 22], ['Dunder methods', 22], ['Dataclasses', 18]]) },
  { id: 'network', n: '06', name: 'The Network', sub: 'Files & APIs', x: 1760, y: 600, R: 105, kind: 'Net', constellation: 'The Mycelial Crown', blurb: 'Reach beyond the program: files, JSON, the web and automation.', c: ['#345a04', '#5f8a2a', '#1c3502', '#dcae45'],
    concepts: seq('network', 6, 200, [['Reading & writing files', 20], ['Exceptions', 20], ['JSON', 18], ['HTTP & APIs', 22], ['Automation scripts', 22], ['pathlib', 18]]) },
  { id: 'frontier', n: '07', name: 'The Frontier', sub: 'Advanced', x: 1980, y: 1110, R: 115, kind: 'Front', constellation: 'The Night Bloom', blurb: 'Generators, decorators, async and the strange flora at the edge.', c: ['#a8423c', '#d4746b', '#5c1f1b', '#dcae45'],
    concepts: seq('frontier', 7, 225, [['Iterators & generators', 22], ['Decorators', 22], ['Context managers', 20], ['Type hints', 18], ['async & await', 25], ['Testing with assert & unittest', 22]]) },
  { id: 'expeditions', n: '08', name: 'The Expeditions', sub: 'Real projects', x: 2180, y: 720, R: 120, kind: 'Exp', constellation: 'The Wayfarer', blurb: 'Specialise. Data, web, games, automation, machine learning.', c: ['#d8cdb2', '#f6f2e8', '#8b7f62', '#c95851'],
    concepts: seq('expeditions', 8, 250, [['Data with csv & statistics', 25], ['A tiny web router', 25], ['Automation bots', 25], ['A text adventure', 25], ['Intro to ML: nearest neighbours', 30], ['Capstone: Greenhouse Monitor', 40]]) },
];

export const CONCEPTS_PER_REGION = 6;
export const ALL_CONCEPTS = REGIONS.flatMap((r) => r.concepts);

// Register Botanica's concept ids with the world-agnostic progression store, so completions persist and
// validate. Other worlds (Lithic, …) register their own ids from their own curricula.
import { registerConcepts } from '../progression/conceptRegistry';
registerConcepts(ALL_CONCEPTS.map((c) => c.id));
export const conceptById = (id: string) => ALL_CONCEPTS.find((c) => c.id === id);
export const conceptByLesson = (lessonId: string) => ALL_CONCEPTS.find((c) => c.lessonId === lessonId);
export const regionOf = (conceptId: string) => REGIONS.find((r) => r.concepts.some((c) => c.id === conceptId));

/** Explicit prerequisites, or the previous concept in the same region. The first concept of a region has none
 *  of its own; the region gate (see progress.ts) decides whether it can be reached. */
export function prerequisites(conceptId: string): string[] {
  const r = regionOf(conceptId); if (!r) return [];
  const i = r.concepts.findIndex((c) => c.id === conceptId);
  const c = r.concepts[i];
  return c.requires ?? (i > 0 ? [r.concepts[i - 1].id] : []);
}

/* ---- lesson index: everything the shell needs without loading lesson text ---- */
export interface LessonMeta { id: string; conceptId: string; regionId: string; regionName: string; number: number; title: string; minutes: number; xp: number }
export const LESSONS: LessonMeta[] = REGIONS.flatMap((r) => r.concepts.filter((c) => c.lessonId).map((c, i) => ({
  id: c.lessonId!, conceptId: c.id, regionId: r.id, regionName: r.name, number: i + 1, title: c.name, minutes: c.minutes ?? 15, xp: c.xp ?? 150,
})));
export const lessonMeta = (id: string) => LESSONS.find((l) => l.id === id);
export const lessonMetaForConcept = (conceptId: string) => LESSONS.find((l) => l.conceptId === conceptId);
