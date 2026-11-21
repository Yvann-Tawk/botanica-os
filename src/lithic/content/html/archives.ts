// The Foundation · Mini-Planet 04 · The Archives — unordered, ordered and description lists, tables, and
// accessible tables.

import type { HtmlLesson } from '../types';

const L = (n: number, title: string, minutes: number, xp: number): Pick<HtmlLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-html-archives-l${String(n).padStart(2, '0')}`, conceptId: `lithic.html.archives.l${n}`, planetId: 'foundation', conceptKey: 'lithic.html.archives', number: n, title, minutes, xp,
});

const lesson01: HtmlLesson = {
  ...L(1, 'Unordered lists', 12, 150),
  objectives: ['Build an unordered list with <ul> and <li>', 'Know when order does not matter', 'Nest a list inside a list item'],
  discover: {
    heading: 'A bag of items',
    lede: 'An **unordered list** groups items whose order does not matter — a set of materials, features, tags. It is a `<ul>` containing one `<li>` per item. You can **nest** a `<ul>` inside an `<li>` to make sub-lists.',
    example: '<ul>\n  <li>Quartz</li>\n  <li>Feldspar\n    <ul>\n      <li>Orthoclase</li>\n      <li>Plagioclase</li>\n    </ul>\n  </li>\n  <li>Mica</li>\n</ul>',
    exampleNote: 'Each item is an `<li>`. The nested `<ul>` inside the second item makes a sub-list of feldspars.',
    tip: 'Only `<li>` may be a direct child of `<ul>`.',
  },
  experiment: { heading: 'List it out', lede: 'Build and nest a list.', steps: ['Make a `<ul>` of three `<li>`', 'Nest a `<ul>` inside one `<li>`', 'Keep items as siblings'], tip: 'Put the nested list inside the <li>, before its </li>.', starter: '<ul>\n  <li>One</li>\n  <li>Two</li>\n  <li>Three</li>\n</ul>\n' },
  practice: {
    heading: 'A materials list', lede: 'Build an unordered list of four materials, one of which has a nested sub-list of two items.',
    steps: ['A `<ul>` with four `<li>`', 'Inside one `<li>`, a nested `<ul>` of two `<li>`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'An unordered list', sel: 'ul', fail: 'Add a <ul>.' },
      { kind: 'count', label: 'At least six list items total', sel: 'li', min: 6 },
      { kind: 'has', label: 'A nested list', sel: 'li ul', fail: 'Nest a <ul> inside an <li>.' },
      { kind: 'count', label: 'The nested list has two items', sel: 'li ul li', min: 2 },
    ],
    hints: ['Four top-level items plus two nested = six `<li>`.', 'The nested `<ul>` goes inside an `<li>`.'],
  },
  challenge: {
    heading: 'A tag cloud', lede: 'Without help: a heading and an unordered list of at least five tags, with one item containing a nested list of three sub-tags.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading', sel: 'h1, h2' },
      { kind: 'has', label: 'An unordered list', sel: 'ul' },
      { kind: 'has', label: 'A nested list', sel: 'li ul' },
      { kind: 'count', label: 'At least eight items total', sel: 'li', min: 8 },
    ],
    hints: ['Five top-level + three nested = eight items.', 'Nest the sub-list inside one of the five items.'],
  },
  quiz: [
    { q: 'When is an unordered list right?', opts: ['When steps must happen in order', 'When item order does not matter', 'Only for navigation'], a: 1, why: 'Use <ul> when sequence is irrelevant.' },
    { q: 'What may be a direct child of <ul>?', opts: ['<p>', '<li>', '<div>'], a: 1, why: 'Only <li> elements belong directly inside a <ul>.' },
    { q: 'How do you nest a list?', opts: ['Put a <ul> inside an <li>', 'Put a <ul> inside a <ul>', 'Use <ol> instead'], a: 0, why: 'A nested list goes inside a list item.' },
  ],
  recap: {
    takeaways: ['`<ul>` + `<li>` makes an unordered list.', 'Use it when order does not matter.', 'Nest a `<ul>` inside an `<li>` for sub-lists.'],
    syntaxExamples: [{ label: 'Unordered list', code: '<ul>\n  <li>Item</li>\n</ul>' }],
    commonMistakes: [
      { mistake: 'Putting text or <p> directly in <ul>', why: 'Only <li> is valid there.', fix: 'Wrap content in <li>.' },
      { mistake: 'Nesting a <ul> as a sibling of <li>', why: 'The structure becomes invalid.', fix: 'Place the nested <ul> inside an <li>.' },
    ],
    knowledgeChecks: [{ q: 'Each item is a…', opts: ['<li>', '<ul>'], a: 0, why: 'Items are <li>; the list is <ul>.' }],
  },
  missions: [
    { id: 'li-html-archives-l01-seed', lessonId: 'li-html-archives-l01', tier: 'seed', title: 'Three items', objective: 'An unordered list of three.', expected: 'A <ul> with three <li>.', starter: '\n', hints: ['`<ul><li>…</li>…</ul>`'], xpReward: 15, checks: [{ kind: 'has', label: 'List', sel: 'ul' }, { kind: 'count', label: 'Three items', sel: 'li', min: 3 }] },
    { id: 'li-html-archives-l01-sprout', lessonId: 'li-html-archives-l01', tier: 'sprout', title: 'Nested', objective: 'A list with a nested sub-list.', expected: 'A <ul> and a nested <ul> inside an <li>.', starter: '\n', hints: ['Nested <ul> inside an <li>.'], xpReward: 30, checks: [{ kind: 'has', label: 'Nested list', sel: 'li ul' }, { kind: 'count', label: 'Five items', sel: 'li', min: 5 }] },
    { id: 'li-html-archives-l01-bloom', lessonId: 'li-html-archives-l01', tier: 'bloom', title: 'The taxonomy', objective: 'A two-level classification with a heading.', expected: 'A heading and a list with two separate nested sub-lists.', starter: '\n', hints: ['Two of the items each hold a nested list.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1, h2' }, { kind: 'count', label: 'Two nested lists', sel: 'li ul', min: 2 }, { kind: 'count', label: 'Many items', sel: 'li', min: 8 }] },
  ],
};

const lesson02: HtmlLesson = {
  ...L(2, 'Ordered lists', 12, 150),
  objectives: ['Build an ordered list with <ol>', 'Use start and type when needed', 'Choose ordered vs unordered by meaning'],
  discover: {
    heading: 'When sequence matters',
    lede: 'An **ordered list** is for steps or ranks — where sequence carries meaning. It is an `<ol>` of `<li>` items, numbered automatically. `start` changes the first number; `type` changes the marker (`1`, `a`, `A`, `i`, `I`). The numbers are generated, so never type them yourself.',
    example: '<ol>\n  <li>Survey the site</li>\n  <li>Take a core sample</li>\n  <li>Log the findings</li>\n</ol>\n<ol start="4" type="a">\n  <li>Review</li>\n</ol>',
    exampleNote: 'The first list numbers 1, 2, 3 automatically. The second starts at 4 and uses letters (so it shows “d”).',
    tip: 'Ordered = sequence matters. Let the browser number it.',
  },
  experiment: { heading: 'Number the steps', lede: 'Build an ordered list and tweak its numbering.', steps: ['Make an `<ol>` of three steps', 'Add `start="5"` to see it begin at 5', 'Try `type="A"`'], tip: 'Do not type the numbers into the text.', starter: '<ol>\n  <li>First</li>\n  <li>Second</li>\n  <li>Third</li>\n</ol>\n' },
  practice: {
    heading: 'A procedure', lede: 'Build an ordered list of four steps, then a second ordered list that continues the numbering.',
    steps: ['An `<ol>` with four `<li>`', 'A second `<ol>` with `start="5"`', 'Do not number the text yourself'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Two ordered lists', sel: 'ol', equals: 2, fail: 'Use two <ol> elements.' },
      { kind: 'count', label: 'At least five list items', sel: 'ol li', min: 5 },
      { kind: 'has', label: 'The second continues at 5', sel: 'ol[start="5"]', fail: 'Add start="5" to the second <ol>.' },
    ],
    hints: ['`<ol start="5">` makes a list begin at 5.', 'Numbers are automatic — leave them out of the text.'],
  },
  challenge: {
    heading: 'A ranked result', lede: 'Without help: an ordered list of a top-five ranking using letters (`type="a"` or `type="I"`), plus a short intro paragraph.', starter: '\n',
    checks: [
      { kind: 'has', label: 'An intro paragraph', sel: 'p' },
      { kind: 'has', label: 'An ordered list', sel: 'ol' },
      { kind: 'count', label: 'Five items', sel: 'ol li', min: 5 },
      { kind: 'has', label: 'A non-default marker type', sel: 'ol[type]', fail: 'Set a type (a, A, i, or I) on the <ol>.' },
    ],
    hints: ['`<ol type="I">` numbers with Roman numerals.', 'Five <li> inside the <ol>.'],
  },
  quiz: [
    { q: 'When should you use <ol>?', opts: ['For a set with no order', 'When sequence or rank matters', 'Only for recipes'], a: 1, why: 'Ordered lists convey sequence.' },
    { q: 'Who provides the numbers?', opts: ['You type them in the text', 'The browser generates them', 'A stylesheet is required'], a: 1, why: 'The browser numbers the items automatically.' },
    { q: 'What does start="4" do?', opts: ['Shows four items', 'Begins numbering at 4', 'Limits to four items'], a: 1, why: 'start sets the first number.' },
  ],
  recap: {
    takeaways: ['`<ol>` numbers items automatically.', '`start` and `type` adjust numbering and markers.', 'Choose ordered vs unordered by meaning, not looks.'],
    syntaxExamples: [{ label: 'Ordered list', code: '<ol start="2" type="a">\n  <li>Item</li>\n</ol>' }],
    commonMistakes: [
      { mistake: 'Typing the numbers into the <li> text', why: 'They duplicate the automatic markers.', fix: 'Let the <ol> number the items.' },
      { mistake: 'Using <ol> when order is irrelevant', why: 'It implies a sequence that is not there.', fix: 'Use <ul> for unordered sets.' },
    ],
    knowledgeChecks: [{ q: 'Ordered list element?', opts: ['<ul>', '<ol>'], a: 1, why: '<ol> is ordered.' }],
  },
  missions: [
    { id: 'li-html-archives-l02-seed', lessonId: 'li-html-archives-l02', tier: 'seed', title: 'Three steps', objective: 'An ordered list of three.', expected: 'An <ol> with three <li>.', starter: '\n', hints: ['`<ol><li>…</li>…</ol>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Ordered list', sel: 'ol' }, { kind: 'count', label: 'Three items', sel: 'ol li', min: 3 }] },
    { id: 'li-html-archives-l02-sprout', lessonId: 'li-html-archives-l02', tier: 'sprout', title: 'Continue', objective: 'A list that starts at a given number.', expected: 'An <ol> with a start attribute.', starter: '\n', hints: ['`<ol start="3">`'], xpReward: 30, checks: [{ kind: 'has', label: 'Start set', sel: 'ol[start]' }, { kind: 'count', label: 'Items', sel: 'ol li', min: 3 }] },
    { id: 'li-html-archives-l02-bloom', lessonId: 'li-html-archives-l02', tier: 'bloom', title: 'The ranked index', objective: 'A ranking with custom marker type and a heading.', expected: 'A heading, an <ol type>, and five items.', starter: '\n', hints: ['Use type="I" or type="a".'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1, h2' }, { kind: 'has', label: 'Typed list', sel: 'ol[type]' }, { kind: 'count', label: 'Five items', sel: 'ol li', min: 5 }] },
  ],
};

