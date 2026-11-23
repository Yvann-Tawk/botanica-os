// The Foundation · Mini-Planet 02 · The Written Walls — HTML text. Five lessons: headings and hierarchy,
// paragraphs & line breaks, text formatting, comments, and entities & special characters.

import type { HtmlLesson } from '../types';

const L = (n: number, title: string, minutes: number, xp: number): Pick<HtmlLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-html-walls-l${String(n).padStart(2, '0')}`, conceptId: `lithic.html.walls.l${n}`, planetId: 'foundation', conceptKey: 'lithic.html.walls', number: n, title, minutes, xp,
});

const lesson01: HtmlLesson = {
  ...L(1, 'Headings', 10, 130),
  objectives: ['Use the six heading levels h1–h6', 'Build a logical heading hierarchy', 'Use one h1 as the page title'],
  discover: {
    heading: 'Six levels of heading',
    lede: 'HTML has six headings, `<h1>` to `<h6>`. They are not font sizes — they are **levels of a document outline**. `<h1>` is the page’s single main title; `<h2>` marks major sections; `<h3>` marks sub-sections, and so on. Screen readers let people jump between them, so the order matters.',
    example: '<h1>The Lithic Shelf</h1>\n<h2>The Foundation</h2>\n<h3>The First Stone</h3>\n<h2>The Crystal Matrix</h2>',
    exampleNote: 'One `<h1>`, then `<h2>` sections, with `<h3>` nested under a section. Never skip a level for looks.',
    tip: 'Think outline, not font size.',
  },
  experiment: { heading: 'Build an outline', lede: 'Arrange headings into a small outline.', steps: ['Keep a single `<h1>`', 'Add two `<h2>` sections', 'Nest an `<h3>` under one section'], tip: 'Do not jump from h1 straight to h3.', starter: '<h1>Survey</h1>\n<h2>Minerals</h2>\n<h3>Quartz</h3>\n<h2>Methods</h2>\n' },
  practice: {
    heading: 'A three-level outline', lede: 'Build a page outline with one title, two sections, and a sub-section.',
    steps: ['One `<h1>`', 'Two `<h2>` headings', 'One `<h3>` after an `<h2>`'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Exactly one <h1>', sel: 'h1', equals: 1, fail: 'Use a single <h1>.' },
      { kind: 'count', label: 'Two <h2> sections', sel: 'h2', equals: 2 },
      { kind: 'has', label: 'An <h3> sub-section', sel: 'h3' },
      { kind: 'order', label: 'The h1 comes first', before: 'h1', after: 'h2' },
    ],
    hints: ['One h1, then two h2, with an h3 under a section.', '`<h1>…</h1><h2>…</h2><h3>…</h3><h2>…</h2>`'],
  },
  challenge: {
    heading: 'A report outline', lede: 'Without help: a report with one title, three sections, and at least one sub-section under a section.', starter: '\n',
    checks: [
      { kind: 'count', label: 'One <h1>', sel: 'h1', equals: 1 },
      { kind: 'count', label: 'Three <h2>', sel: 'h2', equals: 3 },
      { kind: 'has', label: 'At least one <h3>', sel: 'h3' },
      { kind: 'order', label: 'Title before sections', before: 'h1', after: 'h2' },
    ],
    hints: ['Three h2 sections, one with an h3 under it.', 'Keep exactly one h1.'],
  },
  quiz: [
    { q: 'How many <h1> should a page normally have?', opts: ['As many as you like', 'One', 'Exactly six'], a: 1, why: 'One h1 gives a single clear page title.' },
    { q: 'Headings mainly convey…', opts: ['font size', 'document structure/outline', 'colour'], a: 1, why: 'They define the outline; appearance is CSS.' },
    { q: 'After an <h2>, a deeper sub-heading should be…', opts: ['<h4>', '<h3>', '<h1>'], a: 1, why: 'Go one level deeper, h2 → h3, without skipping.' },
  ],
  recap: {
    takeaways: ['`<h1>`–`<h6>` are outline levels, not sizes.', 'Use one `<h1>` per page.', 'Do not skip levels (h1 → h3) just for appearance.'],
    syntaxExamples: [{ label: 'Hierarchy', code: '<h1>Title</h1>\n<h2>Section</h2>\n<h3>Sub-section</h3>' }],
    commonMistakes: [
      { mistake: 'Choosing a heading by how big it looks', why: 'It breaks the outline screen readers rely on.', fix: 'Pick the level by meaning, style with CSS later.' },
      { mistake: 'Several <h1> elements', why: 'The page loses a single clear title.', fix: 'One h1; use h2+ for sections.' },
    ],
    knowledgeChecks: [{ q: 'Which is the top level?', opts: ['<h6>', '<h1>'], a: 1, why: 'h1 is the highest level.' }],
  },
  missions: [
    { id: 'li-html-walls-l01-seed', lessonId: 'li-html-walls-l01', tier: 'seed', title: 'Title and section', objective: 'An h1 and an h2.', expected: 'One h1 followed by an h2.', starter: '\n', hints: ['`<h1>…</h1><h2>…</h2>`'], xpReward: 15, checks: [{ kind: 'count', label: 'One h1', sel: 'h1', equals: 1 }, { kind: 'has', label: 'An h2', sel: 'h2' }] },
    { id: 'li-html-walls-l01-sprout', lessonId: 'li-html-walls-l01', tier: 'sprout', title: 'Nested outline', objective: 'Title, two sections, one sub-section.', expected: 'One h1, two h2, one h3.', starter: '\n', hints: ['h1, h2, h3, h2.'], xpReward: 30, checks: [{ kind: 'count', label: 'One h1', sel: 'h1', equals: 1 }, { kind: 'count', label: 'Two h2', sel: 'h2', equals: 2 }, { kind: 'has', label: 'An h3', sel: 'h3' }] },
    { id: 'li-html-walls-l01-bloom', lessonId: 'li-html-walls-l01', tier: 'bloom', title: 'Deep outline', objective: 'A four-level outline.', expected: 'h1, then h2, h3 and h4 appearing in order.', starter: '\n', hints: ['Go one level at a time down to h4.'], xpReward: 50, checks: [{ kind: 'has', label: 'h1', sel: 'h1' }, { kind: 'has', label: 'h2', sel: 'h2' }, { kind: 'has', label: 'h3', sel: 'h3' }, { kind: 'has', label: 'h4', sel: 'h4' }, { kind: 'order', label: 'h1 before h4', before: 'h1', after: 'h4' }] },
  ],
};

const lesson02: HtmlLesson = {
  ...L(2, 'Paragraphs & line breaks', 12, 130),
  objectives: ['Write paragraphs with <p>', 'Understand that HTML collapses whitespace', 'Use <br> for meaningful line breaks only'],
  discover: {
    heading: 'Text that flows',
    lede: 'Body text lives in paragraphs: `<p>…</p>`. HTML **collapses whitespace** — many spaces or new lines in your source become a single space on the page — so you cannot format text just by pressing Enter. For a genuine line break within a block (an address, a verse), use the void `<br>`.',
    example: '<p>Collected on the\n   north face. Weather fair.</p>\n<p>Level three<br>north gallery<br>04:12</p>',
    exampleNote: 'The first paragraph’s source spans lines and spaces, but renders as one flowing line. The second uses `<br>` where the break is part of the content.',
    tip: 'New paragraph? Use `<p>`. Line break inside one? Use `<br>` — sparingly.',
  },
  experiment: { heading: 'Flow vs break', lede: 'See whitespace collapse, then add real breaks.', steps: ['Add extra spaces and new lines inside a `<p>` — notice they collapse', 'Add a `<br>` where a break is meaningful', 'Split text into two `<p>` paragraphs'], tip: 'Two <p> make two blocks; <br> breaks a line within one.', starter: '<p>One   two    three</p>\n<p>Alpha<br>Beta</p>\n' },
  practice: {
    heading: 'Two paragraphs and an address', lede: 'Write two flowing paragraphs, then a block with meaningful line breaks.',
    steps: ['Two `<p>` paragraphs of a sentence each', 'A third `<p>` that uses two `<br>` to lay out three short lines'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Three paragraphs', sel: 'p', equals: 3 },
      { kind: 'count', label: 'Two line breaks total', sel: 'br', min: 2 },
      { kind: 'has', label: 'A paragraph contains the breaks', sel: 'p br' },
    ],
    hints: ['Two normal paragraphs, then one with `<br>` between short lines.', '`<p>Line one<br>line two<br>line three</p>`'],
  },
  challenge: {
    heading: 'A log entry', lede: 'Without help: an intro paragraph, then a paragraph laid out as four short lines using line breaks.', starter: '\n',
    checks: [
      { kind: 'count', label: 'At least two paragraphs', sel: 'p', min: 2 },
      { kind: 'count', label: 'Three line breaks', sel: 'br', min: 3 },
      { kind: 'has', label: 'Breaks inside a paragraph', sel: 'p br' },
    ],
    hints: ['Four short lines need three `<br>`.', 'Keep the breaks inside one paragraph.'],
  },
  quiz: [
    { q: 'What happens to several spaces in your HTML source?', opts: ['They are preserved exactly', 'They collapse to a single space', 'They cause an error'], a: 1, why: 'HTML collapses runs of whitespace to one space.' },
    { q: 'When should you use <br>?', opts: ['To space out paragraphs', 'For a meaningful line break within a block', 'Instead of <p>'], a: 1, why: 'Use <br> only where the break is part of the content.' },
    { q: 'How do you start a new block of text?', opts: ['Two <br>', 'A new <p>', 'Press Enter twice'], a: 1, why: 'A new paragraph is a new <p> element.' },
  ],
  recap: {
    takeaways: ['Paragraphs are `<p>…</p>`.', 'HTML collapses source whitespace to a single space.', 'Use `<br>` only for meaningful breaks, not for spacing.'],
    syntaxExamples: [{ label: 'Paragraph + break', code: '<p>A line<br>next line</p>' }],
    commonMistakes: [
      { mistake: 'Using many <br> to add vertical space', why: 'It mixes content with layout and is fragile.', fix: 'Use separate <p> blocks (and CSS for spacing later).' },
      { mistake: 'Expecting source line breaks to show', why: 'HTML collapses them.', fix: 'Use <p> or <br> to control breaks.' },
    ],
    knowledgeChecks: [{ q: 'Does <br> need closing?', opts: ['Yes', 'No, it is void'], a: 1, why: '<br> is a void element.' }],
  },
  missions: [
    { id: 'li-html-walls-l02-seed', lessonId: 'li-html-walls-l02', tier: 'seed', title: 'Two blocks', objective: 'Two paragraphs.', expected: 'Two <p> elements.', starter: '\n', hints: ['Two <p> lines.'], xpReward: 15, checks: [{ kind: 'count', label: 'Two paragraphs', sel: 'p', equals: 2 }] },
    { id: 'li-html-walls-l02-sprout', lessonId: 'li-html-walls-l02', tier: 'sprout', title: 'Lined up', objective: 'A paragraph with three lines via breaks.', expected: 'A <p> containing two <br>.', starter: '\n', hints: ['Three lines need two <br>.'], xpReward: 30, checks: [{ kind: 'has', label: 'Paragraph', sel: 'p' }, { kind: 'count', label: 'Two breaks', sel: 'p br', min: 2 }] },
    { id: 'li-html-walls-l02-bloom', lessonId: 'li-html-walls-l02', tier: 'bloom', title: 'The dispatch', objective: 'An intro paragraph plus an address block of four lines.', expected: 'At least two paragraphs; one has three <br>.', starter: '\n', hints: ['Intro <p>, then an address <p> with three breaks.'], xpReward: 50, checks: [{ kind: 'count', label: 'Two paragraphs', sel: 'p', min: 2 }, { kind: 'count', label: 'Three breaks', sel: 'p br', min: 3 }] },
  ],
};

const lesson03: HtmlLesson = {
  ...L(3, 'Text formatting', 14, 140),
  objectives: ['Mark importance with <strong> and emphasis with <em>', 'Show code with <code>', 'Prefer meaning over appearance'],
  discover: {
    heading: 'Meaningful emphasis',
    lede: 'Formatting tags carry **meaning**, not just looks. `<strong>` marks text as important; `<em>` marks stressed emphasis; `<code>` marks a fragment of code; `<mark>` highlights relevant text. Prefer these over the purely visual `<b>` and `<i>`, because assistive tech conveys their meaning.',
    example: '<p>Handle <strong>with care</strong>: the crystal is <em>fragile</em>.</p>\n<p>Run <code>survey --deep</code> to begin.</p>',
    exampleNote: '`<strong>` = importance, `<em>` = emphasis, `<code>` = code. A screen reader can announce these differently.',
    tip: 'Choose the tag for what the text *means*, not how you want it to look.',
  },
  experiment: { heading: 'Mark it up', lede: 'Add importance, emphasis and code.', steps: ['Wrap an important phrase in `<strong>`', 'Stress a word with `<em>`', 'Show a command with `<code>`'], tip: '<code> is great for file names and commands.', starter: '<p>This is <strong>important</strong> and <em>urgent</em>.</p>\n<p>Open <code>index.html</code>.</p>\n' },
  practice: {
    heading: 'Three kinds of meaning', lede: 'Build a paragraph using importance, emphasis and code.',
    steps: ['A `<strong>` for importance', 'An `<em>` for emphasis', 'A `<code>` fragment'], starter: '<p>Edit this sentence.</p>\n',
    checks: [
      { kind: 'has', label: 'Uses <strong>', sel: 'strong', fail: 'Add a <strong> for importance.' },
      { kind: 'has', label: 'Uses <em>', sel: 'em' },
      { kind: 'has', label: 'Uses <code>', sel: 'code' },
      { kind: 'text', label: 'The <code> is not empty', sel: 'code', nonEmpty: true },
    ],
    hints: ['`<strong>important</strong>`, `<em>stressed</em>`, `<code>file.html</code>`.', 'All three can live in one paragraph.'],
  },
  challenge: {
    heading: 'A tooltipped instruction', lede: 'Without help: a paragraph that marks an important warning, emphasises one word, highlights a term with `<mark>`, and shows a command with `<code>`.', starter: '\n',
    checks: [
      { kind: 'has', label: 'Importance with <strong>', sel: 'strong' },
      { kind: 'has', label: 'Emphasis with <em>', sel: 'em' },
      { kind: 'has', label: 'Highlight with <mark>', sel: 'mark' },
      { kind: 'has', label: 'Code with <code>', sel: 'code' },
    ],
    hints: ['`<mark>` highlights a relevant term.', 'Combine all four in a sentence or two.'],
  },
  quiz: [
    { q: 'Which marks text as important?', opts: ['<b>', '<strong>', '<big>'], a: 1, why: '<strong> conveys importance with meaning; <b> is only visual.' },
    { q: 'What is <code> for?', opts: ['Bold text', 'A fragment of computer code', 'A code of conduct'], a: 1, why: '<code> marks up code fragments.' },
    { q: 'Why prefer <em> over <i>?', opts: ['It is shorter', 'It carries meaning (emphasis) assistive tech can convey', 'It is always italic'], a: 1, why: '<em> has semantic meaning; <i> is presentational.' },
  ],
  recap: {
    takeaways: ['`<strong>` = importance, `<em>` = emphasis, `<code>` = code, `<mark>` = highlight.', 'Prefer meaningful tags over `<b>`/`<i>`.', 'Choose a tag by meaning, not appearance.'],
    syntaxExamples: [{ label: 'Meaningful text', code: '<strong>important</strong> <em>stressed</em> <code>cmd</code>' }],
    commonMistakes: [
      { mistake: 'Using <b>/<i> for meaning', why: 'They convey no semantics to assistive tech.', fix: 'Use <strong>/<em> when you mean importance/emphasis.' },
      { mistake: 'Wrapping whole paragraphs in <strong>', why: 'If everything is important, nothing stands out.', fix: 'Emphasise only the key words.' },
    ],
    knowledgeChecks: [{ q: 'Which highlights relevant text?', opts: ['<mark>', '<code>'], a: 0, why: '<mark> highlights; <code> marks code.' }],
  },
  missions: [
    { id: 'li-html-walls-l03-seed', lessonId: 'li-html-walls-l03', tier: 'seed', title: 'Stress a word', objective: 'Emphasise a word.', expected: 'A paragraph with <em>.', starter: '<p>Edit me.</p>\n', hints: ['`<em>word</em>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Emphasis', sel: 'em' }] },
    { id: 'li-html-walls-l03-sprout', lessonId: 'li-html-walls-l03', tier: 'sprout', title: 'Important code', objective: 'Importance and a code fragment.', expected: 'A paragraph with <strong> and <code>.', starter: '\n', hints: ['`<strong>` and `<code>` together.'], xpReward: 30, checks: [{ kind: 'has', label: 'Importance', sel: 'strong' }, { kind: 'has', label: 'Code', sel: 'code' }] },
    { id: 'li-html-walls-l03-bloom', lessonId: 'li-html-walls-l03', tier: 'bloom', title: 'The full annotation', objective: 'Use strong, em, code and mark together.', expected: 'All four semantic tags present.', starter: '\n', hints: ['One rich paragraph using all four.'], xpReward: 50, checks: [{ kind: 'has', label: 'strong', sel: 'strong' }, { kind: 'has', label: 'em', sel: 'em' }, { kind: 'has', label: 'code', sel: 'code' }, { kind: 'has', label: 'mark', sel: 'mark' }] },
  ],
};

