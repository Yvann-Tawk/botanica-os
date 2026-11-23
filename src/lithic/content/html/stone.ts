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

const lesson02: HtmlLesson = {
  ...L(2, 'stone', 'The document skeleton', 12, 120),
  objectives: [
    'Name the parts of a complete HTML document',
    'Write a valid skeleton with a doctype, html, head and body',
    'Set the page title and character encoding',
  ],
  discover: {
    heading: 'Every page has a frame',
    lede: 'A real page is not just loose tags — it sits in a **skeleton**. `<!doctype html>` tells the browser to use modern rules. `<html>` wraps everything. `<head>` holds information *about* the page (its title, its character set); `<body>` holds what you actually see.',
    example: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>Field Notes</title>\n  </head>\n  <body>\n    <h1>Field Notes</h1>\n  </body>\n</html>',
    exampleNote: 'The `<title>` is what shows in the browser tab. `lang="en"` tells assistive tech the page is in English. `<meta charset="utf-8">` lets the page use any character.',
    tip: 'Head = about the page. Body = the page itself.',
  },
  experiment: {
    heading: 'Fill in the skeleton',
    lede: 'Change the title and the heading. The preview shows the body; the title shows on the tab in a real browser.',
    steps: ['Change the `<title>` text', 'Add a `<p>` inside the `<body>`', 'Keep the head and body separate'],
    tip: 'Content you can see goes in the body, never the head.',
    starter: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>My Page</h1>\n  </body>\n</html>\n',
  },
  practice: {
    heading: 'Build a complete document',
    lede: 'Write a full, valid HTML skeleton for a page about a mineral.',
    steps: ['Start with `<!doctype html>`', 'Add `<html lang="en">` wrapping a `<head>` and a `<body>`', 'In the head: a `<meta charset="utf-8">` and a `<title>`', 'In the body: an `<h1>`'],
    starter: '\n',
    checks: [
      { kind: 'doctype', label: 'Declares <!doctype html>' },
      { kind: 'has', label: 'Has an <html> element', sel: 'html' },
      { kind: 'attr', label: 'The <html> sets lang', sel: 'html', name: 'lang', present: true, fail: 'Add lang="en" to <html>.' },
      { kind: 'has', label: 'Has a <title>', sel: 'head title', fail: 'Put a <title> inside the <head>.' },
      { kind: 'text', label: 'The title is not empty', sel: 'title', nonEmpty: true },
      { kind: 'has', label: 'Has a <meta charset>', sel: 'meta[charset]', fail: 'Add <meta charset="utf-8"> in the head.' },
      { kind: 'has', label: 'The body has a heading', sel: 'body h1', fail: 'Put an <h1> in the <body>.' },
    ],
    hints: ['Copy the shape from Discover, then change the text.', 'The `<title>` and `<meta charset>` go in the `<head>`; the `<h1>` goes in the `<body>`.'],
  },
  challenge: {
    heading: 'A titled page',
    lede: 'Without help: build a complete document whose tab title is `Quartz` and whose visible heading is also `Quartz`, with a paragraph of description.',
    starter: '\n',
    checks: [
      { kind: 'doctype', label: 'Declares the doctype' },
      { kind: 'text', label: 'The <title> is “Quartz”', sel: 'title', equals: 'Quartz', fail: 'The <title> text should be Quartz.' },
      { kind: 'text', label: 'The <h1> is “Quartz”', sel: 'body h1', equals: 'Quartz' },
      { kind: 'has', label: 'Has a paragraph in the body', sel: 'body p' },
    ],
    hints: ['Both the title and the h1 say Quartz, but they live in different places (head vs body).', 'Head: `<title>Quartz</title>`. Body: `<h1>Quartz</h1><p>…</p>`.'],
  },
  quiz: [
    { q: 'Where does the <title> element belong?', opts: ['In the <body>', 'In the <head>', 'Before the doctype'], a: 1, why: 'The title is information about the page, so it lives in the head.' },
    { q: 'What does <!doctype html> do?', opts: ['Loads a stylesheet', 'Tells the browser to use modern (standards) rendering', 'Sets the page title'], a: 1, why: 'It opts the page into standards mode.' },
    { q: 'Which part holds what the visitor sees?', opts: ['<head>', '<body>', '<meta>'], a: 1, why: 'Visible content lives in the body.' },
  ],
  recap: {
    takeaways: [
      'A document is `<!doctype html>` + `<html>` wrapping `<head>` and `<body>`.',
      'The head holds information about the page; the body holds visible content.',
      '`<title>` names the tab; `<meta charset="utf-8">` sets the character encoding.',
      '`lang` on `<html>` states the page language.',
    ],
    syntaxExamples: [
      { label: 'Skeleton', code: '<!doctype html>\n<html lang="en">\n  <head>…</head>\n  <body>…</body>\n</html>' },
      { label: 'Head essentials', code: '<meta charset="utf-8">\n<title>Field Notes</title>' },
    ],
    commonMistakes: [
      { mistake: 'Putting visible content in the <head>', why: 'The browser will not display it.', fix: 'Only metadata in the head; everything you see goes in the body.' },
      { mistake: 'Forgetting the doctype', why: 'The browser may fall back to quirks mode and render inconsistently.', fix: 'Start every document with `<!doctype html>`.' },
    ],
    knowledgeChecks: [
      { q: 'What wraps both the head and the body?', opts: ['<page>', '<html>', '<doctype>'], a: 1, why: 'The <html> element is the root that contains both.' },
    ],
  },
  missions: [
    { id: 'li-html-stone-l02-seed', lessonId: 'li-html-stone-l02', tier: 'seed', title: 'Set the tab', objective: 'A valid document with a non-empty title.', expected: 'Doctype, html, head with a <title>, and a body.', starter: '\n', hints: ['Reuse the skeleton from Discover.'], xpReward: 15,
      checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'text', label: 'Title set', sel: 'title', nonEmpty: true }, { kind: 'has', label: 'Body present', sel: 'body' }] },
    { id: 'li-html-stone-l02-sprout', lessonId: 'li-html-stone-l02', tier: 'sprout', title: 'Fully formed', objective: 'A complete, valid skeleton with charset and lang.', expected: 'Doctype, <html lang>, <meta charset>, <title>, and a body heading.', starter: '\n', hints: ['Include <meta charset="utf-8"> and lang="en".'], xpReward: 30,
      checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'attr', label: 'html lang', sel: 'html', name: 'lang', present: true }, { kind: 'has', label: 'charset meta', sel: 'meta[charset]' }, { kind: 'has', label: 'body heading', sel: 'body h1' }] },
    { id: 'li-html-stone-l02-bloom', lessonId: 'li-html-stone-l02', tier: 'bloom', title: 'The specimen record', objective: 'A full page: title, heading, a description and a sub-heading with more detail.', expected: 'A valid document whose head has a title, and whose body has an <h1>, an <h2>, and at least two paragraphs.', starter: '\n', hints: ['Head: title. Body: h1, p, h2, p.'], xpReward: 50,
      checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'has', label: 'title', sel: 'head title' }, { kind: 'has', label: 'h1 in body', sel: 'body h1' }, { kind: 'has', label: 'h2 in body', sel: 'body h2' }, { kind: 'count', label: 'two paragraphs', sel: 'body p', min: 2 }] },
  ],
};

