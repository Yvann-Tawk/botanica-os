// The Foundation · Mini-Planet 05 · The Structural Chambers — semantic HTML: why it matters, header & footer,
// main/section/article, navigation landmarks, and the document outline.

import type { HtmlLesson } from '../types';

const L = (n: number, title: string, minutes: number, xp: number): Pick<HtmlLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-html-chambers-l${String(n).padStart(2, '0')}`, conceptId: `lithic.html.chambers.l${n}`, planetId: 'foundation', conceptKey: 'lithic.html.chambers', number: n, title, minutes, xp,
});

const lesson01: HtmlLesson = {
  ...L(1, 'Why semantic HTML?', 12, 160),
  objectives: ['Explain what semantic HTML is', 'Choose a meaningful element over a generic <div>', 'Know that <div>/<span> carry no meaning'],
  discover: {
    heading: 'Meaning over boxes',
    lede: '**Semantic HTML** uses elements that describe their content — `<nav>`, `<header>`, `<article>`, `<figure>` — instead of generic `<div>` and `<span>` boxes. Meaning helps browsers, search engines and assistive tech understand the page. `<div>` and `<span>` are fine when no semantic element fits, but reach for meaning first.',
    example: '<!-- generic, meaningless -->\n<div class="top">…</div>\n\n<!-- semantic, self-describing -->\n<header>…</header>\n<main>\n  <article>…</article>\n</main>\n<footer>…</footer>',
    exampleNote: 'The second version tells a machine what each region *is*. The first is just unlabelled boxes.',
    tip: 'If a meaningful element exists, use it instead of <div>.',
  },
  experiment: { heading: 'Swap the boxes', lede: 'Replace generic boxes with meaning.', steps: ['Replace a wrapper `<div>` with `<header>`', 'Wrap the main content in `<main>`', 'Add a `<footer>`'], tip: '<div> is a last resort, not a default.', starter: '<header>Site title</header>\n<main>Content</main>\n<footer>Credits</footer>\n' },
  practice: {
    heading: 'A semantic shell', lede: 'Build a page shell using semantic regions instead of divs.',
    steps: ['A `<header>` with an `<h1>`', 'A `<main>` with a paragraph', 'A `<footer>`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A <header>', sel: 'header', fail: 'Add a <header>.' },
      { kind: 'has', label: 'A heading in the header', sel: 'header h1' },
      { kind: 'has', label: 'A <main>', sel: 'main', fail: 'Add a <main>.' },
      { kind: 'has', label: 'A <footer>', sel: 'footer' },
      { kind: 'absent', label: 'No generic layout <div>', sel: 'div', fail: 'Use semantic elements instead of <div>.' },
    ],
    hints: ['Use `<header>`, `<main>`, `<footer>` as the three regions.', 'Put the `<h1>` inside the `<header>`.'],
  },
  challenge: {
    heading: 'Div-free structure', lede: 'Without help: a complete page skeleton whose body uses header, main and footer (and no `<div>` at all), with a heading in the header and two paragraphs in main.', starter: '\n',
    checks: [
      { kind: 'has', label: 'Header', sel: 'header' },
      { kind: 'has', label: 'Main', sel: 'main' },
      { kind: 'has', label: 'Footer', sel: 'footer' },
      { kind: 'count', label: 'Two paragraphs in main', sel: 'main p', min: 2 },
      { kind: 'absent', label: 'No <div>', sel: 'div' },
    ],
    hints: ['Three regions: header, main, footer.', 'Keep all content inside those regions — no div.'],
  },
  quiz: [
    { q: 'What is semantic HTML?', opts: ['HTML with lots of classes', 'Elements that describe their content’s meaning', 'Faster HTML'], a: 1, why: 'Semantic elements convey what content is.' },
    { q: 'When is <div> appropriate?', opts: ['As the default wrapper everywhere', 'When no semantic element fits', 'Never'], a: 1, why: 'Use <div> only when no meaningful element applies.' },
    { q: 'Why does meaning help?', opts: ['It changes colours', 'Browsers, search and assistive tech understand the page', 'It is required'], a: 1, why: 'Semantics aid machines and accessibility.' },
  ],
  recap: {
    takeaways: ['Semantic HTML uses meaningful elements over generic boxes.', '`<div>`/`<span>` carry no meaning — use them last.', 'Semantics help machines and assistive tech.'],
    syntaxExamples: [{ label: 'Semantic shell', code: '<header>…</header>\n<main>…</main>\n<footer>…</footer>' }],
    commonMistakes: [
      { mistake: 'Wrapping everything in <div>s (“div soup”)', why: 'The page has no machine-readable structure.', fix: 'Use header, nav, main, section, article, footer.' },
      { mistake: 'Using a semantic element only for its default styling', why: 'It can imply the wrong meaning.', fix: 'Pick elements by meaning; style with CSS.' },
    ],
    knowledgeChecks: [{ q: 'Which has no inherent meaning?', opts: ['<article>', '<div>'], a: 1, why: '<div> is a generic container.' }],
  },
  missions: [
    { id: 'li-html-chambers-l01-seed', lessonId: 'li-html-chambers-l01', tier: 'seed', title: 'Main content', objective: 'Wrap content in <main>.', expected: 'A <main> with a heading.', starter: '\n', hints: ['`<main><h1>…</h1></main>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Main', sel: 'main' }, { kind: 'has', label: 'Heading in main', sel: 'main h1' }] },
    { id: 'li-html-chambers-l01-sprout', lessonId: 'li-html-chambers-l01', tier: 'sprout', title: 'Three regions', objective: 'Header, main and footer.', expected: 'All three regions, no div.', starter: '\n', hints: ['header, main, footer.'], xpReward: 30, checks: [{ kind: 'has', label: 'header', sel: 'header' }, { kind: 'has', label: 'main', sel: 'main' }, { kind: 'has', label: 'footer', sel: 'footer' }, { kind: 'absent', label: 'No div', sel: 'div' }] },
    { id: 'li-html-chambers-l01-bloom', lessonId: 'li-html-chambers-l01', tier: 'bloom', title: 'The clean page', objective: 'A full page skeleton with semantic regions and no div.', expected: 'A valid doc whose body has header, main with two paragraphs, and footer, no div.', starter: '\n', hints: ['Doctype + semantic body.'], xpReward: 50, checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'has', label: 'header', sel: 'body header' }, { kind: 'count', label: 'Paragraphs in main', sel: 'main p', min: 2 }, { kind: 'has', label: 'footer', sel: 'body footer' }, { kind: 'absent', label: 'No div', sel: 'div' }] },
  ],
};

