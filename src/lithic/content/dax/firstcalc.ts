// The Crystal Matrix · Mini-Planet 01 · The First Calculation — DAX basics over the sample model
// (Sales → Products). Value checks actually evaluate the measure in the limited engine; concept lessons that the
// engine does not execute (calculated columns) use uses/source checks and say so.

import type { DaxLesson } from '../daxTypes';

const L = (n: number, title: string, minutes: number, xp: number): Pick<DaxLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-dax-firstcalc-l${String(n).padStart(2, '0')}`, conceptId: `lithic.dax.firstcalc.l${n}`, planetId: 'matrix', conceptKey: 'lithic.dax.firstcalc', number: n, title, minutes, xp,
});

const lesson01: DaxLesson = {
  ...L(1, 'What is DAX?', 12, 150),
  objectives: ['Explain what DAX is and where it runs', 'Reference a column as Table[Column]', 'Write a first aggregating measure'],
  discover: {
    heading: 'The language of models',
    lede: 'DAX — **Data Analysis Expressions** — is the formula language of tabular models (Power BI, Analysis Services). It does not loop over rows the way a script does; it works over **columns and tables**, aggregating values in a context. A column is written `Table[Column]`, e.g. `Sales[Revenue]`. This world runs a **limited educational DAX engine** over a fixed sample model — enough to learn the ideas, not the full product.',
    example: 'Total Revenue := SUM(Sales[Revenue])',
    exampleNote: 'This measure adds up every value in the `Sales[Revenue]` column. `SUM` takes one column reference. The result here is 4516.',
    tip: 'Reference columns as Table[Column]. Aggregations like SUM take a single column.',
  },
  experiment: { heading: 'Run a measure', lede: 'Type a measure and watch the result update in the panel.', steps: ['Try `SUM(Sales[Revenue])`', 'Change it to `SUM(Sales[Units])`', 'Read the value and the model summary below'], tip: 'The result panel evaluates your formula live.', starter: 'SUM(Sales[Revenue])' },
  practice: {
    heading: 'Total units', lede: 'Write a measure that returns the total number of units sold across all of Sales.',
    steps: ['Use `SUM` over the `Sales[Units]` column'], starter: '',
    checks: [
      { kind: 'runs', label: 'The measure evaluates' },
      { kind: 'uses', label: 'Uses SUM', fn: 'SUM' },
      { kind: 'value', label: 'Totals 290 units', expect: 290, fail: 'SUM(Sales[Units]) should return 290.' },
    ],
    hints: ['`SUM(Sales[Units])`.', 'The column is Units on the Sales table.'],
  },
  challenge: {
    heading: 'Total cost', lede: 'Without the steps: write a measure for the total cost across all sales.', starter: '',
    checks: [
      { kind: 'runs', label: 'Evaluates' },
      { kind: 'value', label: 'Totals 2450', expect: 2450, fail: 'Sum the Sales[Cost] column (2450).' },
    ],
    hints: ['Which column holds cost? `Sales[Cost]`.', '`SUM(Sales[Cost])`.'],
  },
  quiz: [
    { q: 'What does DAX primarily work over?', opts: ['Single values', 'Columns and tables in a context', 'Files on disk'], a: 1, why: 'DAX aggregates columns/tables within an evaluation context.' },
    { q: 'How is a column referenced?', opts: ['Column.Table', 'Table[Column]', '[Table]Column'], a: 1, why: 'The form is Table[Column].' },
    { q: 'What does SUM take?', opts: ['A whole table', 'A single column reference', 'Two numbers'], a: 1, why: 'SUM aggregates one column.' },
  ],
  recap: {
    takeaways: ['DAX is the formula language of tabular models.', 'Columns are `Table[Column]`; aggregations like `SUM` take one column.', 'This world runs a documented, limited DAX engine over a sample model.'],
    syntaxExamples: [{ label: 'A measure', code: 'Total Revenue := SUM(Sales[Revenue])' }],
    commonMistakes: [
      { mistake: 'Writing SUM(Sales) instead of SUM(Sales[Column])', why: 'SUM needs a column, not a table.', fix: 'Pass a single column: SUM(Sales[Revenue]).' },
      { mistake: 'Looping like a script', why: 'DAX aggregates columns in a context, not row by row (that is what iterators do).', fix: 'Reach for SUM/AVERAGE first.' },
    ],
    knowledgeChecks: [{ q: 'Column form?', opts: ['Table[Column]', 'Column(Table)'], a: 0, why: 'Table[Column].' }],
  },
  missions: [
    { id: 'li-dax-firstcalc-l01-seed', lessonId: 'li-dax-firstcalc-l01', tier: 'seed', title: 'Sum revenue', objective: 'Total revenue.', expected: '4516.', starter: '', hints: ['SUM(Sales[Revenue])'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 4516', expect: 4516 }] },
    { id: 'li-dax-firstcalc-l01-sprout', lessonId: 'li-dax-firstcalc-l01', tier: 'sprout', title: 'Gross margin', objective: 'Revenue minus cost.', expected: '2066.', starter: '', hints: ['SUM(Sales[Revenue]) - SUM(Sales[Cost])'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 2066', expect: 2066 }, { kind: 'uses', label: 'Uses SUM', fn: 'SUM' }] },
    { id: 'li-dax-firstcalc-l01-bloom', lessonId: 'li-dax-firstcalc-l01', tier: 'bloom', title: 'Average price', objective: 'The average unit price across sales.', expected: 'About 21.36.', starter: '', hints: ['AVERAGE(Sales[UnitPrice])'], xpReward: 50, checks: [{ kind: 'value', label: '≈ 21.357', expect: 21.3571, approx: 0.01 }, { kind: 'uses', label: 'Uses AVERAGE', fn: 'AVERAGE' }] },
  ],
};

const lesson02: DaxLesson = {
  ...L(2, 'Measures', 14, 150),
  objectives: ['Write measures that aggregate a column', 'Combine aggregations with arithmetic', 'Name a measure with :='],
  discover: {
    heading: 'Reusable calculations',
    lede: 'A **measure** is a named calculation that returns a single value in whatever context it is used. You define it with `Name := expression`. Measures compose: you can add, subtract, multiply and divide aggregations to build new figures like margin or average price.',
    example: 'Gross Margin := SUM(Sales[Revenue]) - SUM(Sales[Cost])',
    exampleNote: 'Two aggregations combined with subtraction. The result is 2066. (In this workspace you type just the expression; the name is optional.)',
    tip: 'Measures aggregate to a single value and compose with arithmetic.',
  },
  experiment: { heading: 'Compose measures', lede: 'Combine aggregations.', steps: ['Try `SUM(Sales[Revenue]) - SUM(Sales[Cost])`', 'Try `SUM(Sales[Revenue]) / COUNTROWS(Sales)`', 'Read the values'], tip: 'Arithmetic between aggregations is fine.', starter: 'SUM(Sales[Revenue]) - SUM(Sales[Cost])' },
  practice: {
    heading: 'Revenue per order', lede: 'Write a measure for average revenue per sales row (total revenue divided by the number of rows).',
    steps: ['Divide total revenue by `COUNTROWS(Sales)`'], starter: '',
    checks: [
      { kind: 'runs', label: 'Evaluates' },
      { kind: 'value', label: '≈ 322.57', expect: 322.5714, approx: 0.01, fail: 'SUM(Sales[Revenue]) / COUNTROWS(Sales) ≈ 322.57.' },
    ],
    hints: ['`SUM(Sales[Revenue]) / COUNTROWS(Sales)`.', 'COUNTROWS(Sales) is 14.'],
  },
  challenge: {
    heading: 'Margin percent', lede: 'Without steps: write margin as a fraction of revenue — (revenue − cost) divided by revenue.', starter: '',
    checks: [
      { kind: 'runs', label: 'Evaluates' },
      { kind: 'value', label: '≈ 0.4575', expect: 0.4575, approx: 0.001, fail: '(Revenue − Cost) / Revenue ≈ 0.4575.' },
    ],
    hints: ['`(SUM(Sales[Revenue]) - SUM(Sales[Cost])) / SUM(Sales[Revenue])`.', 'Wrap the subtraction in parentheses.'],
  },
  quiz: [
    { q: 'What is a measure?', opts: ['A stored table', 'A named calculation returning one value in context', 'A chart'], a: 1, why: 'A measure evaluates to a single value in its context.' },
    { q: 'How do you name a measure?', opts: ['Name = expr', 'Name := expr', 'def Name'], a: 1, why: 'Measures use the := assignment.' },
    { q: 'Can measures combine aggregations?', opts: ['No', 'Yes, with arithmetic'], a: 1, why: 'You can add, subtract, multiply and divide aggregations.' },
  ],
  recap: {
    takeaways: ['A measure is a named, context-aware calculation.', 'Define it with `Name := expression`.', 'Aggregations compose with arithmetic.'],
    syntaxExamples: [{ label: 'Composed measure', code: 'Margin % := DIVIDE(SUM(Sales[Revenue]) - SUM(Sales[Cost]), SUM(Sales[Revenue]))' }],
    commonMistakes: [
      { mistake: 'Dividing with / and risking divide-by-zero', why: 'A zero denominator errors or returns infinity.', fix: 'Prefer DIVIDE() for safe division (next lessons).' },
      { mistake: 'Forgetting parentheses around a subtraction before dividing', why: 'Operator precedence changes the result.', fix: 'Group with parentheses.' },
    ],
    knowledgeChecks: [{ q: 'Measure assignment?', opts: [':=', '=='], a: 0, why: 'Measures use :=.' }],
  },
  missions: [
    { id: 'li-dax-firstcalc-l02-seed', lessonId: 'li-dax-firstcalc-l02', tier: 'seed', title: 'Difference', objective: 'Revenue minus cost.', expected: '2066.', starter: '', hints: ['Subtract the two sums.'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 2066', expect: 2066 }] },
    { id: 'li-dax-firstcalc-l02-sprout', lessonId: 'li-dax-firstcalc-l02', tier: 'sprout', title: 'Per row', objective: 'Average revenue per row.', expected: '≈ 322.57.', starter: '', hints: ['Divide by COUNTROWS(Sales).'], xpReward: 30, checks: [{ kind: 'value', label: '≈ 322.57', expect: 322.5714, approx: 0.01 }] },
    { id: 'li-dax-firstcalc-l02-bloom', lessonId: 'li-dax-firstcalc-l02', tier: 'bloom', title: 'Margin %', objective: 'Margin as a fraction of revenue.', expected: '≈ 0.4575.', starter: '', hints: ['(Rev − Cost) / Rev.'], xpReward: 50, checks: [{ kind: 'value', label: '≈ 0.4575', expect: 0.4575, approx: 0.001 }] },
  ],
};

const lesson03: DaxLesson = {
  ...L(3, 'Calculated columns', 14, 150),
  objectives: ['Tell a calculated column from a measure', 'Understand per-row evaluation (row context)', 'Express a column calculation with an iterator in this engine'],
  discover: {
    heading: 'Columns vs measures',
    lede: 'A **calculated column** is computed **once per row** and stored, in **row context** — so `Sales[Units] * Sales[UnitPrice]` gives a per-row revenue. A **measure** aggregates across rows in a context. This limited engine does not add stored columns, but you can see the same per-row logic with an **iterator**: `SUMX(Sales, Sales[Units] * Sales[UnitPrice])` applies the row expression to every row and sums it.',
    example: 'Revenue (column) = Sales[Units] * Sales[UnitPrice]\n-- same total via an iterator (this engine):\nSUMX(Sales, Sales[Units] * Sales[UnitPrice])',
    exampleNote: 'The column expression runs per row. SUMX reproduces the total (4516) by iterating rows — a measure, not a stored column. Choose columns to store per-row values, measures to aggregate on the fly.',
    tip: 'Calculated column = per row, stored. Measure = aggregate in context. This engine shows per-row logic via SUMX.',
  },
  experiment: { heading: 'Per-row logic', lede: 'See row-by-row evaluation with an iterator.', steps: ['Try `SUMX(Sales, Sales[Units] * Sales[UnitPrice])`', 'Compare to `SUM(Sales[Revenue])`', 'They match (4516)'], tip: 'SUMX puts you in row context, like a calculated column.', starter: 'SUMX(Sales, Sales[Units] * Sales[UnitPrice])' },
  practice: {
    heading: 'Per-row margin, summed', lede: 'Using an iterator (the row-context stand-in for a calculated column), sum per-row profit: (UnitPrice − UnitCost) × Units over Sales.',
    steps: ['Use `SUMX(Sales, …)`', 'Inside, compute `(Sales[UnitPrice] - Sales[UnitCost]) * Sales[Units]`'], starter: '',
    checks: [
      { kind: 'uses', label: 'Uses the SUMX iterator', fn: 'SUMX' },
      { kind: 'value', label: 'Totals 2066', expect: 2066, fail: 'SUMX(Sales, (Sales[UnitPrice]-Sales[UnitCost])*Sales[Units]) = 2066.' },
    ],
    hints: ['`SUMX(Sales, (Sales[UnitPrice] - Sales[UnitCost]) * Sales[Units])`.', 'Per-row profit, then summed.'],
  },
  challenge: {
    heading: 'List-price revenue', lede: 'Without steps: sum the revenue each row would make at the product’s list price — multiply list price by units for every row.', starter: '',
    checks: [
      { kind: 'uses', label: 'Uses an iterator', fn: 'SUMX' },
      { kind: 'uses', label: 'Uses RELATED for the product price', fn: 'RELATED' },
      { kind: 'value', label: 'Totals 4570', expect: 4570, fail: 'SUMX(Sales, RELATED(Products[ListPrice]) * Sales[Units]) = 4570.' },
    ],
    hints: ['List price lives on Products — follow the relationship with `RELATED(Products[ListPrice])`.', '`SUMX(Sales, RELATED(Products[ListPrice]) * Sales[Units])`.'],
  },
  quiz: [
    { q: 'A calculated column is evaluated…', opts: ['Once, overall', 'Once per row (row context)', 'Never'], a: 1, why: 'Columns compute per row in row context.' },
    { q: 'Which gives per-row evaluation in a measure?', opts: ['SUM', 'An iterator like SUMX', 'COUNTROWS'], a: 1, why: 'Iterators evaluate an expression per row.' },
    { q: 'When prefer a measure over a column?', opts: ['Always store columns', 'To aggregate on the fly without storing per-row values', 'Never'], a: 1, why: 'Measures aggregate in context without storage.' },
  ],
  recap: {
    takeaways: ['Calculated columns compute per row and are stored (row context).', 'Measures aggregate in context.', 'This engine shows per-row logic with iterators like `SUMX`.'],
    syntaxExamples: [{ label: 'Per-row via iterator', code: 'SUMX(Sales, Sales[Units] * Sales[UnitPrice])' }],
    commonMistakes: [
      { mistake: 'Using a column reference bare in a measure', why: 'Outside row context there is no single row to read.', fix: 'Aggregate it (SUM) or iterate (SUMX).' },
      { mistake: 'Storing a column when a measure would do', why: 'It bloats the model.', fix: 'Prefer measures for aggregations.' },
    ],
    knowledgeChecks: [{ q: 'Per-row context comes from…', opts: ['SUM', 'an iterator'], a: 1, why: 'Iterators create row context.' }],
  },
  missions: [
    { id: 'li-dax-firstcalc-l03-seed', lessonId: 'li-dax-firstcalc-l03', tier: 'seed', title: 'Iterate revenue', objective: 'Per-row revenue, summed.', expected: '4516.', starter: '', hints: ['SUMX(Sales, Sales[Units]*Sales[UnitPrice])'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 4516', expect: 4516 }, { kind: 'uses', label: 'SUMX', fn: 'SUMX' }] },
    { id: 'li-dax-firstcalc-l03-sprout', lessonId: 'li-dax-firstcalc-l03', tier: 'sprout', title: 'Iterate profit', objective: 'Per-row profit, summed.', expected: '2066.', starter: '', hints: ['(UnitPrice − UnitCost) × Units.'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 2066', expect: 2066 }, { kind: 'uses', label: 'SUMX', fn: 'SUMX' }] },
    { id: 'li-dax-firstcalc-l03-bloom', lessonId: 'li-dax-firstcalc-l03', tier: 'bloom', title: 'Related price', objective: 'List-price revenue via RELATED.', expected: '4570.', starter: '', hints: ['RELATED(Products[ListPrice]) × Units.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 4570', expect: 4570 }, { kind: 'uses', label: 'RELATED', fn: 'RELATED' }] },
  ],
};

const lesson04: DaxLesson = {
  ...L(4, 'Data types', 12, 150),
  objectives: ['Recognise DAX scalar types (number, text, boolean)', 'Do arithmetic and text concatenation', 'Keep types consistent'],
  discover: {
    heading: 'Numbers, text and logic',
    lede: 'DAX values are typed: **numbers**, **text**, **boolean** (TRUE/FALSE), dates and currency. Numbers do arithmetic (`+ - * /`); text joins with the `&` operator; comparisons (`= <> < >`) give boolean. Mixing types the wrong way (adding text to a number) is an error — keep operations within a type.',
    example: '"Rows: " & COUNTROWS(Sales)   -- text, "Rows: 14"\nSUM(Sales[Units]) * 2          -- number, 580',
    exampleNote: '`&` concatenates text (coercing the number to text); `*` does arithmetic. The first is "Rows: 14"; the second is 580.',
    tip: 'Numbers use + - * / ; text joins with & ; comparisons give TRUE/FALSE.',
  },
  experiment: { heading: 'Mix carefully', lede: 'Try numeric and text operations.', steps: ['Try `SUM(Sales[Units]) * 2`', 'Try `"Units: " & SUM(Sales[Units])`', 'Note number vs text results'], tip: 'Use & only for text; * + - / for numbers.', starter: '"Units: " & SUM(Sales[Units])' },
  practice: {
    heading: 'A labelled total', lede: 'Build a text value that reads exactly `Revenue: 4516` by concatenating a label with the total revenue.',
    steps: ['Concatenate `"Revenue: "` with `SUM(Sales[Revenue])` using `&`'], starter: '',
    checks: [
      { kind: 'runs', label: 'Evaluates' },
      { kind: 'source', label: 'Uses the & operator', contains: '&', fail: 'Use & to join text and number.' },
      { kind: 'value', label: 'Reads "Revenue: 4516"', expect: 'Revenue: 4516', fail: 'The text should be exactly Revenue: 4516.' },
    ],
    hints: ['`"Revenue: " & SUM(Sales[Revenue])`.', 'Mind the space after the colon.'],
  },
  challenge: {
    heading: 'Doubled units label', lede: 'Without steps: produce the text `Double units = 580` (the total units multiplied by two, labelled).', starter: '',
    checks: [
      { kind: 'runs', label: 'Evaluates' },
      { kind: 'value', label: 'Reads "Double units = 580"', expect: 'Double units = 580', fail: 'Concatenate the label with SUM(Sales[Units]) * 2.' },
    ],
    hints: ['Compute `SUM(Sales[Units]) * 2` then join with the label using `&`.', '`"Double units = " & (SUM(Sales[Units]) * 2)`.'],
  },
  quiz: [
    { q: 'Which operator concatenates text?', opts: ['+', '&', 'CONCAT only'], a: 1, why: '& joins text in DAX.' },
    { q: 'What does a comparison like Sales[Units] > 10 return?', opts: ['A number', 'A boolean (TRUE/FALSE)', 'Text'], a: 1, why: 'Comparisons yield boolean values.' },
    { q: 'Adding text to a number with + …', opts: ['Works fine', 'Is a type error', 'Converts silently'], a: 1, why: 'Use & for text; + is numeric.' },
  ],
  recap: {
    takeaways: ['DAX has numbers, text, boolean (and dates/currency).', 'Arithmetic with `+ - * /`; text with `&`; comparisons give boolean.', 'Keep operations within a type.'],
    syntaxExamples: [{ label: 'Concatenation', code: '"Total: " & SUM(Sales[Revenue])' }],
    commonMistakes: [
      { mistake: 'Using + to join text', why: '+ is numeric and errors on text.', fix: 'Use & for concatenation.' },
      { mistake: 'Comparing text to numbers', why: 'The types do not match.', fix: 'Compare like with like.' },
    ],
    knowledgeChecks: [{ q: 'Text join operator?', opts: ['&', '+'], a: 0, why: '& concatenates.' }],
  },
  missions: [
    { id: 'li-dax-firstcalc-l04-seed', lessonId: 'li-dax-firstcalc-l04', tier: 'seed', title: 'Double it', objective: 'Total units times two.', expected: '580.', starter: '', hints: ['SUM(Sales[Units]) * 2'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 580', expect: 580 }] },
    { id: 'li-dax-firstcalc-l04-sprout', lessonId: 'li-dax-firstcalc-l04', tier: 'sprout', title: 'Label it', objective: 'A "Revenue: 4516" text.', expected: 'Revenue: 4516.', starter: '', hints: ['Use &.'], xpReward: 30, checks: [{ kind: 'value', label: 'Text matches', expect: 'Revenue: 4516' }] },
    { id: 'li-dax-firstcalc-l04-bloom', lessonId: 'li-dax-firstcalc-l04', tier: 'bloom', title: 'Rows message', objective: 'A "Rows: 14" text from COUNTROWS.', expected: 'Rows: 14.', starter: '', hints: ['"Rows: " & COUNTROWS(Sales)'], xpReward: 50, checks: [{ kind: 'value', label: 'Text matches', expect: 'Rows: 14' }, { kind: 'uses', label: 'COUNTROWS', fn: 'COUNTROWS' }] },
  ],
};

const lesson05: DaxLesson = {
  ...L(5, 'Basic aggregation', 14, 160),
  objectives: ['Use COUNT, COUNTROWS, DISTINCTCOUNT, MIN and MAX', 'Pick the right aggregation', 'Count rows vs count values'],
  discover: {
    heading: 'Counting and extremes',
    lede: 'Beyond SUM and AVERAGE: `COUNTROWS(Table)` counts rows; `COUNT(Table[Col])` counts non-blank values in a column; `DISTINCTCOUNT(Table[Col])` counts unique values; `MIN`/`MAX` give the smallest/largest. Choosing the right one is half of analytics — “how many orders” is COUNTROWS, “how many regions” is DISTINCTCOUNT.',
    example: 'COUNTROWS(Sales)                 -- 14 orders\nDISTINCTCOUNT(Sales[Region])     -- 4 regions\nMAX(Sales[Units])                -- 50',
    exampleNote: '14 rows, 4 distinct regions, and the largest single-row Units is 50. Each answers a different question.',
    tip: 'COUNTROWS = how many rows; DISTINCTCOUNT = how many distinct values.',
  },
  experiment: { heading: 'Count things', lede: 'Try the counting functions.', steps: ['`COUNTROWS(Sales)`', '`DISTINCTCOUNT(Sales[Channel])`', '`MAX(Sales[Units])`'], tip: 'Distinct count ignores duplicates.', starter: 'DISTINCTCOUNT(Sales[Region])' },
  practice: {
    heading: 'How many products sold?', lede: 'Write a measure for the number of distinct products that appear in Sales.',
    steps: ['Use `DISTINCTCOUNT` on `Sales[ProductKey]`'], starter: '',
    checks: [
      { kind: 'uses', label: 'Uses DISTINCTCOUNT', fn: 'DISTINCTCOUNT' },
      { kind: 'value', label: 'There are 6 products', expect: 6, fail: 'DISTINCTCOUNT(Sales[ProductKey]) = 6.' },
    ],
    hints: ['`DISTINCTCOUNT(Sales[ProductKey])`.', 'Distinct ignores repeats.'],
  },
  challenge: {
    heading: 'Range of an order', lede: 'Without steps: compute the spread of units per order — the maximum units minus the minimum units in Sales.', starter: '',
    checks: [
      { kind: 'runs', label: 'Evaluates' },
      { kind: 'value', label: 'Spread is 46', expect: 46, fail: 'MAX(Sales[Units]) - MIN(Sales[Units]) = 50 - 4 = 46.' },
    ],
    hints: ['`MAX(Sales[Units]) - MIN(Sales[Units])`.', 'Max is 50, min is 4.'],
  },
  quiz: [
    { q: '“How many orders” is best answered by…', opts: ['DISTINCTCOUNT', 'COUNTROWS', 'SUM'], a: 1, why: 'COUNTROWS counts the rows (orders).' },
    { q: '“How many distinct regions” uses…', opts: ['COUNT', 'DISTINCTCOUNT', 'MAX'], a: 1, why: 'DISTINCTCOUNT counts unique values.' },
    { q: 'MIN and MAX return…', opts: ['Counts', 'The smallest/largest value', 'Averages'], a: 1, why: 'They return extremes.' },
  ],
  recap: {
    takeaways: ['`COUNTROWS` counts rows; `COUNT` counts non-blank values.', '`DISTINCTCOUNT` counts unique values; `MIN`/`MAX` give extremes.', 'Match the aggregation to the question.'],
    syntaxExamples: [{ label: 'Counting', code: 'DISTINCTCOUNT(Sales[Region])' }],
    commonMistakes: [
      { mistake: 'Using COUNTROWS to count distinct values', why: 'It counts rows, not uniques.', fix: 'Use DISTINCTCOUNT for unique values.' },
      { mistake: 'COUNT on a table', why: 'COUNT needs a column; COUNTROWS takes a table.', fix: 'COUNT(Table[Col]) or COUNTROWS(Table).' },
    ],
    knowledgeChecks: [{ q: 'Count unique values?', opts: ['DISTINCTCOUNT', 'COUNTROWS'], a: 0, why: 'DISTINCTCOUNT.' }],
  },
  missions: [
    { id: 'li-dax-firstcalc-l05-seed', lessonId: 'li-dax-firstcalc-l05', tier: 'seed', title: 'Count orders', objective: 'Number of sales rows.', expected: '14.', starter: '', hints: ['COUNTROWS(Sales)'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 14', expect: 14 }] },
    { id: 'li-dax-firstcalc-l05-sprout', lessonId: 'li-dax-firstcalc-l05', tier: 'sprout', title: 'Distinct channels', objective: 'Number of distinct channels.', expected: '2.', starter: '', hints: ['DISTINCTCOUNT(Sales[Channel])'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 2', expect: 2 }, { kind: 'uses', label: 'DISTINCTCOUNT', fn: 'DISTINCTCOUNT' }] },
    { id: 'li-dax-firstcalc-l05-bloom', lessonId: 'li-dax-firstcalc-l05', tier: 'bloom', title: 'Units spread', objective: 'Max minus min units.', expected: '46.', starter: '', hints: ['MAX − MIN.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 46', expect: 46 }] },
  ],
};

export const FIRSTCALC_LESSONS: DaxLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