const lesson03: HtmlLesson = {
  ...L(3, 'Description lists', 12, 150),
  objectives: ['Build term/description pairs with <dl>, <dt>, <dd>', 'Use description lists for glossaries and metadata', 'Associate multiple descriptions with a term'],
  discover: {
    heading: 'Terms and their meanings',
    lede: 'A **description list** pairs terms with descriptions — perfect for glossaries, metadata, or specs. `<dl>` wraps it; `<dt>` is a term; `<dd>` is its description. A term can have several `<dd>`, and several `<dt>` can share one `<dd>`.',
    example: '<dl>\n  <dt>Hardness</dt>\n  <dd>7 on the Mohs scale</dd>\n  <dt>Colour</dt>\n  <dd>Violet</dd>\n  <dd>Sometimes pale lilac</dd>\n</dl>',
    exampleNote: 'Each `<dt>` is a term; the `<dd>`s after it are its descriptions. “Colour” here has two descriptions.',
    tip: 'Think “term: description”. Use it for data pairs, not for layout.',
  },
  experiment: { heading: 'Define it', lede: 'Build term/description pairs.', steps: ['A `<dl>` with two `<dt>`/`<dd>` pairs', 'Give one term a second `<dd>`', 'Keep terms and descriptions paired'], tip: '<dt> then one or more <dd>.', starter: '<dl>\n  <dt>Name</dt>\n  <dd>Amethyst</dd>\n  <dt>Group</dt>\n  <dd>Quartz</dd>\n</dl>\n' },
  practice: {
    heading: 'A specimen spec', lede: 'Build a description list of three properties, where one property has two descriptions.',
    steps: ['A `<dl>` with three `<dt>`', 'A `<dd>` after each term', 'One term gets a second `<dd>`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A description list', sel: 'dl', fail: 'Add a <dl>.' },
      { kind: 'count', label: 'Three terms', sel: 'dl dt', equals: 3 },
      { kind: 'count', label: 'At least four descriptions', sel: 'dl dd', min: 4, fail: 'One term should have two <dd>.' },
    ],
    hints: ['`<dt>Term</dt><dd>Description</dd>`.', 'Add an extra `<dd>` right after one term’s first `<dd>`.'],
  },
  challenge: {
    heading: 'A glossary', lede: 'Without help: a heading and a glossary of at least four terms, each with a description, where one term carries two descriptions.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading', sel: 'h1, h2' },
      { kind: 'has', label: 'A description list', sel: 'dl' },
      { kind: 'count', label: 'At least four terms', sel: 'dl dt', min: 4 },
      { kind: 'count', label: 'At least five descriptions', sel: 'dl dd', min: 5 },
    ],
    hints: ['Four `<dt>`, five `<dd>` (one term has two).', 'Keep every description after its term.'],
  },
  quiz: [
    { q: 'What is a <dl> for?', opts: ['Ordered steps', 'Term/description pairs', 'Navigation'], a: 1, why: 'Description lists pair terms with descriptions.' },
    { q: 'Which is the term?', opts: ['<dd>', '<dt>', '<li>'], a: 1, why: '<dt> is the term; <dd> is the description.' },
    { q: 'Can a term have two descriptions?', opts: ['No', 'Yes, two <dd> after one <dt>'], a: 1, why: 'A <dt> may be followed by multiple <dd>.' },
  ],
  recap: {
    takeaways: ['`<dl>` wraps term/description pairs.', '`<dt>` is a term; `<dd>` is a description.', 'A term may have several descriptions, and vice versa.'],
    syntaxExamples: [{ label: 'Description list', code: '<dl>\n  <dt>Term</dt>\n  <dd>Description</dd>\n</dl>' }],
    commonMistakes: [
      { mistake: 'Using <dl> for visual two-column layout', why: 'It misuses semantics meant for data pairs.', fix: 'Use <dl> only for genuine term/description pairs.' },
      { mistake: 'Wrapping each pair in an extra element', why: 'Browsers expect <dt>/<dd> directly in <dl>.', fix: 'Place <dt> and <dd> directly inside <dl>.' },
    ],
    knowledgeChecks: [{ q: 'Description element?', opts: ['<dt>', '<dd>'], a: 1, why: '<dd> is the description.' }],
  },
  missions: [
    { id: 'li-html-archives-l03-seed', lessonId: 'li-html-archives-l03', tier: 'seed', title: 'One pair', objective: 'A single term/description pair.', expected: 'A <dl> with one <dt> and one <dd>.', starter: '\n', hints: ['`<dl><dt>…</dt><dd>…</dd></dl>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Term', sel: 'dl dt' }, { kind: 'has', label: 'Description', sel: 'dl dd' }] },
    { id: 'li-html-archives-l03-sprout', lessonId: 'li-html-archives-l03', tier: 'sprout', title: 'Multi', objective: 'A term with two descriptions.', expected: 'A <dl> where a term has two <dd>.', starter: '\n', hints: ['Two <dd> after one <dt>.'], xpReward: 30, checks: [{ kind: 'count', label: 'Terms', sel: 'dl dt', min: 2 }, { kind: 'count', label: 'Descriptions', sel: 'dl dd', min: 3 }] },
    { id: 'li-html-archives-l03-bloom', lessonId: 'li-html-archives-l03', tier: 'bloom', title: 'The data sheet', objective: 'A titled spec sheet of five properties.', expected: 'A heading and a <dl> with at least five terms and six descriptions.', starter: '\n', hints: ['Five terms, one with two descriptions.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1, h2' }, { kind: 'count', label: 'Five terms', sel: 'dl dt', min: 5 }, { kind: 'count', label: 'Six descriptions', sel: 'dl dd', min: 6 }] },
  ],
};