const lesson02: HtmlLesson = {
  ...L(2, 'Header & footer', 12, 160),
  objectives: ['Use <header> for introductory content', 'Use <footer> for closing content', 'Understand they can appear per-section too'],
  discover: {
    heading: 'Tops and bottoms',
    lede: '`<header>` holds introductory content — a site title, logo, or a section’s heading and intro. `<footer>` holds closing content — credits, copyright, related links. A page has one top-level header and footer, but a `<section>` or `<article>` can have its own header and footer too.',
    example: '<header>\n  <h1>Meridian Survey</h1>\n  <p>Charting the world beneath</p>\n</header>\n<main>…</main>\n<footer>\n  <p>&copy; 2026 Meridian Survey</p>\n</footer>',
    exampleNote: 'The page `<header>` introduces the whole site; the `<footer>` closes it with a copyright line.',
    tip: 'Header = intro, footer = closing. They can nest inside sections and articles.',
  },
  experiment: { heading: 'Top and tail', lede: 'Add a page header and footer.', steps: ['A `<header>` with a title and tagline', 'A `<main>` between them', 'A `<footer>` with a copyright line'], tip: 'Use &copy; for the © symbol.', starter: '<header><h1>Survey</h1><p>Tagline</p></header>\n<main><p>Body</p></main>\n<footer><p>&copy; 2026</p></footer>\n' },
  practice: {
    heading: 'Framed page', lede: 'Build a page with a header (title + tagline), a main, and a footer with a copyright and a link.',
    steps: ['A `<header>` with an `<h1>` and a `<p>`', 'A `<main>` with content', 'A `<footer>` with a `&copy;` line and an `<a>`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A header with a heading', sel: 'header h1', fail: 'Put an <h1> in a <header>.' },
      { kind: 'has', label: 'A tagline in the header', sel: 'header p' },
      { kind: 'has', label: 'A main region', sel: 'main' },
      { kind: 'has', label: 'A footer', sel: 'footer' },
      { kind: 'has', label: 'A link in the footer', sel: 'footer a', fail: 'Add a link in the footer.' },
    ],
    hints: ['Header has the h1 and a p; footer has a ©-line and a link.', '`<footer><p>&copy; 2026</p><a href="#">Top</a></footer>`'],
  },
  challenge: {
    heading: 'Per-section footers', lede: 'Without help: a page header, a main containing two `<article>` elements that each have their own `<footer>`, and a page-level `<footer>`.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A page header', sel: 'body > header, header' },
      { kind: 'count', label: 'Two articles', sel: 'main article', min: 2 },
      { kind: 'count', label: 'Each article has a footer', sel: 'article footer', min: 2 },
      { kind: 'has', label: 'A page footer', sel: 'main ~ footer, body > footer, footer' },
    ],
    hints: ['Give each `<article>` its own `<footer>`.', 'Keep the page-level footer outside the articles.'],
  },
  quiz: [
    { q: 'What goes in <header>?', opts: ['Closing credits', 'Introductory content like a title', 'The whole page'], a: 1, why: '<header> holds introductory content.' },
    { q: 'Can a <section> have its own footer?', opts: ['No', 'Yes'], a: 1, why: 'Sections and articles can have their own header/footer.' },
    { q: 'Where do credits and copyright belong?', opts: ['<header>', '<footer>', '<main>'], a: 1, why: 'Closing content like credits goes in <footer>.' },
  ],
  recap: {
    takeaways: ['`<header>` = introductory content; `<footer>` = closing content.', 'A page has one top-level pair.', 'Sections and articles may have their own header/footer.'],
    syntaxExamples: [{ label: 'Header + footer', code: '<header><h1>Title</h1></header>\n<footer><p>&copy; 2026</p></footer>' }],
    commonMistakes: [
      { mistake: 'Putting the main content in <header>', why: 'Header is for intro material only.', fix: 'Keep primary content in <main>.' },
      { mistake: 'Assuming only one footer is allowed', why: 'Sections and articles can each have one.', fix: 'Use per-section footers where it helps.' },
    ],
    knowledgeChecks: [{ q: 'Closing content element?', opts: ['<header>', '<footer>'], a: 1, why: '<footer> holds closing content.' }],
  },
  missions: [
    { id: 'li-html-chambers-l02-seed', lessonId: 'li-html-chambers-l02', tier: 'seed', title: 'Header up', objective: 'A header with a title.', expected: 'A <header> with an <h1>.', starter: '\n', hints: ['`<header><h1>…</h1></header>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Header title', sel: 'header h1' }] },
    { id: 'li-html-chambers-l02-sprout', lessonId: 'li-html-chambers-l02', tier: 'sprout', title: 'Top and tail', objective: 'Header and footer with a copyright.', expected: 'A header and a footer with a ©-line.', starter: '\n', hints: ['Use &copy; in the footer.'], xpReward: 30, checks: [{ kind: 'has', label: 'Header', sel: 'header' }, { kind: 'has', label: 'Footer', sel: 'footer' }, { kind: 'source', label: 'Copyright symbol', matches: '&copy;' }] },
    { id: 'li-html-chambers-l02-bloom', lessonId: 'li-html-chambers-l02', tier: 'bloom', title: 'Nested framing', objective: 'A page frame plus an article with its own header and footer.', expected: 'A page header/footer and an article containing its own header and footer.', starter: '\n', hints: ['Nest a header and footer inside an article.'], xpReward: 50, checks: [{ kind: 'has', label: 'Page header', sel: 'header' }, { kind: 'has', label: 'Article header', sel: 'article header' }, { kind: 'has', label: 'Article footer', sel: 'article footer' }, { kind: 'has', label: 'Page footer', sel: 'footer' }] },
  ],
};