const lesson03: HtmlLesson = {
  ...L(3, 'stone', 'Elements & tags', 12, 120),
  objectives: [
    'Describe an element as an opening tag, content and a closing tag',
    'Nest elements correctly',
    'Use void elements like <br> and <hr> that have no closing tag',
  ],
  discover: {
    heading: 'Tags, elements and nesting',
    lede: 'A **tag** is the thing in angle brackets; an **element** is the opening tag, its content, and the closing tag together. Elements can **nest** inside one another — but they must close in the right order. A few elements are **void**: they have no content and no closing tag, like `<br>` (a line break) and `<hr>` (a thematic divider).',
    example: '<p>A <strong>faceted</strong> crystal.</p>\n<hr>\n<p>First line<br>second line</p>',
    exampleNote: '`<strong>` nests *inside* the paragraph. `<hr>` and `<br>` are void — no closing tag. Notice `<strong>` closes before the `</p>` that opened after it.',
    tip: 'Open last, close first: `<p><strong>…</strong></p>`, never `<p><strong>…</p></strong>`.',
  },
  experiment: {
    heading: 'Nest and break',
    lede: 'Add emphasis inside a paragraph, and split a line with `<br>`.',
    steps: ['Wrap a word in `<em>` inside a paragraph', 'Add a `<br>` to break a line', 'Add an `<hr>` between two paragraphs'],
    tip: '`<br>` and `<hr>` never get a closing tag.',
    starter: '<p>The <em>amethyst</em> seam runs deep.</p>\n<hr>\n<p>Found at level three<br>north gallery.</p>\n',
  },
  practice: {
    heading: 'Nest correctly',
    lede: 'Build a paragraph with emphasised text, a divider, and a two-line paragraph.',
    steps: ['A `<p>` containing a `<strong>` word', 'An `<hr>` divider', 'A second `<p>` with a `<br>` inside it'],
    starter: '\n',
    checks: [
      { kind: 'has', label: 'A paragraph contains <strong>', sel: 'p strong', fail: 'Put a <strong> inside a <p>.' },
      { kind: 'has', label: 'There is an <hr> divider', sel: 'hr' },
      { kind: 'has', label: 'A paragraph contains a <br>', sel: 'p br', fail: 'Put a <br> inside a <p>.' },
      { kind: 'count', label: 'There are two paragraphs', sel: 'p', min: 2 },
    ],
    hints: ['`<strong>` goes between `<p>` and `</p>`.', 'Example: `<p>A <strong>hard</strong> stone.</p><hr><p>Line one<br>line two.</p>`'],
  },
  challenge: {
    heading: 'A short bulletin',
    lede: 'Without help: write two paragraphs separated by a divider. The first must contain emphasised text (`<em>` or `<strong>`); the second must contain a line break.',
    starter: '\n',
    checks: [
      { kind: 'count', label: 'Two paragraphs', sel: 'p', equals: 2 },
      { kind: 'has', label: 'A divider between them', sel: 'hr' },
      { kind: 'has', label: 'Emphasis in a paragraph', sel: 'p :is(em, strong)', fail: 'Add <em> or <strong> inside a paragraph.' },
      { kind: 'has', label: 'A line break in a paragraph', sel: 'p br' },
    ],
    hints: ['`:is(em, strong)` just means “em or strong”.', 'Order: p (with em), hr, p (with br).'],
  },
  quiz: [
    { q: 'What makes up an element?', opts: ['Only an opening tag', 'An opening tag, content, and a closing tag', 'Two closing tags'], a: 1, why: 'Non-void elements have an opening tag, content, and a matching closing tag.' },
    { q: 'Which is a void element (no closing tag)?', opts: ['<p>', '<br>', '<strong>'], a: 1, why: '<br> is void — it has no content and no closing tag.' },
    { q: 'Which nesting is correct?', opts: ['<p><em>hi</p></em>', '<p><em>hi</em></p>', '<em><p>hi</em></p>'], a: 1, why: 'Inner elements must close before the outer element does.' },
  ],
  recap: {
    takeaways: [
      'A tag is in angle brackets; an element is opening tag + content + closing tag.',
      'Elements nest, and must close in reverse order of opening.',
      'Void elements (`<br>`, `<hr>`, `<img>`, `<meta>`) have no closing tag.',
    ],
    syntaxExamples: [
      { label: 'Nested emphasis', code: '<p>A <strong>hard</strong> stone.</p>' },
      { label: 'Void elements', code: '<hr>\nline one<br>line two' },
    ],
    commonMistakes: [
      { mistake: 'Crossing the nesting, like `<p><em>…</p></em>`', why: 'The browser has to guess what you meant and may render it wrong.', fix: 'Close the inner element first: `<p><em>…</em></p>`.' },
      { mistake: 'Writing `</br>`', why: '`<br>` is void; there is nothing to close.', fix: 'Just write `<br>`.' },
    ],
    knowledgeChecks: [
      { q: 'Does <hr> need a closing tag?', opts: ['Yes, </hr>', 'No, it is void'], a: 1, why: '<hr> is a void element with no closing tag.' },
    ],
  },
  missions: [
    { id: 'li-html-stone-l03-seed', lessonId: 'li-html-stone-l03', tier: 'seed', title: 'Emphasise', objective: 'A paragraph with an emphasised word.', expected: 'A <p> containing <em> or <strong>.', starter: '\n', hints: ['`<p>A <em>word</em>.</p>`'], xpReward: 15,
      checks: [{ kind: 'has', label: 'Emphasis in a paragraph', sel: 'p :is(em, strong)' }] },
    { id: 'li-html-stone-l03-sprout', lessonId: 'li-html-stone-l03', tier: 'sprout', title: 'Break and divide', objective: 'Two paragraphs with a divider and a line break.', expected: 'Two <p>, an <hr>, and a <br> inside a paragraph.', starter: '\n', hints: ['Use <hr> between paragraphs and <br> inside one.'], xpReward: 30,
      checks: [{ kind: 'count', label: 'Two paragraphs', sel: 'p', min: 2 }, { kind: 'has', label: 'Divider', sel: 'hr' }, { kind: 'has', label: 'Line break', sel: 'p br' }] },
    { id: 'li-html-stone-l03-bloom', lessonId: 'li-html-stone-l03', tier: 'bloom', title: 'The field note', objective: 'A richly marked-up note: a heading, and two paragraphs using emphasis, a line break and a divider.', expected: 'An <h1>, two paragraphs, emphasis, a <br>, and an <hr>.', starter: '\n', hints: ['Combine everything from this lesson.'], xpReward: 50,
      checks: [{ kind: 'has', label: 'Heading', sel: 'h1' }, { kind: 'count', label: 'Two paragraphs', sel: 'p', min: 2 }, { kind: 'has', label: 'Emphasis', sel: 'p :is(em, strong)' }, { kind: 'has', label: 'Line break', sel: 'p br' }, { kind: 'has', label: 'Divider', sel: 'hr' }] },
  ],
};

