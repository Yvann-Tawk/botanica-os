// The Foundation · Mini-Planet 07 · The Living Structure — media, embedding, responsive images, figures &
// captions, and accessibility best practices. External media does not load in the sandbox (CSP), so checks
// validate the markup — the HTML is what these lessons teach.

import type { HtmlLesson } from '../types';

const L = (n: number, title: string, minutes: number, xp: number): Pick<HtmlLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-html-living-l${String(n).padStart(2, '0')}`, conceptId: `lithic.html.living.l${n}`, planetId: 'foundation', conceptKey: 'lithic.html.living', number: n, title, minutes, xp,
});

const lesson01: HtmlLesson = {
  ...L(1, 'Audio & video', 14, 170),
  objectives: ['Embed media with <audio> and <video>', 'Offer multiple formats with <source>', 'Add controls and captions tracks'],
  discover: {
    heading: 'Sound and motion',
    lede: '`<audio>` and `<video>` embed media. Add the `controls` attribute so people can play, pause and seek. Offer several formats with nested `<source>` elements — the browser picks the first it supports — and provide fallback text. For video, a `<track kind="captions">` adds captions for accessibility.',
    example: '<video controls width="480">\n  <source src="survey.mp4" type="video/mp4">\n  <source src="survey.webm" type="video/webm">\n  <track kind="captions" src="survey.vtt" srclang="en" label="English">\n  Your browser cannot play this video.\n</video>',
    exampleNote: '`controls` shows the player. Two `<source>`s give format choices; the `<track>` adds captions; the text is a fallback.',
    tip: 'Always add controls, and captions for video.',
  },
  experiment: { heading: 'Embed media', lede: 'Add a video with controls and sources.', steps: ['A `<video controls>`', 'Two `<source>` with different `type`', 'A fallback message'], tip: 'Order <source> from most to least preferred.', starter: '<video controls width="400">\n  <source src="clip.mp4" type="video/mp4">\n  Cannot play video.\n</video>\n' },
  practice: {
    heading: 'A captioned video', lede: 'Embed a video with controls, two sources, a captions track, and fallback text.',
    steps: ['A `<video>` with `controls`', 'Two `<source>` elements with `type`', 'A `<track kind="captions">`', 'Fallback text inside'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A video with controls', sel: 'video[controls]', fail: 'Add the controls attribute.' },
      { kind: 'count', label: 'Two sources', sel: 'video source', min: 2 },
      { kind: 'every', label: 'Each source has a type', sel: 'video source', name: 'type' },
      { kind: 'has', label: 'A captions track', sel: 'video track[kind="captions"]', fail: 'Add a <track kind="captions">.' },
      { kind: 'text', label: 'Fallback text is present', sel: 'video', nonEmpty: true },
    ],
    hints: ['`<video controls>` with two `<source type="…">`.', 'Add `<track kind="captions" src="…" srclang="en">`.'],
  },
  challenge: {
    heading: 'An audio & video page', lede: 'Without help: a page with one audio player (controls + two sources) and one video player (controls + two sources + a captions track), each with fallback text.', starter: '\n',
    checks: [
      { kind: 'has', label: 'Audio with controls', sel: 'audio[controls]' },
      { kind: 'count', label: 'Two audio sources', sel: 'audio source', min: 2 },
      { kind: 'has', label: 'Video with controls', sel: 'video[controls]' },
      { kind: 'has', label: 'A captions track', sel: 'video track[kind="captions"]' },
    ],
    hints: ['Both players get controls and multiple sources.', 'Only the video needs a captions track.'],
  },
  quiz: [
    { q: 'What shows the play/pause UI?', opts: ['The autoplay attribute', 'The controls attribute', 'A <source>'], a: 1, why: 'controls shows the native player UI.' },
    { q: 'Why provide multiple <source>?', opts: ['For captions', 'So the browser can pick a supported format', 'For speed'], a: 1, why: 'The browser uses the first supported source.' },
    { q: 'What adds video captions?', opts: ['<caption>', '<track kind="captions">', 'alt'], a: 1, why: 'A <track kind="captions"> provides captions.' },
  ],
  recap: {
    takeaways: ['`<audio>`/`<video>` embed media; add `controls`.', 'Offer formats with nested `<source>` and fallback text.', 'Add `<track kind="captions">` to video for accessibility.'],
    syntaxExamples: [{ label: 'Video', code: '<video controls>\n  <source src="v.mp4" type="video/mp4">\n  <track kind="captions" src="v.vtt" srclang="en">\n</video>' }],
    commonMistakes: [
      { mistake: 'Omitting controls', why: 'People cannot play or pause the media.', fix: 'Add the controls attribute.' },
      { mistake: 'No captions on video', why: 'Deaf and hard-of-hearing users are excluded.', fix: 'Provide a captions track.' },
    ],
    knowledgeChecks: [{ q: 'Captions element?', opts: ['<track>', '<source>'], a: 0, why: '<track kind="captions"> adds captions.' }],
  },
  missions: [
    { id: 'li-html-living-l01-seed', lessonId: 'li-html-living-l01', tier: 'seed', title: 'A player', objective: 'A video with controls.', expected: 'A <video controls>.', starter: '\n', hints: ['`<video controls>…</video>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Video controls', sel: 'video[controls]' }] },
    { id: 'li-html-living-l01-sprout', lessonId: 'li-html-living-l01', tier: 'sprout', title: 'Multi-format', objective: 'A video with two sources.', expected: 'A video with two typed sources.', starter: '\n', hints: ['Two <source type="…">.'], xpReward: 30, checks: [{ kind: 'count', label: 'Two sources', sel: 'video source', min: 2 }, { kind: 'every', label: 'Typed', sel: 'video source', name: 'type' }] },
    { id: 'li-html-living-l01-bloom', lessonId: 'li-html-living-l01', tier: 'bloom', title: 'The accessible clip', objective: 'A captioned, multi-source video with audio too.', expected: 'A video with controls, two sources and a captions track, plus an audio player.', starter: '\n', hints: ['Add a captions track and an audio element.'], xpReward: 50, checks: [{ kind: 'has', label: 'Video controls', sel: 'video[controls]' }, { kind: 'count', label: 'Two sources', sel: 'video source', min: 2 }, { kind: 'has', label: 'Captions', sel: 'video track[kind="captions"]' }, { kind: 'has', label: 'Audio', sel: 'audio[controls]' }] },
  ],
};