const lesson03: HtmlLesson = {
  ...L(3, 'main, section & article', 16, 170),
  objectives: ['Use one <main> for the primary content', 'Group related content in <section>', 'Use <article> for self-contained pieces'],
  discover: {
    heading: 'Organising the body',
    lede: '`<main>` wraps the page’s primary content — one per page. Inside, a `<section>` groups related content under a heading, and an `<article>` is a self-contained piece that would make sense on its own (a post, a specimen entry, a card). Sections and articles should each start with a heading.',
    example: '<main>\n  <section>\n    <h2>Minerals</h2>\n    <article>\n      <h3>Amethyst</h3>\n      <p>A violet quartz.</p>\n    </article>\n    <article>\n      <h3>Citrine</h3>\n      <p>A golden quartz.</p>\n    </article>\n  </section>\n</main>',
    exampleNote: 'One `<main>`; a `<section>` groups the minerals under an `<h2>`; each `<article>` is a self-contained entry with its own `<h3>`.',
    tip: 'main = the whole primary content. section = a themed group. article = stands alone.',
  },
  experiment: { heading: 'Group and isolate', lede: 'Structure content into sections and articles.', steps: ['One `<main>`', 'A `<section>` with a heading', 'Two `<article>` inside, each with a heading'], tip: 'Each section/article starts with its own heading.', starter: '<main>\n  <section>\n    <h2>Group</h2>\n    <article><h3>One</h3><p>…</p></article>\n  </section>\n</main>\n' },
  practice: {
    heading: 'A content outline', lede: 'Build a main with one section that contains two self-contained articles, each headed.',
    steps: ['Exactly one `<main>`', 'A `<section>` with an `<h2>`', 'Two `<article>` each with an `<h3>` and a `<p>`'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Exactly one <main>', sel: 'main', equals: 1, fail: 'Use a single <main>.' },
      { kind: 'has', label: 'A section with a heading', sel: 'main section h2', fail: 'Give the <section> an <h2>.' },
      { kind: 'count', label: 'Two articles', sel: 'section article', equals: 2 },
      { kind: 'count', label: 'Each article has a heading', sel: 'article h3', min: 2 },
    ],
    hints: ['One `<main>` → one `<section>` → two `<article>`.', 'Heading levels: h2 for the section, h3 for each article.'],
  },
  challenge: {
    heading: 'A structured report', lede: 'Without help: a main with two sections (each with an h2), where one section contains at least two articles (each with an h3 and a paragraph).', starter: '\n',
    checks: [
      { kind: 'count', label: 'One main', sel: 'main', equals: 1 },
      { kind: 'count', label: 'Two sections', sel: 'main section', min: 2 },
      { kind: 'count', label: 'Section headings', sel: 'section h2', min: 2 },
      { kind: 'count', label: 'At least two articles', sel: 'section article', min: 2 },
      { kind: 'count', label: 'Article headings', sel: 'article h3', min: 2 },
    ],
    hints: ['Two sections, one of which holds the articles.', 'Keep the heading levels consistent (h2 sections, h3 articles).'],
  },
  quiz: [
    { q: 'How many <main> per page?', opts: ['One', 'As many as you like', 'One per section'], a: 0, why: 'A page has a single <main>.' },
    { q: 'What is an <article>?', opts: ['Any paragraph', 'A self-contained piece that makes sense alone', 'A navigation bar'], a: 1, why: 'An article is independently distributable content.' },
    { q: 'What should a <section> start with?', opts: ['A heading', 'A footer', 'An image'], a: 0, why: 'Sections should begin with a heading.' },
  ],
  recap: {
    takeaways: ['One `<main>` holds the primary content.', '`<section>` groups related content under a heading.', '`<article>` is self-contained and makes sense alone.'],
    syntaxExamples: [{ label: 'Structure', code: '<main>\n  <section><h2>Group</h2>\n    <article><h3>Item</h3></article>\n  </section>\n</main>' }],
    commonMistakes: [
      { mistake: 'Several <main> elements', why: 'Only one primary region is allowed.', fix: 'Use a single <main>.' },
      { mistake: 'Sections without headings', why: 'The outline becomes unclear.', fix: 'Start each section/article with a heading.' },
    ],
    knowledgeChecks: [{ q: 'Self-contained piece?', opts: ['<section>', '<article>'], a: 1, why: '<article> stands alone.' }],
  },
  missions: [
    { id: 'li-html-chambers-l03-seed', lessonId: 'li-html-chambers-l03', tier: 'seed', title: 'One section', objective: 'A main with a headed section.', expected: 'A <main> with a <section> and an <h2>.', starter: '\n', hints: ['`<main><section><h2>…</h2></section></main>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Main', sel: 'main' }, { kind: 'has', label: 'Section heading', sel: 'section h2' }] },
    { id: 'li-html-chambers-l03-sprout', lessonId: 'li-html-chambers-l03', tier: 'sprout', title: 'Two articles', objective: 'A section with two articles.', expected: 'A section containing two headed articles.', starter: '\n', hints: ['Two <article> each with an <h3>.'], xpReward: 30, checks: [{ kind: 'count', label: 'Two articles', sel: 'section article', min: 2 }, { kind: 'count', label: 'Article headings', sel: 'article h3', min: 2 }] },
    { id: 'li-html-chambers-l03-bloom', lessonId: 'li-html-chambers-l03', tier: 'bloom', title: 'The journal', objective: 'A main with two sections and several articles.', expected: 'One main, two sections with h2, at least three articles with h3.', starter: '\n', hints: ['Spread three articles across two sections.'], xpReward: 50, checks: [{ kind: 'count', label: 'One main', sel: 'main', equals: 1 }, { kind: 'count', label: 'Two sections', sel: 'section', min: 2 }, { kind: 'count', label: 'Three articles', sel: 'article', min: 3 }, { kind: 'count', label: 'Article headings', sel: 'article h3', min: 3 }] },
  ],
};

