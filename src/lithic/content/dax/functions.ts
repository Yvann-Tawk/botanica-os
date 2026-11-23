// The Crystal Matrix · Mini-Planet 02 · The Crystal Functions — SUM, AVERAGE, the COUNT family, COUNTROWS,
// DISTINCTCOUNT and DIVIDE. All value checks evaluate in the limited engine against the sample model.

import type { DaxLesson } from '../daxTypes';

const L = (n: number, title: string, minutes: number, xp: number): Pick<DaxLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-dax-functions-l${String(n).padStart(2, '0')}`, conceptId: `lithic.dax.functions.l${n}`, planetId: 'matrix', conceptKey: 'lithic.dax.functions', number: n, title, minutes, xp,
});

const mk = (over: Partial<DaxLesson> & ReturnType<typeof L>): DaxLesson => over as DaxLesson;

const lesson01 = mk({
  ...L(1, 'SUM & AVERAGE', 12, 160),
  objectives: ['Total a column with SUM', 'Average a column with AVERAGE', 'Know they ignore blanks'],
  discover: { heading: 'Totals and means', lede: '`SUM(Table[Column])` adds every value in a column; `AVERAGE(Table[Column])` returns the mean. Both ignore blank cells. They are the workhorses of analytics — revenue totals, average order size, mean price.', example: 'SUM(Sales[Revenue])      -- 4516\nAVERAGE(Sales[Units])    -- ≈ 20.71', exampleNote: 'SUM totals the column; AVERAGE divides the total by the count of non-blank values.', tip: 'SUM totals; AVERAGE means. Both take one column.' },
  experiment: { heading: 'Total and mean', lede: 'Try both.', steps: ['`SUM(Sales[Revenue])`', '`AVERAGE(Sales[Units])`', 'Read the values'], tip: 'They take a single column.', starter: 'AVERAGE(Sales[Units])' },
  practice: { heading: 'Average revenue', lede: 'Write a measure for the average revenue per sales row using AVERAGE on the Revenue column.', steps: ['`AVERAGE(Sales[Revenue])`'], starter: '', checks: [{ kind: 'uses', label: 'Uses AVERAGE', fn: 'AVERAGE' }, { kind: 'value', label: '≈ 322.57', expect: 322.5714, approx: 0.01, fail: 'AVERAGE(Sales[Revenue]) ≈ 322.57.' }], hints: ['`AVERAGE(Sales[Revenue])`.', 'Average of the Revenue column.'] },
  challenge: { heading: 'Mean unit cost', lede: 'Without steps: the average unit cost across sales.', starter: '', checks: [{ kind: 'runs', label: 'Evaluates' }, { kind: 'value', label: '≈ 11.71', expect: 11.7143, approx: 0.01, fail: 'AVERAGE(Sales[UnitCost]) ≈ 11.71.' }], hints: ['Which column is unit cost? `Sales[UnitCost]`.', '`AVERAGE(Sales[UnitCost])`.'] },
  quiz: [
    { q: 'What does AVERAGE ignore?', opts: ['Negative numbers', 'Blank cells', 'The first row'], a: 1, why: 'AVERAGE ignores blanks.' },
    { q: 'SUM takes…', opts: ['A table', 'One column', 'Two columns'], a: 1, why: 'SUM aggregates one column.' },
    { q: 'Average = …', opts: ['total ÷ count of non-blanks', 'max − min', 'count'], a: 0, why: 'Mean is total over count.' },
  ],
  recap: { takeaways: ['`SUM` totals a column; `AVERAGE` means it.', 'Both ignore blanks and take one column.'], syntaxExamples: [{ label: 'Totals', code: 'SUM(Sales[Revenue])\nAVERAGE(Sales[Units])' }], commonMistakes: [{ mistake: 'Passing a table to SUM', why: 'SUM needs a column.', fix: 'SUM(Sales[Revenue]).' }, { mistake: 'Expecting AVERAGE to count blanks', why: 'Blanks are ignored.', fix: 'Use COUNTROWS if you need the row count.' }], knowledgeChecks: [{ q: 'Mean function?', opts: ['AVERAGE', 'SUM'], a: 0, why: 'AVERAGE.' }] },
  missions: [
    { id: 'li-dax-functions-l01-seed', lessonId: 'li-dax-functions-l01', tier: 'seed', title: 'Total revenue', objective: 'Sum revenue.', expected: '4516.', starter: '', hints: ['SUM(Sales[Revenue])'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 4516', expect: 4516 }] },
    { id: 'li-dax-functions-l01-sprout', lessonId: 'li-dax-functions-l01', tier: 'sprout', title: 'Mean units', objective: 'Average units.', expected: '≈ 20.71.', starter: '', hints: ['AVERAGE(Sales[Units])'], xpReward: 30, checks: [{ kind: 'value', label: '≈ 20.71', expect: 20.7143, approx: 0.01 }] },
    { id: 'li-dax-functions-l01-bloom', lessonId: 'li-dax-functions-l01', tier: 'bloom', title: 'Mean cost', objective: 'Average unit cost.', expected: '≈ 11.71.', starter: '', hints: ['AVERAGE(Sales[UnitCost])'], xpReward: 50, checks: [{ kind: 'value', label: '≈ 11.71', expect: 11.7143, approx: 0.01 }] },
  ],
});

const lesson02 = mk({
  ...L(2, 'The COUNT family', 12, 160),
  objectives: ['Count values with COUNT/COUNTA', 'Count rows with COUNTROWS', 'Choose the right counter'],
  discover: { heading: 'Different ways to count', lede: '`COUNT(Table[Column])` counts non-blank **values** in a column; `COUNTA` counts non-blank values of any type; `COUNTROWS(Table)` counts **rows**. On a column with no blanks, COUNT and COUNTROWS match — but they answer different questions, so pick by meaning.', example: 'COUNT(Sales[Units])     -- 14 values\nCOUNTROWS(Sales)        -- 14 rows', exampleNote: 'Here both are 14 because no Units cell is blank; COUNT counts values, COUNTROWS counts rows.', tip: 'COUNT = values in a column; COUNTROWS = rows in a table.' },
  experiment: { heading: 'Count both ways', lede: 'Compare counters.', steps: ['`COUNT(Sales[Units])`', '`COUNTROWS(Sales)`', 'Note they match here'], tip: 'COUNT needs a column; COUNTROWS a table.', starter: 'COUNTROWS(Sales)' },
  practice: { heading: 'Count the orders', lede: 'Write a measure for the number of sales rows (orders) using COUNTROWS.', steps: ['`COUNTROWS(Sales)`'], starter: '', checks: [{ kind: 'uses', label: 'Uses COUNTROWS', fn: 'COUNTROWS' }, { kind: 'value', label: 'There are 14', expect: 14 }], hints: ['`COUNTROWS(Sales)`.', 'COUNTROWS takes a table.'] },
  challenge: { heading: 'Count price values', lede: 'Without steps: count the non-blank values in the UnitPrice column.', starter: '', checks: [{ kind: 'uses', label: 'Uses COUNT', fn: 'COUNT' }, { kind: 'value', label: 'Is 14', expect: 14, fail: 'COUNT(Sales[UnitPrice]) = 14.' }], hints: ['`COUNT(Sales[UnitPrice])`.', 'COUNT takes a column.'] },
  quiz: [
    { q: 'COUNTROWS takes…', opts: ['a column', 'a table', 'two numbers'], a: 1, why: 'COUNTROWS counts rows of a table.' },
    { q: 'COUNT counts…', opts: ['rows', 'non-blank values in a column', 'distinct values'], a: 1, why: 'COUNT counts non-blank values.' },
    { q: 'Why can COUNT and COUNTROWS differ?', opts: ['They never differ', 'Blanks in the column are not counted by COUNT', 'COUNT is random'], a: 1, why: 'Blank cells reduce COUNT below the row count.' },
  ],
  recap: { takeaways: ['`COUNT`/`COUNTA` count values; `COUNTROWS` counts rows.', 'They match only when the column has no blanks.'], syntaxExamples: [{ label: 'Counting', code: 'COUNT(Sales[Units])\nCOUNTROWS(Sales)' }], commonMistakes: [{ mistake: 'COUNT(Sales)', why: 'COUNT needs a column.', fix: 'COUNT(Sales[Col]) or COUNTROWS(Sales).' }, { mistake: 'Assuming COUNT = row count', why: 'Blanks are skipped.', fix: 'Use COUNTROWS for rows.' }], knowledgeChecks: [{ q: 'Rows counter?', opts: ['COUNTROWS', 'COUNT'], a: 0, why: 'COUNTROWS.' }] },
  missions: [
    { id: 'li-dax-functions-l02-seed', lessonId: 'li-dax-functions-l02', tier: 'seed', title: 'Rows', objective: 'Count rows.', expected: '14.', starter: '', hints: ['COUNTROWS(Sales)'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 14', expect: 14 }] },
    { id: 'li-dax-functions-l02-sprout', lessonId: 'li-dax-functions-l02', tier: 'sprout', title: 'Values', objective: 'Count UnitPrice values.', expected: '14.', starter: '', hints: ['COUNT(Sales[UnitPrice])'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 14', expect: 14 }, { kind: 'uses', label: 'COUNT', fn: 'COUNT' }] },
    { id: 'li-dax-functions-l02-bloom', lessonId: 'li-dax-functions-l02', tier: 'bloom', title: 'Regions counted', objective: 'Count Region values.', expected: '14.', starter: '', hints: ['COUNT(Sales[Region]) counts non-blank region cells.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 14', expect: 14 }] },
  ],
});

const lesson03 = mk({
  ...L(3, 'COUNTROWS', 12, 160),
  objectives: ['Count rows of a table expression', 'Count filtered rows with FILTER', 'Use COUNTROWS as a building block'],
  discover: { heading: 'Counting a table', lede: '`COUNTROWS` takes a **table expression**, not just a table name — so `COUNTROWS(FILTER(Sales, Sales[Units] > 20))` counts only the rows that pass the filter. This makes it a flexible building block: “how many large orders?”, “how many online sales?”.', example: 'COUNTROWS(Sales)                              -- 14\nCOUNTROWS(FILTER(Sales, Sales[Units] > 20))   -- 6', exampleNote: '`FILTER` returns the rows where Units exceed 20; `COUNTROWS` counts them (6).', tip: 'COUNTROWS accepts FILTER(…) to count a subset.' },
  experiment: { heading: 'Count a subset', lede: 'Count filtered rows.', steps: ['`COUNTROWS(FILTER(Sales, Sales[Units] > 20))`', 'Change the threshold', 'Watch the count change'], tip: 'FILTER returns a table; COUNTROWS counts it.', starter: 'COUNTROWS(FILTER(Sales, Sales[Units] > 20))' },
  practice: { heading: 'Count online sales', lede: 'Count the sales rows whose Channel is "Online" using COUNTROWS over a FILTER.', steps: ['`COUNTROWS(FILTER(Sales, Sales[Channel] = "Online"))`'], starter: '', checks: [{ kind: 'uses', label: 'Uses FILTER', fn: 'FILTER' }, { kind: 'value', label: 'There are 8', expect: 8, fail: 'COUNTROWS(FILTER(Sales, Sales[Channel]="Online")) = 8.' }], hints: ['`COUNTROWS(FILTER(Sales, Sales[Channel] = "Online"))`.', 'Use quotes around "Online".'] },
  challenge: { heading: 'Count big North orders', lede: 'Without steps: count North-region rows with more than 20 units. (This engine has no AND operator — nest one FILTER inside another.)', starter: '', checks: [{ kind: 'runs', label: 'Evaluates' }, { kind: 'value', label: 'Is 2', expect: 2, fail: 'North rows with Units>20 are 3N (50) and 5N (22): 2.' }], hints: ['Nest filters: filter to North, then to Units > 20.', '`COUNTROWS(FILTER(FILTER(Sales, Sales[Region] = "North"), Sales[Units] > 20))`.'] },
  quiz: [
    { q: 'COUNTROWS can take…', opts: ['only a table name', 'any table expression including FILTER(…)', 'a column'], a: 1, why: 'It accepts table expressions.' },
    { q: 'FILTER returns…', opts: ['a number', 'a table of matching rows', 'text'], a: 1, why: 'FILTER yields a table.' },
    { q: 'To count a subset you combine…', opts: ['COUNTROWS + FILTER', 'SUM + AVERAGE', 'MIN + MAX'], a: 0, why: 'COUNTROWS over FILTER counts a subset.' },
  ],
  recap: { takeaways: ['`COUNTROWS` counts any table expression.', '`FILTER(Table, condition)` returns matching rows.', 'Together they count subsets.'], syntaxExamples: [{ label: 'Filtered count', code: 'COUNTROWS(FILTER(Sales, Sales[Units] > 20))' }], commonMistakes: [{ mistake: 'Putting a column in COUNTROWS', why: 'It expects a table.', fix: 'Give it Sales or FILTER(Sales, …).' }, { mistake: 'Forgetting quotes on text values', why: 'Unquoted text is read as a name.', fix: 'Quote text: "Online".' }], knowledgeChecks: [{ q: 'Subset table function?', opts: ['FILTER', 'SUM'], a: 0, why: 'FILTER returns a table.' }] },
  missions: [
    { id: 'li-dax-functions-l03-seed', lessonId: 'li-dax-functions-l03', tier: 'seed', title: 'Big orders', objective: 'Rows with Units > 20.', expected: '6.', starter: '', hints: ['COUNTROWS(FILTER(Sales, Sales[Units] > 20))'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 6', expect: 6 }] },
    { id: 'li-dax-functions-l03-sprout', lessonId: 'li-dax-functions-l03', tier: 'sprout', title: 'Retail count', objective: 'Retail rows.', expected: '6.', starter: '', hints: ['FILTER on Channel = "Retail".'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 6', expect: 6 }, { kind: 'uses', label: 'FILTER', fn: 'FILTER' }] },
    { id: 'li-dax-functions-l03-bloom', lessonId: 'li-dax-functions-l03', tier: 'bloom', title: 'Small West', objective: 'West rows with fewer than 20 units.', expected: '3.', starter: '', hints: ['Nest filters: West, then Units < 20.', 'West rows under 20 units: 5W (18), 6W (16), 1W (4).'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 3', expect: 3 }] },
  ],
});

const lesson04 = mk({
  ...L(4, 'DISTINCTCOUNT', 12, 160),
  objectives: ['Count unique values with DISTINCTCOUNT', 'Answer “how many distinct …” questions', 'Distinguish it from COUNT'],
  discover: { heading: 'Counting uniques', lede: '`DISTINCTCOUNT(Table[Column])` counts the **unique** values in a column, ignoring repeats and blanks. It answers “how many distinct customers / regions / products” — a different question from COUNT, which counts every value.', example: 'DISTINCTCOUNT(Sales[Region])     -- 4\nDISTINCTCOUNT(Sales[ProductKey]) -- 6', exampleNote: 'Four distinct regions appear in Sales; six distinct products. Repeated values are counted once.', tip: 'DISTINCTCOUNT = how many unique values.' },
  experiment: { heading: 'Count uniques', lede: 'Try distinct counts.', steps: ['`DISTINCTCOUNT(Sales[Region])`', '`DISTINCTCOUNT(Sales[Channel])`', 'Compare to COUNT'], tip: 'Duplicates count once.', starter: 'DISTINCTCOUNT(Sales[ProductKey])' },
  practice: { heading: 'How many channels?', lede: 'Write a measure for the number of distinct sales channels.', steps: ['`DISTINCTCOUNT(Sales[Channel])`'], starter: '', checks: [{ kind: 'uses', label: 'Uses DISTINCTCOUNT', fn: 'DISTINCTCOUNT' }, { kind: 'value', label: 'There are 2', expect: 2 }], hints: ['`DISTINCTCOUNT(Sales[Channel])`.', 'Online and Retail.'] },
  challenge: { heading: 'Distinct products', lede: 'Without steps: how many distinct products appear in Sales?', starter: '', checks: [{ kind: 'value', label: 'Is 6', expect: 6, fail: 'DISTINCTCOUNT(Sales[ProductKey]) = 6.' }], hints: ['Use the ProductKey column.', '`DISTINCTCOUNT(Sales[ProductKey])`.'] },
  quiz: [
    { q: 'DISTINCTCOUNT counts…', opts: ['every value', 'unique values', 'rows'], a: 1, why: 'It counts uniques.' },
    { q: 'Repeated values are counted…', opts: ['once', 'each time'], a: 0, why: 'Duplicates count once.' },
    { q: '“How many distinct regions” uses…', opts: ['COUNT', 'DISTINCTCOUNT'], a: 1, why: 'DISTINCTCOUNT for uniques.' },
  ],
  recap: { takeaways: ['`DISTINCTCOUNT` counts unique, non-blank values.', 'It differs from COUNT, which counts every value.'], syntaxExamples: [{ label: 'Unique count', code: 'DISTINCTCOUNT(Sales[Region])' }], commonMistakes: [{ mistake: 'Using COUNT for uniqueness', why: 'COUNT includes duplicates.', fix: 'Use DISTINCTCOUNT.' }, { mistake: 'Passing a table', why: 'It needs a column.', fix: 'DISTINCTCOUNT(Table[Col]).' }], knowledgeChecks: [{ q: 'Uniques function?', opts: ['DISTINCTCOUNT', 'COUNTROWS'], a: 0, why: 'DISTINCTCOUNT.' }] },
  missions: [
    { id: 'li-dax-functions-l04-seed', lessonId: 'li-dax-functions-l04', tier: 'seed', title: 'Regions', objective: 'Distinct regions.', expected: '4.', starter: '', hints: ['DISTINCTCOUNT(Sales[Region])'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 4', expect: 4 }] },
    { id: 'li-dax-functions-l04-sprout', lessonId: 'li-dax-functions-l04', tier: 'sprout', title: 'Channels', objective: 'Distinct channels.', expected: '2.', starter: '', hints: ['DISTINCTCOUNT(Sales[Channel])'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 2', expect: 2 }, { kind: 'uses', label: 'DISTINCTCOUNT', fn: 'DISTINCTCOUNT' }] },
    { id: 'li-dax-functions-l04-bloom', lessonId: 'li-dax-functions-l04', tier: 'bloom', title: 'Products', objective: 'Distinct products.', expected: '6.', starter: '', hints: ['Use ProductKey.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 6', expect: 6 }] },
  ],
});

const lesson05 = mk({
  ...L(5, 'DIVIDE & safe division', 12, 170),
  objectives: ['Divide safely with DIVIDE', 'Avoid divide-by-zero errors', 'Supply an alternate result'],
  discover: { heading: 'Division without errors', lede: 'Dividing with `/` errors (or returns infinity) when the denominator is zero. `DIVIDE(numerator, denominator [, alternate])` returns the alternate (blank by default) instead of failing. Use it for ratios: margin %, average price, conversion rate.', example: 'DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units]))  -- ≈ 15.57 (revenue per unit)\nDIVIDE(10, 0, -1)                               -- -1 (safe)', exampleNote: 'The first gives revenue per unit; the second shows the alternate result for a zero denominator.', tip: 'Prefer DIVIDE over / for any ratio that might hit zero.' },
  experiment: { heading: 'Divide safely', lede: 'Try DIVIDE.', steps: ['`DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units]))`', '`DIVIDE(10, 0)`', '`DIVIDE(10, 0, -1)`'], tip: 'The third argument is the fallback.', starter: 'DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units]))' },
  practice: { heading: 'Revenue per unit', lede: 'Write a safe measure for revenue per unit: total revenue divided by total units, using DIVIDE.', steps: ['`DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units]))`'], starter: '', checks: [{ kind: 'uses', label: 'Uses DIVIDE', fn: 'DIVIDE' }, { kind: 'value', label: '≈ 15.57', expect: 15.5724, approx: 0.01, fail: 'DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units])) ≈ 15.57.' }], hints: ['`DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units]))`.', 'Revenue over units.'] },
  challenge: { heading: 'Safe margin %', lede: 'Without steps: margin as a share of revenue, computed safely with DIVIDE so a zero revenue would not error.', starter: '', checks: [{ kind: 'uses', label: 'Uses DIVIDE', fn: 'DIVIDE' }, { kind: 'value', label: '≈ 0.4575', expect: 0.4575, approx: 0.001, fail: 'DIVIDE(Revenue − Cost, Revenue) ≈ 0.4575.' }], hints: ['`DIVIDE(SUM(Sales[Revenue]) - SUM(Sales[Cost]), SUM(Sales[Revenue]))`.', 'Numerator is the margin.'] },
  quiz: [
    { q: 'Why use DIVIDE?', opts: ['It is faster', 'It avoids divide-by-zero errors', 'It rounds'], a: 1, why: 'DIVIDE handles zero denominators safely.' },
    { q: 'The third argument of DIVIDE is…', opts: ['the numerator', 'the alternate result on zero', 'ignored'], a: 1, why: 'It is the fallback value.' },
    { q: 'DIVIDE(10, 0) returns…', opts: ['an error', 'blank (0 here) by default', 'infinity'], a: 1, why: 'Without an alternate it returns blank.' },
  ],
  recap: { takeaways: ['`DIVIDE(num, den [, alt])` divides safely.', 'A zero denominator yields the alternate (blank by default), not an error.', 'Prefer it over `/` for ratios.'], syntaxExamples: [{ label: 'Safe divide', code: 'DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units]), 0)' }], commonMistakes: [{ mistake: 'Using / on a possibly-zero denominator', why: 'It errors or returns infinity.', fix: 'Use DIVIDE.' }, { mistake: 'Omitting the alternate when you need a specific fallback', why: 'You get blank, not your value.', fix: 'Pass a third argument.' }], knowledgeChecks: [{ q: 'Safe division?', opts: ['DIVIDE', '/'], a: 0, why: 'DIVIDE is safe.' }] },
  missions: [
    { id: 'li-dax-functions-l05-seed', lessonId: 'li-dax-functions-l05', tier: 'seed', title: 'Safe zero', objective: 'DIVIDE by zero with a fallback.', expected: '-1.', starter: '', hints: ['DIVIDE(10, 0, -1)'], xpReward: 15, checks: [{ kind: 'value', label: 'Is -1', expect: -1 }] },
    { id: 'li-dax-functions-l05-sprout', lessonId: 'li-dax-functions-l05', tier: 'sprout', title: 'Per unit', objective: 'Revenue per unit.', expected: '≈ 15.57.', starter: '', hints: ['DIVIDE(Revenue, Units).'], xpReward: 30, checks: [{ kind: 'value', label: '≈ 15.57', expect: 15.5724, approx: 0.01 }, { kind: 'uses', label: 'DIVIDE', fn: 'DIVIDE' }] },
    { id: 'li-dax-functions-l05-bloom', lessonId: 'li-dax-functions-l05', tier: 'bloom', title: 'Cost ratio', objective: 'Cost as a share of revenue, safely.', expected: '≈ 0.5425.', starter: '', hints: ['DIVIDE(SUM(Sales[Cost]), SUM(Sales[Revenue])).'], xpReward: 50, checks: [{ kind: 'value', label: '≈ 0.5425', expect: 0.5425, approx: 0.001 }, { kind: 'uses', label: 'DIVIDE', fn: 'DIVIDE' }] },
  ],
});

export const FUNCTIONS_LESSONS: DaxLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
