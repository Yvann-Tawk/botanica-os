// The Foundation · Mini-Planet 03 · The Passageways — links, paths, images, navigation and file organisation.
// Note: the sandboxed preview blocks external resources (CSP img-src data: blob:), so image lessons validate the
// markup (src + alt), not a fetched render — honest, and what matters for learning the HTML.

import type { HtmlLesson } from '../types';

const L = (n: number, title: string, minutes: number, xp: number): Pick<HtmlLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-html-paths-l${String(n).padStart(2, '0')}`, conceptId: `lithic.html.paths.l${n}`, planetId: 'foundation', conceptKey: 'lithic.html.paths', number: n, title, minutes, xp,
});

const lesson01: HtmlLesson = {
  ...L(1, 'Hyperlinks', 12, 140),
  objectives: ['Create links with the <a> element and its href', 'Write clear, descriptive link text', 'Open and target links correctly'],
  discover: {
    heading: 'The anchor that connects',
    lede: 'A hyperlink is the `<a>` element — the “anchor”. Its `href` attribute says where it goes; the text between the tags is what the visitor clicks. Good link text describes the destination, so `<a href="…">the survey report</a>` beats “click here”.',
    example: '<p>Read <a href="https://example.com/report">the survey report</a> for details.</p>\n<p>Jump to <a href="#methods">methods</a> on this page.</p>',
    exampleNote: 'An `href` to a full URL goes to another site; an `href` starting with `#` jumps to an element with that id on the same page.',
    tip: 'Link text should make sense out of context — never “click here”.',
  },
  experiment: { heading: 'Make it clickable', lede: 'Create links to a site and within the page.', steps: ['Add an `<a>` with an `href` to any URL', 'Give it descriptive text', 'Add a second link to `#top`'], tip: 'The clickable part is the text between <a> and </a>.', starter: '<p>Visit <a href="https://example.com">the archive</a>.</p>\n' },
  practice: {
    heading: 'Two good links', lede: 'Write a paragraph with two links: one to an external site, one to a section on the page.',
    steps: ['An `<a>` whose `href` is a full `https://` URL', 'An `<a>` whose `href` starts with `#`', 'Descriptive text in both'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Two links', sel: 'a[href]', equals: 2, fail: 'Add two <a> elements with href.' },
      { kind: 'has', label: 'One links to an external URL', sel: 'a[href^="http"]', fail: 'One href should start with http.' },
      { kind: 'has', label: 'One links within the page', sel: 'a[href^="#"]', fail: 'One href should start with #.' },
      { kind: 'every', label: 'Every link has non-empty text', sel: 'a', name: 'href' },
    ],
    hints: ['`<a href="https://example.com">text</a>` and `<a href="#section">text</a>`.', 'Make the text describe where it goes.'],
  },
  challenge: {
    heading: 'A linked index', lede: 'Without help: a short page with a heading that has an id, and three links — two to external sites and one that jumps to that heading.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading with an id', sel: ':is(h1,h2)[id]' },
      { kind: 'count', label: 'Three links', sel: 'a[href]', equals: 3 },
      { kind: 'count', label: 'Two external links', sel: 'a[href^="http"]', min: 2 },
      { kind: 'has', label: 'A link to the heading', sel: 'a[href^="#"]' },
    ],
    hints: ['Give the heading `id="top"`, then link with `href="#top"`.', 'Two of the three links use full URLs.'],
  },
  quiz: [
    { q: 'Which attribute sets a link’s destination?', opts: ['src', 'href', 'link'], a: 1, why: 'The href attribute holds the destination.' },
    { q: 'What does href="#methods" do?', opts: ['Opens a new site', 'Jumps to the element with id="methods" on the page', 'Downloads a file'], a: 1, why: 'A # link targets an id on the same page.' },
    { q: 'Which is the best link text?', opts: ['click here', 'the 2026 survey report', 'link'], a: 1, why: 'Descriptive text makes links usable out of context.' },
  ],
  recap: {
    takeaways: ['Links are `<a href="…">text</a>`.', 'A full URL goes to another site; `#id` jumps within the page.', 'Write descriptive link text, never “click here”.'],
    syntaxExamples: [{ label: 'External + in-page', code: '<a href="https://example.com">report</a>\n<a href="#methods">methods</a>' }],
    commonMistakes: [
      { mistake: 'Using “click here” as link text', why: 'It is meaningless out of context and bad for accessibility.', fix: 'Describe the destination in the text.' },
      { mistake: 'Forgetting the href', why: 'An <a> with no href is not a link.', fix: 'Always include href.' },
    ],
    knowledgeChecks: [{ q: 'What element is a hyperlink?', opts: ['<link>', '<a>'], a: 1, why: 'The <a> (anchor) element makes hyperlinks.' }],
  },
  missions: [
    { id: 'li-html-paths-l01-seed', lessonId: 'li-html-paths-l01', tier: 'seed', title: 'One link', objective: 'A single descriptive link.', expected: 'An <a> with an href and text.', starter: '\n', hints: ['`<a href="https://example.com">archive</a>`'], xpReward: 15, checks: [{ kind: 'has', label: 'A link', sel: 'a[href]' }, { kind: 'text', label: 'Link has text', sel: 'a', nonEmpty: true }] },
    { id: 'li-html-paths-l01-sprout', lessonId: 'li-html-paths-l01', tier: 'sprout', title: 'In and out', objective: 'An external link and an in-page link.', expected: 'One http link and one # link.', starter: '\n', hints: ['One href starts with http, one with #.'], xpReward: 30, checks: [{ kind: 'has', label: 'External', sel: 'a[href^="http"]' }, { kind: 'has', label: 'In-page', sel: 'a[href^="#"]' }] },
    { id: 'li-html-paths-l01-bloom', lessonId: 'li-html-paths-l01', tier: 'bloom', title: 'The hub', objective: 'A heading with an id and four descriptive links including one back to the heading.', expected: 'A heading[id], four links, one to #, three external.', starter: '\n', hints: ['Four links; one jumps to the heading id.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading id', sel: ':is(h1,h2)[id]' }, { kind: 'count', label: 'Four links', sel: 'a[href]', min: 4 }, { kind: 'has', label: 'In-page link', sel: 'a[href^="#"]' }, { kind: 'count', label: 'Three external', sel: 'a[href^="http"]', min: 3 }] },
  ],
};