const lesson04: HtmlLesson = {
  ...L(4, 'Navigation landmarks', 14, 160),
  objectives: ['Mark navigation with <nav>', 'Use <aside> for tangential content', 'Label multiple landmarks of the same type'],
  discover: {
    heading: 'Signposts for the page',
    lede: 'Landmarks let assistive tech jump around a page. `<nav>` marks navigation; `<aside>` marks tangential content (a sidebar, related links). When a page has more than one landmark of the same type — two `<nav>`s, say — give each an `aria-label` so they can be told apart.',
    example: '<nav aria-label="Primary">\n  <ul><li><a href="#">Home</a></li></ul>\n</nav>\n<main>…</main>\n<aside aria-label="Related">\n  <h2>See also</h2>\n</aside>\n<nav aria-label="Footer">…</nav>',
    exampleNote: 'Two `<nav>`s share the page, so each has an `aria-label` (“Primary”, “Footer”). The `<aside>` holds related, non-essential content.',
    tip: 'Multiple same-type landmarks each need a distinguishing label.',
  },
  experiment: { heading: 'Place landmarks', lede: 'Add navigation and an aside.', steps: ['A labelled `<nav>`', 'A `<main>`', 'An `<aside>` with related content'], tip: 'Label a nav with aria-label when there is more than one.', starter: '<nav aria-label="Primary"><ul><li><a href="#">Home</a></li></ul></nav>\n<main><p>Body</p></main>\n<aside><h2>Related</h2></aside>\n' },
  practice: {
    heading: 'Two navs and an aside', lede: 'Build a page with two labelled navigations and an aside of related links.',
    steps: ['A primary `<nav aria-label="Primary">`', 'A `<main>`', 'An `<aside>` with a heading', 'A second `<nav aria-label="…">`'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Two navigations', sel: 'nav', equals: 2, fail: 'Add two <nav> elements.' },
      { kind: 'count', label: 'Both navs are labelled', sel: 'nav[aria-label]', equals: 2, fail: 'Give each <nav> an aria-label.' },
      { kind: 'has', label: 'A main region', sel: 'main' },
      { kind: 'has', label: 'An aside with a heading', sel: 'aside :is(h2,h3)', fail: 'Give the <aside> a heading.' },
    ],
    hints: ['Two `<nav>`, each with a different `aria-label`.', 'The `<aside>` holds tangential content with its own heading.'],
  },
  challenge: {
    heading: 'A full landmark set', lede: 'Without help: a page with a header, a labelled primary nav, a main, an aside with related links, and a labelled footer nav — each same-type landmark distinctly labelled.', starter: '\n',
    checks: [
      { kind: 'has', label: 'Header', sel: 'header' },
      { kind: 'count', label: 'Two labelled navs', sel: 'nav[aria-label]', min: 2 },
      { kind: 'has', label: 'Main', sel: 'main' },
      { kind: 'has', label: 'Aside', sel: 'aside' },
      { kind: 'has', label: 'Footer', sel: 'footer' },
    ],
    hints: ['header, nav(Primary), main, aside, footer with nav(Footer).', 'Each nav gets its own aria-label.'],
  },
  quiz: [
    { q: 'What does <aside> hold?', opts: ['The main content', 'Tangential / related content', 'The page title'], a: 1, why: '<aside> is for tangential content like sidebars.' },
    { q: 'Two <nav>s on a page should…', opts: ['be merged', 'each have an aria-label', 'use the same id'], a: 1, why: 'Distinct labels let them be told apart.' },
    { q: 'What are landmarks for?', opts: ['Styling', 'Letting assistive tech jump between page regions', 'SEO only'], a: 1, why: 'Landmarks aid navigation for assistive tech.' },
  ],
  recap: {
    takeaways: ['`<nav>` marks navigation; `<aside>` marks tangential content.', 'Multiple same-type landmarks each need an `aria-label`.', 'Landmarks let assistive tech jump around the page.'],
    syntaxExamples: [{ label: 'Labelled nav', code: '<nav aria-label="Primary">…</nav>' }],
    commonMistakes: [
      { mistake: 'Two unlabelled navs', why: 'Assistive tech cannot distinguish them.', fix: 'Add a unique aria-label to each.' },
      { mistake: 'Putting primary content in <aside>', why: 'Aside implies the content is tangential.', fix: 'Keep primary content in <main>.' },
    ],
    knowledgeChecks: [{ q: 'Sidebar element?', opts: ['<aside>', '<section>'], a: 0, why: '<aside> is for tangential/sidebar content.' }],
  },
  missions: [
    { id: 'li-html-chambers-l04-seed', lessonId: 'li-html-chambers-l04', tier: 'seed', title: 'Label a nav', objective: 'A labelled navigation.', expected: 'A <nav> with aria-label.', starter: '\n', hints: ['`<nav aria-label="Primary">…`'], xpReward: 15, checks: [{ kind: 'has', label: 'Labelled nav', sel: 'nav[aria-label]' }] },
    { id: 'li-html-chambers-l04-sprout', lessonId: 'li-html-chambers-l04', tier: 'sprout', title: 'Add an aside', objective: 'A main and an aside.', expected: 'A <main> and an <aside> with a heading.', starter: '\n', hints: ['Aside holds related content.'], xpReward: 30, checks: [{ kind: 'has', label: 'Main', sel: 'main' }, { kind: 'has', label: 'Aside heading', sel: 'aside :is(h2,h3)' }] },
    { id: 'li-html-chambers-l04-bloom', lessonId: 'li-html-chambers-l04', tier: 'bloom', title: 'The landmarked page', objective: 'A page with header, two labelled navs, main, aside and footer.', expected: 'All five landmark regions, with both navs labelled.', starter: '\n', hints: ['Two labelled navs, plus header/main/aside/footer.'], xpReward: 50, checks: [{ kind: 'has', label: 'Header', sel: 'header' }, { kind: 'count', label: 'Two labelled navs', sel: 'nav[aria-label]', min: 2 }, { kind: 'has', label: 'Main', sel: 'main' }, { kind: 'has', label: 'Aside', sel: 'aside' }, { kind: 'has', label: 'Footer', sel: 'footer' }] },
  ],
};