const lesson04: HtmlLesson = {
  ...L(4, 'Tables', 16, 170),
  objectives: ['Build a table with rows and cells', 'Use <th> for header cells', 'Structure a table with thead and tbody'],
  discover: {
    heading: 'Rows and columns',
    lede: 'A table shows **data in a grid**. `<table>` wraps it; each `<tr>` is a row; `<td>` is a data cell; `<th>` is a header cell. Group the header row in `<thead>` and the data in `<tbody>`. Use tables for tabular data — never for page layout.',
    example: '<table>\n  <thead>\n    <tr><th>Mineral</th><th>Hardness</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Talc</td><td>1</td></tr>\n    <tr><td>Quartz</td><td>7</td></tr>\n  </tbody>\n</table>',
    exampleNote: 'The `<thead>` row uses `<th>` for column headers; each data row uses `<td>`. `<tbody>` holds the data rows.',
    tip: 'Tables are for data grids, not layout.',
  },
  experiment: { heading: 'Build a grid', lede: 'Make a small table.', steps: ['A `<table>` with a `<thead>` header row of `<th>`', 'A `<tbody>` with two data rows of `<td>`', 'Keep columns aligned'], tip: 'Header cells are <th>; data cells are <td>.', starter: '<table>\n  <thead><tr><th>Name</th><th>Value</th></tr></thead>\n  <tbody>\n    <tr><td>A</td><td>1</td></tr>\n    <tr><td>B</td><td>2</td></tr>\n  </tbody>\n</table>\n' },
  practice: {
    heading: 'A data table', lede: 'Build a table with a header row of three columns and three data rows.',
    steps: ['A `<thead>` row with three `<th>`', 'A `<tbody>` with three `<tr>` of three `<td>`', 'Use real column headers'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A table', sel: 'table', fail: 'Add a <table>.' },
      { kind: 'has', label: 'A header in thead', sel: 'thead th', fail: 'Put <th> header cells in a <thead>.' },
      { kind: 'count', label: 'Three header columns', sel: 'thead th', equals: 3 },
      { kind: 'count', label: 'Three data rows', sel: 'tbody tr', equals: 3 },
      { kind: 'count', label: 'Nine data cells', sel: 'tbody td', min: 9 },
    ],
    hints: ['Header: `<thead><tr><th>…</th>×3</tr></thead>`.', 'Each data row has three `<td>`.'],
  },
  challenge: {
    heading: 'A survey log', lede: 'Without help: a four-column table with a header row and at least four data rows, grouped with thead and tbody, under a heading.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading', sel: 'h1, h2' },
      { kind: 'count', label: 'Four header columns', sel: 'thead th', equals: 4 },
      { kind: 'count', label: 'Four data rows', sel: 'tbody tr', min: 4 },
      { kind: 'has', label: 'Uses tbody', sel: 'tbody', fail: 'Group data rows in <tbody>.' },
    ],
    hints: ['Four `<th>` in the header; each data row has four `<td>`.', 'Wrap data rows in `<tbody>`.'],
  },
  quiz: [
    { q: 'What is a header cell?', opts: ['<td>', '<th>', '<tr>'], a: 1, why: '<th> marks a header cell; <td> is a data cell.' },
    { q: 'What is <tr>?', opts: ['A table region', 'A table row', 'A header'], a: 1, why: '<tr> is a table row containing cells.' },
    { q: 'Should you use tables for page layout?', opts: ['Yes, always', 'No — only for tabular data'], a: 1, why: 'Tables are for data; layout is CSS’s job.' },
  ],
  recap: {
    takeaways: ['`<table>` + `<tr>` + `<td>`/`<th>` builds a data grid.', 'Group the header in `<thead>` and data in `<tbody>`.', 'Use tables for tabular data, not layout.'],
    syntaxExamples: [{ label: 'Table', code: '<table>\n  <thead><tr><th>H</th></tr></thead>\n  <tbody><tr><td>d</td></tr></tbody>\n</table>' }],
    commonMistakes: [
      { mistake: 'Using <td> for header cells', why: 'Headers lose their meaning for assistive tech.', fix: 'Use <th> for headers.' },
      { mistake: 'Using tables to position content', why: 'It is inaccessible and fragile.', fix: 'Use CSS for layout; tables for data.' },
    ],
    knowledgeChecks: [{ q: 'A row is…', opts: ['<tr>', '<td>'], a: 0, why: '<tr> is a table row.' }],
  },
  missions: [
    { id: 'li-html-archives-l04-seed', lessonId: 'li-html-archives-l04', tier: 'seed', title: 'A 2x2', objective: 'A small table with a header.', expected: 'A table with a header row and a data row.', starter: '\n', hints: ['One <th> row, one <td> row.'], xpReward: 15, checks: [{ kind: 'has', label: 'Table', sel: 'table' }, { kind: 'has', label: 'Header cell', sel: 'th' }, { kind: 'has', label: 'Data cell', sel: 'td' }] },
    { id: 'li-html-archives-l04-sprout', lessonId: 'li-html-archives-l04', tier: 'sprout', title: 'Structured', objective: 'A table with thead and tbody.', expected: 'A table with a thead header and two tbody rows.', starter: '\n', hints: ['Group header in <thead>, rows in <tbody>.'], xpReward: 30, checks: [{ kind: 'has', label: 'thead header', sel: 'thead th' }, { kind: 'count', label: 'Two data rows', sel: 'tbody tr', min: 2 }] },
    { id: 'li-html-archives-l04-bloom', lessonId: 'li-html-archives-l04', tier: 'bloom', title: 'The register', objective: 'A titled five-column table with several rows.', expected: 'A heading and a table with five header columns and at least four tbody rows.', starter: '\n', hints: ['Five <th>, four+ data rows.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1, h2' }, { kind: 'count', label: 'Five columns', sel: 'thead th', equals: 5 }, { kind: 'count', label: 'Four rows', sel: 'tbody tr', min: 4 }] },
  ],
};