const lesson02: HtmlLesson = {
  ...L(2, 'Relative & absolute paths', 14, 150),
  objectives: ['Tell absolute from relative URLs', 'Link between pages in the same project with relative paths', 'Use ../ to go up a folder'],
  discover: {
    heading: 'Where a link points',
    lede: 'An **absolute** URL is the full address: `https://example.com/report`. A **relative** path is relative to the current page: `about.html` (same folder), `pages/about.html` (down into a folder), `../index.html` (up one folder). Relative paths keep a project portable — move the whole folder and the links still work.',
    example: '<a href="https://example.com">absolute</a>\n<a href="about.html">same folder</a>\n<a href="pages/team.html">a sub-folder</a>\n<a href="../index.html">up one folder</a>',
    exampleNote: '`about.html` sits beside the current page; `pages/team.html` is inside a `pages` folder; `../` climbs up one level.',
    tip: 'Within your own site, prefer relative paths.',
  },
  experiment: { heading: 'Walk the folders', lede: 'Write links that move around a project.', steps: ['A link to a page in the same folder', 'A link down into a `pages/` folder', 'A link up with `../`'], tip: '../ means “the folder above”.', starter: '<a href="index.html">home</a>\n<a href="pages/about.html">about</a>\n<a href="../index.html">up</a>\n' },
  practice: {
    heading: 'Three relative links', lede: 'Build a small nav that links within a project using only relative paths.',
    steps: ['A same-folder link (e.g. `about.html`)', 'A sub-folder link (e.g. `pages/contact.html`)', 'A parent-folder link using `../`'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Three links', sel: 'a[href]', min: 3 },
      { kind: 'absent', label: 'No absolute http links', sel: 'a[href^="http"]', fail: 'Use relative paths only — no http URLs.' },
      { kind: 'has', label: 'A sub-folder link', sel: 'a[href*="/"]', fail: 'Include a link into a folder, e.g. pages/x.html.' },
      { kind: 'has', label: 'A parent link with ../', sel: 'a[href^="../"]', fail: 'Include a link starting with ../.' },
    ],
    hints: ['`about.html`, `pages/contact.html`, `../index.html`.', 'No `https://` here — relative only.'],
  },
  challenge: {
    heading: 'A portable menu', lede: 'Without help: a navigation of four relative links — same folder, a sub-folder, a deeper sub-folder, and a parent with `../` — and no absolute URLs.', starter: '\n',
    checks: [
      { kind: 'count', label: 'Four links', sel: 'a[href]', min: 4 },
      { kind: 'absent', label: 'No absolute URLs', sel: 'a[href^="http"]' },
      { kind: 'has', label: 'A parent link', sel: 'a[href^="../"]' },
      { kind: 'has', label: 'A nested path', sel: 'a[href*="/"]' },
    ],
    hints: ['`a.html`, `sec/b.html`, `sec/deep/c.html`, `../home.html`.', 'Keep every href relative.'],
  },
  quiz: [
    { q: 'Which is an absolute URL?', opts: ['about.html', 'https://example.com/about', '../about.html'], a: 1, why: 'An absolute URL includes the full scheme and host.' },
    { q: 'What does ../ mean in a path?', opts: ['The current folder', 'The folder above', 'The site root'], a: 1, why: '../ goes up one directory level.' },
    { q: 'Why prefer relative paths within a site?', opts: ['They are shorter to type', 'The project stays portable if moved', 'They load faster'], a: 1, why: 'Relative links survive moving the whole folder.' },
  ],
  recap: {
    takeaways: ['Absolute URLs include the host; relative paths are relative to the current page.', '`file.html` = same folder, `dir/file.html` = down, `../file.html` = up.', 'Use relative paths within your own project.'],
    syntaxExamples: [{ label: 'Relative paths', code: '<a href="about.html">same</a>\n<a href="pages/x.html">down</a>\n<a href="../index.html">up</a>' }],
    commonMistakes: [
      { mistake: 'Hard-coding absolute URLs to your own pages', why: 'They break when the site moves or changes domain.', fix: 'Link internally with relative paths.' },
      { mistake: 'Losing track of ../ levels', why: 'Too many or too few ../ points to the wrong place.', fix: 'Count folders from the current page.' },
    ],
    knowledgeChecks: [{ q: 'Which goes up a folder?', opts: ['./', '../'], a: 1, why: '../ climbs one level up.' }],
  },
  missions: [
    { id: 'li-html-paths-l02-seed', lessonId: 'li-html-paths-l02', tier: 'seed', title: 'Same folder', objective: 'A relative link in the same folder.', expected: 'A link to a .html with no host.', starter: '\n', hints: ['`<a href="about.html">about</a>`'], xpReward: 15, checks: [{ kind: 'has', label: 'A relative link', sel: 'a[href$=".html"]' }, { kind: 'absent', label: 'No http', sel: 'a[href^="http"]' }] },
    { id: 'li-html-paths-l02-sprout', lessonId: 'li-html-paths-l02', tier: 'sprout', title: 'Up and down', objective: 'A sub-folder link and a parent link.', expected: 'One nested path and one ../ path.', starter: '\n', hints: ['`pages/x.html` and `../index.html`.'], xpReward: 30, checks: [{ kind: 'has', label: 'Nested', sel: 'a[href*="/"]' }, { kind: 'has', label: 'Parent', sel: 'a[href^="../"]' }, { kind: 'absent', label: 'No http', sel: 'a[href^="http"]' }] },
    { id: 'li-html-paths-l02-bloom', lessonId: 'li-html-paths-l02', tier: 'bloom', title: 'The site map', objective: 'Five relative links spanning same, down, deep and up, all portable.', expected: 'Five relative links, including ../ and a two-level nested path, no http.', starter: '\n', hints: ['Include `a/b/c.html` and `../x.html`.'], xpReward: 50, checks: [{ kind: 'count', label: 'Five links', sel: 'a[href]', min: 5 }, { kind: 'absent', label: 'No http', sel: 'a[href^="http"]' }, { kind: 'has', label: 'Deep nested', sel: 'a[href*="/"][href*="/"]' }, { kind: 'has', label: 'Parent', sel: 'a[href^="../"]' }] },
  ],
};

