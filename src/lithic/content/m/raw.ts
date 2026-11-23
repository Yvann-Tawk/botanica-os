// The Refinery · Mini-Planet 01 · Raw Materials — Power Query & M, query structure, let/in, values & types,
// your first query. Value checks evaluate in the limited M engine against the sample Source table.

import type { MLesson } from '../mTypes';

const L = (n: number, title: string, minutes: number, xp: number): Pick<MLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-m-raw-l${String(n).padStart(2, '0')}`, conceptId: `lithic.m.raw.l${n}`, planetId: 'refinery', conceptKey: 'lithic.m.raw', number: n, title, minutes, xp,
});
const mk = (o: Partial<MLesson> & ReturnType<typeof L>): MLesson => o as MLesson;

const lesson01 = mk({
  ...L(1, 'What is Power Query?', 12, 150),
  objectives: ['Explain what Power Query and M are', 'Project a column as a list', 'Run a first aggregation'],
  discover: { heading: 'Shaping data', lede: 'Power Query is the data-prep tool in Power BI and Excel; its formula language is **M**. You load a source, then apply **steps** that filter, clean and reshape it. M is functional: every step is an expression. This world runs a **limited educational M engine** over a sample `Source` table — enough to learn the ideas, not the full product. Project a column as a list with `Source[Column]`.', example: 'List.Sum(Source[Units])   // 159', exampleNote: '`Source[Units]` is the Units column as a list; `List.Sum` totals it (159).', tip: 'Source[Column] gives a list; List.* functions aggregate it.' },
  experiment: { heading: 'Total a column', lede: 'Aggregate a projected column.', steps: ['Try `List.Sum(Source[Units])`', 'Try `List.Count(Source[Units])`', 'Read the results'], tip: 'The result panel evaluates live.', starter: 'List.Sum(Source[Units])' },
  practice: { heading: 'Count the rows', lede: 'Return how many values are in the Units column.', steps: ['Use `List.Count` on `Source[Units]`'], starter: '', checks: [{ kind: 'uses', label: 'Uses List.Count', fn: 'List.Count' }, { kind: 'value', label: 'There are 8', expect: 8 }], hints: ['`List.Count(Source[Units])`.', 'Project the column, then count it.'] },
  challenge: { heading: 'Total units', lede: 'Without steps: the total units across the Source table.', starter: '', checks: [{ kind: 'value', label: 'Totals 159', expect: 159, fail: 'List.Sum(Source[Units]) = 159.' }], hints: ['`List.Sum(Source[Units])`.'] },
  quiz: [
    { q: 'What is M?', opts: ['A chart type', 'Power Query’s formula language', 'A database'], a: 1, why: 'M is the Power Query formula language.' },
    { q: '`Source[Units]` gives…', opts: ['one number', 'the Units column as a list', 'a table'], a: 1, why: 'Column projection yields a list.' },
    { q: 'Power Query is for…', opts: ['drawing charts', 'loading and reshaping data', 'writing SQL only'], a: 1, why: 'It prepares and transforms data.' },
  ],
  recap: { takeaways: ['Power Query prepares data; M is its language.', '`Source[Column]` projects a column to a list.', 'This world runs a documented, limited M engine.'], syntaxExamples: [{ label: 'Aggregate a column', code: 'List.Sum(Source[Units])' }], commonMistakes: [{ mistake: 'Expecting Source[Units] to be a single value', why: 'It is the whole column as a list.', fix: 'Aggregate it with a List.* function.' }, { mistake: 'Treating M like a full Power Query here', why: 'This engine is a documented subset.', fix: 'Stick to the functions the lessons show.' }], knowledgeChecks: [{ q: 'Project a column?', opts: ['Source[Col]', 'Source(Col)'], a: 0, why: 'Source[Col].' }] },
  missions: [
    { id: 'li-m-raw-l01-seed', lessonId: 'li-m-raw-l01', tier: 'seed', title: 'Count rows', objective: 'Count the Units values.', expected: '8.', starter: '', hints: ['List.Count(Source[Units])'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 8', expect: 8 }] },
    { id: 'li-m-raw-l01-sprout', lessonId: 'li-m-raw-l01', tier: 'sprout', title: 'Total units', objective: 'Sum the units.', expected: '159.', starter: '', hints: ['List.Sum(Source[Units])'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 159', expect: 159 }, { kind: 'uses', label: 'List.Sum', fn: 'List.Sum' }] },
    { id: 'li-m-raw-l01-bloom', lessonId: 'li-m-raw-l01', tier: 'bloom', title: 'Average price', objective: 'Average the Price column.', expected: '22.', starter: '', hints: ['List.Average(Source[Price])'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 22', expect: 22 }, { kind: 'uses', label: 'List.Average', fn: 'List.Average' }] },
  ],
});

const lesson02 = mk({
  ...L(2, 'The M language', 14, 150),
  objectives: ['See that everything in M is an expression', 'Use arithmetic and text operators', 'Combine values'],
  discover: { heading: 'Everything is an expression', lede: 'M is a pure expression language: there are no statements, only values and expressions that produce values. Numbers do arithmetic (`+ - * /`), text joins with `&`, and comparisons give `true`/`false`. A whole query is one big expression (often a `let … in`).', example: '2 + 3 * 4        // 14\n"Hello " & "Lithic"   // "Hello Lithic"', exampleNote: 'Operator precedence applies (× before +); `&` concatenates text.', tip: 'Numbers: + - * / · Text: & · Comparisons give true/false.' },
  experiment: { heading: 'Compute', lede: 'Try operators.', steps: ['`2 + 3 * 4`', '`"a" & "b" & "c"`', '`10 > 3`'], tip: 'Multiplication binds tighter than addition.', starter: '2 + 3 * 4' },
  practice: { heading: 'A greeting', lede: 'Produce the text `Hello Lithic` by joining two strings.', steps: ['Join `"Hello "` and `"Lithic"` with `&`'], starter: '', checks: [{ kind: 'value', label: 'Reads "Hello Lithic"', expect: 'Hello Lithic', fail: '"Hello " & "Lithic" → "Hello Lithic".' }], hints: ['`"Hello " & "Lithic"`.', 'Mind the trailing space.'] },
  challenge: { heading: 'A computation', lede: 'Without steps: compute `(10 + 5) * 2` using parentheses to control order.', starter: '', checks: [{ kind: 'value', label: 'Is 30', expect: 30, fail: '(10 + 5) * 2 = 30.' }], hints: ['Parentheses force the addition first.', '`(10 + 5) * 2`.'] },
  quiz: [
    { q: 'M is…', opts: ['a statement language', 'an expression language', 'object-oriented'], a: 1, why: 'Everything in M is an expression.' },
    { q: 'What joins text?', opts: ['+', '&', 'concat'], a: 1, why: '& concatenates text.' },
    { q: '`2 + 3 * 4` is…', opts: ['20', '14', '24'], a: 1, why: 'Multiplication first: 2 + 12 = 14.' },
  ],
  recap: { takeaways: ['M is a pure expression language.', 'Arithmetic with `+ - * /`; text with `&`.', 'Parentheses control order.'], syntaxExamples: [{ label: 'Expressions', code: '(10 + 5) * 2\n"a" & "b"' }], commonMistakes: [{ mistake: 'Using + to join text', why: '+ is numeric.', fix: 'Use & for text.' }, { mistake: 'Ignoring precedence', why: '× binds before +.', fix: 'Parenthesise when unsure.' }], knowledgeChecks: [{ q: 'Text operator?', opts: ['&', '+'], a: 0, why: '& joins text.' }] },
  missions: [
    { id: 'li-m-raw-l02-seed', lessonId: 'li-m-raw-l02', tier: 'seed', title: 'Add', objective: 'Compute 7 + 8.', expected: '15.', starter: '', hints: ['7 + 8'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 15', expect: 15 }] },
    { id: 'li-m-raw-l02-sprout', lessonId: 'li-m-raw-l02', tier: 'sprout', title: 'Join', objective: 'Make "North-West".', expected: 'North-West.', starter: '', hints: ['"North" & "-" & "West"'], xpReward: 30, checks: [{ kind: 'value', label: 'Text matches', expect: 'North-West' }] },
    { id: 'li-m-raw-l02-bloom', lessonId: 'li-m-raw-l02', tier: 'bloom', title: 'Order of ops', objective: 'Compute (3 + 4) * (2 + 2).', expected: '28.', starter: '', hints: ['Group both sums.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 28', expect: 28 }] },
  ],
});

const lesson03 = mk({
  ...L(3, 'let / in expressions', 16, 160),
  objectives: ['Structure a query with let … in', 'Name intermediate steps', 'Return the final step'],
  discover: { heading: 'Named steps', lede: 'A real query is a `let … in` expression: `let` defines named **steps** (each an expression, separated by commas), and `in` returns the final one. Steps can reference earlier steps, so a query reads as a pipeline — load, filter, aggregate.', example: 'let\n  units = Source[Units],\n  total = List.Sum(units)\nin\n  total     // 159', exampleNote: 'Two steps: `units` projects the column, `total` sums it; `in total` returns 159.', tip: 'let step1 = …, step2 = … in finalStep — commas between steps.' },
  experiment: { heading: 'Build a pipeline', lede: 'Chain steps.', steps: ['Define a step for `Source[Units]`', 'Define a step that sums it', 'Return the total'], tip: 'Each step can use earlier steps.', starter: 'let\n  units = Source[Units],\n  total = List.Sum(units)\nin\n  total' },
  practice: { heading: 'A two-step total', lede: 'With `let … in`, define a step that projects `Source[Price]` and a step that averages it, returning the average.', steps: ['`let price = Source[Price], avg = List.Average(price) in avg`'], starter: '', checks: [{ kind: 'source', label: 'Uses let … in', matches: '\\blet\\b[\\s\\S]*\\bin\\b' }, { kind: 'value', label: 'Average is 22', expect: 22, fail: 'The average price is 22.' }], hints: ['`let price = Source[Price], avg = List.Average(price) in avg`.', 'Return the averaging step.'] },
  challenge: { heading: 'Filtered count', lede: 'Without steps: a `let … in` query that filters Source to rows with Units above 10, then returns the row count.', starter: '', checks: [{ kind: 'source', label: 'Uses let … in', matches: '\\blet\\b[\\s\\S]*\\bin\\b' }, { kind: 'uses', label: 'Uses Table.SelectRows', fn: 'Table.SelectRows' }, { kind: 'value', label: 'Count is 5', expect: 5, fail: 'Rows with Units > 10: 50, 25, 18, 14, 30 → 5.' }], hints: ['`let f = Table.SelectRows(Source, each [Units] > 10), n = Table.RowCount(f) in n`.', 'Five rows exceed 10 units.'] },
  quiz: [
    { q: 'What does `in` do?', opts: ['defines a step', 'returns the final expression', 'imports data'], a: 1, why: 'in gives the query result.' },
    { q: 'Steps are separated by…', opts: ['semicolons', 'commas', 'newlines only'], a: 1, why: 'Commas separate let steps.' },
    { q: 'Can a step use an earlier step?', opts: ['No', 'Yes'], a: 1, why: 'Later steps reference earlier ones.' },
  ],
  recap: { takeaways: ['`let … in` defines named steps and returns the last.', 'Steps are comma-separated and can chain.', 'A query reads as a pipeline.'], syntaxExamples: [{ label: 'let/in', code: 'let a = 1, b = a + 1 in b' }], commonMistakes: [{ mistake: 'Separating steps with semicolons', why: 'M uses commas.', fix: 'Comma between steps.' }, { mistake: 'Forgetting `in`', why: 'The query has no result.', fix: 'End with `in finalStep`.' }], knowledgeChecks: [{ q: 'Returns the result?', opts: ['in', 'let'], a: 0, why: 'in returns it.' }] },
  missions: [
    { id: 'li-m-raw-l03-seed', lessonId: 'li-m-raw-l03', tier: 'seed', title: 'One step', objective: 'let a = 10 in a + 5.', expected: '15.', starter: '', hints: ['let a = 10 in a + 5'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 15', expect: 15 }, { kind: 'source', label: 'Uses let', matches: '\\blet\\b' }] },
    { id: 'li-m-raw-l03-sprout', lessonId: 'li-m-raw-l03', tier: 'sprout', title: 'Two steps', objective: 'Average price via two steps.', expected: '22.', starter: '', hints: ['Project, then average.'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 22', expect: 22 }, { kind: 'source', label: 'let…in', matches: '\\blet\\b[\\s\\S]*\\bin\\b' }] },
    { id: 'li-m-raw-l03-bloom', lessonId: 'li-m-raw-l03', tier: 'bloom', title: 'Pipeline', objective: 'Filter Units > 20 then count.', expected: '3.', starter: '', hints: ['Table.SelectRows then Table.RowCount.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 3', expect: 3 }, { kind: 'uses', label: 'Table.SelectRows', fn: 'Table.SelectRows' }] },
  ],
});

const lesson04 = mk({
  ...L(4, 'Values & types', 14, 160),
  objectives: ['Name M’s value types', 'Build list and record literals', 'Read fields and items'],
  discover: { heading: 'The kinds of value', lede: 'M values include **number**, **text**, **logical** (true/false), **null**, **list** `{1, 2, 3}`, **record** `[Name = "Q", Units = 50]`, and **table**. Read a record field with `rec[Field]` and a list item with `list{index}` (0-based).', example: '[Name = "Quartz", Units = 50][Units]   // 50\n{10, 20, 30}{1}                        // 20', exampleNote: 'Record field access uses `[Field]`; list item access uses `{index}` (zero-based, so index 1 is 20).', tip: 'Record → [Field]. List → {index}, zero-based.' },
  experiment: { heading: 'Build and read', lede: 'Make a record and a list.', steps: ['`[A = 1, B = 2][B]`', '`{5, 10, 15}{0}`', 'Read a field and an item'], tip: 'Lists are zero-indexed.', starter: '[A = 1, B = 2][B]' },
  practice: { heading: 'Read a record', lede: 'Build a record with a `Units` field of 50 and return that field.', steps: ['Make `[Product = "Quartz", Units = 50]`', 'Read its `[Units]`'], starter: '', checks: [{ kind: 'value', label: 'Returns 50', expect: 50, fail: '[…, Units = 50][Units] = 50.' }], hints: ['`[Product = "Quartz", Units = 50][Units]`.', 'Field access with [Units].'] },
  challenge: { heading: 'Third item', lede: 'Without steps: from the list `{3, 6, 9, 12}`, return the item at index 2.', starter: '', checks: [{ kind: 'value', label: 'Is 9', expect: 9, fail: '{3,6,9,12}{2} = 9 (zero-based).' }], hints: ['`{3, 6, 9, 12}{2}`.', 'Index 2 is the third item.'] },
  quiz: [
    { q: 'A list literal looks like…', opts: ['[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)'], a: 1, why: 'Lists use braces {…}.' },
    { q: 'A record field is read with…', opts: ['rec{Field}', 'rec[Field]', 'rec.Field'], a: 1, why: 'Records use [Field].' },
    { q: 'List indexing is…', opts: ['one-based', 'zero-based'], a: 1, why: 'M lists are zero-based.' },
  ],
  recap: { takeaways: ['Values: number, text, logical, null, list, record, table.', 'List literal `{…}`; record literal `[…]`.', 'Read with `rec[Field]` and `list{index}` (zero-based).'], syntaxExamples: [{ label: 'Record & list', code: '[A = 1][A]\n{10, 20}{0}' }], commonMistakes: [{ mistake: 'Confusing {} and []', why: '{} is a list; [] is a record.', fix: 'Braces = list, brackets = record.' }, { mistake: 'One-based indexing', why: 'M is zero-based.', fix: 'First item is {0}.' }], knowledgeChecks: [{ q: 'List literal?', opts: ['{…}', '[…]'], a: 0, why: 'Braces are lists.' }] },
  missions: [
    { id: 'li-m-raw-l04-seed', lessonId: 'li-m-raw-l04', tier: 'seed', title: 'A field', objective: 'Read a record field.', expected: '7.', starter: '', hints: ['[X = 7][X]'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 7', expect: 7 }] },
    { id: 'li-m-raw-l04-sprout', lessonId: 'li-m-raw-l04', tier: 'sprout', title: 'An item', objective: 'Second item of {2,4,6,8}.', expected: '4.', starter: '', hints: ['{2,4,6,8}{1}'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 4', expect: 4 }] },
    { id: 'li-m-raw-l04-bloom', lessonId: 'li-m-raw-l04', tier: 'bloom', title: 'Count a list', objective: 'Count items in a 5-item list.', expected: '5.', starter: '', hints: ['List.Count({…}) with five items.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 5', expect: 5 }, { kind: 'uses', label: 'List.Count', fn: 'List.Count' }] },
  ],
});

const lesson05 = mk({
  ...L(5, 'Your first query', 16, 170),
  objectives: ['Write a multi-step query', 'Filter then aggregate', 'Return a meaningful result'],
  discover: { heading: 'A real pipeline', lede: 'Bring it together: a `let … in` query that loads `Source`, filters it with `Table.SelectRows(…, each [Column] …)`, and returns an aggregate. `each` makes a row function where `[Column]` is the current row’s value.', example: 'let\n  big = Table.SelectRows(Source, each [Units] > 20),\n  count = Table.RowCount(big)\nin\n  count    // 3', exampleNote: '`each [Units] > 20` keeps rows over 20 units; `Table.RowCount` counts them (3).', tip: 'each [Column] refers to the current row’s value.' },
  experiment: { heading: 'Filter and count', lede: 'Build the pipeline.', steps: ['Filter Source to Units > 20', 'Count the result', 'Return the count'], tip: '`each [Units]` reads the row’s Units.', starter: 'let\n  big = Table.SelectRows(Source, each [Units] > 20),\n  count = Table.RowCount(big)\nin\n  count' },
  practice: { heading: 'Big-order revenue', lede: 'Write a query that filters Source to Units above 20, adds a Revenue column (Units × Price), and returns the total revenue of those rows.', steps: ['Filter with `Table.SelectRows(Source, each [Units] > 20)`', 'Add a Revenue column with `Table.AddColumn(…, "Revenue", each [Units] * [Price])`', 'Return `List.Sum(…[Revenue])`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Table.SelectRows', fn: 'Table.SelectRows' }, { kind: 'uses', label: 'Uses Table.AddColumn', fn: 'Table.AddColumn' }, { kind: 'value', label: 'Totals 1130', expect: 1130, fail: 'Rows over 20 units: 600 + 200 + 330 = 1130.' }], hints: ['Filter, add Revenue, then List.Sum the Revenue column.', 'The three big rows are 50×12, 25×8, 30×11.'] },
  challenge: { heading: 'Small-order count', lede: 'Without steps: a query that returns how many rows have Units of 10 or fewer.', starter: '', checks: [{ kind: 'uses', label: 'Uses Table.SelectRows', fn: 'Table.SelectRows' }, { kind: 'value', label: 'Count is 3', expect: 3, fail: 'Units ≤ 10: 10, 8, 4 → 3 rows.' }], hints: ['`Table.RowCount(Table.SelectRows(Source, each [Units] <= 10))`.', 'Three rows are 10 or fewer.'] },
  quiz: [
    { q: 'What does `each [Units]` mean?', opts: ['every Units value at once', 'the current row’s Units', 'the Units column'], a: 1, why: 'each makes a row function; [Units] is the row’s value.' },
    { q: 'Table.SelectRows returns…', opts: ['a number', 'a filtered table', 'a list'], a: 1, why: 'It filters rows and returns a table.' },
    { q: 'A query ends with…', opts: ['the last let step via in', 'a semicolon', 'return'], a: 0, why: 'in returns the final step.' },
  ],
  recap: { takeaways: ['A query is load → filter → aggregate, in `let … in`.', '`each [Column]` reads the current row.', 'Compose Table.* and List.* functions into a pipeline.'], syntaxExamples: [{ label: 'Pipeline', code: 'let f = Table.SelectRows(Source, each [Units] > 20) in Table.RowCount(f)' }], commonMistakes: [{ mistake: 'Using [Column] without each', why: 'There is no current row outside a row function.', fix: 'Wrap the condition in each.' }, { mistake: 'Returning the wrong step', why: 'in must name the final result.', fix: 'Point in at the aggregate.' }], knowledgeChecks: [{ q: 'Row function keyword?', opts: ['each', 'row'], a: 0, why: 'each.' }] },
  missions: [
    { id: 'li-m-raw-l05-seed', lessonId: 'li-m-raw-l05', tier: 'seed', title: 'Filter + count', objective: 'Count rows with Units > 20.', expected: '3.', starter: '', hints: ['Table.SelectRows + Table.RowCount.'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 3', expect: 3 }] },
    { id: 'li-m-raw-l05-sprout', lessonId: 'li-m-raw-l05', tier: 'sprout', title: 'Small orders', objective: 'Count rows with Units ≤ 10.', expected: '3.', starter: '', hints: ['each [Units] <= 10.'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 3', expect: 3 }, { kind: 'uses', label: 'Table.SelectRows', fn: 'Table.SelectRows' }] },
    { id: 'li-m-raw-l05-bloom', lessonId: 'li-m-raw-l05', tier: 'bloom', title: 'Big-order revenue', objective: 'Total revenue of rows with Units > 20.', expected: '1130.', starter: '', hints: ['Filter, add Revenue, sum it.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 1130', expect: 1130 }, { kind: 'uses', label: 'Table.AddColumn', fn: 'Table.AddColumn' }] },
  ],
});

export const RAW_LESSONS: MLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