const lesson02: HtmlLesson = {
  ...L(2, 'Embedding content', 14, 170),
  objectives: ['Embed external pages with <iframe>', 'Title every iframe for accessibility', 'Understand sandbox and loading'],
  discover: {
    heading: 'A window to elsewhere',
    lede: 'An `<iframe>` embeds another page (a map, a video player, a document). Every iframe needs a `title` describing its content, so assistive tech can announce it. Use `loading="lazy"` to defer off-screen frames, and `sandbox` to restrict what the embedded page can do. (This learning sandbox blocks external frames, so you validate the markup.)',
    example: '<iframe src="https://example.com/map" title="Map of the dig site" width="400" height="300" loading="lazy"></iframe>',
    exampleNote: 'The `title` names the frame for assistive tech; `loading="lazy"` defers it until needed; `width`/`height` reserve space.',
    tip: 'Never ship an iframe without a title.',
  },
  experiment: { heading: 'Frame a page', lede: 'Embed and title a frame.', steps: ['An `<iframe>` with a `src`', 'A descriptive `title`', 'Add `loading="lazy"`'], tip: 'The title describes what is inside the frame.', starter: '<iframe src="https://example.com" title="Example site" width="400" height="300" loading="lazy"></iframe>\n' },
  practice: {
    heading: 'A titled embed', lede: 'Embed a frame with a src, a descriptive title, dimensions, and lazy loading.',
    steps: ['An `<iframe>` with a `src`', 'A non-empty `title`', '`width` and `height`', '`loading="lazy"`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'An iframe with a src', sel: 'iframe[src]', fail: 'Add an <iframe src>.' },
      { kind: 'attr', label: 'The iframe has a title', sel: 'iframe', name: 'title', present: true, fail: 'Add a descriptive title.' },
      { kind: 'has', label: 'It sets dimensions', sel: 'iframe[width][height]' },
      { kind: 'has', label: 'It loads lazily', sel: 'iframe[loading="lazy"]', fail: 'Add loading="lazy".' },
    ],
    hints: ['`<iframe src="…" title="…" width="…" height="…" loading="lazy">`.', 'The title must describe the embedded content.'],
  },
  challenge: {
    heading: 'Two framed resources', lede: 'Without help: a page embedding two different iframes, each with a descriptive title, dimensions, and lazy loading, under a heading.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading', sel: 'h1, h2' },
      { kind: 'count', label: 'Two iframes', sel: 'iframe[src]', min: 2 },
      { kind: 'every', label: 'Each iframe has a title', sel: 'iframe', name: 'title' },
      { kind: 'count', label: 'Both lazy-loaded', sel: 'iframe[loading="lazy"]', min: 2 },
    ],
    hints: ['Two iframes, each titled and lazy.', 'Different src and titles for each.'],
  },
  quiz: [
    { q: 'What must every iframe have?', opts: ['autoplay', 'a title', 'a border'], a: 1, why: 'A title describes the frame for assistive tech.' },
    { q: 'What does loading="lazy" do?', opts: ['Blurs the frame', 'Defers loading until it is near view', 'Disables the frame'], a: 1, why: 'It defers off-screen frames to save loading.' },
    { q: 'What restricts an embedded page’s abilities?', opts: ['sandbox', 'title', 'loading'], a: 0, why: 'The sandbox attribute restricts the frame.' },
  ],
  recap: {
    takeaways: ['`<iframe>` embeds another page.', 'Every iframe needs a descriptive `title`.', 'Use `loading="lazy"` and `sandbox` where appropriate.'],
    syntaxExamples: [{ label: 'Iframe', code: '<iframe src="…" title="…" loading="lazy"></iframe>' }],
    commonMistakes: [
      { mistake: 'An iframe with no title', why: 'Assistive tech cannot describe it.', fix: 'Always add a meaningful title.' },
      { mistake: 'Embedding untrusted pages without sandbox', why: 'They could abuse the embed.', fix: 'Add a restrictive sandbox attribute.' },
    ],
    knowledgeChecks: [{ q: 'Required iframe attribute for a11y?', opts: ['title', 'width'], a: 0, why: 'A title is required for accessibility.' }],
  },
  missions: [
    { id: 'li-html-living-l02-seed', lessonId: 'li-html-living-l02', tier: 'seed', title: 'Title it', objective: 'A titled iframe.', expected: 'An iframe with src and title.', starter: '\n', hints: ['`<iframe src title>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Iframe src', sel: 'iframe[src]' }, { kind: 'attr', label: 'Title', sel: 'iframe', name: 'title', present: true }] },
    { id: 'li-html-living-l02-sprout', lessonId: 'li-html-living-l02', tier: 'sprout', title: 'Lazy frame', objective: 'A titled, lazy, sized iframe.', expected: 'An iframe with title, width/height and loading=lazy.', starter: '\n', hints: ['Add loading="lazy" and dimensions.'], xpReward: 30, checks: [{ kind: 'attr', label: 'Title', sel: 'iframe', name: 'title', present: true }, { kind: 'has', label: 'Lazy', sel: 'iframe[loading="lazy"]' }, { kind: 'has', label: 'Sized', sel: 'iframe[width][height]' }] },
    { id: 'li-html-living-l02-bloom', lessonId: 'li-html-living-l02', tier: 'bloom', title: 'The resources page', objective: 'A titled page embedding two distinct, titled, lazy iframes.', expected: 'A heading and two titled, lazy iframes.', starter: '\n', hints: ['Two titled, lazy iframes under a heading.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1, h2' }, { kind: 'count', label: 'Two iframes', sel: 'iframe[src]', min: 2 }, { kind: 'every', label: 'Titled', sel: 'iframe', name: 'title' }, { kind: 'count', label: 'Lazy', sel: 'iframe[loading="lazy"]', min: 2 }] },
  ],
};