const lesson03: HtmlLesson = {
  ...L(3, 'Images', 14, 150),
  objectives: ['Embed images with <img>', 'Always provide meaningful alt text', 'Set width and height to reserve space'],
  discover: {
    heading: 'Pictures with meaning',
    lede: 'The `<img>` element embeds an image. It is **void** — no closing tag. `src` is the path to the image; `alt` is a text description for people who cannot see it (and shows if the image fails). Decorative images get an empty `alt=""`. Setting `width` and `height` lets the browser reserve space before the image loads.',
    example: '<img src="amethyst.jpg" alt="A cluster of violet amethyst crystals" width="320" height="240">\n<img src="divider.png" alt="">',
    exampleNote: 'The first image describes its content for assistive tech; the second is decorative, so its `alt` is empty — but the attribute is still present.',
    tip: 'Every <img> needs an alt attribute: describe content, or leave it empty for decoration. (This sandbox blocks external images, so you may see a broken icon — the markup is what matters.)',
  },
  experiment: { heading: 'Place an image', lede: 'Add images with good alt text.', steps: ['Add an `<img>` with a `src` and a descriptive `alt`', 'Add a decorative image with `alt=""`', 'Give one image `width` and `height`'], tip: 'alt is required; make it describe the image’s meaning.', starter: '<img src="quartz.jpg" alt="A clear quartz point" width="200" height="200">\n' },
  practice: {
    heading: 'Two images, two kinds of alt', lede: 'Add a content image with descriptive alt and a decorative image with empty alt.',
    steps: ['An `<img>` with a `src` and a meaningful `alt`', 'A decorative `<img>` with `alt=""`', 'Give the content image `width` and `height`'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Two images', sel: 'img', equals: 2 },
      { kind: 'every', label: 'Every image has a src', sel: 'img', name: 'src' },
      { kind: 'has', label: 'A content image has non-empty alt', sel: 'img[alt]:not([alt=""])', fail: 'One image needs descriptive alt text.' },
      { kind: 'has', label: 'A decorative image has empty alt', sel: 'img[alt=""]', fail: 'One image should have alt="".' },
      { kind: 'has', label: 'An image sets width and height', sel: 'img[width][height]' },
    ],
    hints: ['`<img src="x.jpg" alt="a description" width="200" height="150">`', 'Decorative: `<img src="line.png" alt="">`.'],
  },
  challenge: {
    heading: 'A specimen gallery', lede: 'Without help: three images — each with a src — where at least two have descriptive alt text and at least one has width and height; no image may be missing its alt attribute.', starter: '\n',
    checks: [
      { kind: 'count', label: 'Three images', sel: 'img', min: 3 },
      { kind: 'every', label: 'Every image has alt', sel: 'img', name: 'src' },
      { kind: 'absent', label: 'No image missing alt', sel: 'img:not([alt])', fail: 'Every <img> must have an alt attribute.' },
      { kind: 'count', label: 'At least two descriptive alts', sel: 'img[alt]:not([alt=""])', min: 2 },
      { kind: 'has', label: 'One sets dimensions', sel: 'img[width][height]' },
    ],
    hints: ['Give every <img> an alt, even if empty.', 'Two should describe the image; set width/height on one.'],
  },
  quiz: [
    { q: 'What is alt text for?', opts: ['A caption shown under the image', 'A description for people who cannot see the image', 'The image file name'], a: 1, why: 'alt describes the image for assistive tech and when it fails to load.' },
    { q: 'A purely decorative image should have…', opts: ['no alt attribute', 'alt=""', 'alt="decorative"'], a: 1, why: 'An empty alt tells assistive tech to skip it.' },
    { q: 'Why set width and height?', opts: ['To crop the image', 'To reserve space and avoid layout shift', 'It is required'], a: 1, why: 'Dimensions let the browser reserve space before the image loads.' },
  ],
  recap: {
    takeaways: ['`<img src alt>` embeds an image and is void.', 'Content images need descriptive `alt`; decorative ones use `alt=""`.', '`width`/`height` reserve space and reduce layout shift.'],
    syntaxExamples: [{ label: 'Image', code: '<img src="x.jpg" alt="a clear description" width="320" height="240">' }],
    commonMistakes: [
      { mistake: 'Omitting the alt attribute', why: 'Screen-reader users get nothing, and broken images show no fallback.', fix: 'Always include alt — descriptive or empty.' },
      { mistake: 'Putting the file name in alt', why: 'It does not describe the image.', fix: 'Describe what the image shows.' },
    ],
    knowledgeChecks: [{ q: 'Is <img> void?', opts: ['Yes', 'No'], a: 0, why: '<img> has no closing tag.' }],
  },
  missions: [
    { id: 'li-html-paths-l03-seed', lessonId: 'li-html-paths-l03', tier: 'seed', title: 'Describe it', objective: 'One image with descriptive alt.', expected: 'An <img> with src and non-empty alt.', starter: '\n', hints: ['`<img src="x.jpg" alt="a cat">`'], xpReward: 15, checks: [{ kind: 'has', label: 'Image with alt', sel: 'img[alt]:not([alt=""])' }] },
    { id: 'li-html-paths-l03-sprout', lessonId: 'li-html-paths-l03', tier: 'sprout', title: 'Content & decoration', objective: 'A content image and a decorative one.', expected: 'One img with descriptive alt, one with alt="".', starter: '\n', hints: ['Use alt="" for the decorative image.'], xpReward: 30, checks: [{ kind: 'has', label: 'Descriptive', sel: 'img[alt]:not([alt=""])' }, { kind: 'has', label: 'Decorative', sel: 'img[alt=""]' }] },
    { id: 'li-html-paths-l03-bloom', lessonId: 'li-html-paths-l03', tier: 'bloom', title: 'The plate', objective: 'A heading and three sized, described images with no missing alt.', expected: 'A heading, three <img> with src, all with alt, two descriptive, each with width/height.', starter: '\n', hints: ['Set width and height on each image.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1' }, { kind: 'count', label: 'Three images', sel: 'img', min: 3 }, { kind: 'absent', label: 'No missing alt', sel: 'img:not([alt])' }, { kind: 'count', label: 'Two sized', sel: 'img[width][height]', min: 2 }] },
  ],
};

