// The Foundation · Mini-Planet 06 · The Control Room — forms: the form element, input types, labels &
// fieldsets, validation attributes, and accessible form design. Forms do not submit in the sandbox (no server);
// checks validate the markup, which is what matters for learning HTML.

import type { HtmlLesson } from '../types';

const L = (n: number, title: string, minutes: number, xp: number): Pick<HtmlLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-html-control-l${String(n).padStart(2, '0')}`, conceptId: `lithic.html.control.l${n}`, planetId: 'foundation', conceptKey: 'lithic.html.control', number: n, title, minutes, xp,
});

const lesson01: HtmlLesson = {
  ...L(1, 'The form element', 14, 160),
  objectives: ['Wrap controls in a <form>', 'Set action and method', 'Add a submit button'],
  discover: {
    heading: 'A container for input',
    lede: 'A `<form>` groups controls that are submitted together. `action` is where the data goes; `method` is how it is sent (`get` puts data in the URL, `post` sends it in the request body). A `<button type="submit">` sends the form. Every control that should be sent needs a `name`.',
    example: '<form action="/subscribe" method="post">\n  <input type="text" name="handle">\n  <button type="submit">Join</button>\n</form>',
    exampleNote: 'The `<form>` posts to `/subscribe`. The text `<input>` has a `name` so its value is sent; the button submits.',
    tip: 'Use method="post" for data that changes something; get for searches.',
  },
  experiment: { heading: 'Make a form', lede: 'Build a minimal form.', steps: ['A `<form>` with an `action` and `method`', 'One named `<input>`', 'A submit `<button>`'], tip: 'A control needs a name to be submitted.', starter: '<form action="/go" method="post">\n  <input type="text" name="q">\n  <button type="submit">Send</button>\n</form>\n' },
  practice: {
    heading: 'A search form', lede: 'Build a form that posts to an endpoint, with a named text input and a submit button.',
    steps: ['A `<form>` with `action` and `method="post"`', 'A text `<input>` with a `name`', 'A `<button type="submit">`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A form', sel: 'form', fail: 'Add a <form>.' },
      { kind: 'attr', label: 'The form has an action', sel: 'form', name: 'action', present: true },
      { kind: 'attr', label: 'The method is post', sel: 'form', name: 'method', equals: 'post', fail: 'Set method="post".' },
      { kind: 'has', label: 'A named input', sel: 'form input[name]', fail: 'Give the input a name.' },
      { kind: 'has', label: 'A submit button', sel: 'form button[type="submit"], form input[type="submit"]', fail: 'Add a submit button.' },
    ],
    hints: ['`<form action="/x" method="post">`.', 'The input needs `name="…"` to be submitted.'],
  },
  challenge: {
    heading: 'A feedback form', lede: 'Without help: a form (posting to an endpoint) with two named inputs and a submit button, all inside the form.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A form with action', sel: 'form[action]' },
      { kind: 'count', label: 'Two named inputs', sel: 'form input[name], form textarea[name]', min: 2 },
      { kind: 'has', label: 'A submit control', sel: 'form :is(button[type="submit"], input[type="submit"])' },
    ],
    hints: ['Two inputs, each with a name; one submit button.', 'A `<textarea name="…">` counts as a named control.'],
  },
  quiz: [
    { q: 'What does the action attribute set?', opts: ['The form’s colour', 'Where the data is sent', 'The button label'], a: 1, why: 'action is the submission destination.' },
    { q: 'Which method puts data in the URL?', opts: ['post', 'get', 'send'], a: 1, why: 'get appends data to the URL; post sends it in the body.' },
    { q: 'What makes a control’s value get submitted?', opts: ['A name attribute', 'An id', 'A class'], a: 0, why: 'Only named controls are submitted.' },
  ],
  recap: {
    takeaways: ['`<form>` groups controls submitted together.', '`action` = destination, `method` = get or post.', 'A control needs a `name` to be sent; a submit button sends it.'],
    syntaxExamples: [{ label: 'Form', code: '<form action="/x" method="post">\n  <input name="q">\n  <button type="submit">Go</button>\n</form>' }],
    commonMistakes: [
      { mistake: 'Forgetting name on inputs', why: 'Their values are not submitted.', fix: 'Give every submitted control a name.' },
      { mistake: 'Using get for sensitive data', why: 'It ends up in the URL and logs.', fix: 'Use post for data that changes state.' },
    ],
    knowledgeChecks: [{ q: 'What submits a form?', opts: ['<button type="submit">', '<a>'], a: 0, why: 'A submit button (or input) submits the form.' }],
  },
  missions: [
    { id: 'li-html-control-l01-seed', lessonId: 'li-html-control-l01', tier: 'seed', title: 'Just a form', objective: 'A form with a submit button.', expected: 'A <form> and a submit button.', starter: '\n', hints: ['`<form><button type="submit">Go</button></form>`'], xpReward: 15, checks: [{ kind: 'has', label: 'Form', sel: 'form' }, { kind: 'has', label: 'Submit', sel: 'form :is(button[type="submit"], input[type="submit"])' }] },
    { id: 'li-html-control-l01-sprout', lessonId: 'li-html-control-l01', tier: 'sprout', title: 'Named input', objective: 'A form that posts a named input.', expected: 'A form[method=post] with a named input and submit.', starter: '\n', hints: ['method="post", input name, submit.'], xpReward: 30, checks: [{ kind: 'has', label: 'Posts', sel: 'form[method="post"]' }, { kind: 'has', label: 'Named input', sel: 'form input[name]' }, { kind: 'has', label: 'Submit', sel: 'form :is(button[type="submit"], input[type="submit"])' }] },
    { id: 'li-html-control-l01-bloom', lessonId: 'li-html-control-l01', tier: 'bloom', title: 'The signup', objective: 'A titled form with three named controls and a submit.', expected: 'A heading and a form[action] with three named controls and a submit.', starter: '\n', hints: ['Three named inputs/textarea + submit.'], xpReward: 50, checks: [{ kind: 'has', label: 'Heading', sel: 'h1, h2' }, { kind: 'has', label: 'Form action', sel: 'form[action]' }, { kind: 'count', label: 'Three named controls', sel: 'form :is(input,textarea,select)[name]', min: 3 }, { kind: 'has', label: 'Submit', sel: 'form :is(button[type="submit"], input[type="submit"])' }] },
  ],
};

const lesson02: HtmlLesson = {
  ...L(2, 'Input types', 16, 170),
  objectives: ['Choose the right input type', 'Use email, number, checkbox and radio', 'Group radio buttons with a shared name'],
  discover: {
    heading: 'The right control for the data',
    lede: 'The `type` of an `<input>` changes its behaviour and keyboard. `text` is plain text; `email` validates an address and shows an email keyboard; `number` accepts digits; `checkbox` is an on/off toggle; `radio` picks one option from a group. **Radios with the same `name` form one group** — only one can be chosen.',
    example: '<input type="email" name="email">\n<input type="number" name="age">\n<input type="checkbox" name="news" value="yes">\n<input type="radio" name="size" value="s">\n<input type="radio" name="size" value="m">',
    exampleNote: 'The two radios share `name="size"`, so they are mutually exclusive. The checkbox toggles one value.',
    tip: 'Pick the type that matches the data — it improves validation and the on-screen keyboard.',
  },
  experiment: { heading: 'Try the types', lede: 'Use several input types.', steps: ['An `email` input', 'A `number` input', 'Two `radio` inputs sharing a name'], tip: 'Radios need the same name to group.', starter: '<input type="email" name="email">\n<input type="radio" name="plan" value="a">\n<input type="radio" name="plan" value="b">\n' },
  practice: {
    heading: 'A profile form', lede: 'Build a form with an email, a number, a checkbox, and a radio group of two options.',
    steps: ['An `<input type="email" name="…">`', 'An `<input type="number" name="…">`', 'A `checkbox`', 'Two `radio` inputs with the same `name`'], starter: '\n',
    checks: [
      { kind: 'has', label: 'An email input', sel: 'input[type="email"]', fail: 'Add input type="email".' },
      { kind: 'has', label: 'A number input', sel: 'input[type="number"]' },
      { kind: 'has', label: 'A checkbox', sel: 'input[type="checkbox"]' },
      { kind: 'count', label: 'Two grouped radios', sel: 'input[type="radio"]', min: 2 },
      { kind: 'every', label: 'All inputs have a name', sel: 'input', name: 'name' },
    ],
    hints: ['Four types: email, number, checkbox, radio (×2).', 'Give the two radios the same `name`.'],
  },
  challenge: {
    heading: 'A booking form', lede: 'Without help: a form with an email, a number, a radio group of at least three options sharing one name, and a checkbox — every control named.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A form', sel: 'form' },
      { kind: 'has', label: 'Email input', sel: 'input[type="email"]' },
      { kind: 'has', label: 'Number input', sel: 'input[type="number"]' },
      { kind: 'count', label: 'Three radios', sel: 'input[type="radio"]', min: 3 },
      { kind: 'has', label: 'A checkbox', sel: 'input[type="checkbox"]' },
      { kind: 'every', label: 'Every input is named', sel: 'input', name: 'name' },
    ],
    hints: ['Three radios share one name; the rest each have their own.', 'Keep everything inside the form.'],
  },
  quiz: [
    { q: 'What groups radio buttons?', opts: ['The same id', 'The same name', 'The same value'], a: 1, why: 'Radios with a shared name are one mutually-exclusive group.' },
    { q: 'Why choose type="email"?', opts: ['It is required', 'It validates the address and shows an email keyboard', 'It is faster'], a: 1, why: 'The type improves validation and input UX.' },
    { q: 'Which is an on/off toggle?', opts: ['radio', 'checkbox', 'number'], a: 1, why: 'A checkbox toggles a single value on or off.' },
  ],
  recap: {
    takeaways: ['The `type` tailors behaviour and keyboard.', '`email`/`number`/`checkbox`/`radio` cover common needs.', 'Radios sharing a `name` form one exclusive group.'],
    syntaxExamples: [{ label: 'Radio group', code: '<input type="radio" name="size" value="s">\n<input type="radio" name="size" value="m">' }],
    commonMistakes: [
      { mistake: 'Radios with different names', why: 'They stop being mutually exclusive.', fix: 'Give grouped radios the same name.' },
      { mistake: 'Using text for everything', why: 'You lose type-specific validation and keyboards.', fix: 'Choose the type that fits the data.' },
    ],
    knowledgeChecks: [{ q: 'Pick-one control?', opts: ['checkbox', 'radio'], a: 1, why: 'Radios pick one from a group.' }],
  },
  missions: [
    { id: 'li-html-control-l02-seed', lessonId: 'li-html-control-l02', tier: 'seed', title: 'An email', objective: 'A named email input.', expected: 'An input[type=email][name].', starter: '\n', hints: ['`<input type="email" name="email">`'], xpReward: 15, checks: [{ kind: 'has', label: 'Email', sel: 'input[type="email"][name]' }] },
    { id: 'li-html-control-l02-sprout', lessonId: 'li-html-control-l02', tier: 'sprout', title: 'Choose one', objective: 'A radio group of three.', expected: 'Three radios sharing a name.', starter: '\n', hints: ['Same name on all three radios.'], xpReward: 30, checks: [{ kind: 'count', label: 'Three radios', sel: 'input[type="radio"]', min: 3 }, { kind: 'every', label: 'Named', sel: 'input[type="radio"]', name: 'name' }] },
    { id: 'li-html-control-l02-bloom', lessonId: 'li-html-control-l02', tier: 'bloom', title: 'The full set', objective: 'A form using five input types, all named.', expected: 'email, number, checkbox and a radio group — every control named.', starter: '\n', hints: ['Mix email, number, checkbox, radios.'], xpReward: 50, checks: [{ kind: 'has', label: 'Email', sel: 'input[type="email"]' }, { kind: 'has', label: 'Number', sel: 'input[type="number"]' }, { kind: 'has', label: 'Checkbox', sel: 'input[type="checkbox"]' }, { kind: 'count', label: 'Radios', sel: 'input[type="radio"]', min: 2 }, { kind: 'every', label: 'Named', sel: 'input', name: 'name' }] },
  ],
};

const lesson03: HtmlLesson = {
  ...L(3, 'Labels & fieldsets', 16, 170),
  objectives: ['Associate a <label> with its control', 'Group related controls with <fieldset> and <legend>', 'Make every control labelled'],
  discover: {
    heading: 'Every control needs a label',
    lede: 'A `<label>` names a control so people know what to enter — and clicking the label focuses the control. Associate them by matching the label’s `for` to the control’s `id` (or by wrapping the control inside the label). Group related controls — like a radio set — in a `<fieldset>` with a `<legend>` describing the group.',
    example: '<label for="email">Email</label>\n<input id="email" type="email" name="email">\n\n<fieldset>\n  <legend>Size</legend>\n  <label><input type="radio" name="size" value="s"> Small</label>\n  <label><input type="radio" name="size" value="m"> Medium</label>\n</fieldset>',
    exampleNote: 'The first label’s `for="email"` matches the input’s `id="email"`. The radio group is wrapped in a `<fieldset>` whose `<legend>` names it.',
    tip: 'for + id links a label to its control; fieldset + legend groups a set.',
  },
  experiment: { heading: 'Label it', lede: 'Add labels and a fieldset.', steps: ['A `<label for>` linked to an input `id`', 'A `<fieldset>` with a `<legend>`', 'Two labelled radios inside'], tip: 'The label’s for must equal the input’s id.', starter: '<label for="name">Name</label>\n<input id="name" name="name">\n<fieldset><legend>Plan</legend>\n  <label><input type="radio" name="plan" value="a"> A</label>\n</fieldset>\n' },
  practice: {
    heading: 'A labelled form', lede: 'Build a form where a text input and an email input are each labelled by `for`/`id`, and a radio group is wrapped in a fieldset with a legend.',
    steps: ['Two inputs, each with an `id` and a matching `<label for>`', 'A `<fieldset>` with a `<legend>`', 'Two radios inside the fieldset'], starter: '\n',
    checks: [
      { kind: 'count', label: 'Two labels with for', sel: 'label[for]', min: 2, fail: 'Add a <label for> for each input.' },
      { kind: 'has', label: 'An input id matches a label', sel: 'input[id]' },
      { kind: 'has', label: 'A fieldset', sel: 'fieldset', fail: 'Group the radios in a <fieldset>.' },
      { kind: 'has', label: 'A legend', sel: 'fieldset legend', fail: 'Add a <legend> to the fieldset.' },
      { kind: 'count', label: 'Two radios in the fieldset', sel: 'fieldset input[type="radio"]', min: 2 },
    ],
    hints: ['`<label for="x">…</label><input id="x">`.', 'The fieldset wraps the radio group; the legend names it.'],
  },
  challenge: {
    heading: 'A fully labelled form', lede: 'Without help: a form where every text/email input has an associated label (via for/id) and a radio group sits in a fieldset with a legend — at least three labelled controls in all.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A form', sel: 'form' },
      { kind: 'count', label: 'At least two labels with for', sel: 'label[for]', min: 2 },
      { kind: 'has', label: 'A fieldset with a legend', sel: 'fieldset legend' },
      { kind: 'count', label: 'At least three inputs', sel: 'input', min: 3 },
      { kind: 'absent', label: 'No input without a name', sel: 'input:not([name])', fail: 'Every input needs a name.' },
    ],
    hints: ['Two labelled inputs + a fieldset of radios.', 'Match each label’s for to an input id.'],
  },
  quiz: [
    { q: 'How do you link a label to a control?', opts: ['Same class', 'label for = input id', 'Same name'], a: 1, why: 'The label’s for matches the control’s id.' },
    { q: 'What groups a set of controls?', opts: ['<section>', '<fieldset> with <legend>', '<div>'], a: 1, why: 'A fieldset groups controls; the legend names the group.' },
    { q: 'A benefit of labels?', opts: ['Clicking the label focuses the control', 'They colour the input', 'They submit the form'], a: 0, why: 'Labels improve usability and accessibility.' },
  ],
  recap: {
    takeaways: ['Every control needs a `<label>`.', 'Link with `for`/`id`, or wrap the control in the label.', 'Group related controls in `<fieldset>` with a `<legend>`.'],
    syntaxExamples: [{ label: 'Labelled input', code: '<label for="email">Email</label>\n<input id="email" name="email">' }, { label: 'Group', code: '<fieldset><legend>Size</legend>…</fieldset>' }],
    commonMistakes: [
      { mistake: 'Using placeholder text instead of a label', why: 'Placeholders vanish on typing and are not reliable labels.', fix: 'Always provide a real <label>.' },
      { mistake: 'A radio group with no fieldset/legend', why: 'The group has no accessible name.', fix: 'Wrap it in <fieldset> with a <legend>.' },
    ],
    knowledgeChecks: [{ q: 'Groups controls?', opts: ['<legend>', '<fieldset>'], a: 1, why: '<fieldset> groups; <legend> names the group.' }],
  },
  missions: [
    { id: 'li-html-control-l03-seed', lessonId: 'li-html-control-l03', tier: 'seed', title: 'One label', objective: 'A label linked to an input.', expected: 'A label[for] and an input[id] that match.', starter: '\n', hints: ['`<label for="x">…</label><input id="x">`'], xpReward: 15, checks: [{ kind: 'has', label: 'Label for', sel: 'label[for]' }, { kind: 'has', label: 'Input id', sel: 'input[id]' }] },
    { id: 'li-html-control-l03-sprout', lessonId: 'li-html-control-l03', tier: 'sprout', title: 'Group it', objective: 'A fieldset with a legend and radios.', expected: 'A fieldset, a legend, and two radios.', starter: '\n', hints: ['Wrap radios in a fieldset with a legend.'], xpReward: 30, checks: [{ kind: 'has', label: 'Legend', sel: 'fieldset legend' }, { kind: 'count', label: 'Radios', sel: 'fieldset input[type="radio"]', min: 2 }] },
    { id: 'li-html-control-l03-bloom', lessonId: 'li-html-control-l03', tier: 'bloom', title: 'The labelled survey', objective: 'A form where every control is labelled and the radios are grouped.', expected: 'Three labels-for, a fieldset+legend, and no unnamed inputs.', starter: '\n', hints: ['Label every input; group the radios.'], xpReward: 50, checks: [{ kind: 'count', label: 'Three labels', sel: 'label[for]', min: 3 }, { kind: 'has', label: 'Fieldset legend', sel: 'fieldset legend' }, { kind: 'absent', label: 'No unnamed inputs', sel: 'input:not([name])' }] },
  ],
};

const lesson04: HtmlLesson = {
  ...L(4, 'Validation attributes', 16, 170),
  objectives: ['Make fields required', 'Constrain input with min, max, maxlength and pattern', 'Let the browser validate before submit'],
  discover: {
    heading: 'Rules the browser enforces',
    lede: 'HTML can validate input before a form submits, no script needed. `required` makes a field mandatory. `min`/`max` bound a number; `maxlength` caps text length; `pattern` requires a regular expression match. The right `type` (like `email`) also validates. The browser blocks submission and shows a message when a rule fails.',
    example: '<input type="email" name="email" required>\n<input type="number" name="age" min="0" max="120">\n<input type="text" name="code" pattern="[A-Z]{3}" maxlength="3" required>',
    exampleNote: '`required` blocks an empty field. `min`/`max` bound the number. `pattern="[A-Z]{3}"` demands exactly three capital letters.',
    tip: 'Prefer built-in validation attributes before reaching for JavaScript.',
  },
  experiment: { heading: 'Add rules', lede: 'Constrain some fields.', steps: ['Make an input `required`', 'Bound a number with `min` and `max`', 'Add a `pattern` to a text field'], tip: 'Try submitting to see the browser enforce the rules.', starter: '<form>\n  <input type="email" name="email" required>\n  <input type="number" name="n" min="1" max="10">\n  <button type="submit">Go</button>\n</form>\n' },
  practice: {
    heading: 'A validated form', lede: 'Build a form with a required email, a bounded number, and a text field constrained by a pattern.',
    steps: ['A `required` email input', 'A number input with `min` and `max`', 'A text input with a `pattern`', 'A submit button'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A required email', sel: 'input[type="email"][required]', fail: 'Make the email input required.' },
      { kind: 'has', label: 'A bounded number', sel: 'input[type="number"][min][max]', fail: 'Add min and max to the number input.' },
      { kind: 'has', label: 'A patterned text field', sel: 'input[pattern]', fail: 'Add a pattern to a text input.' },
      { kind: 'has', label: 'A submit button', sel: ':is(button[type="submit"], input[type="submit"])' },
    ],
    hints: ['`required`, `min`/`max`, and `pattern` are plain attributes.', '`pattern="[0-9]{4}"` requires four digits.'],
  },
  challenge: {
    heading: 'A strict registration', lede: 'Without help: a form with at least two required fields, a number bounded by min and max, a text field with both a pattern and a maxlength, and a submit button.', starter: '\n',
    checks: [
      { kind: 'count', label: 'Two required fields', sel: '[required]', min: 2 },
      { kind: 'has', label: 'A bounded number', sel: 'input[type="number"][min][max]' },
      { kind: 'has', label: 'Pattern + maxlength', sel: 'input[pattern][maxlength]' },
      { kind: 'has', label: 'A submit button', sel: ':is(button[type="submit"], input[type="submit"])' },
    ],
    hints: ['Mark two fields required.', 'One text field carries both pattern and maxlength.'],
  },
  quiz: [
    { q: 'What does required do?', opts: ['Styles the field red', 'Blocks submission if the field is empty', 'Sets a default value'], a: 1, why: 'required makes a field mandatory before submit.' },
    { q: 'What constrains a number’s range?', opts: ['maxlength', 'min and max', 'pattern'], a: 1, why: 'min/max bound a numeric input.' },
    { q: 'What does pattern take?', opts: ['A colour', 'A regular expression', 'A URL'], a: 1, why: 'pattern validates against a regular expression.' },
  ],
  recap: {
    takeaways: ['`required` makes a field mandatory.', '`min`/`max`, `maxlength` and `pattern` constrain values.', 'The browser validates before submit — no script needed.'],
    syntaxExamples: [{ label: 'Validation', code: '<input type="email" required>\n<input type="number" min="0" max="10">\n<input pattern="[A-Z]{3}">' }],
    commonMistakes: [
      { mistake: 'Relying only on client-side validation for security', why: 'It can be bypassed; servers must re-check.', fix: 'Use attributes for UX; validate on the server too.' },
      { mistake: 'A pattern that is too strict or wrong', why: 'Valid input gets rejected.', fix: 'Test the regex against real values.' },
    ],
    knowledgeChecks: [{ q: 'Bounds a number?', opts: ['pattern', 'min/max'], a: 1, why: 'min and max bound numbers.' }],
  },
  missions: [
    { id: 'li-html-control-l04-seed', lessonId: 'li-html-control-l04', tier: 'seed', title: 'Make it required', objective: 'A required input.', expected: 'An input with required.', starter: '\n', hints: ['Add the required attribute.'], xpReward: 15, checks: [{ kind: 'has', label: 'Required', sel: 'input[required]' }] },
    { id: 'li-html-control-l04-sprout', lessonId: 'li-html-control-l04', tier: 'sprout', title: 'Bounded', objective: 'A bounded number and a required field.', expected: 'A number[min][max] and a required field.', starter: '\n', hints: ['min and max on a number; required on another.'], xpReward: 30, checks: [{ kind: 'has', label: 'Bounded number', sel: 'input[type="number"][min][max]' }, { kind: 'has', label: 'Required', sel: '[required]' }] },
    { id: 'li-html-control-l04-bloom', lessonId: 'li-html-control-l04', tier: 'bloom', title: 'The strict form', objective: 'A form with required fields, a bounded number, and a patterned, length-capped field.', expected: 'Two required, a number[min][max], and input[pattern][maxlength], plus submit.', starter: '\n', hints: ['Combine required, min/max, pattern and maxlength.'], xpReward: 50, checks: [{ kind: 'count', label: 'Two required', sel: '[required]', min: 2 }, { kind: 'has', label: 'Bounded number', sel: 'input[type="number"][min][max]' }, { kind: 'has', label: 'Pattern + maxlength', sel: 'input[pattern][maxlength]' }, { kind: 'has', label: 'Submit', sel: ':is(button[type="submit"], input[type="submit"])' }] },
  ],
};

const lesson05: HtmlLesson = {
  ...L(5, 'Accessible form design', 16, 180),
  objectives: ['Give every control a visible label', 'Group and describe controls clearly', 'Associate help text and errors with their fields'],
  discover: {
    heading: 'Forms everyone can complete',
    lede: 'Accessible forms combine the pieces: a visible `<label>` for every control, `<fieldset>`/`<legend>` for groups, and help text tied to a field with `aria-describedby`. Avoid using `placeholder` as the only label — it disappears when typing. Mark required fields in the label text, not by colour alone.',
    example: '<label for="pw">Password <span>(required)</span></label>\n<input id="pw" name="pw" type="password" required aria-describedby="pwhelp">\n<p id="pwhelp">At least 8 characters.</p>',
    exampleNote: 'The label is visible and names the field; `aria-describedby="pwhelp"` ties the help paragraph to the input, so assistive tech reads it with the field.',
    tip: 'Label everything; describe with aria-describedby; never rely on placeholder alone.',
  },
  experiment: { heading: 'Make it accessible', lede: 'Wire a field to its help text.', steps: ['A visible `<label for>`', 'An input with `aria-describedby`', 'A help `<p>` whose `id` matches'], tip: 'aria-describedby points at the id of the help text.', starter: '<label for="u">Username</label>\n<input id="u" name="u" aria-describedby="uh">\n<p id="uh">Letters and numbers only.</p>\n' },
  practice: {
    heading: 'An accessible field', lede: 'Build a labelled input with associated help text, inside a form, with a submit button.',
    steps: ['A `<label for>` matching an input `id`', 'The input has `aria-describedby`', 'A help element whose `id` matches the describedby', 'A submit button'], starter: '\n',
    checks: [
      { kind: 'has', label: 'A label with for', sel: 'label[for]', fail: 'Add a <label for>.' },
      { kind: 'has', label: 'An input with id and describedby', sel: 'input[id][aria-describedby]', fail: 'Add aria-describedby to the input.' },
      { kind: 'has', label: 'Help text with an id', sel: '[id]', fail: 'Give the help text an id.' },
      { kind: 'has', label: 'A submit button', sel: ':is(button[type="submit"], input[type="submit"])' },
      { kind: 'absent', label: 'No input relies on placeholder only', sel: 'input[placeholder]:not([id])', fail: 'Every input still needs a real label.' },
    ],
    hints: ['Match the input’s `aria-describedby` to the help element’s `id`.', 'Keep a real `<label>` even if you add a placeholder.'],
  },
  challenge: {
    heading: 'The accessible form', lede: 'Without help: a complete, accessible form — a legend-grouped set, every control with a visible label, at least one field with associated help via aria-describedby, required fields marked in text, and a submit button.', starter: '\n',
    checks: [
      { kind: 'has', label: 'A form', sel: 'form' },
      { kind: 'has', label: 'A fieldset + legend', sel: 'fieldset legend' },
      { kind: 'count', label: 'At least two labels with for', sel: 'label[for]', min: 2 },
      { kind: 'has', label: 'A described field', sel: '[aria-describedby]' },
      { kind: 'has', label: 'A submit button', sel: ':is(button[type="submit"], input[type="submit"])' },
      { kind: 'absent', label: 'No unlabelled, placeholder-only input', sel: 'input[placeholder]:not([id]):not([aria-label])' },
    ],
    hints: ['Combine labels, a fieldset/legend, and aria-describedby help.', 'Mark “(required)” in the label text.'],
  },
  quiz: [
    { q: 'Why not use placeholder as the only label?', opts: ['It is illegal', 'It disappears when the user types', 'It is too small'], a: 1, why: 'Placeholders vanish on input and are unreliable labels.' },
    { q: 'What ties help text to a field?', opts: ['aria-describedby', 'title', 'class'], a: 0, why: 'aria-describedby references the help element’s id.' },
    { q: 'How should required be indicated?', opts: ['Colour only', 'In the label text (and with required)', 'Not at all'], a: 1, why: 'Convey required-ness in text, not colour alone.' },
  ],
  recap: {
    takeaways: ['Every control needs a visible label.', 'Tie help text to a field with `aria-describedby`.', 'Do not rely on `placeholder` or colour alone.'],
    syntaxExamples: [{ label: 'Described field', code: '<label for="pw">Password</label>\n<input id="pw" aria-describedby="h">\n<p id="h">8+ characters.</p>' }],
    commonMistakes: [
      { mistake: 'Placeholder-only fields', why: 'No persistent label for anyone.', fix: 'Add a real <label>.' },
      { mistake: 'Marking required with colour alone', why: 'Colour is not announced or perceivable to all.', fix: 'State “required” in the label text.' },
    ],
    knowledgeChecks: [{ q: 'Associates help text?', opts: ['aria-describedby', 'placeholder'], a: 0, why: 'aria-describedby links help to a field.' }],
  },
  missions: [
    { id: 'li-html-control-l05-seed', lessonId: 'li-html-control-l05', tier: 'seed', title: 'Describe a field', objective: 'A field with associated help.', expected: 'An input[aria-describedby] and a matching help id.', starter: '\n', hints: ['aria-describedby points at a help id.'], xpReward: 15, checks: [{ kind: 'has', label: 'Described input', sel: 'input[aria-describedby]' }, { kind: 'has', label: 'Help with id', sel: 'p[id], span[id]' }] },
    { id: 'li-html-control-l05-sprout', lessonId: 'li-html-control-l05', tier: 'sprout', title: 'Label and help', objective: 'A labelled, described field with a submit.', expected: 'A label[for], input[aria-describedby], and submit.', starter: '\n', hints: ['Label + describedby + submit.'], xpReward: 30, checks: [{ kind: 'has', label: 'Label for', sel: 'label[for]' }, { kind: 'has', label: 'Described input', sel: 'input[aria-describedby]' }, { kind: 'has', label: 'Submit', sel: ':is(button[type="submit"], input[type="submit"])' }] },
    { id: 'li-html-control-l05-bloom', lessonId: 'li-html-control-l05', tier: 'bloom', title: 'The accessible signup', objective: 'A grouped, fully labelled, described, submittable form.', expected: 'A fieldset+legend, 2+ labels-for, a described field, a submit, no placeholder-only inputs.', starter: '\n', hints: ['Pull together everything from this mini-planet.'], xpReward: 50, checks: [{ kind: 'has', label: 'Fieldset legend', sel: 'fieldset legend' }, { kind: 'count', label: 'Labels', sel: 'label[for]', min: 2 }, { kind: 'has', label: 'Described', sel: '[aria-describedby]' }, { kind: 'has', label: 'Submit', sel: ':is(button[type="submit"], input[type="submit"])' }, { kind: 'absent', label: 'No placeholder-only input', sel: 'input[placeholder]:not([id]):not([aria-label])' }] },
  ],
};

export const CONTROL_LESSONS: HtmlLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
