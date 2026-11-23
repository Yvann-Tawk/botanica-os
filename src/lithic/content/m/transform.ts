// The Refinery · Mini-Planet 04 · The Transformation Engine — text, number, date (concept only — this engine
// has no dates and does not execute date functions, so those checks are syntax-level and say so), type
// conversions, and conditional columns.

import type { MLesson } from '../mTypes';

const L = (n: number, title: string, minutes: number, xp: number): Pick<MLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-m-transform-l${String(n).padStart(2, '0')}`, conceptId: `lithic.m.transform.l${n}`, planetId: 'refinery', conceptKey: 'lithic.m.transform', number: n, title, minutes, xp,
});
const mk = (o: Partial<MLesson> & ReturnType<typeof L>): MLesson => o as MLesson;

const lesson01 = mk({
  ...L(1, 'Text functions', 14, 170),
  objectives: ['Clean and reshape text', 'Compose Text.* functions', 'Standardise messy strings'],
  discover: { heading: 'Working with text', lede: 'The `Text.*` family cleans and reshapes strings: `Text.Upper`/`Text.Lower`/`Text.Proper` change case, `Text.Trim` removes surrounding spaces, `Text.Length` measures, `Text.Start`/`Text.End` slice, `Text.Combine` joins a list. Compose them to standardise messy data.', example: 'Text.Upper(Text.Trim("Citrine "))   // "CITRINE"\nText.Start("amethyst", 3)           // "ame"', exampleNote: 'Trim removes the trailing space, then Upper capitalises; Start takes the first 3 characters.', tip: 'Compose Text.* functions to clean strings in one expression.' },
  experiment: { heading: 'Reshape text', lede: 'Clean a string.', steps: ['`Text.Upper(Text.Trim("Citrine "))`', '`Text.Length("feldspar")`', '`Text.Proper("copper ore")`'], tip: 'Wrap one function in another to compose.', starter: 'Text.Upper(Text.Trim("Citrine "))' },
  practice: { heading: 'Standardise a name', lede: 'Take `"  quartz "`, trim it and make it Proper case, yielding `"Quartz"`.', steps: ['Compose `Text.Proper` and `Text.Trim`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Text.Trim', fn: 'Text.Trim' }, { kind: 'value', label: 'Reads "Quartz"', expect: 'Quartz', fail: 'Text.Proper(Text.Trim("  quartz ")) → "Quartz".' }], hints: ['`Text.Proper(Text.Trim("  quartz "))`.'] },
  challenge: { heading: 'First three', lede: 'Without steps: uppercase the first three characters of `"amethyst"`, yielding `"AME"`.', starter: '', checks: [{ kind: 'value', label: 'Reads "AME"', expect: 'AME', fail: 'Text.Upper(Text.Start("amethyst", 3)) → "AME".' }], hints: ['`Text.Upper(Text.Start("amethyst", 3))`.', 'Start takes the first 3; then uppercase.'] },
  quiz: [
    { q: 'Text.Trim removes…', opts: ['vowels', 'surrounding whitespace', 'digits'], a: 1, why: 'It trims whitespace.' },
    { q: 'Text.Proper does…', opts: ['ALL CAPS', 'Title Case', 'lowercase'], a: 1, why: 'Proper capitalises each word.' },
    { q: 'Can you compose Text.* functions?', opts: ['no', 'yes, nesting them'], a: 1, why: 'They compose.' },
  ],
  recap: { takeaways: ['`Text.*` cleans and reshapes strings.', 'Compose them to standardise data.', 'Case, trim, slice, length, combine.'], syntaxExamples: [{ label: 'Compose', code: 'Text.Proper(Text.Trim("  quartz "))' }], commonMistakes: [{ mistake: 'Forgetting to trim before comparing', why: 'Stray spaces break equality.', fix: 'Trim first.' }], knowledgeChecks: [{ q: 'Title case?', opts: ['Text.Proper', 'Text.Upper'], a: 0, why: 'Text.Proper.' }] },
  missions: [
    { id: 'li-m-transform-l01-seed', lessonId: 'li-m-transform-l01', tier: 'seed', title: 'Uppercase', objective: 'Uppercase "amethyst".', expected: 'AMETHYST.', starter: '', hints: ['Text.Upper("amethyst")'], xpReward: 15, checks: [{ kind: 'value', label: 'Is "AMETHYST"', expect: 'AMETHYST' }] },
    { id: 'li-m-transform-l01-sprout', lessonId: 'li-m-transform-l01', tier: 'sprout', title: 'Trim + upper', objective: 'Clean "Citrine ".', expected: 'CITRINE.', starter: '', hints: ['Text.Upper(Text.Trim("Citrine "))'], xpReward: 30, checks: [{ kind: 'value', label: 'Is "CITRINE"', expect: 'CITRINE' }, { kind: 'uses', label: 'Text.Trim', fn: 'Text.Trim' }] },
    { id: 'li-m-transform-l01-bloom', lessonId: 'li-m-transform-l01', tier: 'bloom', title: 'Initials', objective: 'First 3 of "feldspar", proper case.', expected: 'Fel.', starter: '', hints: ['Text.Proper(Text.Start("feldspar", 3))'], xpReward: 50, checks: [{ kind: 'value', label: 'Is "Fel"', expect: 'Fel' }] },
  ],
});

const lesson02 = mk({
  ...L(2, 'Number functions', 14, 170),
  objectives: ['Round and absolute numbers', 'Aggregate numeric lists', 'Combine Number.* and List.*'],
  discover: { heading: 'Numeric transforms', lede: '`Number.Round(n, digits)` rounds; `Number.Abs` gives magnitude. Pair them with the list aggregates (`List.Sum`, `List.Average`, `List.Max`, `List.Min`) to produce clean figures — a rounded average, a total.', example: 'Number.Round(List.Average(Source[Price]), 1)   // 22\nList.Sum(Source[Price])                        // 176', exampleNote: 'The average price (22) rounded to 1 decimal is 22; the total price is 176.', tip: 'Round after aggregating for tidy figures.' },
  experiment: { heading: 'Crunch numbers', lede: 'Round and total.', steps: ['`List.Sum(Source[Price])`', '`Number.Round(List.Average(Source[Units]), 2)`', 'Read the figures'], tip: 'Round the result of an aggregate.', starter: 'Number.Round(List.Average(Source[Units]), 2)' },
  practice: { heading: 'Rounded average price', lede: 'Return the average Price, rounded to a whole number.', steps: ['`Number.Round(List.Average(Source[Price]), 0)`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Number.Round', fn: 'Number.Round' }, { kind: 'value', label: 'Is 22', expect: 22 }], hints: ['`Number.Round(List.Average(Source[Price]), 0)`.'] },
  challenge: { heading: 'Total price', lede: 'Without steps: the total of the Price column.', starter: '', checks: [{ kind: 'value', label: 'Is 176', expect: 176, fail: 'List.Sum(Source[Price]) = 176.' }], hints: ['`List.Sum(Source[Price])`.'] },
  quiz: [
    { q: 'Number.Round(x, 2) rounds to…', opts: ['2 significant figures', '2 decimal places', 'the nearest 2'], a: 1, why: 'The second argument is decimal places.' },
    { q: 'List.Average returns…', opts: ['the total', 'the mean', 'the max'], a: 1, why: 'It is the mean.' },
    { q: 'Round after aggregating because…', opts: ['it is required', 'you round the final figure', 'it is faster'], a: 1, why: 'Round the result for tidiness.' },
  ],
  recap: { takeaways: ['`Number.Round`/`Number.Abs` transform numbers.', 'List aggregates total/mean/extremes.', 'Round the aggregate for a clean figure.'], syntaxExamples: [{ label: 'Round a mean', code: 'Number.Round(List.Average(Source[Price]), 0)' }], commonMistakes: [{ mistake: 'Rounding each value before aggregating', why: 'It can shift the result.', fix: 'Aggregate first, then round.' }], knowledgeChecks: [{ q: 'Round a number?', opts: ['Number.Round', 'Text.Round'], a: 0, why: 'Number.Round.' }] },
  missions: [
    { id: 'li-m-transform-l02-seed', lessonId: 'li-m-transform-l02', tier: 'seed', title: 'Total price', objective: 'Sum prices.', expected: '176.', starter: '', hints: ['List.Sum(Source[Price])'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 176', expect: 176 }] },
    { id: 'li-m-transform-l02-sprout', lessonId: 'li-m-transform-l02', tier: 'sprout', title: 'Rounded average', objective: 'Average price, whole number.', expected: '22.', starter: '', hints: ['Number.Round(List.Average(Source[Price]), 0)'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 22', expect: 22 }, { kind: 'uses', label: 'Number.Round', fn: 'Number.Round' }] },
    { id: 'li-m-transform-l02-bloom', lessonId: 'li-m-transform-l02', tier: 'bloom', title: 'Rounded mean units', objective: 'Average units to 2 dp.', expected: '19.88.', starter: '', hints: ['Number.Round(List.Average(Source[Units]), 2); 159/8 = 19.875.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 19.88', expect: 19.88 }] },
  ],
});

const lesson03 = mk({
  ...L(3, 'Date functions', 14, 160),
  objectives: ['Recognise date transforms', 'Know Date.Year / Date.Month patterns', 'Understand dates need a date value'],
  discover: { heading: 'Working with dates', lede: 'Power Query has a rich `Date.*` family — `Date.Year`, `Date.Month`, `Date.AddDays`, `Date.From` — for extracting parts and shifting dates. **This limited engine has no date values and does not execute `Date.*` functions**, so this lesson teaches the patterns and checks the formula shape, not a computed result. In real M you would apply these to a date column.', example: 'Date.Year([OrderDate])      // the year part of a date\nDate.AddDays([OrderDate], 7) // one week later', exampleNote: 'Both operate on a date value from a column. We validate that you write the pattern; this engine cannot run it.', tip: 'Date.* needs real date values; here we check the shape, not a value.' },
  experiment: { heading: 'Write the pattern', lede: 'Practise the shape (not executed here).', steps: ['Write `Date.Year([OrderDate])`', 'Note it will not evaluate in this engine', 'Focus on the structure'], tip: 'The result panel will show an error — expected without dates.', starter: 'Date.Year([OrderDate])' },
  practice: { heading: 'Extract the year', lede: 'Write an expression that extracts the year from an `[OrderDate]` column with `Date.Year`. (Shape only — this engine does not execute date functions.)', steps: ['Use `Date.Year([OrderDate])`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Date.Year', fn: 'Date.Year', fail: 'Use Date.Year(...).' }, { kind: 'source', label: 'References a date column', matches: '\\[OrderDate\\]', fail: 'Pass a date column like [OrderDate].' }], hints: ['`Date.Year([OrderDate])`.', 'Date functions take a date value.'] },
  challenge: { heading: 'Add a week', lede: 'Without steps: write a pattern that shifts `[OrderDate]` forward by 7 days with Date.AddDays. (Shape only.)', starter: '', checks: [{ kind: 'uses', label: 'Uses Date.AddDays', fn: 'Date.AddDays', fail: 'Use Date.AddDays([OrderDate], 7).' }, { kind: 'source', label: 'Shifts by 7', matches: ',\\s*7' }], hints: ['`Date.AddDays([OrderDate], 7)`.'] },
  quiz: [
    { q: 'Date functions need…', opts: ['nothing', 'a date value', 'two tables'], a: 1, why: 'They operate on date values.' },
    { q: 'Date.Year extracts…', opts: ['the month', 'the year part', 'the day'], a: 1, why: 'It returns the year.' },
    { q: 'Does this engine execute Date.* functions?', opts: ['yes', 'no — it checks the shape'], a: 1, why: 'The limited engine has no dates.' },
  ],
  recap: { takeaways: ['`Date.*` extracts parts and shifts dates.', 'They need real date values.', 'This engine checks the pattern’s shape, not a value.'], syntaxExamples: [{ label: 'Date patterns', code: 'Date.Year([OrderDate])\nDate.AddDays([OrderDate], 7)' }], commonMistakes: [{ mistake: 'Applying Date.* to text', why: 'They need a date value.', fix: 'Convert with Date.From first.' }], knowledgeChecks: [{ q: 'Year part?', opts: ['Date.Year', 'Date.Day'], a: 0, why: 'Date.Year.' }] },
  missions: [
    { id: 'li-m-transform-l03-seed', lessonId: 'li-m-transform-l03', tier: 'seed', title: 'Year shape', objective: 'A Date.Year pattern.', expected: 'Date.Year over a date column.', starter: '', hints: ['Date.Year([OrderDate])'], xpReward: 15, checks: [{ kind: 'uses', label: 'Date.Year', fn: 'Date.Year' }, { kind: 'source', label: 'Date column', matches: '\\[OrderDate\\]' }] },
    { id: 'li-m-transform-l03-sprout', lessonId: 'li-m-transform-l03', tier: 'sprout', title: 'Month shape', objective: 'A Date.Month pattern.', expected: 'Date.Month over a date column.', starter: '', hints: ['Date.Month([OrderDate])'], xpReward: 30, checks: [{ kind: 'uses', label: 'Date.Month', fn: 'Date.Month' }, { kind: 'source', label: 'Date column', matches: '\\[OrderDate\\]' }] },
    { id: 'li-m-transform-l03-bloom', lessonId: 'li-m-transform-l03', tier: 'bloom', title: 'Shift shape', objective: 'A Date.AddDays pattern by 30.', expected: 'Date.AddDays by 30.', starter: '', hints: ['Date.AddDays([OrderDate], 30)'], xpReward: 50, checks: [{ kind: 'uses', label: 'Date.AddDays', fn: 'Date.AddDays' }, { kind: 'source', label: 'By 30', matches: ',\\s*30' }] },
  ],
});

const lesson04 = mk({
  ...L(4, 'Type conversions', 14, 170),
  objectives: ['Convert text to number with Number.From', 'Convert number to text by concatenation', 'Keep types consistent'],
  discover: { heading: 'Changing types', lede: 'Data often arrives as the wrong type — numbers stored as text, say. `Number.From("42")` parses text to a number so you can do arithmetic. Going the other way, `&` coerces a number to text: `"Count: " & 8` is `"Count: 8"`. Convert early so later steps work.', example: 'Number.From("42") + 8    // 50\n"Total: " & 176          // "Total: 176"', exampleNote: '`Number.From` parses "42" so it can be added; `&` turns 176 into text.', tip: 'Number.From parses text→number; & coerces number→text.' },
  experiment: { heading: 'Convert', lede: 'Change types.', steps: ['`Number.From("10") + 5`', '`"Rows: " & 8`', 'See number vs text'], tip: 'Convert before you compute.', starter: 'Number.From("10") + 5' },
  practice: { heading: 'Parse and add', lede: 'Parse the text `"40"` to a number and add 2, yielding 42.', steps: ['`Number.From("40") + 2`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Number.From', fn: 'Number.From' }, { kind: 'value', label: 'Is 42', expect: 42 }], hints: ['`Number.From("40") + 2`.'] },
  challenge: { heading: 'A labelled count', lede: 'Without steps: produce the text `Rows: 8` by joining a label with the Source row count.', starter: '', checks: [{ kind: 'value', label: 'Reads "Rows: 8"', expect: 'Rows: 8', fail: '"Rows: " & Table.RowCount(Source) → "Rows: 8".' }], hints: ['`"Rows: " & Table.RowCount(Source)`.', '& turns the number into text.'] },
  quiz: [
    { q: 'Number.From("42") gives…', opts: ['the text "42"', 'the number 42', 'an error'], a: 1, why: 'It parses text to a number.' },
    { q: 'How do you turn a number into text?', opts: ['with &', 'with +', 'you cannot'], a: 0, why: '& coerces to text.' },
    { q: 'Convert types…', opts: ['at the end', 'early, before computing', 'never'], a: 1, why: 'Convert early so steps work.' },
  ],
  recap: { takeaways: ['`Number.From` parses text to number.', '`&` coerces a number to text.', 'Convert early to avoid type errors.'], syntaxExamples: [{ label: 'Conversions', code: 'Number.From("40") + 2\n"n = " & 8' }], commonMistakes: [{ mistake: 'Adding text and number with +', why: '+ is numeric.', fix: 'Parse with Number.From, or join with &.' }], knowledgeChecks: [{ q: 'Text→number?', opts: ['Number.From', 'Text.From'], a: 0, why: 'Number.From.' }] },
  missions: [
    { id: 'li-m-transform-l04-seed', lessonId: 'li-m-transform-l04', tier: 'seed', title: 'Parse', objective: 'Number.From("99").', expected: '99.', starter: '', hints: ['Number.From("99")'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 99', expect: 99 }] },
    { id: 'li-m-transform-l04-sprout', lessonId: 'li-m-transform-l04', tier: 'sprout', title: 'Parse + add', objective: 'Number.From("40") + 2.', expected: '42.', starter: '', hints: ['Add after parsing.'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 42', expect: 42 }, { kind: 'uses', label: 'Number.From', fn: 'Number.From' }] },
    { id: 'li-m-transform-l04-bloom', lessonId: 'li-m-transform-l04', tier: 'bloom', title: 'Labelled count', objective: 'Make "Rows: 8".', expected: 'Rows: 8.', starter: '', hints: ['"Rows: " & Table.RowCount(Source)'], xpReward: 50, checks: [{ kind: 'value', label: 'Text matches', expect: 'Rows: 8' }] },
  ],
});

const lesson05 = mk({
  ...L(5, 'Conditional columns', 16, 190),
  objectives: ['Add a column with Table.AddColumn', 'Compute it per row with each and if/then/else', 'Build a derived category'],
  discover: { heading: 'Deriving new columns', lede: '`Table.AddColumn(table, "Name", each expression)` adds a column computed per row. Combine it with `if … then … else` to derive a category: a tier, a flag, a bucket. Inside `each`, `[Column]` is the row’s value. This is the heart of transformation — turning raw fields into analysis-ready ones.', example: 'Table.AddColumn(Source, "Tier", each if [Units] > 20 then "High" else "Low")', exampleNote: 'Each row gets a Tier of "High" or "Low" based on its Units. The result is a new table with the extra column.', tip: 'Table.AddColumn + each + if/then/else derives a column per row.' },
  experiment: { heading: 'Add a column', lede: 'Derive a tier.', steps: ['Add a `Tier` column with `if [Units] > 20 then "High" else "Low"`', 'Filter to `[Tier] = "High"`', 'Count the result'], tip: 'The new column is usable in later steps.', starter: 'Table.RowCount(Table.SelectRows(Table.AddColumn(Source, "Tier", each if [Units] > 20 then "High" else "Low"), each [Tier] = "High"))' },
  practice: { heading: 'Count high-tier rows', lede: 'Add a `Tier` column (`"High"` when Units above 20, else `"Low"`), then count the High rows.', steps: ['`Table.AddColumn(Source, "Tier", each if [Units] > 20 then "High" else "Low")`', 'Filter to `[Tier] = "High"` and count'], starter: '', checks: [{ kind: 'uses', label: 'Uses Table.AddColumn', fn: 'Table.AddColumn' }, { kind: 'source', label: 'Uses if/then/else', matches: '\\bif\\b[\\s\\S]*\\bthen\\b[\\s\\S]*\\belse\\b' }, { kind: 'value', label: '3 are High', expect: 3, fail: 'Units > 20 → 3 High rows.' }], hints: ['Add the Tier column, then Table.RowCount(Table.SelectRows(…, each [Tier] = "High")).', 'Three rows exceed 20 units.'] },
  challenge: { heading: 'Revenue column total', lede: 'Without steps: add a `Revenue` column (Units × Price) and return the total revenue across all rows.', starter: '', checks: [{ kind: 'uses', label: 'Uses Table.AddColumn', fn: 'Table.AddColumn' }, { kind: 'value', label: 'Totals 2500', expect: 2500, fail: 'Sum of Units × Price across all rows is 2500.' }], hints: ['`List.Sum(Table.AddColumn(Source, "Revenue", each [Units] * [Price])[Revenue])`.', 'Add the column, project it, sum it.'] },
  quiz: [
    { q: 'Table.AddColumn computes the new column…', opts: ['once overall', 'once per row (each)', 'never'], a: 1, why: 'each runs per row.' },
    { q: 'A per-row category uses…', opts: ['if/then/else', 'a loop', 'SQL'], a: 0, why: 'if/then/else derives it.' },
    { q: 'Inside each, `[Units]` is…', opts: ['the column', 'the row’s Units', '0'], a: 1, why: 'each gives row context.' },
  ],
  recap: { takeaways: ['`Table.AddColumn(t, "Name", each …)` adds a per-row column.', 'Combine with `if/then/else` to derive categories.', 'The new column feeds later steps.'], syntaxExamples: [{ label: 'Conditional column', code: 'Table.AddColumn(Source, "Tier", each if [Units] > 20 then "High" else "Low")' }], commonMistakes: [{ mistake: 'Omitting each', why: '[Column] needs a row function.', fix: 'Write each before the expression.' }, { mistake: 'Missing the else', why: 'if needs both then and else in M.', fix: 'Always provide else.' }], knowledgeChecks: [{ q: 'Add a column?', opts: ['Table.AddColumn', 'List.Transform'], a: 0, why: 'Table.AddColumn.' }] },
  missions: [
    { id: 'li-m-transform-l05-seed', lessonId: 'li-m-transform-l05', tier: 'seed', title: 'Add a column', objective: 'Add Revenue, count rows.', expected: '8.', starter: '', hints: ['Table.RowCount(Table.AddColumn(Source, "Revenue", each [Units] * [Price]))'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 8', expect: 8 }, { kind: 'uses', label: 'Table.AddColumn', fn: 'Table.AddColumn' }] },
    { id: 'li-m-transform-l05-sprout', lessonId: 'li-m-transform-l05', tier: 'sprout', title: 'High tier count', objective: 'Count High-tier rows.', expected: '3.', starter: '', hints: ['Tier High when Units > 20.'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 3', expect: 3 }, { kind: 'source', label: 'if/then/else', matches: '\\bif\\b[\\s\\S]*\\belse\\b' }] },
    { id: 'li-m-transform-l05-bloom', lessonId: 'li-m-transform-l05', tier: 'bloom', title: 'Total revenue', objective: 'Sum a Revenue column.', expected: '2500.', starter: '', hints: ['Add Revenue, sum the column.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 2500', expect: 2500 }, { kind: 'uses', label: 'Table.AddColumn', fn: 'Table.AddColumn' }] },
  ],
});

export const TRANSFORM_LESSONS: MLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