const lesson04: HtmlLesson = {
  ...L(4, 'Comments', 10, 120),
  objectives: ['Write HTML comments', 'Use comments to annotate, not to hide content from users', 'Know that comments are visible in the source'],
  discover: {
    heading: 'Notes to yourself',
    lede: 'An HTML **comment** is written `<!-- like this -->`. The browser ignores it, so it never renders — it is a note for whoever reads the code. Comments are perfect for labelling sections or leaving reminders. They are **not** private: anyone can view source, so never put secrets in them.',
    example: '<!-- Specimen header -->\n<h1>Amethyst</h1>\n<!-- TODO: add the discovery date -->\n<p>A violet quartz.</p>',
    exampleNote: 'Neither comment appears on the page, but both help a developer reading the file.',
    tip: 'Comments explain the code; they are visible in “view source”.',
  },
  experiment: { heading: 'Annotate', lede: 'Add comments around your markup.', steps: ['Add a comment above a heading', 'Add a reminder comment', 'Confirm comments never show in the preview'], tip: 'Anything between <!-- and --> is ignored by the browser.', starter: '<!-- page title -->\n<h1>Field Notes</h1>\n<p>An entry.</p>\n' },
  practice: {
    heading: 'Label the sections', lede: 'Write a short page and label two parts with comments.',
    steps: ['An `<h1>` and a `<p>`', 'A comment above the heading', 'A comment above the paragraph'], starter: '\n',
    checks: [
      { kind: 'has', label: 'There is a heading', sel: 'h1' },
      { kind: 'has', label: 'There is a paragraph', sel: 'p' },
      { kind: 'source', label: 'There are at least two comments', matches: '<!--[\\s\\S]*?-->[\\s\\S]*<!--[\\s\\S]*?-->', fail: 'Add two <!-- comments -->.' },
    ],
    hints: ['A comment is `<!-- text -->`.', 'Put one comment before the h1 and one before the p.'],
  },
  challenge: {
    heading: 'A commented template', lede: 'Without help: a small page (heading + two paragraphs) with a comment labelling each of the three elements, and no secret data in any comment.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading', sel: 'h1' },
      { kind: 'count', label: 'Two paragraphs', sel: 'p', equals: 2 },
      { kind: 'source', label: 'At least three comments', matches: '(<!--[\\s\\S]*?-->[\\s\\S]*){3}' },
    ],
    hints: ['Three labelled elements → three comments.', 'Keep comments descriptive, not secret.'],
  },
  quiz: [
    { q: 'How do you write an HTML comment?', opts: ['// like this', '<!-- like this -->', '/* like this */'], a: 1, why: 'HTML comments use <!-- --> .' },
    { q: 'Do comments show on the page?', opts: ['Yes', 'No, the browser ignores them'], a: 1, why: 'Comments are not rendered.' },
    { q: 'Are comments private?', opts: ['Yes, users cannot see them', 'No, anyone can view source'], a: 1, why: 'Comments are visible in the page source.' },
  ],
  recap: {
    takeaways: ['Comments are `<!-- … -->` and never render.', 'Use them to annotate and label code.', 'They are visible in view-source — never put secrets in them.'],
    syntaxExamples: [{ label: 'Comment', code: '<!-- a note for developers -->' }],
    commonMistakes: [
      { mistake: 'Putting sensitive data in a comment', why: 'Anyone can read the source.', fix: 'Keep secrets out of HTML entirely.' },
      { mistake: 'Nesting comments or missing the closing -->', why: 'The browser may swallow following markup.', fix: 'Close every comment and do not nest them.' },
    ],
    knowledgeChecks: [{ q: 'Which closes a comment?', opts: ['-->', '*/'], a: 0, why: 'HTML comments close with -->.' }],
  },
  missions: [
    { id: 'li-html-walls-l04-seed', lessonId: 'li-html-walls-l04', tier: 'seed', title: 'One note', objective: 'A page with a comment.', expected: 'A heading and one comment.', starter: '<h1>Notes</h1>\n', hints: ['`<!-- note -->`'], xpReward: 15, checks: [{ kind: 'has', label: 'Heading', sel: 'h1' }, { kind: 'source', label: 'A comment', matches: '<!--[\\s\\S]*?-->' }] },
    { id: 'li-html-walls-l04-sprout', lessonId: 'li-html-walls-l04', tier: 'sprout', title: 'Labelled', objective: 'Two comments labelling two elements.', expected: 'A heading, a paragraph, and two comments.', starter: '\n', hints: ['One comment per element.'], xpReward: 30, checks: [{ kind: 'has', label: 'Heading', sel: 'h1' }, { kind: 'has', label: 'Paragraph', sel: 'p' }, { kind: 'source', label: 'Two comments', matches: '(<!--[\\s\\S]*?-->[\\s\\S]*){2}' }] },
    { id: 'li-html-walls-l04-bloom', lessonId: 'li-html-walls-l04', tier: 'bloom', title: 'The documented page', objective: 'A structured page where every block is labelled by a comment.', expected: 'A heading, two paragraphs, and at least three comments.', starter: '\n', hints: ['Three elements, three comments.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1' }, { kind: 'count', label: 'Two paragraphs', sel: 'p', min: 2 }, { kind: 'source', label: 'Three comments', matches: '(<!--[\\s\\S]*?-->[\\s\\S]*){3}' }] },
  ],
};