const lesson05: HtmlLesson = {
  ...L(5, 'The document outline', 14, 170),
  objectives: ['Build a logical heading outline', 'Keep one h1 and nest levels without skipping', 'Combine landmarks and headings into a coherent page'],
  discover: {
    heading: 'The shape of the page',
    lede: 'The **document outline** is the tree of headings a page produces. Assistive tech builds navigation from it, so it must be logical: one `<h1>` for the page, `<h2>` for its sections, `<h3>` for sub-parts — never skipping a level for appearance. Combined with landmarks, a clear outline makes a page navigable by structure alone.',
    example: '<main>\n  <h1>The Lithic Shelf</h1>\n  <section>\n    <h2>The Foundation</h2>\n    <h3>The First Stone</h3>\n    <h3>The Written Walls</h3>\n  </section>\n  <section>\n    <h2>The Crystal Matrix</h2>\n  </section>\n</main>',
    exampleNote: 'One `<h1>`, two `<h2>` sections, with `<h3>` sub-parts under the first — a clean, non-skipping tree.',
    tip: 'One h1; go one level deeper at a time.',
  },
  experiment: { heading: 'Shape the outline', lede: 'Arrange headings into a clean tree.', steps: ['One `<h1>`', 'Two `<h2>` sections', 'An `<h3>` under one section — do not skip to h4'], tip: 'Never jump h1 → h3.', starter: '<main>\n  <h1>Title</h1>\n  <section><h2>One</h2><h3>Detail</h3></section>\n  <section><h2>Two</h2></section>\n</main>\n' },
  practice: {
    heading: 'A coherent outline', lede: 'Build a main whose outline is one h1, two h2 sections, and at least two h3 sub-parts, with no skipped levels.',
    steps: ['Exactly one `<h1>`', 'Two `<section>` each with an `<h2>`', 'At least two `<h3>` under the sections'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Exactly one h1', sel: 'h1', equals: 1, fail: 'Use a single <h1>.' },
      { kind: 'count', label: 'Two section headings', sel: 'section h2', min: 2 },
      { kind: 'count', label: 'At least two h3', sel: 'section h3', min: 2 },
      { kind: 'absent', label: 'No h4 (do not skip levels)', sel: 'h4', fail: 'Stay within h1–h3 for this exercise.' },
      { kind: 'order', label: 'The h1 comes before the sections', before: 'h1', after: 'h2' },
    ],
    hints: ['One h1, two h2, two h3 — no h4.', 'Put the h1 at the top of main.'],
  },
  challenge: {
    heading: 'The whole page', lede: 'Without help: a complete page — header, main and footer — whose main has one h1 and a logical outline of three sections (h2) with sub-parts (h3), and at least one labelled nav. No skipped heading levels.', starter: '\n',
    checks: [
      { kind: 'has', label: 'Header', sel: 'header' },
      { kind: 'has', label: 'A labelled nav', sel: 'nav[aria-label]' },
      { kind: 'count', label: 'One h1', sel: 'main h1', equals: 1 },
      { kind: 'count', label: 'Three sections', sel: 'main section', min: 3 },
      { kind: 'count', label: 'Sub-headings', sel: 'section h3', min: 3 },
      { kind: 'has', label: 'Footer', sel: 'footer' },
    ],
    hints: ['Combine landmarks (header/nav/main/footer) with a clean heading tree.', 'One h1, three h2 sections, h3 sub-parts; no h4+ skips.'],
  },
  quiz: [
    { q: 'What builds the document outline?', opts: ['The landmarks only', 'The heading levels h1–h6', 'The CSS'], a: 1, why: 'Headings form the outline tree.' },
    { q: 'Is skipping from h1 to h3 fine for looks?', opts: ['Yes', 'No — go one level at a time'], a: 1, why: 'Skipping breaks the outline.' },
    { q: 'How many h1 in a clear outline?', opts: ['One', 'One per section'], a: 0, why: 'A single h1 gives a clear page title.' },
  ],
  recap: {
    takeaways: ['The outline is the tree of headings on the page.', 'Keep one h1 and never skip levels.', 'Landmarks + a clean outline make a page navigable by structure.'],
    syntaxExamples: [{ label: 'Outline', code: '<h1>Page</h1>\n<h2>Section</h2>\n<h3>Sub-part</h3>' }],
    commonMistakes: [
      { mistake: 'Choosing heading levels by size', why: 'It breaks the outline assistive tech relies on.', fix: 'Pick levels by structure; style with CSS.' },
      { mistake: 'Several h1 or skipped levels', why: 'The outline becomes ambiguous.', fix: 'One h1, descend one level at a time.' },
    ],
    knowledgeChecks: [{ q: 'Headings define the…', opts: ['colour', 'outline'], a: 1, why: 'Headings define the document outline.' }],
  },
  missions: [
    { id: 'li-html-chambers-l05-seed', lessonId: 'li-html-chambers-l05', tier: 'seed', title: 'One and two', objective: 'An h1 and two h2.', expected: 'One h1 and two h2.', starter: '\n', hints: ['h1, h2, h2.'], xpReward: 15, checks: [{ kind: 'count', label: 'One h1', sel: 'h1', equals: 1 }, { kind: 'count', label: 'Two h2', sel: 'h2', min: 2 }] },
    { id: 'li-html-chambers-l05-sprout', lessonId: 'li-html-chambers-l05', tier: 'sprout', title: 'No skips', objective: 'A three-level outline with no skipped levels.', expected: 'h1, h2 and h3 present, no h4.', starter: '\n', hints: ['h1 → h2 → h3, stop there.'], xpReward: 30, checks: [{ kind: 'has', label: 'h1', sel: 'h1' }, { kind: 'has', label: 'h2', sel: 'h2' }, { kind: 'has', label: 'h3', sel: 'h3' }, { kind: 'absent', label: 'No h4', sel: 'h4' }] },
    { id: 'li-html-chambers-l05-bloom', lessonId: 'li-html-chambers-l05', tier: 'bloom', title: 'The navigable page', objective: 'A landmarked page with a clean three-section outline.', expected: 'header, nav[aria-label], main with one h1 and three h2 sections with h3 sub-parts, footer.', starter: '\n', hints: ['Landmarks plus a clean heading tree.'], xpReward: 50, checks: [{ kind: 'has', label: 'Header', sel: 'header' }, { kind: 'has', label: 'Labelled nav', sel: 'nav[aria-label]' }, { kind: 'count', label: 'One h1', sel: 'main h1', equals: 1 }, { kind: 'count', label: 'Three sections', sel: 'main section', min: 3 }, { kind: 'has', label: 'Footer', sel: 'footer' }] },
  ],
};

export const CHAMBERS_LESSONS: HtmlLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