const lesson04: HtmlLesson = {
  ...L(4, 'Navigation menus', 14, 150),
  objectives: ['Build a navigation from a list of links', 'Use the <nav> landmark', 'Mark the current page'],
  discover: {
    heading: 'A menu is a list of links',
    lede: 'A navigation menu is just a **list of links** inside a `<nav>` landmark. Using an unordered list (`<ul>` with `<li>`) gives assistive tech the count and structure; the `<nav>` tells it “this is navigation”. Mark the current page with `aria-current="page"`.',
    example: '<nav>\n  <ul>\n    <li><a href="index.html" aria-current="page">Home</a></li>\n    <li><a href="survey.html">Survey</a></li>\n    <li><a href="about.html">About</a></li>\n  </ul>\n</nav>',
    exampleNote: 'The links live in list items inside a `<nav>`. `aria-current="page"` marks which link is the page you are on.',
    tip: 'Wrap site navigation in <nav>, and build it from a list.',
  },
  experiment: { heading: 'Build a menu', lede: 'Make a small nav from a list.', steps: ['Wrap a `<ul>` of links in `<nav>`', 'Use `<li>` for each link', 'Mark one with `aria-current="page"`'], tip: 'Each link is an <li> containing an <a>.', starter: '<nav>\n  <ul>\n    <li><a href="index.html">Home</a></li>\n    <li><a href="survey.html">Survey</a></li>\n  </ul>\n</nav>\n' },
  practice: {
    heading: 'A four-item menu', lede: 'Build a navigation list of four links inside a nav, marking the current page.',
    steps: ['A `<nav>` wrapping a `<ul>`', 'Four `<li>`, each with an `<a>`', 'One link has `aria-current="page"`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A <nav> landmark', sel: 'nav', fail: 'Wrap the menu in <nav>.' },
      { kind: 'has', label: 'A list inside nav', sel: 'nav ul' },
      { kind: 'count', label: 'Four list items', sel: 'nav li', equals: 4 },
      { kind: 'count', label: 'Four links', sel: 'nav li a', equals: 4 },
      { kind: 'has', label: 'The current page is marked', sel: 'nav a[aria-current="page"]', fail: 'Add aria-current="page" to the current link.' },
    ],
    hints: ['Each item is `<li><a href="…">Label</a></li>`.', 'Put the whole `<ul>` inside `<nav>`.'],
  },
  challenge: {
    heading: 'A header navigation', lede: 'Without help: a `<nav>` containing a list of five relative links, exactly one marked as the current page, all with descriptive text.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A nav', sel: 'nav' },
      { kind: 'count', label: 'Five links in a list', sel: 'nav li a', equals: 5 },
      { kind: 'count', label: 'Exactly one current', sel: 'nav a[aria-current="page"]', equals: 1 },
      { kind: 'absent', label: 'No absolute URLs', sel: 'nav a[href^="http"]' },
    ],
    hints: ['Five `<li>`, each with a relative-link `<a>`.', 'Only one link is aria-current="page".'],
  },
  quiz: [
    { q: 'What element wraps site navigation?', opts: ['<menu>', '<nav>', '<div>'], a: 1, why: '<nav> is the navigation landmark.' },
    { q: 'Why build menus from a list?', opts: ['It looks nicer', 'It gives assistive tech structure and a count', 'It is required by browsers'], a: 1, why: 'A list conveys structure and number of items.' },
    { q: 'How do you mark the current page?', opts: ['class="current"', 'aria-current="page"', 'selected'], a: 1, why: 'aria-current="page" is the accessible way to mark it.' },
  ],
  recap: {
    takeaways: ['Navigation is a list of links inside `<nav>`.', 'Use `<ul>`/`<li>` for structure.', 'Mark the current page with `aria-current="page"`.'],
    syntaxExamples: [{ label: 'Menu', code: '<nav><ul><li><a href="x.html">X</a></li></ul></nav>' }],
    commonMistakes: [
      { mistake: 'A row of bare links with no list or nav', why: 'Assistive tech loses the structure and landmark.', fix: 'Wrap links in <ul>/<li> inside <nav>.' },
      { mistake: 'Marking the current page only with colour', why: 'Colour alone is not announced.', fix: 'Add aria-current="page".' },
    ],
    knowledgeChecks: [{ q: 'Each menu item is…', opts: ['an <a> in an <li>', 'a <nav>'], a: 0, why: 'Items are <li> containing an <a>.' }],
  },
  missions: [
    { id: 'li-html-paths-l04-seed', lessonId: 'li-html-paths-l04', tier: 'seed', title: 'A tiny menu', objective: 'A nav with two links in a list.', expected: 'A <nav> with a <ul> of two <li> links.', starter: '\n', hints: ['`<nav><ul><li><a>…</a></li></ul></nav>`'], xpReward: 15, checks: [{ kind: 'has', label: 'nav', sel: 'nav ul' }, { kind: 'count', label: 'Two links', sel: 'nav li a', min: 2 }] },
    { id: 'li-html-paths-l04-sprout', lessonId: 'li-html-paths-l04', tier: 'sprout', title: 'Mark current', objective: 'A menu that marks the current page.', expected: 'A nav list with aria-current="page" on one link.', starter: '\n', hints: ['Add aria-current="page".'], xpReward: 30, checks: [{ kind: 'has', label: 'nav list', sel: 'nav li a' }, { kind: 'has', label: 'current', sel: 'nav a[aria-current="page"]' }] },
    { id: 'li-html-paths-l04-bloom', lessonId: 'li-html-paths-l04', tier: 'bloom', title: 'The site header', objective: 'A header nav of six relative links, one current, with a site title.', expected: 'A heading plus a nav of six list links, one aria-current, no absolute URLs.', starter: '\n', hints: ['Six items, one current, all relative.'], xpReward: 50, checks: [{ kind: 'has', label: 'Title', sel: 'h1' }, { kind: 'count', label: 'Six links', sel: 'nav li a', min: 6 }, { kind: 'count', label: 'One current', sel: 'nav a[aria-current="page"]', equals: 1 }, { kind: 'absent', label: 'No absolute', sel: 'nav a[href^="http"]' }] },
  ],
};