const lesson05: HtmlLesson = {
  ...L(5, 'Entities & special characters', 12, 140),
  objectives: ['Write reserved characters with entities', 'Use named and numeric entities', 'Show <, > and & safely as text'],
  discover: {
    heading: 'Characters that need escaping',
    lede: 'Some characters are **reserved**: `<`, `>` and `&` have meaning in HTML. To show them as text you use an **entity** — a code starting with `&` and ending with `;`. `&lt;` is `<`, `&gt;` is `>`, `&amp;` is `&`. Entities also give you symbols: `&copy;` (©), `&mdash;` (—), `&nbsp;` (a non-breaking space).',
    example: '<p>Use &lt;p&gt; for a paragraph.</p>\n<p>Quartz &amp; feldspar &mdash; common.</p>\n<p>&copy; 2026 Meridian Survey</p>',
    exampleNote: 'Writing a literal `<p>` would start an element; `&lt;p&gt;` shows the text “<p>”. `&amp;` shows an ampersand without starting an entity.',
    tip: 'If you want to *show* `<`, `>` or `&`, escape it.',
  },
  experiment: { heading: 'Escape and symbol', lede: 'Show reserved characters and a symbol.', steps: ['Show the text `<h1>` using entities', 'Write an ampersand with `&amp;`', 'Add a `&copy;` symbol'], tip: 'Every entity ends with a semicolon.', starter: '<p>The &lt;h1&gt; tag &amp; its uses.</p>\n<p>&copy; Meridian</p>\n' },
  practice: {
    heading: 'Show the tags as text', lede: 'Write a paragraph that displays the literal text “<title> & <body>” using entities.',
    steps: ['Use `&lt;` and `&gt;` for the angle brackets', 'Use `&amp;` for the ampersand', 'Add a paragraph with a `&copy;` notice'], starter: '\n',
    checks: [
      { kind: 'has', label: 'There is a paragraph', sel: 'p' },
      { kind: 'source', label: 'Uses &lt; and &gt;', matches: '&lt;[\\s\\S]*&gt;', fail: 'Escape the angle brackets with &lt; and &gt;.' },
      { kind: 'source', label: 'Uses &amp;', contains: '&amp;' },
      { kind: 'source', label: 'Uses a symbol entity like &copy;', matches: '&(copy|mdash|nbsp|rarr);' },
      { kind: 'absent', label: 'No stray real <title> element', sel: 'title' },
    ],
    hints: ['`&lt;title&gt; &amp; &lt;body&gt;` renders as “<title> & <body>”.', 'Add `<p>&copy; 2026</p>`.'],
  },
  challenge: {
    heading: 'A syntax note', lede: 'Without help: a short note that explains an element by showing its literal tags with entities, mentions another with `&amp;`, and ends with a `&copy;` line. None of the escaped tags should become real elements.', starter: '\n',
    checks: [
      { kind: 'count', label: 'At least two paragraphs', sel: 'p', min: 2 },
      { kind: 'source', label: 'Escaped angle brackets', matches: '&lt;[\\s\\S]*?&gt;' },
      { kind: 'source', label: 'An ampersand entity', contains: '&amp;' },
      { kind: 'source', label: 'A symbol entity', matches: '&(copy|mdash|nbsp);' },
      { kind: 'absent', label: 'No accidental <h1> from escaping', sel: 'h1' },
    ],
    hints: ['Escape every `<`, `>` and `&` you want shown as text.', 'End with `<p>&copy; 2026 …</p>`.'],
  },
  quiz: [
    { q: 'How do you display a literal < character?', opts: ['\\<', '&lt;', '[<]'], a: 1, why: '&lt; is the entity for <.' },
    { q: 'Why escape &?', opts: ['It is reserved — it begins entities', 'It is illegal in HTML', 'For colour'], a: 0, why: '& starts an entity, so a literal ampersand is written &amp;.' },
    { q: 'What does every entity end with?', opts: ['A semicolon ;', 'A slash /', 'A space'], a: 0, why: 'Entities end with a semicolon.' },
  ],
  recap: {
    takeaways: ['`&lt;` `&gt;` `&amp;` show the reserved characters `<` `>` `&`.', 'Entities start with `&` and end with `;`.', 'Entities also produce symbols like `&copy;` and `&mdash;`.'],
    syntaxExamples: [{ label: 'Escaping', code: 'Use &lt;p&gt; &amp; &lt;br&gt;' }, { label: 'Symbols', code: '&copy; &mdash; &nbsp;' }],
    commonMistakes: [
      { mistake: 'Writing a literal & in text', why: 'The browser may try to read an entity.', fix: 'Write &amp; for a visible ampersand.' },
      { mistake: 'Forgetting the semicolon', why: 'The entity will not be recognised.', fix: 'End every entity with ;.' },
    ],
    knowledgeChecks: [{ q: 'What is &gt;?', opts: ['<', '>'], a: 1, why: '&gt; is the greater-than sign.' }],
  },
  missions: [
    { id: 'li-html-walls-l05-seed', lessonId: 'li-html-walls-l05', tier: 'seed', title: 'Show a tag', objective: 'Display a tag as text.', expected: 'A paragraph using &lt; and &gt;.', starter: '\n', hints: ['`&lt;p&gt;`'], xpReward: 15, checks: [{ kind: 'has', label: 'Paragraph', sel: 'p' }, { kind: 'source', label: 'Escaped brackets', matches: '&lt;[\\s\\S]*&gt;' }] },
    { id: 'li-html-walls-l05-sprout', lessonId: 'li-html-walls-l05', tier: 'sprout', title: 'Amp and symbol', objective: 'Use an ampersand entity and a symbol.', expected: 'A paragraph with &amp; and a symbol entity.', starter: '\n', hints: ['`&amp;` and `&copy;`.'], xpReward: 30, checks: [{ kind: 'source', label: '&amp;', contains: '&amp;' }, { kind: 'source', label: 'symbol', matches: '&(copy|mdash|nbsp);' }] },
    { id: 'li-html-walls-l05-bloom', lessonId: 'li-html-walls-l05', tier: 'bloom', title: 'The glossary line', objective: 'Explain two tags as literal text with entities, plus an ampersand and a copyright symbol, with no accidental elements.', expected: 'Escaped brackets, &amp;, a symbol, and no real <p>-breaking elements leaking in.', starter: '\n', hints: ['Escape everything you want shown.'], xpReward: 50, checks: [{ kind: 'source', label: 'Escaped brackets', matches: '&lt;[\\s\\S]*?&gt;' }, { kind: 'source', label: 'ampersand', contains: '&amp;' }, { kind: 'source', label: 'symbol', matches: '&(copy|mdash|nbsp);' }, { kind: 'has', label: 'At least two paragraphs', sel: 'p' }] },
  ],
};

export const WALLS_LESSONS: HtmlLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
