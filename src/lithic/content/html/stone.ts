// The Foundation · Mini-Planet 01 · The First Stone — HTML bedrock. Five lessons: what HTML is, the document
// skeleton, elements & tags, attributes, and a first complete webpage. Each has the full five-stage arc, a
// recap, and three optional missions, validated by the DOM-based HtmlCheck engine.

import type { HtmlLesson } from '../types';

const L = (n: number, mini: string, title: string, minutes: number, xp: number): Pick<HtmlLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-html-${mini}-l${String(n).padStart(2, '0')}`, conceptId: `lithic.html.${mini}.l${n}`, planetId: 'foundation', conceptKey: `lithic.html.${mini}`, number: n, title, minutes, xp,
});

const lesson01: HtmlLesson = {
  ...L(1, 'stone', 'What is HTML?', 10, 120),
  objectives: [
    'Explain what HTML is and what it is for',
    'Recognise an HTML element made of an opening tag, content and a closing tag',
    'Write your first heading and paragraph',
  ],
  discover: {
    heading: 'The language of structure',
    lede: 'HTML — **HyperText Markup Language** — is how every web page is built. It does not style or animate; it **names the parts** of a page so a browser knows what each piece *is*: a heading, a paragraph, a link, an image. You write that meaning with **tags** wrapped in angle brackets.',
    example: '<h1>The Lithic Shelf</h1>\n<p>A survey of the world beneath.</p>',
    exampleNote: '`<h1>` marks the main heading; `<p>` marks a paragraph. The browser shows the h1 big and bold not because you said so, but because you told it *this text is the top heading*.',
    tip: 'Markup describes meaning. Appearance comes later, from CSS.',
  },
  experiment: {
    heading: 'Try it in the preview',
    lede: 'Type HTML on the left; the sandboxed preview updates as you go. Change the words between the tags and watch the page change.',
    steps: ['Edit the heading text inside `<h1>…</h1>`', 'Add a second paragraph below the first', 'Notice the preview re-render as you type'],
    tip: 'Nothing you write here can affect the app — it renders in a sealed sandbox.',
    starter: '<h1>Hello, Lithic</h1>\n<p>This is my first page.</p>\n',
  },
  practice: {
    heading: 'A heading and a paragraph',
    lede: 'Build the smallest real page: one main heading and one paragraph beneath it.',
    steps: ['Add an `<h1>` whose text is `Field Notes`', 'Below it, add a `<p>` with any sentence you like'],
    starter: '<!-- Write your heading and paragraph here -->\n',
    checks: [
      { kind: 'has', label: 'There is an <h1> heading', sel: 'h1', fail: 'Add a heading: <h1>Field Notes</h1>.' },
      { kind: 'text', label: 'The heading reads “Field Notes”', sel: 'h1', equals: 'Field Notes', fail: 'The <h1> text should be exactly Field Notes.' },
      { kind: 'has', label: 'There is a paragraph', sel: 'p', fail: 'Add a <p> with a sentence.' },
      { kind: 'text', label: 'The paragraph is not empty', sel: 'p', nonEmpty: true },
      { kind: 'order', label: 'The heading comes before the paragraph', before: 'h1', after: 'p', fail: 'Put the <h1> above the <p>.' },
    ],
    hints: ['A heading is `<h1>text</h1>`; a paragraph is `<p>text</p>`.', 'Write the `<h1>` line first, then the `<p>` line below it.'],
  },
  challenge: {
    heading: 'A tiny specimen card',
    lede: 'Without step-by-step help: make a page with a main heading and **two** paragraphs describing a mineral — its name and where it was found.',
    starter: '\n',
    checks: [
      { kind: 'has', label: 'There is exactly one <h1>', sel: 'h1' },
      { kind: 'count', label: 'There is exactly one heading', sel: 'h1', equals: 1, fail: 'Use a single <h1> for the title.' },
      { kind: 'count', label: 'There are two paragraphs', sel: 'p', equals: 2, fail: 'Add two <p> elements.' },
      { kind: 'text', label: 'The heading is not empty', sel: 'h1', nonEmpty: true },
    ],
    hints: ['One `<h1>`, then two `<p>` lines.', 'Example: `<h1>Amethyst</h1><p>A violet quartz.</p><p>Found in the Matrix seam.</p>`'],
  },
  quiz: [
    { q: 'What does HTML describe about a page?', opts: ['Its colours and fonts', 'The meaning and structure of its parts', 'How fast it loads'], a: 1, why: 'HTML names what each part is; CSS handles appearance.' },
    { q: 'Which is a correctly formed paragraph element?', opts: ['<p>Hello<p>', '<p>Hello</p>', '<paragraph>Hello</paragraph>'], a: 1, why: 'An element is an opening tag, content, and a matching closing tag with a slash.' },
    { q: 'Why does an <h1> appear large and bold by default?', opts: ['Because you set its size', 'Because the browser styles the top heading that way', 'Because h1 means “huge”'], a: 1, why: 'The tag conveys meaning; the browser applies default styling to it.' },
  ],
  recap: {
    takeaways: [
      'HTML marks up content to give it meaning and structure.',
      'An element is an opening tag, content, and a closing tag: `<p>…</p>`.',
      '`<h1>` is the main heading; `<p>` is a paragraph.',
      'Appearance is CSS’s job, not HTML’s.',
    ],
    syntaxExamples: [
      { label: 'Main heading', code: '<h1>Field Notes</h1>' },
      { label: 'Paragraph', code: '<p>A sentence of text.</p>' },
    ],
    commonMistakes: [
      { mistake: 'Forgetting the closing tag', why: 'The browser keeps reading your text as part of the element.', fix: 'Always close it: `<p>…</p>`.' },
      { mistake: 'Using the wrong slash, like `</ p>` or `<p/>`', why: 'The closing tag must be `</p>` — slash first, no space.', fix: 'Open with `<p>`, close with `</p>`.' },
    ],
    knowledgeChecks: [
      { q: 'What goes between an opening and closing tag?', opts: ['The element’s content', 'Nothing', 'Only other tags'], a: 0, why: 'Content — text or other elements — lives between the tags.' },
    ],
  },
  missions: [
    { id: 'li-html-stone-l01-seed', lessonId: 'li-html-stone-l01', tier: 'seed', title: 'Name the specimen', objective: 'Write a single heading.', expected: 'A page with one <h1> containing a mineral name.', starter: '\n', hints: ['`<h1>Quartz</h1>`'], xpReward: 15,
      checks: [{ kind: 'has', label: 'One <h1>', sel: 'h1' }, { kind: 'text', label: 'Heading not empty', sel: 'h1', nonEmpty: true }] },
    { id: 'li-html-stone-l01-sprout', lessonId: 'li-html-stone-l01', tier: 'sprout', title: 'A short entry', objective: 'A heading and two paragraphs.', expected: 'One <h1> and two <p> paragraphs.', starter: '\n', hints: ['One heading, then two paragraph lines.'], xpReward: 30,
      checks: [{ kind: 'count', label: 'One heading', sel: 'h1', equals: 1 }, { kind: 'count', label: 'Two paragraphs', sel: 'p', equals: 2 }] },
    { id: 'li-html-stone-l01-bloom', lessonId: 'li-html-stone-l01', tier: 'bloom', title: 'The field page', objective: 'A fuller page: heading, intro paragraph, and a sub-heading with its own paragraph.', expected: 'An <h1>, an <h2>, and at least two <p> elements, heading first.', starter: '\n', hints: ['`<h2>` is a sub-heading, smaller than `<h1>`.', 'Order: h1, p, h2, p.'], xpReward: 50,
      checks: [
        { kind: 'has', label: 'A main heading', sel: 'h1' },
        { kind: 'has', label: 'A sub-heading', sel: 'h2' },
        { kind: 'count', label: 'At least two paragraphs', sel: 'p', min: 2 },
        { kind: 'order', label: 'Main heading first', before: 'h1', after: 'h2' },
      ] },
  ],
};

export const STONE_LESSONS: HtmlLesson[] = [lesson01];