const lesson03: HtmlLesson = {
  ...L(3, 'Responsive images', 16, 180),
  objectives: ['Serve sizes with srcset and sizes', 'Offer art direction with <picture>', 'Keep images accessible and performant'],
  discover: {
    heading: 'The right image for the screen',
    lede: 'A **responsive image** gives the browser options so it can pick the best for the device. `srcset` lists image files with their widths; `sizes` tells the browser how wide the image will display. For **art direction** — a different crop on small screens — use `<picture>` with `<source media="…">` and an `<img>` fallback (which still needs `alt`).',
    example: '<img src="stone-640.jpg"\n     srcset="stone-320.jpg 320w, stone-640.jpg 640w, stone-1280.jpg 1280w"\n     sizes="(max-width: 600px) 100vw, 640px"\n     alt="A faceted stone">\n\n<picture>\n  <source media="(max-width: 600px)" srcset="stone-portrait.jpg">\n  <img src="stone-wide.jpg" alt="A faceted stone">\n</picture>',
    exampleNote: '`srcset`/`sizes` let the browser choose a resolution. `<picture>` swaps the whole image by media query; the inner `<img>` still carries the `alt` and is the fallback.',
    tip: 'srcset for resolution; <picture> for a different crop. Always keep alt.',
  },
  experiment: { heading: 'Offer sizes', lede: 'Add a responsive image.', steps: ['An `<img>` with a `srcset` of two widths', 'A `sizes` attribute', 'Keep a descriptive `alt`'], tip: 'Widths in srcset use the w descriptor (e.g. 640w).', starter: '<img src="a-640.jpg" srcset="a-320.jpg 320w, a-640.jpg 640w" sizes="100vw" alt="A sample">\n' },
  practice: {
    heading: 'A responsive figure', lede: 'Build a responsive image with srcset and sizes, and a picture element with an art-directed source.',
    steps: ['An `<img>` with `srcset` (two widths) and `sizes`, plus `alt`', 'A `<picture>` with a `<source media>` and an inner `<img alt>`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'An img with srcset', sel: 'img[srcset]', fail: 'Add srcset to an <img>.' },
      { kind: 'has', label: 'It has a sizes attribute', sel: 'img[sizes]', fail: 'Add a sizes attribute.' },
      { kind: 'has', label: 'A picture element', sel: 'picture', fail: 'Add a <picture>.' },
      { kind: 'has', label: 'A media-conditioned source', sel: 'picture source[media]', fail: 'Add <source media="…"> inside <picture>.' },
      { kind: 'has', label: 'The picture has an img with alt', sel: 'picture img[alt]' },
    ],
    hints: ['`srcset="a-320.jpg 320w, a-640.jpg 640w"` with `sizes="…"`.', '`<picture><source media="…" srcset="…"><img alt="…"></picture>`'],
  },
  challenge: {
    heading: 'An adaptive gallery', lede: 'Without help: two responsive images — one using srcset with at least three widths plus sizes, and one <picture> with two media-conditioned sources and an img fallback — every image with alt.', starter: '\n',
    checks: [
      { kind: 'has', label: 'srcset with sizes', sel: 'img[srcset][sizes]' },
      { kind: 'has', label: 'A picture', sel: 'picture' },
      { kind: 'count', label: 'Two media sources', sel: 'picture source[media]', min: 2 },
      { kind: 'absent', label: 'No image missing alt', sel: 'img:not([alt])', fail: 'Every <img> needs alt.' },
    ],
    hints: ['Three widths in srcset for the first image.', 'Two `<source media>` in the picture, plus the fallback img.'],
  },
  quiz: [
    { q: 'What does srcset provide?', opts: ['A caption', 'Candidate image files for the browser to choose', 'A link'], a: 1, why: 'srcset lists options the browser selects from.' },
    { q: 'When use <picture>?', opts: ['For a different crop per screen (art direction)', 'Only for GIFs', 'To add captions'], a: 0, why: '<picture> swaps the whole image via media queries.' },
    { q: 'Does a responsive image still need alt?', opts: ['No', 'Yes, on the <img>'], a: 1, why: 'The <img> must always have alt.' },
  ],
  recap: {
    takeaways: ['`srcset`/`sizes` let the browser pick a resolution.', '`<picture>` + `<source media>` art-directs by screen.', 'The `<img>` is the fallback and always needs `alt`.'],
    syntaxExamples: [{ label: 'srcset', code: '<img srcset="a-320.jpg 320w, a-640.jpg 640w" sizes="100vw" alt="…">' }, { label: 'picture', code: '<picture><source media="(max-width:600px)" srcset="s.jpg"><img src="w.jpg" alt="…"></picture>' }],
    commonMistakes: [
      { mistake: 'Dropping alt on responsive images', why: 'Accessibility breaks.', fix: 'Keep alt on the <img>.' },
      { mistake: 'Omitting sizes with srcset widths', why: 'The browser cannot choose well.', fix: 'Provide a sizes hint.' },
    ],
    knowledgeChecks: [{ q: 'Art direction element?', opts: ['<picture>', '<figure>'], a: 0, why: '<picture> handles art direction.' }],
  },
  missions: [
    { id: 'li-html-living-l03-seed', lessonId: 'li-html-living-l03', tier: 'seed', title: 'Two widths', objective: 'An image with srcset.', expected: 'An img with srcset and alt.', starter: '\n', hints: ['Add srcset with two widths.'], xpReward: 15, checks: [{ kind: 'has', label: 'srcset', sel: 'img[srcset]' }, { kind: 'has', label: 'alt', sel: 'img[alt]' }] },
    { id: 'li-html-living-l03-sprout', lessonId: 'li-html-living-l03', tier: 'sprout', title: 'Pick a crop', objective: 'A picture with a media source.', expected: 'A picture with a source[media] and an img[alt].', starter: '\n', hints: ['`<picture><source media><img alt></picture>`'], xpReward: 30, checks: [{ kind: 'has', label: 'Picture source', sel: 'picture source[media]' }, { kind: 'has', label: 'Fallback img', sel: 'picture img[alt]' }] },
    { id: 'li-html-living-l03-bloom', lessonId: 'li-html-living-l03', tier: 'bloom', title: 'Fully adaptive', objective: 'Both techniques combined, accessibly.', expected: 'An img[srcset][sizes] and a picture with two media sources, no missing alt.', starter: '\n', hints: ['srcset+sizes image plus a two-source picture.'], xpReward: 50, checks: [{ kind: 'has', label: 'srcset+sizes', sel: 'img[srcset][sizes]' }, { kind: 'count', label: 'Two media sources', sel: 'picture source[media]', min: 2 }, { kind: 'absent', label: 'No missing alt', sel: 'img:not([alt])' }] },
  ],
};

