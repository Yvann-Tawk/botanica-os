// The Lithic curriculum graph: three planets (disciplines) → mini-planets (concept modules) → lessons.
// Structure and stable ids only; full lesson text loads with the Lithic Academy (a lazy chunk), exactly as
// Botanica splits curriculum.ts from content/lessons. Concept ids are permanent keys for progress — never
// rename one that has shipped.
//
//   SYSTEM (Lithic) → PLANET (Foundation/HTML · Matrix/DAX · Refinery/M) → MINI-PLANET (module) → LESSON
//
// Only The Foundation (HTML) is open. The Crystal Matrix (DAX) and The Refinery (Power Query M) are sealed
// until their content and language panes exist (INTEGRATION_GUIDE §I).

import { registerConcepts } from '../progression/conceptRegistry';

export type LithicLang = 'html' | 'dax' | 'm';
export type PlanetStatus = 'open' | 'sealed';

/** A single lesson node (the design's lesson-ring node). */
export interface LithicLesson {
  id: string;
  conceptId: string;
  /** 1-based position within its mini-planet. */
  number: number;
  title: string;
  minutes: number;
  xp: number;
}

/** A mini-planet = one learning module; the design fans its lessons on a ring. */
export interface LithicConcept {
  id: string;
  name: string;
  /** One-line landmark/sub-title shown on the specimen sheet. */
  sub: string;
  blurb: string;
  lessons: LithicLesson[];
}

/** A planet = one discipline/language. */
export interface LithicPlanet {
  id: string;
  /** Catalogue number, e.g. "01". */
  n: string;
  name: string;
  discipline: string;
  lang: LithicLang;
  status: PlanetStatus;
  blurb: string;
  /** Centre on the Survey plane (2600×1700, same plane as Botanica's Universe) and body radius. */
  x: number; y: number; R: number;
  /** Radial planet-body gradient triple (light → body → shadow). */
  grad: [string, string, string];
  /** Halo / accent colour. */
  accent: string;
  concepts: LithicConcept[];
}

/** Build a mini-planet's lessons: ids `li-<lang>-<mini>-l<n>`, concept id `lithic.<lang>.<mini>`. */
function module(lang: LithicLang, mini: string, name: string, sub: string, blurb: string, xp: number, lessons: [string, number][]): LithicConcept {
  const conceptId = `lithic.${lang}.${mini}`;
  return {
    id: conceptId, name, sub, blurb,
    lessons: lessons.map(([title, minutes], i) => ({
      id: `li-${lang}-${mini}-l${String(i + 1).padStart(2, '0')}`,
      conceptId: `${conceptId}.l${i + 1}`, number: i + 1, title, minutes, xp,
    })),
  };
}

/* ---------- Planet 01 · The Foundation · HTML (open) ---------- */
const FOUNDATION: LithicConcept[] = [
  module('html', 'stone', 'The First Stone', 'Mini-Planet 01 · bedrock', 'Lay the first stone: what HTML is, the shape of a document, and your first live page.', 120, [
    ['What is HTML?', 10], ['The document skeleton', 12], ['Elements & tags', 12], ['Attributes', 12], ['Your first webpage', 14],
  ]),
  module('html', 'walls', 'The Written Walls', 'Mini-Planet 02 · inscriptions', 'Raise the walls with text: headings, paragraphs, emphasis, comments, and special characters.', 130, [
    ['Headings', 10], ['Paragraphs & line breaks', 12], ['Text formatting', 14], ['Comments', 10], ['Entities & special characters', 12],
  ]),
  module('html', 'paths', 'The Passageways', 'Mini-Planet 03 · corridors', 'Cut the passageways: links, paths, images, navigation, and how files are organised.', 140, [
    ['Hyperlinks', 12], ['Relative & absolute paths', 14], ['Images', 14], ['Navigation menus', 14], ['Organising files', 12],
  ]),
  module('html', 'archives', 'The Archives', 'Mini-Planet 04 · catalogues', 'Shelve the archives: ordered, unordered and description lists, tables, and accessible data.', 150, [
    ['Unordered lists', 12], ['Ordered lists', 12], ['Description lists', 12], ['Tables', 16], ['Accessible tables', 16],
  ]),
  module('html', 'chambers', 'The Structural Chambers', 'Mini-Planet 05 · load-bearing', 'Frame the chambers: semantic HTML, header and footer, main/section/article, and landmarks.', 160, [
    ['Why semantic HTML?', 12], ['Header & footer', 12], ['main, section & article', 16], ['Navigation landmarks', 14], ['The document outline', 14],
  ]),
  module('html', 'control', 'The Control Room', 'Mini-Planet 06 · instruments', 'Wire the control room: forms, input types, labels, validation, and accessible controls.', 170, [
    ['The form element', 14], ['Input types', 16], ['Labels & fieldsets', 14], ['Validation attributes', 16], ['Accessible form design', 16],
  ]),
  module('html', 'living', 'The Living Structure', 'Mini-Planet 07 · the breathing shell', 'Bring it to life: media, embedding, responsive images, figures, and accessibility fundamentals.', 180, [
    ['Audio & video', 14], ['Embedding content', 14], ['Responsive images', 16], ['Figures & captions', 12], ['Accessibility best practices', 16],
  ]),
  module('html', 'grand', 'The Grand Construction', 'Mini-Planet 08 · the finished build', 'Assemble the grand construction: a multi-page, semantic, accessible site — your final HTML project.', 200, [
    ['Multi-page structure', 16], ['Shared navigation', 14], ['Semantic page layout', 18], ['A contact form', 16], ['Project: a complete website', 24],
  ]),
];