const lesson05: HtmlLesson = {
  ...L(5, 'Accessible tables', 16, 180),
  objectives: ['Add a <caption> to a table', 'Scope header cells with scope', 'Make a table understandable to assistive tech'],
  discover: {
    heading: 'Tables everyone can read',
    lede: 'A data table becomes accessible when its structure is explicit. A `<caption>` names the table. `scope="col"` on a column header and `scope="row"` on a row header tell assistive tech which cells each header labels. With both, a screen reader can announce “Hardness, Quartz: 7”.',
    example: '<table>\n  <caption>Mohs hardness of common minerals</caption>\n  <thead>\n    <tr><th scope="col">Mineral</th><th scope="col">Hardness</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope="row">Quartz</th><td>7</td></tr>\n  </tbody>\n</table>',
    exampleNote: 'The `<caption>` titles the table. Column headers use `scope="col"`; the row header (the mineral name) uses `scope="row"`.',
    tip: 'Caption + scoped headers make a table self-describing.',
  },
  experiment: { heading: 'Make it accessible', lede: 'Add a caption and scopes.', steps: ['Add a `<caption>` to a table', 'Give column headers `scope="col"`', 'Make the first cell of each row a `<th scope="row">`'], tip: 'Row headers are <th scope="row">, not <td>.', starter: '<table>\n  <caption>Sample data</caption>\n  <thead><tr><th scope="col">Name</th><th scope="col">Value</th></tr></thead>\n  <tbody><tr><th scope="row">A</th><td>1</td></tr></tbody>\n</table>\n' },
  practice: {
    heading: 'An accessible grid', lede: 'Build a table with a caption, scoped column headers, and row headers for each data row.',
    steps: ['A `<caption>`', 'Column `<th scope="col">` in the header', 'Each data row begins with a `<th scope="row">`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A caption', sel: 'table caption', fail: 'Add a <caption>.' },
      { kind: 'has', label: 'Scoped column headers', sel: 'th[scope="col"]', fail: 'Add scope="col" to column headers.' },
      { kind: 'has', label: 'A scoped row header', sel: 'tbody th[scope="row"]', fail: 'Start each data row with <th scope="row">.' },
      { kind: 'count', label: 'At least two data rows', sel: 'tbody tr', min: 2 },
    ],
    hints: ['`<caption>` goes right after `<table>`.', 'Row header: `<tr><th scope="row">Name</th><td>…</td></tr>`.'],
  },
  challenge: {
    heading: 'The published table', lede: 'Without help: a fully accessible three-column table — a caption, scoped column headers, a scoped row header per row, at least three data rows — under a heading.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading', sel: 'h1, h2' },
      { kind: 'has', label: 'A caption', sel: 'table caption' },
      { kind: 'count', label: 'Scoped column headers', sel: 'th[scope="col"]', min: 3 },
      { kind: 'count', label: 'Scoped row headers', sel: 'tbody th[scope="row"]', min: 3 },
      { kind: 'count', label: 'Three data rows', sel: 'tbody tr', min: 3 },
    ],
    hints: ['Three `scope="col"` headers; one `scope="row"` per data row.', 'The caption titles the whole table.'],
  },
  quiz: [
    { q: 'What does <caption> do?', opts: ['Styles the table', 'Gives the table a title', 'Adds a footer'], a: 1, why: 'The caption names the table for everyone.' },
    { q: 'What does scope="col" mean?', opts: ['The header labels its column', 'The header labels its row', 'The column is hidden'], a: 0, why: 'scope="col" ties a header to its column.' },
    { q: 'A row’s label cell should be…', opts: ['<td>', '<th scope="row">'], a: 1, why: 'Row headers are <th scope="row">.' },
  ],
  recap: {
    takeaways: ['A `<caption>` titles the table.', '`scope="col"`/`scope="row"` associate headers with cells.', 'Row labels are `<th scope="row">`, not `<td>`.'],
    syntaxExamples: [{ label: 'Accessible table', code: '<table>\n  <caption>Title</caption>\n  <tr><th scope="col">H</th></tr>\n  <tr><th scope="row">R</th><td>d</td></tr>\n</table>' }],
    commonMistakes: [
      { mistake: 'No caption or scopes on a data table', why: 'Screen-reader users cannot tell which header labels which cell.', fix: 'Add a caption and scope attributes.' },
      { mistake: 'Using <td> for row labels', why: 'The row label loses its header role.', fix: 'Use <th scope="row"> for the first cell of each row.' },
    ],
    knowledgeChecks: [{ q: 'Column header scope?', opts: ['scope="col"', 'scope="row"'], a: 0, why: 'scope="col" for column headers.' }],
  },
  missions: [
    { id: 'li-html-archives-l05-seed', lessonId: 'li-html-archives-l05', tier: 'seed', title: 'Caption it', objective: 'Add a caption to a table.', expected: 'A table with a <caption>.', starter: '\n', hints: ['`<caption>…</caption>` after `<table>`.'], xpReward: 15, checks: [{ kind: 'has', label: 'Caption', sel: 'table caption' }, { kind: 'has', label: 'A cell', sel: 'td, th' }] },
    { id: 'li-html-archives-l05-sprout', lessonId: 'li-html-archives-l05', tier: 'sprout', title: 'Scoped', objective: 'Column and row header scopes.', expected: 'A table with scope="col" and scope="row" headers.', starter: '\n', hints: ['Add scope to the headers.'], xpReward: 30, checks: [{ kind: 'has', label: 'Col scope', sel: 'th[scope="col"]' }, { kind: 'has', label: 'Row scope', sel: 'th[scope="row"]' }] },
    { id: 'li-html-archives-l05-bloom', lessonId: 'li-html-archives-l05', tier: 'bloom', title: 'The accessible register', objective: 'A captioned, fully scoped four-column table with a heading.', expected: 'A heading, a caption, four scope="col" headers, a scope="row" per row, and three+ rows.', starter: '\n', hints: ['Caption + four col scopes + a row scope per row.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1, h2' }, { kind: 'has', label: 'Caption', sel: 'caption' }, { kind: 'count', label: 'Four col headers', sel: 'th[scope="col"]', min: 4 }, { kind: 'count', label: 'Row headers', sel: 'tbody th[scope="row"]', min: 3 }] },
  ],
};

export const ARCHIVES_LESSONS: HtmlLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