const lesson04: HtmlLesson = {
  ...L(4, 'Figures & captions', 12, 160),
  objectives: ['Associate a caption with media using <figure> and <figcaption>', 'Know when to use figure', 'Keep alt and caption complementary'],
  discover: {
    heading: 'Media with a caption',
    lede: 'A `<figure>` groups self-contained content — an image, a diagram, a code sample — with an optional `<figcaption>` that captions it. The caption and the image’s `alt` play different roles: `alt` describes the image for those who cannot see it; the caption adds context everyone reads. Keep them complementary, not identical.',
    example: '<figure>\n  <img src="amethyst.jpg" alt="A cluster of violet amethyst points">\n  <figcaption>Amethyst from the Crystal Matrix, level three.</figcaption>\n</figure>',
    exampleNote: 'The `alt` describes what the image *shows*; the `<figcaption>` tells you *where it is from*. Together they inform everyone.',
    tip: 'alt = what it is; caption = context for all readers.',
  },
  experiment: { heading: 'Caption it', lede: 'Wrap an image in a figure.', steps: ['A `<figure>` around an `<img>`', 'A `<figcaption>`', 'Keep a descriptive `alt`'], tip: 'The figcaption goes inside the figure.', starter: '<figure>\n  <img src="stone.jpg" alt="A faceted stone">\n  <figcaption>A specimen stone.</figcaption>\n</figure>\n' },
  practice: {
    heading: 'A captioned specimen', lede: 'Build a figure with an image (descriptive alt) and a complementary caption.',
    steps: ['A `<figure>`', 'An `<img>` with meaningful `alt`', 'A `<figcaption>` adding context'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A figure', sel: 'figure', fail: 'Add a <figure>.' },
      { kind: 'has', label: 'An image with alt in the figure', sel: 'figure img[alt]', fail: 'Put an <img alt> in the figure.' },
      { kind: 'has', label: 'A figcaption', sel: 'figure figcaption', fail: 'Add a <figcaption>.' },
      { kind: 'text', label: 'The caption is not empty', sel: 'figcaption', nonEmpty: true },
    ],
    hints: ['`<figure><img alt="…"><figcaption>…</figcaption></figure>`.', 'Make the caption add context, not repeat the alt.'],
  },
  challenge: {
    heading: 'A plate of figures', lede: 'Without help: a heading and at least two figures, each with an image (with alt) and a non-empty figcaption; one figure may caption a code sample instead of an image.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A heading', sel: 'h1, h2' },
      { kind: 'count', label: 'Two figures', sel: 'figure', min: 2 },
      { kind: 'count', label: 'Two captions', sel: 'figcaption', min: 2 },
      { kind: 'absent', label: 'No figure image missing alt', sel: 'figure img:not([alt])' },
    ],
    hints: ['Two figures, each captioned.', 'A figure can wrap a `<pre><code>` sample too.'],
  },
  quiz: [
    { q: 'What captions a figure?', opts: ['<caption>', '<figcaption>', 'alt'], a: 1, why: '<figcaption> captions a <figure>.' },
    { q: 'How do alt and caption differ?', opts: ['They are the same', 'alt describes the image; the caption adds context for all', 'Captions are for video only'], a: 1, why: 'They play complementary roles.' },
    { q: 'What can a <figure> contain?', opts: ['Only images', 'Images, diagrams, code and more', 'Only captions'], a: 1, why: 'A figure groups varied self-contained content.' },
  ],
  recap: {
    takeaways: ['`<figure>` groups self-contained media with a `<figcaption>`.', '`alt` describes the image; the caption adds context for everyone.', 'Figures can hold images, diagrams or code.'],
    syntaxExamples: [{ label: 'Figure', code: '<figure>\n  <img src="x.jpg" alt="…">\n  <figcaption>Context.</figcaption>\n</figure>' }],
    commonMistakes: [
      { mistake: 'Repeating the alt text in the caption', why: 'It wastes the caption’s role and is redundant.', fix: 'Let alt describe and the caption add context.' },
      { mistake: 'Captioning with a plain <p>', why: 'The association is lost.', fix: 'Use <figcaption> inside <figure>.' },
    ],
    knowledgeChecks: [{ q: 'Caption element?', opts: ['<figcaption>', '<caption>'], a: 0, why: '<figcaption> captions figures.' }],
  },
  missions: [
    { id: 'li-html-living-l04-seed', lessonId: 'li-html-living-l04', tier: 'seed', title: 'A figure', objective: 'A captioned image.', expected: 'A figure with an img[alt] and a figcaption.', starter: '\n', hints: ['`<figure><img alt><figcaption></figcaption></figure>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Figure image', sel: 'figure img[alt]' }, { kind: 'has', label: 'Caption', sel: 'figcaption' }] },
    { id: 'li-html-living-l04-sprout', lessonId: 'li-html-living-l04', tier: 'sprout', title: 'Two figures', objective: 'Two captioned figures.', expected: 'Two figures with captions.', starter: '\n', hints: ['Two figures, two figcaptions.'], xpReward: 30, checks: [{ kind: 'count', label: 'Two figures', sel: 'figure', min: 2 }, { kind: 'count', label: 'Two captions', sel: 'figcaption', min: 2 }] },
    { id: 'li-html-living-l04-bloom', lessonId: 'li-html-living-l04', tier: 'bloom', title: 'The illustrated page', objective: 'A titled page with three figures, each captioned, one wrapping a code sample.', expected: 'A heading and three figures with captions, no figure image missing alt.', starter: '\n', hints: ['One figure can caption a <pre><code>.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1, h2' }, { kind: 'count', label: 'Three figures', sel: 'figure', min: 3 }, { kind: 'count', label: 'Three captions', sel: 'figcaption', min: 3 }, { kind: 'absent', label: 'No figure img without alt', sel: 'figure img:not([alt])' }] },
  ],
};