/* ---------- Planet 02 · The Crystal Matrix · DAX (sealed) ---------- */
const MATRIX: LithicConcept[] = [
  module('dax', 'firstcalc', 'The First Calculation', 'Mini-Planet 01 · seed crystal', 'Measures, calculated columns, data types, and basic aggregation in the tabular model.', 150, [
    ['What is DAX?', 12], ['Measures', 16], ['Calculated columns', 14], ['Data types', 12], ['Basic aggregation', 16],
  ]),
  module('dax', 'functions', 'The Crystal Functions', 'Mini-Planet 02 · facets', 'SUM, AVERAGE, COUNT, COUNTROWS, DISTINCTCOUNT and DIVIDE.', 160, [
    ['SUM & AVERAGE', 14], ['COUNT family', 14], ['COUNTROWS', 12], ['DISTINCTCOUNT', 12], ['DIVIDE & safe division', 14],
  ]),
  module('dax', 'context', 'The Context Chamber', 'Mini-Planet 03 · pressure', 'Row context, filter context, evaluation context, context transition and CALCULATE.', 180, [
    ['Row context', 16], ['Filter context', 18], ['Evaluation context', 16], ['Context transition', 18], ['Introducing CALCULATE', 18],
  ]),
  module('dax', 'core', 'The Analytical Core', 'Mini-Planet 04 · the deep seam', 'Iterators, time intelligence, and practical business-intelligence measures.', 200, [
    ['Iterators (SUMX)', 18], ['Variables', 14], ['Time intelligence', 20], ['RELATED & relationships', 16], ['A business measure', 20],
  ]),
];

/* ---------- Planet 03 · The Refinery · Power Query M (sealed) ---------- */
const REFINERY: LithicConcept[] = [
  module('m', 'raw', 'Raw Materials', 'Mini-Planet 01 · intake', 'Power Query and M, query structure, let/in, and basic values and types.', 150, [
    ['What is Power Query?', 12], ['The M language', 14], ['let / in expressions', 16], ['Values & types', 14], ['Your first query', 16],
  ]),
  module('m', 'extract', 'The Extraction Chamber', 'Mini-Planet 02 · sources', 'Data sources, tables, records and lists.', 160, [
    ['Data sources', 14], ['Tables', 16], ['Records', 14], ['Lists', 14], ['Navigating structured data', 16],
  ]),
  module('m', 'separate', 'The Separation Works', 'Mini-Planet 03 · sifting', 'Filtering, sorting, removing duplicates, replacing values and handling nulls.', 170, [
    ['Filtering rows', 14], ['Sorting', 12], ['Removing duplicates', 14], ['Replacing values', 14], ['Handling nulls', 16],
  ]),
  module('m', 'transform', 'The Transformation Engine', 'Mini-Planet 04 · refinement', 'Text, number and date functions, type conversions and conditional columns.', 190, [
    ['Text functions', 16], ['Number functions', 14], ['Date functions', 16], ['Type conversions', 14], ['Conditional columns', 18],
  ]),
];

export const PLANETS: LithicPlanet[] = [
  { id: 'foundation', n: '01', name: 'The Foundation', discipline: 'HTML', lang: 'html', status: 'open',
    blurb: 'Architecture and construction. Build a digital structure, element by element, in HTML.',
    x: 900, y: 880, R: 150, grad: ['#e6c877', '#c69a3e', '#7a5410'], accent: '#c69a3e', concepts: FOUNDATION },
  { id: 'matrix', n: '02', name: 'The Crystal Matrix', discipline: 'DAX', lang: 'dax', status: 'sealed',
    blurb: 'Analytical relationships and crystalline networks. The expression language of tabular models.',
    x: 1560, y: 650, R: 128, grad: ['#c9bce0', '#8A78A6', '#4e4368'], accent: '#8A78A6', concepts: MATRIX },
  { id: 'refinery', n: '03', name: 'The Refinery', discipline: 'Power Query M', lang: 'm', status: 'sealed',
    blurb: 'Extraction, cleaning and transformation. Refine raw data into shape with Power Query M.',
    x: 1840, y: 1180, R: 132, grad: ['#d79a6f', '#b06a3f', '#5c3418'], accent: '#b06a3f', concepts: REFINERY },
];

/* ---------- derived lookups ---------- */
export const ALL_LITHIC_CONCEPTS = PLANETS.flatMap((p) => p.concepts);
export const ALL_LITHIC_LESSONS = ALL_LITHIC_CONCEPTS.flatMap((c) => c.lessons);
export const planetById = (id: string) => PLANETS.find((p) => p.id === id);
export const lithicConceptById = (id: string) => ALL_LITHIC_CONCEPTS.find((c) => c.id === id);
export const lithicLessonById = (id: string) => ALL_LITHIC_LESSONS.find((l) => l.id === id);
export const planetOfConcept = (conceptId: string) => PLANETS.find((p) => p.concepts.some((c) => c.id === conceptId));
export const isLithicLang = (v: unknown): v is LithicLang => v === 'html' || v === 'dax' || v === 'm';

// Register every Lithic concept id (the mini-planet id and one per lesson) with the progression store so
// completions persist and validate. Eager import (see boot) guarantees this runs before stored progress is read.
registerConcepts(ALL_LITHIC_CONCEPTS.map((c) => c.id));
registerConcepts(ALL_LITHIC_LESSONS.map((l) => l.conceptId));