const lesson04: HtmlLesson = {
  ...L(4, 'stone', 'Attributes', 12, 120),
  objectives: [
    'Add attributes to elements with the name="value" syntax',
    'Use the global attributes id, class, title and lang',
    'Recognise boolean attributes',
  ],
  discover: {
    heading: 'Extra information on a tag',
    lede: 'An **attribute** adds information to an element, written inside its opening tag as `name="value"`. Some are **global** — they work on any element: `id` (a unique name), `class` (a reusable label), `title` (a tooltip), `lang` (language). Some attributes are **boolean**: their presence alone is enough, like `hidden`.',
    example: '<p id="intro" class="lead" title="The opening line">The survey begins here.</p>\n<p lang="la">Terra incognita</p>',
    exampleNote: '`id="intro"` names this one paragraph; `class="lead"` is a label you could reuse; `title` shows a tooltip on hover; `lang="la"` marks the text as Latin.',
    tip: 'An id must be unique on the page; a class can be used many times.',
  },
  experiment: {
    heading: 'Label your elements',
    lede: 'Add an id and a class, and a title you can hover in the preview.',
    steps: ['Give a paragraph an `id`', 'Give another paragraph a `class`', 'Add a `title` and hover it in the preview'],
    tip: 'Values go in quotes: `class="note"`.',
    starter: '<p id="lead" title="Hover me">The first paragraph.</p>\n<p class="note">A note.</p>\n',
  },
  practice: {
    heading: 'Name and label',
    lede: 'Build two paragraphs: one identified by id, one labelled by class, each carrying a title.',
    steps: ['A `<p>` with `id="summary"`', 'A `<p>` with `class="detail"`', 'Both should have a `title` attribute'],
    starter: '\n',
    checks: [
      { kind: 'has', label: 'A paragraph with id="summary"', sel: 'p#summary', fail: 'Add id="summary" to a paragraph.' },
      { kind: 'has', label: 'A paragraph with class="detail"', sel: 'p.detail', fail: 'Add class="detail" to a paragraph.' },
      { kind: 'attr', label: 'The summary has a title', sel: 'p#summary', name: 'title', present: true },
      { kind: 'attr', label: 'The detail has a title', sel: 'p.detail', name: 'title', present: true },
    ],
    hints: ['`<p id="summary" title="…">`', '`#summary` means the id summary; `.detail` means the class detail.'],
  },
  challenge: {
    heading: 'A labelled card',
    lede: 'Without help: make a heading with `id="title"`, and two paragraphs that share `class="line"`. The heading must also carry a `lang` attribute.',
    starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading with id="title"', sel: 'h1#title, h2#title' },
      { kind: 'attr', label: 'The heading sets lang', sel: '#title', name: 'lang', present: true },
      { kind: 'count', label: 'Two elements with class="line"', sel: '.line', equals: 2, fail: 'Give two paragraphs class="line".' },
    ],
    hints: ['A class can appear on more than one element.', '`<h1 id="title" lang="en">` then two `<p class="line">`.'],
  },
  quiz: [
    { q: 'How is an attribute written?', opts: ['name:value', 'name="value" inside the opening tag', 'value(name)'], a: 1, why: 'Attributes are name="value" pairs inside the opening tag.' },
    { q: 'What is true about id?', opts: ['It must be unique on the page', 'It can be reused freely', 'It only works on <div>'], a: 0, why: 'An id must be unique; class is the reusable one.' },
    { q: 'Which is a boolean attribute?', opts: ['class', 'hidden', 'title'], a: 1, why: 'hidden is boolean — its presence alone applies it.' },
  ],
  recap: {
    takeaways: [
      'Attributes add information inside the opening tag as `name="value"`.',
      '`id` is unique; `class` is reusable; `title` gives a tooltip; `lang` sets language.',
      'Boolean attributes (like `hidden`) need no value.',
    ],
    syntaxExamples: [
      { label: 'id and class', code: '<p id="intro" class="lead">…</p>' },
      { label: 'Boolean attribute', code: '<p hidden>not shown</p>' },
    ],
    commonMistakes: [
      { mistake: 'Reusing the same id twice', why: 'Ids must be unique; tools and links that target it break.', fix: 'Use a class when you need the same label more than once.' },
      { mistake: 'Leaving off the quotes', why: 'Values with spaces or special characters break without quotes.', fix: 'Always quote: `class="lead note"`.' },
    ],
    knowledgeChecks: [
      { q: 'Which can appear on many elements?', opts: ['id', 'class'], a: 1, why: 'A class is reusable; an id must be unique.' },
    ],
  },
  missions: [
    { id: 'li-html-stone-l04-seed', lessonId: 'li-html-stone-l04', tier: 'seed', title: 'Give it an id', objective: 'A paragraph identified by an id.', expected: 'A <p> with any id.', starter: '\n', hints: ['`<p id="note">…</p>`'], xpReward: 15,
      checks: [{ kind: 'has', label: 'A paragraph with an id', sel: 'p[id]' }] },
    { id: 'li-html-stone-l04-sprout', lessonId: 'li-html-stone-l04', tier: 'sprout', title: 'Classify', objective: 'Two paragraphs sharing a class, each with a title.', expected: 'Two elements with the same class, each with a title attribute.', starter: '\n', hints: ['Reuse one class on two paragraphs.'], xpReward: 30,
      checks: [{ kind: 'count', label: 'Two with class="note"', sel: '.note', equals: 2 }, { kind: 'attr', label: 'A note has a title', sel: '.note', name: 'title', present: true }] },
    { id: 'li-html-stone-l04-bloom', lessonId: 'li-html-stone-l04', tier: 'bloom', title: 'The tagged specimen', objective: 'A heading with a unique id and language, plus three classed paragraphs.', expected: 'A heading with id and lang, and three elements sharing one class.', starter: '\n', hints: ['One id on the heading, one class on three paragraphs.'], xpReward: 50,
      checks: [{ kind: 'has', label: 'Heading with id', sel: ':is(h1,h2)[id]' }, { kind: 'attr', label: 'Heading sets lang', sel: ':is(h1,h2)[id]', name: 'lang', present: true }, { kind: 'count', label: 'Three classed paragraphs', sel: 'p[class]', min: 3 }] },
  ],
};