const lesson05: HtmlLesson = {
  ...L(5, 'Accessibility best practices', 16, 190),
  objectives: ['Apply the HTML accessibility essentials', 'Prefer semantics and native elements', 'Add ARIA only where HTML falls short'],
  discover: {
    heading: 'Build it accessible from the start',
    lede: 'Accessibility is the sum of habits you have met: a `lang` on `<html>`, a descriptive `<title>`, `alt` on images, labels on controls, a logical heading outline, landmarks, and captions on media. Prefer **native semantic elements** — a `<button>` is accessible for free. Reach for ARIA only to fill gaps HTML cannot, never to replace real elements.',
    example: '<html lang="en">\n  <header>…</header>\n  <nav aria-label="Primary">…</nav>\n  <main>\n    <h1>…</h1>\n    <img src="s.jpg" alt="…">\n    <button type="button">Reveal</button>\n  </main>\n  <footer>…</footer>\n</html>',
    exampleNote: 'Every piece — `lang`, landmarks, an `aria-label` where needed, `alt`, a real `<button>` — adds up to an accessible page with almost no ARIA.',
    tip: 'First rule of ARIA: don’t use ARIA if a native element will do.',
  },
  experiment: { heading: 'Audit a page', lede: 'Assemble the accessible essentials.', steps: ['Set `lang` on `<html>`', 'Use landmarks and one `<h1>`', 'Give images `alt` and controls labels'], tip: 'Native elements first; ARIA only to fill gaps.', starter: '<!doctype html>\n<html lang="en">\n  <head><meta charset="utf-8"><title>Accessible page</title></head>\n  <body>\n    <main><h1>Title</h1><img src="x.jpg" alt="A description"><button type="button">Go</button></main>\n  </body>\n</html>\n' },
  practice: {
    heading: 'An accessible page', lede: 'Build a complete page that applies the accessibility essentials: lang, title, landmarks, one h1, an image with alt, and a real button.',
    steps: ['`<html lang>` and a `<title>`', 'A `<header>`, `<main>` and `<footer>`', 'One `<h1>`, an `<img alt>`, and a `<button>`'], starter: '\n',
    checks: [
      { kind: 'attr', label: 'The html has lang', sel: 'html', name: 'lang', present: true, fail: 'Add lang to <html>.' },
      { kind: 'has', label: 'A non-empty title', sel: 'title' },
      { kind: 'has', label: 'A main landmark', sel: 'main' },
      { kind: 'count', label: 'Exactly one h1', sel: 'h1', equals: 1 },
      { kind: 'absent', label: 'No image missing alt', sel: 'img:not([alt])', fail: 'Every image needs alt.' },
      { kind: 'has', label: 'A real button', sel: 'button', fail: 'Use a <button>, not a clickable div.' },
    ],
    hints: ['Combine lang, title, landmarks, one h1, alt and a button.', 'Use native `<button>` rather than a div.'],
  },
  challenge: {
    heading: 'The accessibility review', lede: 'Without help: a full page passing the essentials — lang, descriptive title, header/nav(labelled)/main/footer landmarks, a single h1 with a logical outline, every image with alt, a labelled form control, and native interactive elements (no clickable divs).', starter: '\n',
    checks: [
      { kind: 'attr', label: 'html lang', sel: 'html', name: 'lang', present: true },
      { kind: 'has', label: 'A labelled nav', sel: 'nav[aria-label]' },
      { kind: 'has', label: 'Main landmark', sel: 'main' },
      { kind: 'count', label: 'One h1', sel: 'h1', equals: 1 },
      { kind: 'has', label: 'A labelled control', sel: 'label[for], [aria-label]' },
      { kind: 'absent', label: 'No image without alt', sel: 'img:not([alt])' },
      { kind: 'absent', label: 'No clickable div with onclick', sel: 'div[onclick]', fail: 'Use <button>/<a>, not a div with onclick.' },
    ],
    hints: ['Bring together every habit from this mini-planet and the last.', 'No clickable divs — use <button> or <a>.'],
  },
  quiz: [
    { q: 'The first rule of ARIA is…', opts: ['Use ARIA everywhere', 'Don’t use ARIA if a native element will do', 'ARIA replaces HTML'], a: 1, why: 'Prefer native semantics; ARIA fills gaps only.' },
    { q: 'What makes a <button> better than a clickable <div>?', opts: ['It is smaller', 'It is focusable and operable by keyboard for free', 'It looks nicer'], a: 1, why: 'Native buttons are accessible by default.' },
    { q: 'Which belongs on <html>?', opts: ['alt', 'lang', 'role'], a: 1, why: 'lang states the document language.' },
  ],
  recap: {
    takeaways: ['Accessibility is a sum of habits: lang, title, alt, labels, outline, landmarks, captions.', 'Prefer native semantic elements; a `<button>` is accessible for free.', 'Use ARIA only to fill gaps HTML cannot.'],
    syntaxExamples: [{ label: 'Accessible shell', code: '<html lang="en">…\n  <nav aria-label="Primary">…</nav>\n  <main><h1>…</h1></main>\n</html>' }],
    commonMistakes: [
      { mistake: 'Clickable <div>s instead of buttons', why: 'They are not keyboard-operable or announced.', fix: 'Use <button> or <a>.' },
      { mistake: 'Over-using ARIA to patch bad markup', why: 'It often makes things worse.', fix: 'Fix the HTML first; add ARIA only for genuine gaps.' },
    ],
    knowledgeChecks: [{ q: 'Native clickable element?', opts: ['<div onclick>', '<button>'], a: 1, why: 'Use a real <button>.' }],
  },
  missions: [
    { id: 'li-html-living-l05-seed', lessonId: 'li-html-living-l05', tier: 'seed', title: 'Real button', objective: 'Use a native button.', expected: 'A <button> and a lang on <html>.', starter: '\n', hints: ['`<button type="button">…</button>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Button', sel: 'button' }, { kind: 'attr', label: 'lang', sel: 'html', name: 'lang', present: true }] },
    { id: 'li-html-living-l05-sprout', lessonId: 'li-html-living-l05', tier: 'sprout', title: 'Landmarked & labelled', objective: 'Landmarks, one h1, and alt images.', expected: 'main, one h1, no image missing alt.', starter: '\n', hints: ['main + one h1 + alt on images.'], xpReward: 30, checks: [{ kind: 'has', label: 'Main', sel: 'main' }, { kind: 'count', label: 'One h1', sel: 'h1', equals: 1 }, { kind: 'absent', label: 'No missing alt', sel: 'img:not([alt])' }] },
    { id: 'li-html-living-l05-bloom', lessonId: 'li-html-living-l05', tier: 'bloom', title: 'The audited page', objective: 'A full page meeting every essential.', expected: 'lang, title, labelled nav, main, one h1, alt images, a labelled control, no clickable divs.', starter: '\n', hints: ['Combine all accessibility habits.'], xpReward: 50, checks: [{ kind: 'attr', label: 'lang', sel: 'html', name: 'lang', present: true }, { kind: 'has', label: 'Labelled nav', sel: 'nav[aria-label]' }, { kind: 'count', label: 'One h1', sel: 'h1', equals: 1 }, { kind: 'has', label: 'Labelled control', sel: 'label[for], [aria-label]' }, { kind: 'absent', label: 'No missing alt', sel: 'img:not([alt])' }, { kind: 'absent', label: 'No clickable div', sel: 'div[onclick]' }] },
  ],
};

export const LIVING_LESSONS: HtmlLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
