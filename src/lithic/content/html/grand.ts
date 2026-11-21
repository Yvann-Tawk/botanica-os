// The Foundation · Mini-Planet 08 · The Grand Construction — bringing it together: multi-page structure, shared
// navigation, semantic page layout, a contact form, and the planet's final project (a complete website page).

import type { HtmlLesson } from '../types';

const L = (n: number, title: string, minutes: number, xp: number): Pick<HtmlLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-html-grand-l${String(n).padStart(2, '0')}`, conceptId: `lithic.html.grand.l${n}`, planetId: 'foundation', conceptKey: 'lithic.html.grand', number: n, title, minutes, xp,
});

const lesson01: HtmlLesson = {
  ...L(1, 'Multi-page structure', 16, 180),
  objectives: ['Plan a site as several linked pages', 'Keep a consistent document skeleton across pages', 'Use index.html as the entry page'],
  discover: {
    heading: 'More than one page',
    lede: 'A real site is several HTML files that link to each other — `index.html`, `about.html`, `contact.html`. Each is a complete, valid document with the same skeleton, so pages feel consistent. The shared parts (header, nav, footer) repeat on every page; only the `<main>` content changes.',
    example: '<!-- index.html -->\n<!doctype html>\n<html lang="en">\n  <head><meta charset="utf-8"><title>Meridian Survey — Home</title></head>\n  <body>\n    <header><h1>Meridian Survey</h1></header>\n    <main><p>Welcome.</p></main>\n    <footer><a href="about.html">About</a></footer>\n  </body>\n</html>',
    exampleNote: 'Every page shares this skeleton; `about.html` would differ only in its `<title>` and its `<main>` content.',
    tip: 'Consistent skeleton across pages, unique content in <main>.',
  },
  experiment: { heading: 'Draft a page', lede: 'Build one page of a multi-page site.', steps: ['A valid document with a page-specific `<title>`', 'A shared `<header>` and `<footer>`', 'A link to another page'], tip: 'Each page is a full document.', starter: '<!doctype html>\n<html lang="en">\n  <head><meta charset="utf-8"><title>Home</title></head>\n  <body>\n    <header><h1>Site</h1></header>\n    <main><p>Home page.</p></main>\n    <footer><a href="about.html">About</a></footer>\n  </body>\n</html>\n' },
  practice: {
    heading: 'The home page', lede: 'Build a complete index page with a shared header/footer and links to two other pages.',
    steps: ['A valid document (doctype, lang, head with title)', 'A `<header>`, a `<main>`, and a `<footer>`', 'Links to `about.html` and `contact.html`'], starter: '\n',
    checks: [
      { kind: 'doctype', label: 'Declares the doctype' },
      { kind: 'attr', label: 'html has lang', sel: 'html', name: 'lang', present: true },
      { kind: 'has', label: 'A page title', sel: 'title' },
      { kind: 'has', label: 'Header, main and footer', sel: 'body header', fail: 'Include header, main and footer.' },
      { kind: 'has', label: 'Has a main', sel: 'main' },
      { kind: 'has', label: 'Has a footer', sel: 'footer' },
      { kind: 'has', label: 'Links to about.html', sel: 'a[href="about.html"]', fail: 'Link to about.html.' },
      { kind: 'has', label: 'Links to contact.html', sel: 'a[href="contact.html"]' },
    ],
    hints: ['Reuse the skeleton; put the links in the header or footer.', 'Relative links: `about.html`, `contact.html`.'],
  },
  challenge: {
    heading: 'A second page', lede: 'Without help: build about.html — a complete, valid document with the same header/main/footer structure, a page-specific title, a link back to index.html, and two paragraphs of content in main.', starter: '\n',
    checks: [
      { kind: 'doctype', label: 'Doctype' },
      { kind: 'has', label: 'A title', sel: 'title' },
      { kind: 'has', label: 'Header', sel: 'body header' },
      { kind: 'has', label: 'A link home', sel: 'a[href="index.html"]', fail: 'Link back to index.html.' },
      { kind: 'count', label: 'Two paragraphs in main', sel: 'main p', min: 2 },
      { kind: 'has', label: 'Footer', sel: 'footer' },
    ],
    hints: ['Keep the same skeleton as the home page.', 'Change the title and the main content.'],
  },
  quiz: [
    { q: 'What stays consistent across pages?', opts: ['The main content', 'The skeleton and shared header/nav/footer', 'Nothing'], a: 1, why: 'Shared structure gives a consistent feel.' },
    { q: 'What is the usual entry page?', opts: ['home.html', 'index.html', 'start.html'], a: 1, why: 'index.html is served by default.' },
    { q: 'What changes between pages?', opts: ['The doctype', 'The title and <main> content', 'The language'], a: 1, why: 'Each page has its own title and main content.' },
  ],
  recap: {
    takeaways: ['A site is several complete, linked HTML documents.', 'Keep the skeleton and shared regions consistent.', 'Only the `<title>` and `<main>` change per page.'],
    syntaxExamples: [{ label: 'Page link', code: '<a href="about.html">About</a>' }],
    commonMistakes: [
      { mistake: 'Different skeletons on each page', why: 'The site feels inconsistent and is harder to maintain.', fix: 'Reuse one skeleton across pages.' },
      { mistake: 'Absolute links between your own pages', why: 'They break when the site moves.', fix: 'Use relative links.' },
    ],
    knowledgeChecks: [{ q: 'Entry page name?', opts: ['index.html', 'main.html'], a: 0, why: 'index.html is the default.' }],
  },
  missions: [
    { id: 'li-html-grand-l01-seed', lessonId: 'li-html-grand-l01', tier: 'seed', title: 'A page', objective: 'A valid page linking to another.', expected: 'A valid document with a link to another page.', starter: '\n', hints: ['Skeleton + a relative link.'], xpReward: 15, checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'has', label: 'A page link', sel: 'a[href$=".html"]' }] },
    { id: 'li-html-grand-l01-sprout', lessonId: 'li-html-grand-l01', tier: 'sprout', title: 'Framed page', objective: 'A page with header/main/footer and two links.', expected: 'Landmarks and two page links.', starter: '\n', hints: ['header, main, footer + two links.'], xpReward: 30, checks: [{ kind: 'has', label: 'Header', sel: 'header' }, { kind: 'has', label: 'Main', sel: 'main' }, { kind: 'has', label: 'Footer', sel: 'footer' }, { kind: 'count', label: 'Two links', sel: 'a[href$=".html"]', min: 2 }] },
    { id: 'li-html-grand-l01-bloom', lessonId: 'li-html-grand-l01', tier: 'bloom', title: 'Two of three', objective: 'A home page linking to about and contact, fully structured.', expected: 'A valid, landmarked page linking to about.html and contact.html.', starter: '\n', hints: ['Link to both other pages.'], xpReward: 50, checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'has', label: 'Main', sel: 'main' }, { kind: 'has', label: 'about', sel: 'a[href="about.html"]' }, { kind: 'has', label: 'contact', sel: 'a[href="contact.html"]' }] },
  ],
};

const lesson02: HtmlLesson = {
  ...L(2, 'Shared navigation', 14, 180),
  objectives: ['Repeat the same nav on every page', 'Mark the current page with aria-current', 'Keep navigation in a nav landmark'],
  discover: {
    heading: 'One menu, every page',
    lede: 'A site’s **navigation** is the same list of links on every page, so visitors always know where they can go. Put it in a `<nav>`, build it from a list, and on each page mark the link to *that* page with `aria-current="page"`. The nav is identical everywhere except which link is current.',
    example: '<!-- on about.html -->\n<nav aria-label="Primary">\n  <ul>\n    <li><a href="index.html">Home</a></li>\n    <li><a href="about.html" aria-current="page">About</a></li>\n    <li><a href="contact.html">Contact</a></li>\n  </ul>\n</nav>',
    exampleNote: 'This nav appears on every page; on about.html, the About link carries `aria-current="page"`.',
    tip: 'Same nav everywhere; only the current marker moves.',
  },
  experiment: { heading: 'Build the nav', lede: 'Create a site nav with a current marker.', steps: ['A labelled `<nav>` with a list of three links', 'Mark one with `aria-current="page"`', 'Use relative links'], tip: 'The current page’s own link is aria-current.', starter: '<nav aria-label="Primary">\n  <ul>\n    <li><a href="index.html" aria-current="page">Home</a></li>\n    <li><a href="about.html">About</a></li>\n  </ul>\n</nav>\n' },
  practice: {
    heading: 'The site menu', lede: 'Build the shared navigation: a labelled nav with a three-link list, the current page marked, all relative links.',
    steps: ['A `<nav aria-label>`', 'A `<ul>` of three relative links', 'Exactly one `aria-current="page"`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A labelled nav', sel: 'nav[aria-label]', fail: 'Add a <nav aria-label>.' },
      { kind: 'count', label: 'Three links in a list', sel: 'nav li a', equals: 3 },
      { kind: 'count', label: 'Exactly one current', sel: 'nav a[aria-current="page"]', equals: 1 },
      { kind: 'absent', label: 'No absolute links', sel: 'nav a[href^="http"]' },
    ],
    hints: ['Three `<li>`, each a relative-link `<a>`.', 'One link is aria-current="page".'],
  },
  challenge: {
    heading: 'Nav on two pages', lede: 'Without help: show the same four-link nav as it would appear on two different pages — build two `<nav>` blocks, each labelled, each marking a different link as current.', starter: '\n',
    checks: [
      { kind: 'count', label: 'Two navs', sel: 'nav[aria-label]', min: 2 },
      { kind: 'count', label: 'Eight links total', sel: 'nav li a', min: 8 },
      { kind: 'count', label: 'Two current markers (one per nav)', sel: 'nav a[aria-current="page"]', equals: 2 },
      { kind: 'absent', label: 'No absolute links', sel: 'nav a[href^="http"]' },
    ],
    hints: ['Two nav blocks, four links each.', 'A different link is current in each.'],
  },
  quiz: [
    { q: 'How much of the nav changes between pages?', opts: ['All of it', 'Only which link is aria-current', 'The labels'], a: 1, why: 'The nav is identical except the current marker.' },
    { q: 'What marks the current page’s link?', opts: ['class="here"', 'aria-current="page"', 'selected'], a: 1, why: 'aria-current="page" is the accessible marker.' },
    { q: 'Where does navigation belong?', opts: ['In <footer> only', 'In a <nav> landmark', 'In <aside>'], a: 1, why: 'Navigation goes in a <nav> landmark.' },
  ],
  recap: {
    takeaways: ['Repeat the same nav on every page.', 'Mark the current page’s link with `aria-current="page"`.', 'Keep it in a labelled `<nav>` built from a list.'],
    syntaxExamples: [{ label: 'Current link', code: '<a href="about.html" aria-current="page">About</a>' }],
    commonMistakes: [
      { mistake: 'Different menus on different pages', why: 'Visitors get disoriented.', fix: 'Reuse one nav everywhere.' },
      { mistake: 'Forgetting to move aria-current per page', why: 'The wrong page appears current.', fix: 'Set aria-current on each page’s own link.' },
    ],
    knowledgeChecks: [{ q: 'Current-page attribute?', opts: ['aria-current', 'aria-selected'], a: 0, why: 'aria-current="page" marks the current page.' }],
  },
  missions: [
    { id: 'li-html-grand-l02-seed', lessonId: 'li-html-grand-l02', tier: 'seed', title: 'A nav', objective: 'A labelled nav list.', expected: 'A nav[aria-label] with list links.', starter: '\n', hints: ['`<nav aria-label>…<ul>…`'], xpReward: 15, checks: [{ kind: 'has', label: 'Labelled nav', sel: 'nav[aria-label]' }, { kind: 'has', label: 'List links', sel: 'nav li a' }] },
    { id: 'li-html-grand-l02-sprout', lessonId: 'li-html-grand-l02', tier: 'sprout', title: 'Mark current', objective: 'A nav with the current page marked.', expected: 'A nav list with one aria-current.', starter: '\n', hints: ['Add aria-current="page" to one link.'], xpReward: 30, checks: [{ kind: 'count', label: 'Links', sel: 'nav li a', min: 3 }, { kind: 'count', label: 'One current', sel: 'nav a[aria-current="page"]', equals: 1 }] },
    { id: 'li-html-grand-l02-bloom', lessonId: 'li-html-grand-l02', tier: 'bloom', title: 'Consistent nav', objective: 'The same nav shown current on two pages.', expected: 'Two labelled navs, each with a different current link, relative only.', starter: '\n', hints: ['Two navs, different current each.'], xpReward: 50, checks: [{ kind: 'count', label: 'Two navs', sel: 'nav[aria-label]', min: 2 }, { kind: 'count', label: 'Two current', sel: 'nav a[aria-current="page"]', equals: 2 }, { kind: 'absent', label: 'No absolute', sel: 'nav a[href^="http"]' }] },
  ],
};

const lesson03: HtmlLesson = {
  ...L(3, 'Semantic page layout', 18, 190),
  objectives: ['Compose a page from semantic regions', 'Arrange header, nav, main, aside and footer', 'Keep a clean outline within the layout'],
  discover: {
    heading: 'The whole page, composed',
    lede: 'A full page layout combines the landmarks you know into one coherent structure: a `<header>` (often containing the site title and `<nav>`), a `<main>` with the page content in `<section>`/`<article>`, an optional `<aside>`, and a `<footer>`. No `<div>` soup — each region is a meaningful element, and the headings form a clean outline.',
    example: '<body>\n  <header>\n    <h1>Meridian Survey</h1>\n    <nav aria-label="Primary">…</nav>\n  </header>\n  <main>\n    <article>\n      <h2>Latest dispatch</h2>\n      <p>…</p>\n    </article>\n    <aside aria-label="Related"><h2>See also</h2></aside>\n  </main>\n  <footer><p>&copy; 2026</p></footer>\n</body>',
    exampleNote: 'Header holds the title and nav; main holds the content (an article and an aside); footer closes. Every region is semantic.',
    tip: 'Compose the landmarks; keep the heading outline logical.',
  },
  experiment: { heading: 'Lay it out', lede: 'Compose a semantic page.', steps: ['A `<header>` with an `<h1>` and a `<nav>`', 'A `<main>` with an `<article>`', 'An `<aside>` and a `<footer>`'], tip: 'Nav usually lives inside the header.', starter: '<body>\n  <header><h1>Site</h1><nav aria-label="Primary"><ul><li><a href="#">Home</a></li></ul></nav></header>\n  <main><article><h2>Post</h2><p>…</p></article></main>\n  <footer><p>&copy; 2026</p></footer>\n</body>\n' },
  practice: {
    heading: 'A composed page', lede: 'Build a full semantic layout: header (title + nav), main (an article with a heading), an aside, and a footer — no div.',
    steps: ['A `<header>` with an `<h1>` and a labelled `<nav>`', 'A `<main>` with an `<article>` (h2 + paragraph)', 'An `<aside>` with a heading', 'A `<footer>`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'Header with a title', sel: 'header h1', fail: 'Put the <h1> in the <header>.' },
      { kind: 'has', label: 'Nav inside the header', sel: 'header nav[aria-label]', fail: 'Put a labelled <nav> in the header.' },
      { kind: 'has', label: 'Main with an article', sel: 'main article', fail: 'Add an <article> in <main>.' },
      { kind: 'has', label: 'An article heading', sel: 'article h2' },
      { kind: 'has', label: 'An aside with a heading', sel: 'aside :is(h2,h3)' },
      { kind: 'has', label: 'A footer', sel: 'footer' },
      { kind: 'absent', label: 'No div', sel: 'div', fail: 'Use semantic elements, not <div>.' },
    ],
    hints: ['Header → h1 + nav; main → article + aside; footer.', 'No `<div>` — every region is semantic.'],
  },
  challenge: {
    heading: 'A two-column semantic page', lede: 'Without help: a full page layout — header with title and labelled nav, a main with two articles (each h2 + content) and a labelled aside, and a footer — with one h1, a clean outline, and no div.', starter: '\n',
    checks: [
      { kind: 'has', label: 'Header title + nav', sel: 'header nav[aria-label]' },
      { kind: 'count', label: 'One h1', sel: 'h1', equals: 1 },
      { kind: 'count', label: 'Two articles', sel: 'main article', min: 2 },
      { kind: 'has', label: 'Labelled aside', sel: 'aside[aria-label]' },
      { kind: 'has', label: 'Footer', sel: 'footer' },
      { kind: 'absent', label: 'No div', sel: 'div' },
    ],
    hints: ['Two articles in main plus a labelled aside.', 'Keep a single h1 and no divs.'],
  },
  quiz: [
    { q: 'Where does the primary nav usually sit?', opts: ['In the footer', 'Inside the header', 'In an aside'], a: 1, why: 'Primary navigation commonly lives in the header.' },
    { q: 'What holds the page’s main content?', opts: ['<aside>', '<main>', '<header>'], a: 1, why: '<main> holds the primary content.' },
    { q: 'How many <div> should a clean layout need?', opts: ['Many', 'Ideally none — use semantic regions', 'Exactly one'], a: 1, why: 'Semantic elements replace layout divs.' },
  ],
  recap: {
    takeaways: ['Compose a page from header, nav, main, aside and footer.', 'Nav usually lives in the header; content in main.', 'Keep one h1, a clean outline, and avoid div soup.'],
    syntaxExamples: [{ label: 'Layout', code: '<header><h1>…</h1><nav>…</nav></header>\n<main><article>…</article><aside>…</aside></main>\n<footer>…</footer>' }],
    commonMistakes: [
      { mistake: 'Rebuilding landmarks out of <div>s', why: 'You lose all the semantics.', fix: 'Use the real elements.' },
      { mistake: 'Multiple h1s in the layout', why: 'The outline becomes ambiguous.', fix: 'Keep a single h1.' },
    ],
    knowledgeChecks: [{ q: 'Primary content region?', opts: ['<main>', '<aside>'], a: 0, why: '<main> holds primary content.' }],
  },
  missions: [
    { id: 'li-html-grand-l03-seed', lessonId: 'li-html-grand-l03', tier: 'seed', title: 'Header + main', objective: 'A header with nav and a main.', expected: 'A header with a nav and a main.', starter: '\n', hints: ['Nav inside the header.'], xpReward: 15, checks: [{ kind: 'has', label: 'Header nav', sel: 'header nav' }, { kind: 'has', label: 'Main', sel: 'main' }] },
    { id: 'li-html-grand-l03-sprout', lessonId: 'li-html-grand-l03', tier: 'sprout', title: 'Full landmarks', objective: 'All five regions, no div.', expected: 'header, nav, main (article), aside, footer, no div.', starter: '\n', hints: ['Compose every landmark.'], xpReward: 30, checks: [{ kind: 'has', label: 'Header', sel: 'header' }, { kind: 'has', label: 'Main article', sel: 'main article' }, { kind: 'has', label: 'Aside', sel: 'aside' }, { kind: 'has', label: 'Footer', sel: 'footer' }, { kind: 'absent', label: 'No div', sel: 'div' }] },
    { id: 'li-html-grand-l03-bloom', lessonId: 'li-html-grand-l03', tier: 'bloom', title: 'The composed page', objective: 'A two-article layout with aside, one h1, no div.', expected: 'header nav, two articles, labelled aside, footer, one h1, no div.', starter: '\n', hints: ['Two articles + labelled aside.'], xpReward: 50, checks: [{ kind: 'has', label: 'Header nav', sel: 'header nav[aria-label]' }, { kind: 'count', label: 'Two articles', sel: 'main article', min: 2 }, { kind: 'has', label: 'Labelled aside', sel: 'aside[aria-label]' }, { kind: 'count', label: 'One h1', sel: 'h1', equals: 1 }, { kind: 'absent', label: 'No div', sel: 'div' }] },
  ],
};

const lesson04: HtmlLesson = {
  ...L(4, 'A contact form', 16, 190),
  objectives: ['Build an accessible contact form', 'Label every field and group related ones', 'Validate with built-in attributes'],
  discover: {
    heading: 'Putting forms to work',
    lede: 'A contact form brings the Control Room together: a `<form>` that posts, a labelled name field, a required email, a `<textarea>` for the message, maybe a fieldset of radio options, and a submit button. Every control has a `<label>`, required fields use `required`, and the email uses `type="email"` for free validation.',
    example: '<form action="/contact" method="post">\n  <label for="name">Name</label>\n  <input id="name" name="name" required>\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required>\n  <label for="msg">Message</label>\n  <textarea id="msg" name="message" required></textarea>\n  <button type="submit">Send</button>\n</form>',
    exampleNote: 'Three labelled controls, all required, the email validated by type, and a submit button — an accessible, validated contact form.',
    tip: 'Label everything, require the essentials, let type="email" validate.',
  },
  experiment: { heading: 'Draft the form', lede: 'Build a basic contact form.', steps: ['A labelled name input', 'A required email input', 'A labelled message `<textarea>` and a submit'], tip: 'Match each label’s for to its control’s id.', starter: '<form action="/contact" method="post">\n  <label for="name">Name</label>\n  <input id="name" name="name" required>\n  <button type="submit">Send</button>\n</form>\n' },
  practice: {
    heading: 'The contact form', lede: 'Build an accessible contact form: labelled name, required email, labelled message textarea, and a submit, posting to an endpoint.',
    steps: ['A `<form action method="post">`', 'A labelled name input (`required`)', 'A labelled email input (`type="email"` + `required`)', 'A labelled `<textarea>` and a submit button'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A posting form', sel: 'form[action][method="post"]', fail: 'Add a form that posts to an action.' },
      { kind: 'count', label: 'Three labels with for', sel: 'label[for]', min: 3 },
      { kind: 'has', label: 'A required email', sel: 'input[type="email"][required]', fail: 'Add a required email input.' },
      { kind: 'has', label: 'A message textarea', sel: 'textarea[name]', fail: 'Add a named <textarea>.' },
      { kind: 'has', label: 'A submit button', sel: ':is(button[type="submit"], input[type="submit"])' },
      { kind: 'absent', label: 'No unnamed controls', sel: ':is(input,textarea,select):not([name])', fail: 'Every control needs a name.' },
    ],
    hints: ['Label name, email and message; match for/id.', 'Email: `type="email" required`. Message: `<textarea name>`.'],
  },
  challenge: {
    heading: 'A grouped contact form', lede: 'Without help: an accessible contact form with labelled name, required email, a fieldset of at least two radio options (with a legend), a labelled message textarea, at least one field with aria-describedby help, and a submit — every control named.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A posting form', sel: 'form[action]' },
      { kind: 'count', label: 'At least three labels', sel: 'label[for]', min: 3 },
      { kind: 'has', label: 'A required email', sel: 'input[type="email"][required]' },
      { kind: 'has', label: 'A fieldset with a legend', sel: 'fieldset legend' },
      { kind: 'has', label: 'A described field', sel: '[aria-describedby]' },
      { kind: 'has', label: 'A submit button', sel: ':is(button[type="submit"], input[type="submit"])' },
      { kind: 'absent', label: 'No unnamed controls', sel: ':is(input,textarea,select):not([name])' },
    ],
    hints: ['Add a fieldset of radios with a legend.', 'Tie a help paragraph to a field with aria-describedby.'],
  },
  quiz: [
    { q: 'What validates an email field for free?', opts: ['pattern', 'type="email"', 'required alone'], a: 1, why: 'type="email" validates the format.' },
    { q: 'What holds a multi-line message?', opts: ['<input>', '<textarea>', '<select>'], a: 1, why: 'A <textarea> is for multi-line text.' },
    { q: 'How are radio options grouped accessibly?', opts: ['<fieldset> + <legend>', '<div>', 'placeholder'], a: 0, why: 'A fieldset with a legend names the group.' },
  ],
  recap: {
    takeaways: ['A contact form combines labels, required fields, and type-based validation.', 'Use a `<textarea>` for the message and a fieldset for options.', 'Every control is labelled and named.'],
    syntaxExamples: [{ label: 'Email + message', code: '<input type="email" required>\n<textarea name="message"></textarea>' }],
    commonMistakes: [
      { mistake: 'Unlabelled fields', why: 'The form is unusable with assistive tech.', fix: 'Label every control.' },
      { mistake: 'No required/type validation', why: 'Bad data slips through client-side.', fix: 'Use required and the right input type.' },
    ],
    knowledgeChecks: [{ q: 'Multi-line field?', opts: ['<input>', '<textarea>'], a: 1, why: '<textarea> holds multi-line text.' }],
  },
  missions: [
    { id: 'li-html-grand-l04-seed', lessonId: 'li-html-grand-l04', tier: 'seed', title: 'Name & send', objective: 'A labelled name field and submit.', expected: 'A form with a labelled name input and submit.', starter: '\n', hints: ['Label the name; add a submit.'], xpReward: 15, checks: [{ kind: 'has', label: 'Label', sel: 'label[for]' }, { kind: 'has', label: 'Submit', sel: ':is(button[type="submit"], input[type="submit"])' }] },
    { id: 'li-html-grand-l04-sprout', lessonId: 'li-html-grand-l04', tier: 'sprout', title: 'Email & message', objective: 'A required email and a message textarea.', expected: 'A required email and a named textarea, both labelled.', starter: '\n', hints: ['type=email required + a textarea.'], xpReward: 30, checks: [{ kind: 'has', label: 'Required email', sel: 'input[type="email"][required]' }, { kind: 'has', label: 'Textarea', sel: 'textarea[name]' }, { kind: 'count', label: 'Labels', sel: 'label[for]', min: 2 }] },
    { id: 'li-html-grand-l04-bloom', lessonId: 'li-html-grand-l04', tier: 'bloom', title: 'The full contact form', objective: 'A grouped, described, fully labelled contact form.', expected: 'Labels, required email, fieldset+legend, aria-describedby, textarea, submit, all named.', starter: '\n', hints: ['Combine every form technique.'], xpReward: 50, checks: [{ kind: 'count', label: 'Labels', sel: 'label[for]', min: 3 }, { kind: 'has', label: 'Required email', sel: 'input[type="email"][required]' }, { kind: 'has', label: 'Fieldset legend', sel: 'fieldset legend' }, { kind: 'has', label: 'Described', sel: '[aria-describedby]' }, { kind: 'has', label: 'Textarea', sel: 'textarea[name]' }, { kind: 'absent', label: 'No unnamed controls', sel: ':is(input,textarea,select):not([name])' }] },
  ],
};

const lesson05: HtmlLesson = {
  ...L(5, 'Project: a complete website', 24, 250),
  objectives: ['Combine every HTML skill into one page', 'Build a valid, semantic, accessible document', 'Ship a portfolio-worthy result'],
  discover: {
    heading: 'The final construction',
    lede: 'This is the capstone of The Foundation. You will build **one complete, real webpage** that uses everything: a valid document, semantic landmarks, shared-style navigation, a clean heading outline, lists and/or a table, images with alt, an accessible contact form, and sound accessibility throughout. It is the kind of page you could ship. Take your time — this is your proof of the planet.',
    example: '<!doctype html>\n<html lang="en">\n  <head><meta charset="utf-8"><title>Meridian Survey</title></head>\n  <body>\n    <header><h1>Meridian Survey</h1>\n      <nav aria-label="Primary"><ul><li><a href="index.html" aria-current="page">Home</a></li><li><a href="contact.html">Contact</a></li></ul></nav>\n    </header>\n    <main>\n      <article>\n        <h2>About the survey</h2>\n        <p>…</p>\n        <figure><img src="site.jpg" alt="The dig site at dawn"><figcaption>The dig site.</figcaption></figure>\n        <h2>Findings</h2>\n        <table><caption>Hardness</caption><thead><tr><th scope="col">Mineral</th><th scope="col">Mohs</th></tr></thead><tbody><tr><th scope="row">Quartz</th><td>7</td></tr></tbody></table>\n      </article>\n      <section>\n        <h2>Contact</h2>\n        <form action="/contact" method="post">\n          <label for="email">Email</label>\n          <input id="email" name="email" type="email" required>\n          <label for="msg">Message</label>\n          <textarea id="msg" name="message" required></textarea>\n          <button type="submit">Send</button>\n        </form>\n      </section>\n    </main>\n    <footer><p>&copy; 2026 Meridian Survey</p></footer>\n  </body>\n</html>',
    exampleNote: 'One page, everything in it: valid skeleton, landmarks, a current-marked nav, a clean outline, a captioned figure, an accessible table, and a validated contact form.',
    tip: 'This page is your Foundation capstone — make it one you would show off.',
  },
  experiment: { heading: 'Assemble the pieces', lede: 'Start composing your complete page from the skeleton up.', steps: ['Begin with a valid document and landmarks', 'Add a current-marked nav and a clean heading outline', 'Bring in a figure/table and the contact form'], tip: 'Build region by region; check as you go.', starter: '<!doctype html>\n<html lang="en">\n  <head><meta charset="utf-8"><title>My Site</title></head>\n  <body>\n    <header><h1>My Site</h1><nav aria-label="Primary"><ul><li><a href="index.html" aria-current="page">Home</a></li></ul></nav></header>\n    <main>\n      <article><h2>About</h2><p>…</p></article>\n    </main>\n    <footer><p>&copy; 2026</p></footer>\n  </body>\n</html>\n' },
  practice: {
    heading: 'The complete website (guided)', lede: 'Build a complete page that passes the capstone checklist: valid document, landmarks, current-marked nav, outline, images with alt, and an accessible contact form.',
    steps: ['A valid document (doctype, `html lang`, `title`, `charset`)', 'Header (with `h1` + labelled nav marking the current page), main, footer', 'In main: at least two `<h2>` sections and an image with `alt`', 'An accessible contact form (labelled email + message, submit)'], starter: '\n',
    checks: [
      { kind: 'doctype', label: 'Valid doctype' },
      { kind: 'attr', label: 'html has lang', sel: 'html', name: 'lang', present: true },
      { kind: 'has', label: 'A non-empty title', sel: 'title' },
      { kind: 'has', label: 'Header with an h1', sel: 'header h1' },
      { kind: 'has', label: 'A current-marked nav', sel: 'header nav a[aria-current="page"]', fail: 'Mark the current page in the nav.' },
      { kind: 'count', label: 'Exactly one h1', sel: 'h1', equals: 1 },
      { kind: 'count', label: 'At least two h2 sections', sel: 'h2', min: 2 },
      { kind: 'absent', label: 'No image missing alt', sel: 'img:not([alt])' },
      { kind: 'has', label: 'An accessible contact form', sel: 'form label[for]', fail: 'Add a labelled contact form.' },
      { kind: 'has', label: 'A required email in the form', sel: 'form input[type="email"][required]' },
      { kind: 'has', label: 'A submit button', sel: 'form :is(button[type="submit"], input[type="submit"])' },
      { kind: 'has', label: 'A footer', sel: 'footer' },
    ],
    hints: ['Work from the Discover example and make it your own.', 'Tick each requirement as you add it.'],
  },
  challenge: {
    heading: 'The capstone', lede: 'Without help: build a complete, polished, portfolio-worthy website page that pulls together the whole planet — valid and semantic, a labelled current-marked nav, a single h1 with a clean h2/h3 outline, a captioned figure, an accessible data table (caption + scope), lists, a fully accessible contact form, and no div soup or unlabelled controls.', starter: '\n',
    checks: [
      { kind: 'doctype', label: 'Valid doctype' },
      { kind: 'attr', label: 'html lang', sel: 'html', name: 'lang', present: true },
      { kind: 'has', label: 'Header nav (current-marked)', sel: 'header nav a[aria-current="page"]' },
      { kind: 'count', label: 'One h1', sel: 'h1', equals: 1 },
      { kind: 'count', label: 'A multi-section outline', sel: 'h2', min: 2 },
      { kind: 'has', label: 'A captioned figure', sel: 'figure figcaption' },
      { kind: 'has', label: 'An accessible table', sel: 'table caption' },
      { kind: 'has', label: 'Scoped table headers', sel: 'th[scope]' },
      { kind: 'has', label: 'A list', sel: ':is(ul, ol) li' },
      { kind: 'has', label: 'A labelled, required contact field', sel: 'form input[required]' },
      { kind: 'has', label: 'A message textarea', sel: 'form textarea[name]' },
      { kind: 'absent', label: 'No image missing alt', sel: 'img:not([alt])' },
      { kind: 'absent', label: 'No unlabelled form controls', sel: 'form :is(input,textarea,select):not([name])' },
      { kind: 'absent', label: 'No div soup', sel: 'div' },
    ],
    hints: ['This is the whole planet in one page — take it region by region.', 'Figure + table + list + form + landmarks, all accessible, no div.'],
  },
  quiz: [
    { q: 'What makes a page “complete” here?', opts: ['Lots of colour', 'Valid, semantic, accessible markup covering the planet’s skills', 'A single heading'], a: 1, why: 'The capstone demonstrates the whole planet.' },
    { q: 'Should the capstone use clickable <div>s?', opts: ['Yes', 'No — native elements and landmarks'], a: 1, why: 'Use semantic, accessible elements.' },
    { q: 'What marks the current nav link?', opts: ['aria-current="page"', 'class only'], a: 0, why: 'aria-current="page" marks the current page.' },
  ],
  recap: {
    takeaways: ['The capstone combines every Foundation skill into one real page.', 'Valid, semantic, accessible — no div soup, every image and control labelled.', 'You have completed The Foundation: you can build real HTML.'],
    syntaxExamples: [{ label: 'The shape', code: '<header><h1>…</h1><nav>…</nav></header>\n<main>…(sections, figure, table, form)…</main>\n<footer>…</footer>' }],
    commonMistakes: [
      { mistake: 'Skipping accessibility under time pressure', why: 'The page excludes real users.', fix: 'Bake in labels, alt and landmarks from the start.' },
      { mistake: 'One giant section with no outline', why: 'The page is hard to navigate.', fix: 'Break content into headed sections.' },
    ],
    knowledgeChecks: [{ q: 'The Foundation teaches…', opts: ['Python', 'HTML'], a: 1, why: 'The Foundation is the HTML planet.' }],
  },
  missions: [
    { id: 'li-html-grand-l05-seed', lessonId: 'li-html-grand-l05', tier: 'seed', title: 'Valid & landmarked', objective: 'A valid, landmarked page.', expected: 'A valid doc with header, main and footer.', starter: '\n', hints: ['Doctype + landmarks.'], xpReward: 15, checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'has', label: 'Header', sel: 'header' }, { kind: 'has', label: 'Main', sel: 'main' }, { kind: 'has', label: 'Footer', sel: 'footer' }] },
    { id: 'li-html-grand-l05-sprout', lessonId: 'li-html-grand-l05', tier: 'sprout', title: 'Content & form', objective: 'A page with an outline and a labelled form.', expected: 'One h1, two h2, an image with alt, and a labelled form control.', starter: '\n', hints: ['Outline + an accessible form.'], xpReward: 30, checks: [{ kind: 'count', label: 'One h1', sel: 'h1', equals: 1 }, { kind: 'count', label: 'Two h2', sel: 'h2', min: 2 }, { kind: 'absent', label: 'No missing alt', sel: 'img:not([alt])' }, { kind: 'has', label: 'Labelled form', sel: 'form label[for]' }] },
    { id: 'li-html-grand-l05-bloom', lessonId: 'li-html-grand-l05', tier: 'bloom', title: 'The portfolio page', objective: 'A complete, accessible, div-free site page.', expected: 'Valid + landmarks + current nav + figure + table(caption+scope) + form, no div, no missing alt.', starter: '\n', hints: ['The full capstone, polished.'], xpReward: 50, checks: [{ kind: 'doctype', label: 'Doctype' }, { kind: 'has', label: 'Current nav', sel: 'header nav a[aria-current="page"]' }, { kind: 'has', label: 'Figure caption', sel: 'figure figcaption' }, { kind: 'has', label: 'Table caption', sel: 'table caption' }, { kind: 'has', label: 'Scoped header', sel: 'th[scope]' }, { kind: 'has', label: 'Form control', sel: 'form :is(input,textarea)[name]' }, { kind: 'absent', label: 'No div', sel: 'div' }, { kind: 'absent', label: 'No missing alt', sel: 'img:not([alt])' }] },
  ],
};

export const GRAND_LESSONS: HtmlLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