const lesson05: HtmlLesson = {
  ...L(5, 'Organising files', 12, 140),
  objectives: ['Structure a project with sensible folders', 'Use index.html as a default page', 'Link reliably between pages and assets'],
  discover: {
    heading: 'A tidy project',
    lede: 'A small site is a folder of files. `index.html` is the conventional **default page** a server serves for a folder. Keep assets in sub-folders — images in `images/`, pages in `pages/` — and link to them with relative paths. A tidy structure makes links predictable: `images/logo.png`, `pages/about.html`, `../index.html`.',
    example: '<!-- project/ index.html, about.html, images/logo.png -->\n<a href="index.html">Home</a>\n<a href="about.html">About</a>\n<img src="images/logo.png" alt="Survey logo">',
    exampleNote: 'From `index.html`, `about.html` is a sibling and `images/logo.png` is one folder down. If `about.html` lived in `pages/`, it would link home with `../index.html`.',
    tip: 'index.html is the front door; group assets into folders and link relatively.',
  },
  experiment: { heading: 'Wire a project', lede: 'Link a home page to a page and an image.', steps: ['Link to `about.html`', 'Embed `images/logo.png` with alt', 'Imagine the folder layout as you go'], tip: 'The paths are relative to the file you are editing.', starter: '<a href="about.html">About</a>\n<img src="images/logo.png" alt="Logo">\n' },
  practice: {
    heading: 'A home page’s links', lede: 'From an index page, link to two sibling pages and embed an image from an images/ folder.',
    steps: ['Two relative links to sibling `.html` pages', 'An `<img>` whose `src` is `images/…` with alt', 'No absolute URLs'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Two page links', sel: 'a[href$=".html"]', min: 2 },
      { kind: 'has', label: 'An image from images/', sel: 'img[src^="images/"]', fail: 'Use src="images/…".' },
      { kind: 'every', label: 'The image has alt', sel: 'img', name: 'src' },
      { kind: 'absent', label: 'No absolute URLs', sel: '[href^="http"], [src^="http"]' },
    ],
    hints: ['`<a href="about.html">`, `<img src="images/logo.png" alt="…">`.', 'Keep everything relative.'],
  },
  challenge: {
    heading: 'A page inside pages/', lede: 'Without help: imagine this file is `pages/about.html`. Link back to the home page with `../index.html`, link to a sibling `pages/contact.html`, and embed an image from `../images/` with alt.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A link up to home', sel: 'a[href="../index.html"]', fail: 'Link home with ../index.html.' },
      { kind: 'has', label: 'A sibling page link', sel: 'a[href="contact.html"], a[href$="/contact.html"]' },
      { kind: 'has', label: 'An image from ../images/', sel: 'img[src^="../images/"]' },
      { kind: 'every', label: 'The image has alt', sel: 'img', name: 'src' },
    ],
    hints: ['From pages/, home is `../index.html`.', 'Images in a top-level images/ are `../images/…` from here.'],
  },
  quiz: [
    { q: 'What is index.html usually?', opts: ['A list of every page', 'The default page served for a folder', 'A required system file'], a: 1, why: 'Servers serve index.html by default for a directory.' },
    { q: 'From pages/about.html, how do you link to index.html at the root?', opts: ['index.html', '../index.html', 'pages/index.html'], a: 1, why: 'Climb up one folder with ../.' },
    { q: 'Where should images usually live?', opts: ['Mixed in with HTML files', 'In a dedicated folder like images/', 'Only as absolute URLs'], a: 1, why: 'Grouping assets keeps the project tidy and links predictable.' },
  ],
  recap: {
    takeaways: ['`index.html` is the default page for a folder.', 'Group assets into folders (images/, pages/).', 'Link between pages and assets with relative paths.'],
    syntaxExamples: [{ label: 'From the root', code: '<a href="about.html">About</a>\n<img src="images/logo.png" alt="Logo">' }, { label: 'From pages/', code: '<a href="../index.html">Home</a>' }],
    commonMistakes: [
      { mistake: 'Forgetting ../ when a page is in a sub-folder', why: 'The link points to the wrong place.', fix: 'Count folders up to the target and add ../ per level.' },
      { mistake: 'Dumping every file in one folder', why: 'The project gets hard to navigate.', fix: 'Group pages and assets into folders.' },
    ],
    knowledgeChecks: [{ q: 'The default page name is…', opts: ['home.html', 'index.html'], a: 1, why: 'index.html is served by default.' }],
  },
  missions: [
    { id: 'li-html-paths-l05-seed', lessonId: 'li-html-paths-l05', tier: 'seed', title: 'Home link', objective: 'A link to index.html.', expected: 'A relative link to index.html.', starter: '\n', hints: ['`<a href="index.html">Home</a>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Home link', sel: 'a[href="index.html"]' }] },
    { id: 'li-html-paths-l05-sprout', lessonId: 'li-html-paths-l05', tier: 'sprout', title: 'Asset folder', objective: 'Link a page and an image from a folder.', expected: 'A .html link and an images/ image with alt.', starter: '\n', hints: ['`images/logo.png`.'], xpReward: 30, checks: [{ kind: 'has', label: 'Page link', sel: 'a[href$=".html"]' }, { kind: 'has', label: 'Folder image', sel: 'img[src^="images/"]' }] },
    { id: 'li-html-paths-l05-bloom', lessonId: 'li-html-paths-l05', tier: 'bloom', title: 'The sub-page', objective: 'From pages/, link home with ../, link a sibling, and show an image from ../images/.', expected: 'A ../index.html link, a sibling link, and a ../images/ image with alt.', starter: '\n', hints: ['Everything is relative to pages/.'], xpReward: 50, checks: [{ kind: 'has', label: 'Home up', sel: 'a[href="../index.html"]' }, { kind: 'has', label: 'Parent image', sel: 'img[src^="../images/"]' }, { kind: 'absent', label: 'No absolute', sel: '[href^="http"], [src^="http"]' }] },
  ],
};

export const PATHS_LESSONS: HtmlLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