const lesson05: HtmlLesson = {
  ...L(5, 'stone', 'Your first webpage', 14, 150),
  objectives: [
    'Combine the skeleton, elements and attributes into one page',
    'Structure a page with a heading, paragraphs and a divider',
    'Produce a valid, complete first webpage',
  ],
  discover: {
    heading: 'Putting the stone in place',
    lede: 'You now have every piece: the document **skeleton**, **elements** that nest, and **attributes** that label them. A first webpage brings them together — a valid document whose body has a clear heading and some paragraphs. This is the foundation every later lesson builds on.',
    example: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>Specimen: Amethyst</title>\n  </head>\n  <body>\n    <h1 id="name">Amethyst</h1>\n    <p class="lead">A violet variety of quartz.</p>\n    <hr>\n    <p>Found in the Crystal Matrix seam.</p>\n  </body>\n</html>',
    exampleNote: 'A real, complete page: a titled head, and a body with an identified heading, a lead paragraph, a divider and more detail.',
    tip: 'If it has a doctype, an html with head and body, a title and visible headings and paragraphs, it is a proper page.',
  },
  experiment: {
    heading: 'Make it yours',
    lede: 'Edit this page to describe a mineral of your choice — change the title, heading and paragraphs.',
    steps: ['Change the `<title>` and `<h1>`', 'Rewrite the paragraphs', 'Keep the structure valid'],
    tip: 'The title and the h1 can differ — the title is the tab, the h1 is on the page.',
    starter: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>Specimen</title>\n  </head>\n  <body>\n    <h1>Specimen</h1>\n    <p>Describe it here.</p>\n  </body>\n</html>\n',
  },
  practice: {
    heading: 'A complete specimen page',
    lede: 'Build a full webpage for a mineral: a valid document with a titled head and a structured body.',
    steps: ['A valid skeleton (doctype, html lang, head, body)', 'A `<title>` and a `<meta charset>` in the head', 'In the body: one `<h1>`, at least two `<p>`, and an `<hr>`'],
    starter: '\n',
    checks: [
      { kind: 'doctype', label: 'Declares the doctype' },
      { kind: 'attr', label: 'The <html> sets lang', sel: 'html', name: 'lang', present: true },
      { kind: 'has', label: 'A non-empty <title>', sel: 'title' },
      { kind: 'text', label: 'The title is not empty', sel: 'title', nonEmpty: true },
      { kind: 'has', label: 'A charset meta', sel: 'meta[charset]' },
      { kind: 'count', label: 'Exactly one <h1>', sel: 'body h1', equals: 1 },
      { kind: 'count', label: 'At least two paragraphs', sel: 'body p', min: 2 },
      { kind: 'has', label: 'A divider', sel: 'body hr' },
    ],
    hints: ['Start from the Discover example and replace the text.', 'Everything visible (h1, p, hr) goes in the body.'],
  },
  challenge: {
    heading: 'The bedrock page',
    lede: 'Without help: a complete, valid page with a tab title of `Field Notes`, a main heading, a lead paragraph given `class="lead"`, a divider, and a closing paragraph.',
    starter: '\n',
    checks: [
      { kind: 'doctype', label: 'Doctype' },
      { kind: 'text', label: 'Title is “Field Notes”', sel: 'title', equals: 'Field Notes' },
      { kind: 'has', label: 'A main heading', sel: 'body h1' },
      { kind: 'has', label: 'A lead paragraph with class="lead"', sel: 'p.lead' },
      { kind: 'has', label: 'A divider', sel: 'hr' },
      { kind: 'count', label: 'At least two paragraphs', sel: 'body p', min: 2 },
    ],
    hints: ['Title goes in the head; the class goes on a body paragraph.', 'Order in the body: h1, p.lead, hr, p.'],
  },
  quiz: [
    { q: 'A valid first page needs at least…', opts: ['Only an <h1>', 'A doctype, <html>, <head> with a title, and a <body>', 'A stylesheet'], a: 1, why: 'Those are the minimum parts of a complete document.' },
    { q: 'The visible heading of the page is…', opts: ['the <title>', 'an <h1> in the body', 'the charset'], a: 1, why: 'The <title> is the tab; the <h1> is the on-page heading.' },
    { q: 'Where does <hr> go?', opts: ['In the head', 'In the body', 'Outside <html>'], a: 1, why: 'A divider is visible content, so it goes in the body.' },
  ],
  recap: {
    takeaways: [
      'A first webpage combines the skeleton, nested elements, and attributes.',
      'The head carries the title and charset; the body carries headings, paragraphs and dividers.',
      'A valid page is the foundation every later HTML lesson builds on.',
    ],
    syntaxExamples: [
      { label: 'A complete page', code: '<!doctype html>\n<html lang="en">\n  <head><meta charset="utf-8"><title>…</title></head>\n  <body><h1>…</h1><p>…</p></body>\n</html>' },
    ],
    commonMistakes: [
      { mistake: 'Visible content in the head', why: 'It will not render.', fix: 'Move headings and paragraphs into the body.' },
      { mistake: 'More than one <h1> used as the page title', why: 'The main page heading should be singular and clear.', fix: 'Use one <h1>; use <h2> for sub-headings (next mini-planet).' },
    ],
    knowledgeChecks: [
      { q: 'Which is the tab name?', opts: ['<h1>', '<title>'], a: 1, why: 'The <title> shows in the browser tab.' },
    ],
  },
  missions: [
    { id: 'li-html-stone-l05-seed', lessonId: 'li-html-stone-l05', tier: 'seed', title: 'A real page', objective: 'A valid document with a title and a body heading.', expected: 'Doctype, html, head with title, body with an <h1>.', starter: '\n', hints: ['Reuse the skeleton and add an <h1>.'], xpReward: 15,
      checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'has', label: 'Title', sel: 'title' }, { kind: 'has', label: 'Body heading', sel: 'body h1' }] },
    { id: 'li-html-stone-l05-sprout', lessonId: 'li-html-stone-l05', tier: 'sprout', title: 'Structured', objective: 'A page with a heading, two paragraphs and a divider.', expected: 'A valid page whose body has an <h1>, two <p> and an <hr>.', starter: '\n', hints: ['Body: h1, p, hr, p.'], xpReward: 30,
      checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'count', label: 'One h1', sel: 'body h1', equals: 1 }, { kind: 'count', label: 'Two paragraphs', sel: 'body p', min: 2 }, { kind: 'has', label: 'Divider', sel: 'hr' }] },
    { id: 'li-html-stone-l05-bloom', lessonId: 'li-html-stone-l05', tier: 'bloom', title: 'The complete specimen sheet', objective: 'A polished page: titled head, identified heading, a lead paragraph and a detail section with a sub-heading.', expected: 'A valid page with a title, an <h1 id>, a class="lead" paragraph, an <h2>, and at least three paragraphs total.', starter: '\n', hints: ['Combine the skeleton, ids/classes, and headings.', 'Body: h1#name, p.lead, hr, h2, p, p.'], xpReward: 50,
      checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'has', label: 'Title', sel: 'title' }, { kind: 'has', label: 'Identified heading', sel: 'body h1[id]' }, { kind: 'has', label: 'Lead paragraph', sel: 'p.lead' }, { kind: 'has', label: 'Sub-heading', sel: 'body h2' }, { kind: 'count', label: 'Three paragraphs', sel: 'body p', min: 3 }] },
  ],
};

export const STONE_LESSONS: HtmlLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
