// The Refinery · Mini-Planet 03 · The Separation Works — filtering, sorting, removing duplicates, replacing
// values, and handling nulls.

import type { MLesson } from '../mTypes';

const L = (n: number, title: string, minutes: number, xp: number): Pick<MLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-m-separate-l${String(n).padStart(2, '0')}`, conceptId: `lithic.m.separate.l${n}`, planetId: 'refinery', conceptKey: 'lithic.m.separate', number: n, title, minutes, xp,
});
const mk = (o: Partial<MLesson> & ReturnType<typeof L>): MLesson => o as MLesson;

const lesson01 = mk({
  ...L(1, 'Filtering rows', 14, 170),
  objectives: ['Keep rows with Table.SelectRows', 'Write a row condition with each', 'Combine conditions'],
  discover: { heading: 'Keeping the rows you want', lede: '`Table.SelectRows(table, each condition)` keeps the rows where the condition is true. `each` is a row function; inside it, `[Column]` is the current row’s value. Conditions use comparisons and `and`/`or`.', example: 'Table.SelectRows(Source, each [Units] > 20)   // 3 rows\nTable.SelectRows(Source, each [Region] = "South")  // 2 rows', exampleNote: 'The first keeps high-unit rows (3); the second keeps South rows (2).', tip: 'each [Column] is the row’s value; combine with and/or.' },
  experiment: { heading: 'Filter', lede: 'Keep matching rows.', steps: ['`Table.RowCount(Table.SelectRows(Source, each [Units] > 20))`', 'Change the threshold', 'Try a Region filter'], tip: 'Wrap in Table.RowCount to count the result.', starter: 'Table.RowCount(Table.SelectRows(Source, each [Units] > 20))' },
  practice: { heading: 'South rows', lede: 'Count how many rows are in the South region.', steps: ['Filter with `each [Region] = "South"`', 'Count with `Table.RowCount`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Table.SelectRows', fn: 'Table.SelectRows' }, { kind: 'value', label: 'There are 2', expect: 2, fail: 'South rows: QUARTZ and feldspar → 2.' }], hints: ['`Table.RowCount(Table.SelectRows(Source, each [Region] = "South"))`.', 'Quote "South".'] },
  challenge: { heading: 'Big and cheap', lede: 'Without steps: count rows where Units is above 20 and Price is below 12.', starter: '', checks: [{ kind: 'source', label: 'Uses and', matches: '\\band\\b', fail: 'Combine two conditions with and.' }, { kind: 'value', label: 'There are 2', expect: 2, fail: 'Units>20 and Price<12: feldspar (25 at 8) and quartz (30 at 11) → 2.' }], hints: ['`each [Units] > 20 and [Price] < 12`.', 'feldspar (25 at 8) and quartz (30 at 11) qualify.'] },
  quiz: [
    { q: 'Table.SelectRows keeps…', opts: ['columns', 'rows matching a condition', 'the first row'], a: 1, why: 'It filters rows.' },
    { q: 'Inside each, `[Units]` is…', opts: ['the whole column', 'the current row’s Units', 'always 0'], a: 1, why: 'each gives row context.' },
    { q: 'Combine two conditions with…', opts: ['and / or', '& &', 'plus'], a: 0, why: 'M uses and / or.' },
  ],
  recap: { takeaways: ['`Table.SelectRows(t, each …)` filters rows.', '`each [Column]` reads the current row.', 'Combine conditions with `and`/`or`.'], syntaxExamples: [{ label: 'Filter', code: 'Table.SelectRows(Source, each [Units] > 20 and [Region] = "South")' }], commonMistakes: [{ mistake: 'Omitting each', why: '[Column] needs a row function.', fix: 'Write each before the condition.' }, { mistake: 'Using && for and', why: 'M uses the word and.', fix: 'Write `and`.' }], knowledgeChecks: [{ q: 'Filter rows?', opts: ['Table.SelectRows', 'Table.SelectColumns'], a: 0, why: 'SelectRows filters rows.' }] },
  missions: [
    { id: 'li-m-separate-l01-seed', lessonId: 'li-m-separate-l01', tier: 'seed', title: 'Big orders', objective: 'Rows with Units > 20.', expected: '3.', starter: '', hints: ['each [Units] > 20'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 3', expect: 3 }] },
    { id: 'li-m-separate-l01-sprout', lessonId: 'li-m-separate-l01', tier: 'sprout', title: 'South', objective: 'South rows.', expected: '2.', starter: '', hints: ['each [Region] = "South"'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 2', expect: 2 }, { kind: 'uses', label: 'Table.SelectRows', fn: 'Table.SelectRows' }] },
    { id: 'li-m-separate-l01-bloom', lessonId: 'li-m-separate-l01', tier: 'bloom', title: 'Compound', objective: 'Units > 20 and Price < 12.', expected: '2.', starter: '', hints: ['Combine with and.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 2', expect: 2 }, { kind: 'source', label: 'Uses and', matches: '\\band\\b' }] },
  ],
});

const lesson02 = mk({
  ...L(2, 'Sorting', 14, 170),
  objectives: ['Sort a table by a column', 'Read the top row after sorting', 'Understand ascending order'],
  discover: { heading: 'Putting rows in order', lede: '`Table.Sort(table, "Column")` orders rows by that column, ascending. After sorting, `{0}` is the first row — so `Table.Sort(Source, "Units"){0}[Units]` is the smallest Units value. Sorting is a step like any other; it returns a new table.', example: 'Table.Sort(Source, "Units"){0}[Units]   // 4  (smallest)', exampleNote: 'Sorting by Units ascending puts the 4-unit row first; reading its Units gives 4.', tip: 'Table.Sort orders ascending; {0} is then the smallest.' },
  experiment: { heading: 'Sort and peek', lede: 'Order then read.', steps: ['`Table.Sort(Source, "Units"){0}[Units]`', 'Sort by Price instead', 'Read the top row'], tip: 'Sorting returns a table; index it.', starter: 'Table.Sort(Source, "Units"){0}[Units]' },
  practice: { heading: 'Cheapest item', lede: 'After sorting Source by Price ascending, return the Price of the first row.', steps: ['`Table.Sort(Source, "Price"){0}[Price]`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Table.Sort', fn: 'Table.Sort' }, { kind: 'value', label: 'Cheapest is 8', expect: 8, fail: 'The lowest price is 8 (feldspar).' }], hints: ['`Table.Sort(Source, "Price"){0}[Price]`.', 'Ascending puts the smallest first.'] },
  challenge: { heading: 'Priciest product', lede: 'Without steps: after sorting Source by Price ascending, return the Product of the last row (index 7).', starter: '', checks: [{ kind: 'value', label: 'Is "amethyst"', expect: 'amethyst', fail: 'Highest price (40) is amethyst; last after ascending sort.' }], hints: ['`Table.Sort(Source, "Price"){7}[Product]`.', 'Index 7 is the last of 8 rows.'] },
  quiz: [
    { q: 'Table.Sort orders…', opts: ['descending by default', 'ascending by default', 'randomly'], a: 1, why: 'It sorts ascending here.' },
    { q: 'After sorting, `{0}` is…', opts: ['the smallest', 'the largest', 'the count'], a: 0, why: 'First row ascending is the smallest.' },
    { q: 'Table.Sort returns…', opts: ['a number', 'a new sorted table', 'a list'], a: 1, why: 'It returns a table.' },
  ],
  recap: { takeaways: ['`Table.Sort(t, "Col")` orders ascending.', 'After sorting, `{0}` is the smallest, last index the largest.', 'Sorting returns a new table.'], syntaxExamples: [{ label: 'Sort', code: 'Table.Sort(Source, "Units"){0}[Units]' }], commonMistakes: [{ mistake: 'Expecting descending', why: 'This sort is ascending.', fix: 'Read the last row for the largest.' }], knowledgeChecks: [{ q: 'Order rows?', opts: ['Table.Sort', 'List.Sort'], a: 0, why: 'Table.Sort for tables.' }] },
  missions: [
    { id: 'li-m-separate-l02-seed', lessonId: 'li-m-separate-l02', tier: 'seed', title: 'Smallest units', objective: 'Min via sort.', expected: '4.', starter: '', hints: ['Table.Sort(Source, "Units"){0}[Units]'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 4', expect: 4 }] },
    { id: 'li-m-separate-l02-sprout', lessonId: 'li-m-separate-l02', tier: 'sprout', title: 'Cheapest', objective: 'Min price via sort.', expected: '8.', starter: '', hints: ['Sort by Price, read {0}.'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 8', expect: 8 }, { kind: 'uses', label: 'Table.Sort', fn: 'Table.Sort' }] },
    { id: 'li-m-separate-l02-bloom', lessonId: 'li-m-separate-l02', tier: 'bloom', title: 'Dearest product', objective: 'Product of the last row by price.', expected: 'amethyst.', starter: '', hints: ['Index 7 after sorting by Price.'], xpReward: 50, checks: [{ kind: 'value', label: 'Is "amethyst"', expect: 'amethyst' }] },
  ],
});

const lesson03 = mk({
  ...L(3, 'Removing duplicates', 14, 170),
  objectives: ['Remove duplicate rows with Table.Distinct', 'Count distinct values', 'Combine with column selection'],
  discover: { heading: 'One of each', lede: '`Table.Distinct(table)` removes duplicate rows. To find distinct values of one column, select that column first: `Table.Distinct(Table.SelectColumns(Source, {"Product"}))`. For a list, `List.Distinct` does the same.', example: 'Table.RowCount(Table.Distinct(Table.SelectColumns(Source, {"Product"})))   // 7', exampleNote: 'Source has 8 rows but “amethyst” appears twice, so there are 7 distinct products.', tip: 'Select the column, then Table.Distinct, to count unique values.' },
  experiment: { heading: 'Dedupe', lede: 'Remove duplicates.', steps: ['`Table.RowCount(Table.Distinct(Table.SelectColumns(Source, {"Product"})))`', 'Try the Region column', 'Compare to the raw count'], tip: 'Distinct on one column counts unique values.', starter: 'Table.RowCount(Table.Distinct(Table.SelectColumns(Source, {"Product"})))' },
  practice: { heading: 'Distinct products', lede: 'Return how many distinct products appear in Source.', steps: ['Select `{"Product"}`, apply `Table.Distinct`, count rows'], starter: '', checks: [{ kind: 'uses', label: 'Uses Table.Distinct', fn: 'Table.Distinct' }, { kind: 'value', label: 'There are 7', expect: 7, fail: 'amethyst repeats, so 7 distinct products.' }], hints: ['`Table.RowCount(Table.Distinct(Table.SelectColumns(Source, {"Product"})))`.'] },
  challenge: { heading: 'Distinct regions', lede: 'Without steps: how many distinct Region values appear (case-sensitive, so "North" and "north" differ)?', starter: '', checks: [{ kind: 'value', label: 'There are 5', expect: 5, fail: 'Regions: North, north, South, West, East → 5 (case-sensitive).' }], hints: ['`List.Count(List.Distinct(Source[Region]))`.', '"North" and "north" count separately.'] },
  quiz: [
    { q: 'Table.Distinct removes…', opts: ['columns', 'duplicate rows', 'nulls'], a: 1, why: 'It removes duplicate rows.' },
    { q: 'To count unique values of one column…', opts: ['select it first, then Distinct', 'use List.Sum', 'sort it'], a: 0, why: 'Select the column, then Distinct.' },
    { q: '"North" and "north" are…', opts: ['the same value', 'different (case-sensitive)'], a: 1, why: 'Text is case-sensitive.' },
  ],
  recap: { takeaways: ['`Table.Distinct` removes duplicate rows.', 'Select a column first to count its unique values.', '`List.Distinct` deduplicates a list.'], syntaxExamples: [{ label: 'Distinct', code: 'Table.Distinct(Table.SelectColumns(Source, {"Product"}))' }], commonMistakes: [{ mistake: 'Distinct on the whole table for one column', why: 'Other columns keep rows distinct.', fix: 'Select the one column first.' }, { mistake: 'Expecting case-insensitive dedupe', why: 'Text is case-sensitive.', fix: 'Lowercase first if needed.' }], knowledgeChecks: [{ q: 'Dedupe a list?', opts: ['List.Distinct', 'List.Sum'], a: 0, why: 'List.Distinct.' }] },
  missions: [
    { id: 'li-m-separate-l03-seed', lessonId: 'li-m-separate-l03', tier: 'seed', title: 'Dedupe list', objective: 'Distinct of {1,1,2,2,3}.', expected: '3.', starter: '', hints: ['List.Count(List.Distinct({1,1,2,2,3}))'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 3', expect: 3 }] },
    { id: 'li-m-separate-l03-sprout', lessonId: 'li-m-separate-l03', tier: 'sprout', title: 'Distinct products', objective: 'Unique products.', expected: '7.', starter: '', hints: ['Select Product, Distinct, count.'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 7', expect: 7 }, { kind: 'uses', label: 'Table.Distinct', fn: 'Table.Distinct' }] },
    { id: 'li-m-separate-l03-bloom', lessonId: 'li-m-separate-l03', tier: 'bloom', title: 'Distinct regions', objective: 'Unique regions (case-sensitive).', expected: '5.', starter: '', hints: ['List.Distinct(Source[Region]).'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 5', expect: 5 }] },
  ],
});

const lesson04 = mk({
  ...L(4, 'Replacing values', 14, 170),
  objectives: ['Replace text with Text.Replace', 'Clean messy strings', 'Chain replacements'],
  discover: { heading: 'Swapping values', lede: '`Text.Replace(text, old, new)` replaces every occurrence of `old` with `new`. It is the workhorse of cleaning — fix a misspelling, swap a separator, standardise a label. Chain it or combine with `Text.Trim`/`Text.Lower` for a full clean.', example: 'Text.Replace("copper ore", "ore", "ingot")   // "copper ingot"\nText.Replace("iron ore", " ", "_")            // "iron_ore"', exampleNote: 'The first swaps a word; the second swaps spaces for underscores.', tip: 'Text.Replace(text, old, new) replaces all occurrences.' },
  experiment: { heading: 'Clean text', lede: 'Replace parts of a string.', steps: ['`Text.Replace("copper ore", "ore", "ingot")`', '`Text.Replace("North-West", "-", " ")`', 'See the results'], tip: 'It replaces every occurrence.', starter: 'Text.Replace("copper ore", "ore", "ingot")' },
  practice: { heading: 'Standardise a code', lede: 'Turn `"iron ore"` into `"iron_ore"` by replacing the space with an underscore.', steps: ['`Text.Replace("iron ore", " ", "_")`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Text.Replace', fn: 'Text.Replace' }, { kind: 'value', label: 'Reads "iron_ore"', expect: 'iron_ore' }], hints: ['`Text.Replace("iron ore", " ", "_")`.'] },
  challenge: { heading: 'Clean and case', lede: 'Without steps: take `"  QUARTZ  "`, trim the spaces and lowercase it, yielding `"quartz"`.', starter: '', checks: [{ kind: 'uses', label: 'Uses Text.Trim', fn: 'Text.Trim' }, { kind: 'value', label: 'Reads "quartz"', expect: 'quartz', fail: 'Trim then lower → "quartz".' }], hints: ['`Text.Lower(Text.Trim("  QUARTZ  "))`.', 'Trim first, then lowercase.'] },
  quiz: [
    { q: 'Text.Replace replaces…', opts: ['the first match only', 'every occurrence', 'nothing'], a: 1, why: 'It replaces all occurrences.' },
    { q: 'To remove surrounding spaces use…', opts: ['Text.Trim', 'Text.Upper', 'Text.Length'], a: 0, why: 'Text.Trim trims whitespace.' },
    { q: 'You can chain cleaning functions…', opts: ['no', 'yes, wrapping one in another'], a: 1, why: 'Functions compose.' },
  ],
  recap: { takeaways: ['`Text.Replace(text, old, new)` replaces all occurrences.', 'Combine with `Text.Trim`/`Text.Lower` to clean.', 'Cleaning functions compose.'], syntaxExamples: [{ label: 'Replace & clean', code: 'Text.Lower(Text.Trim("  QUARTZ  "))' }], commonMistakes: [{ mistake: 'Expecting only the first match replaced', why: 'All matches are replaced.', fix: 'Use a more specific old value if needed.' }], knowledgeChecks: [{ q: 'Trim spaces?', opts: ['Text.Trim', 'Text.Replace'], a: 0, why: 'Text.Trim.' }] },
  missions: [
    { id: 'li-m-separate-l04-seed', lessonId: 'li-m-separate-l04', tier: 'seed', title: 'Swap word', objective: 'copper ore → copper ingot.', expected: 'copper ingot.', starter: '', hints: ['Text.Replace("copper ore","ore","ingot")'], xpReward: 15, checks: [{ kind: 'value', label: 'Text matches', expect: 'copper ingot' }] },
    { id: 'li-m-separate-l04-sprout', lessonId: 'li-m-separate-l04', tier: 'sprout', title: 'Underscore', objective: 'iron ore → iron_ore.', expected: 'iron_ore.', starter: '', hints: ['Replace " " with "_".'], xpReward: 30, checks: [{ kind: 'value', label: 'Text matches', expect: 'iron_ore' }, { kind: 'uses', label: 'Text.Replace', fn: 'Text.Replace' }] },
    { id: 'li-m-separate-l04-bloom', lessonId: 'li-m-separate-l04', tier: 'bloom', title: 'Full clean', objective: 'Trim and lowercase "  QUARTZ  ".', expected: 'quartz.', starter: '', hints: ['Text.Lower(Text.Trim(...)).'], xpReward: 50, checks: [{ kind: 'value', label: 'Is "quartz"', expect: 'quartz' }, { kind: 'uses', label: 'Text.Trim', fn: 'Text.Trim' }] },
  ],
});

const lesson05 = mk({
  ...L(5, 'Handling nulls', 14, 180),
  objectives: ['Coalesce nulls with ??', 'Provide a default value', 'Know aggregations skip nulls'],
  discover: { heading: 'Missing values', lede: 'Missing data is `null`. The coalesce operator `??` returns its right side when the left is null: `value ?? default`. It is the clean way to supply a fallback. Aggregations like `List.Sum` skip nulls, so `List.Sum({1, null, 3})` is 4.', example: 'null ?? 0                 // 0\nList.Sum({1, null, 3})    // 4', exampleNote: '`??` replaces null with 0; `List.Sum` ignores the null and totals 1 + 3 = 4.', tip: 'value ?? default supplies a fallback; aggregations skip nulls.' },
  experiment: { heading: 'Coalesce', lede: 'Handle nulls.', steps: ['`null ?? 42`', '`let x = null in x ?? 5`', '`List.Sum({10, null, 20})`'], tip: '?? is the null-coalescing operator.', starter: 'null ?? 42' },
  practice: { heading: 'A default', lede: 'Using a `let`, bind `x` to `null`, then return `x ?? 99`.', steps: ['`let x = null in x ?? 99`'], starter: '', checks: [{ kind: 'source', label: 'Uses ??', contains: '??' }, { kind: 'value', label: 'Is 99', expect: 99, fail: 'null ?? 99 → 99.' }], hints: ['`let x = null in x ?? 99`.'] },
  challenge: { heading: 'Sum ignoring gaps', lede: 'Without steps: sum the list `{5, null, 10, null, 15}` — the nulls should be skipped.', starter: '', checks: [{ kind: 'uses', label: 'Uses List.Sum', fn: 'List.Sum' }, { kind: 'value', label: 'Is 30', expect: 30, fail: 'List.Sum skips nulls: 5 + 10 + 15 = 30.' }], hints: ['`List.Sum({5, null, 10, null, 15})`.', 'Aggregations ignore nulls.'] },
  quiz: [
    { q: 'Missing data is…', opts: ['0', 'null', '""'], a: 1, why: 'Missing is null.' },
    { q: 'What does `x ?? d` do?', opts: ['always returns d', 'returns d when x is null', 'errors on null'], a: 1, why: '?? coalesces null to the default.' },
    { q: 'List.Sum with nulls…', opts: ['errors', 'skips the nulls', 'returns null'], a: 1, why: 'Aggregations skip nulls.' },
  ],
  recap: { takeaways: ['Missing data is `null`.', '`value ?? default` supplies a fallback.', 'Aggregations skip nulls.'], syntaxExamples: [{ label: 'Coalesce', code: 'x ?? 0' }], commonMistakes: [{ mistake: 'Treating null like 0 in arithmetic', why: 'null propagates or errors.', fix: 'Coalesce with ?? first.' }, { mistake: 'Expecting List.Sum to fail on nulls', why: 'It skips them.', fix: 'No special handling needed to total.' }], knowledgeChecks: [{ q: 'Coalesce operator?', opts: ['??', '&&'], a: 0, why: '?? coalesces null.' }] },
  missions: [
    { id: 'li-m-separate-l05-seed', lessonId: 'li-m-separate-l05', tier: 'seed', title: 'Default', objective: 'null ?? 7.', expected: '7.', starter: '', hints: ['null ?? 7'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 7', expect: 7 }] },
    { id: 'li-m-separate-l05-sprout', lessonId: 'li-m-separate-l05', tier: 'sprout', title: 'Let default', objective: 'let x = null in x ?? 50.', expected: '50.', starter: '', hints: ['Use ?? in a let.'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 50', expect: 50 }, { kind: 'source', label: 'Uses ??', contains: '??' }] },
    { id: 'li-m-separate-l05-bloom', lessonId: 'li-m-separate-l05', tier: 'bloom', title: 'Sum with gaps', objective: 'Sum skipping nulls.', expected: '30.', starter: '', hints: ['List.Sum({5,null,10,null,15}).'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 30', expect: 30 }, { kind: 'uses', label: 'List.Sum', fn: 'List.Sum' }] },
  ],
});

export const SEPARATE_LESSONS: MLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
