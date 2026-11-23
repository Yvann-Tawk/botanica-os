// The Refinery · Mini-Planet 02 · The Extraction Chamber — data sources, tables, records, lists, and navigating
// structured data.

import type { MLesson } from '../mTypes';

const L = (n: number, title: string, minutes: number, xp: number): Pick<MLesson, 'id' | 'conceptId' | 'planetId' | 'conceptKey' | 'number' | 'title' | 'minutes' | 'xp'> => ({
  id: `li-m-extract-l${String(n).padStart(2, '0')}`, conceptId: `lithic.m.extract.l${n}`, planetId: 'refinery', conceptKey: 'lithic.m.extract', number: n, title, minutes, xp,
});
const mk = (o: Partial<MLesson> & ReturnType<typeof L>): MLesson => o as MLesson;

const lesson01 = mk({
  ...L(1, 'Data sources', 12, 160),
  objectives: ['Understand a source as a table value', 'Inspect a table’s size', 'Know real sources (CSV, Excel, JSON) become tables'],
  discover: { heading: 'From source to table', lede: 'In Power Query, a connector (CSV, Excel, a database, JSON) loads data as a **table** value. From there, M treats it like any table. Here the loaded source is the `Source` table; `Table.RowCount` tells you its size. Real connectors differ only in how the table arrives — once loaded, the M is the same.', example: 'Table.RowCount(Source)   // 8', exampleNote: '`Source` is the loaded table; it has 8 rows. A CSV or Excel import would produce a table just the same.', tip: 'Every source becomes a table; then M transforms it.' },
  experiment: { heading: 'Inspect the source', lede: 'Look at the table.', steps: ['`Table.RowCount(Source)`', '`Table.ColumnNames(Source)`', 'See the rows and columns'], tip: 'The result panel shows tables as a size summary.', starter: 'Table.RowCount(Source)' },
  practice: { heading: 'How big is it?', lede: 'Return the number of rows in the Source table.', steps: ['Use `Table.RowCount` on `Source`'], starter: '', checks: [{ kind: 'uses', label: 'Uses Table.RowCount', fn: 'Table.RowCount' }, { kind: 'value', label: 'There are 8 rows', expect: 8 }], hints: ['`Table.RowCount(Source)`.'] },
  challenge: { heading: 'How many columns?', lede: 'Without steps: return the number of columns in Source.', starter: '', checks: [{ kind: 'value', label: 'There are 4', expect: 4, fail: 'List.Count(Table.ColumnNames(Source)) = 4.' }], hints: ['`List.Count(Table.ColumnNames(Source))`.', 'Product, Region, Units, Price.'] },
  quiz: [
    { q: 'A data source loads as…', opts: ['a chart', 'a table value', 'text'], a: 1, why: 'Connectors produce tables.' },
    { q: 'Table.RowCount returns…', opts: ['columns', 'the number of rows', 'a list'], a: 1, why: 'It counts rows.' },
    { q: 'After loading, different sources are…', opts: ['handled with different M', 'all tables, handled the same', 'not usable'], a: 1, why: 'Once loaded they are tables.' },
  ],
  recap: { takeaways: ['Connectors load data as table values.', '`Table.RowCount` sizes a table.', 'Once loaded, all sources are tables to M.'], syntaxExamples: [{ label: 'Inspect', code: 'Table.RowCount(Source)' }], commonMistakes: [{ mistake: 'Treating Source like a list', why: 'It is a table; columns are lists.', fix: 'Use Table.* on tables, List.* on columns.' }, { mistake: 'Expecting connector specifics here', why: 'This engine starts from a loaded table.', fix: 'Focus on the transformations.' }], knowledgeChecks: [{ q: 'Size a table?', opts: ['Table.RowCount', 'List.Count'], a: 0, why: 'Table.RowCount.' }] },
  missions: [
    { id: 'li-m-extract-l01-seed', lessonId: 'li-m-extract-l01', tier: 'seed', title: 'Rows', objective: 'Count Source rows.', expected: '8.', starter: '', hints: ['Table.RowCount(Source)'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 8', expect: 8 }] },
    { id: 'li-m-extract-l01-sprout', lessonId: 'li-m-extract-l01', tier: 'sprout', title: 'Columns', objective: 'Count columns.', expected: '4.', starter: '', hints: ['List.Count(Table.ColumnNames(Source))'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 4', expect: 4 }] },
    { id: 'li-m-extract-l01-bloom', lessonId: 'li-m-extract-l01', tier: 'bloom', title: 'Column names', objective: 'Return the list of column names.', expected: '{"Product","Region","Units","Price"}.', starter: '', hints: ['Table.ColumnNames(Source)'], xpReward: 50, checks: [{ kind: 'list', label: 'Names match', expect: ['Product', 'Region', 'Units', 'Price'] }] },
  ],
});

const lesson02 = mk({
  ...L(2, 'Tables', 14, 160),
  objectives: ['Read a table’s shape', 'List its column names', 'Project a column to a list'],
  discover: { heading: 'Rows and columns', lede: 'A table is rows of records sharing columns. `Table.ColumnNames(t)` returns the column names as a list; `t[Column]` projects a column to a list; `Table.RowCount(t)` counts rows. These three let you inspect any table.', example: 'Table.ColumnNames(Source)   // {"Product", "Region", "Units", "Price"}\nSource[Region]              // {"North", "north", ...}', exampleNote: '`Table.ColumnNames` lists the headers; `Source[Region]` is the Region column as a list.', tip: 'ColumnNames → headers; Table[Col] → a column as a list.' },
  experiment: { heading: 'Inspect columns', lede: 'List and project.', steps: ['`Table.ColumnNames(Source)`', '`Source[Price]`', '`List.Max(Source[Price])`'], tip: 'A projected column is a list you can aggregate.', starter: 'Source[Price]' },
  practice: { heading: 'The dearest item', lede: 'Return the maximum price in Source by projecting the Price column and taking its max.', steps: ['`List.Max(Source[Price])`'], starter: '', checks: [{ kind: 'uses', label: 'Uses List.Max', fn: 'List.Max' }, { kind: 'value', label: 'Max price is 40', expect: 40 }], hints: ['`List.Max(Source[Price])`.', 'Project then take the max.'] },
  challenge: { heading: 'Column headers', lede: 'Without steps: return the list of column names of Source.', starter: '', checks: [{ kind: 'list', label: 'Names match', expect: ['Product', 'Region', 'Units', 'Price'], fail: 'Table.ColumnNames(Source).' }], hints: ['`Table.ColumnNames(Source)`.'] },
  quiz: [
    { q: 'A table is…', opts: ['a single value', 'rows of records sharing columns', 'a list only'], a: 1, why: 'Tables are rows of records.' },
    { q: 'Column names come from…', opts: ['Table.ColumnNames', 'List.Count', 'Record.Field'], a: 0, why: 'Table.ColumnNames.' },
    { q: '`Source[Price]` is…', opts: ['a number', 'the Price column as a list', 'a record'], a: 1, why: 'Projection yields a list.' },
  ],
  recap: { takeaways: ['Tables are rows of records sharing columns.', '`Table.ColumnNames`, `Table.RowCount`, `Table[Col]` inspect them.', 'A projected column is a list.'], syntaxExamples: [{ label: 'Inspect', code: 'Table.ColumnNames(Source)\nSource[Units]' }], commonMistakes: [{ mistake: 'Using List.* on a table directly', why: 'List.* needs a list.', fix: 'Project a column first: Table[Col].' }], knowledgeChecks: [{ q: 'Project a column?', opts: ['Table[Col]', 'Table(Col)'], a: 0, why: 'Table[Col].' }] },
  missions: [
    { id: 'li-m-extract-l02-seed', lessonId: 'li-m-extract-l02', tier: 'seed', title: 'Max price', objective: 'Largest price.', expected: '40.', starter: '', hints: ['List.Max(Source[Price])'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 40', expect: 40 }] },
    { id: 'li-m-extract-l02-sprout', lessonId: 'li-m-extract-l02', tier: 'sprout', title: 'Min units', objective: 'Smallest units.', expected: '4.', starter: '', hints: ['List.Min(Source[Units])'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 4', expect: 4 }, { kind: 'uses', label: 'List.Min', fn: 'List.Min' }] },
    { id: 'li-m-extract-l02-bloom', lessonId: 'li-m-extract-l02', tier: 'bloom', title: 'Headers', objective: 'List the column names.', expected: 'The four headers.', starter: '', hints: ['Table.ColumnNames(Source)'], xpReward: 50, checks: [{ kind: 'list', label: 'Match', expect: ['Product', 'Region', 'Units', 'Price'] }] },
  ],
});

const lesson03 = mk({
  ...L(3, 'Records', 14, 160),
  objectives: ['Build and read records', 'Access a field', 'See a table row as a record'],
  discover: { heading: 'A row is a record', lede: 'A **record** is a set of named fields: `[Product = "Quartz", Units = 50]`. Read a field with `[Field]`. Each row of a table is a record — `Source{0}` is the first row, and `Source{0}[Product]` reads that row’s Product. (Row access `{index}` is zero-based.)', example: '[Product = "Quartz", Units = 50][Units]   // 50\nSource{0}[Product]                        // "amethyst"', exampleNote: 'The literal record’s `[Units]` is 50; `Source{0}` is the first row (a record), and `[Product]` reads it.', tip: 'Table row = record. Source{i}[Field] reads a cell.' },
  experiment: { heading: 'Read fields', lede: 'Access record fields.', steps: ['`[A = 1, B = 2][B]`', '`Source{0}[Region]`', 'Read a literal and a row'], tip: 'Rows are records; {index} picks one.', starter: 'Source{0}[Product]' },
  practice: { heading: 'A cell value', lede: 'Return the Units of the third row of Source (index 2).', steps: ['Access `Source{2}[Units]`'], starter: '', checks: [{ kind: 'value', label: 'Is 50', expect: 50, fail: 'Source{2}[Units] = 50 (the QUARTZ row).' }], hints: ['`Source{2}[Units]`.', 'Index 2 is the third row.'] },
  challenge: { heading: 'Build a record', lede: 'Without steps: build a record with `Name = "Topaz"` and `Price = 35`, then return its Price.', starter: '', checks: [{ kind: 'value', label: 'Is 35', expect: 35, fail: '[Name = "Topaz", Price = 35][Price] = 35.' }], hints: ['`[Name = "Topaz", Price = 35][Price]`.'] },
  quiz: [
    { q: 'A record is…', opts: ['a list of values', 'a set of named fields', 'a table'], a: 1, why: 'Records have named fields.' },
    { q: 'A table row is…', opts: ['a list', 'a record', 'text'], a: 1, why: 'Each row is a record.' },
    { q: '`Source{0}` is…', opts: ['the first column', 'the first row (a record)', 'the row count'], a: 1, why: 'Row access returns a record.' },
  ],
  recap: { takeaways: ['Records are named fields; read with `[Field]`.', 'Each table row is a record.', '`Source{i}[Field]` reads a cell (zero-based rows).'], syntaxExamples: [{ label: 'Record & cell', code: '[A = 1][A]\nSource{0}[Units]' }], commonMistakes: [{ mistake: 'Using {} to read a field', why: '{} is item access on a list.', fix: 'Fields use [Field].' }], knowledgeChecks: [{ q: 'Read a field?', opts: ['[Field]', '{Field}'], a: 0, why: '[Field].' }] },
  missions: [
    { id: 'li-m-extract-l03-seed', lessonId: 'li-m-extract-l03', tier: 'seed', title: 'A field', objective: 'Read a record field.', expected: '50.', starter: '', hints: ['[Units = 50][Units]'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 50', expect: 50 }] },
    { id: 'li-m-extract-l03-sprout', lessonId: 'li-m-extract-l03', tier: 'sprout', title: 'First product', objective: 'The first row’s Product.', expected: 'amethyst.', starter: '', hints: ['Source{0}[Product]'], xpReward: 30, checks: [{ kind: 'value', label: 'Is "amethyst"', expect: 'amethyst' }] },
    { id: 'li-m-extract-l03-bloom', lessonId: 'li-m-extract-l03', tier: 'bloom', title: 'A cell', objective: 'Units of the QUARTZ row (index 2).', expected: '50.', starter: '', hints: ['Source{2}[Units]'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 50', expect: 50 }] },
  ],
});

const lesson04 = mk({
  ...L(4, 'Lists', 14, 160),
  objectives: ['Build list literals', 'Count and aggregate lists', 'Access items by index'],
  discover: { heading: 'Ordered collections', lede: 'A **list** is an ordered collection: `{1, 2, 3}`. `List.Count` sizes it; `List.Sum`/`List.Average`/`List.Max`/`List.Min` aggregate; `{index}` reads an item (zero-based). Columns project to lists, so list skills apply to data.', example: 'List.Count({5, 10, 15, 20})   // 4\n{5, 10, 15, 20}{2}            // 15', exampleNote: '`List.Count` is 4; item at index 2 is 15 (zero-based).', tip: 'Lists: {…}. Count, aggregate, and index with {i}.' },
  experiment: { heading: 'Work a list', lede: 'Count and index.', steps: ['`List.Count({2, 4, 6})`', '`{2, 4, 6}{1}`', '`List.Sum({2, 4, 6})`'], tip: 'Zero-based indexing.', starter: 'List.Sum({2, 4, 6})' },
  practice: { heading: 'Sum a list', lede: 'Return the sum of the list `{3, 6, 9, 12}`.', steps: ['Use `List.Sum` on the list'], starter: '', checks: [{ kind: 'uses', label: 'Uses List.Sum', fn: 'List.Sum' }, { kind: 'value', label: 'Is 30', expect: 30 }], hints: ['`List.Sum({3, 6, 9, 12})`.'] },
  challenge: { heading: 'A built list', lede: 'Without steps: from `{100, 200, 300, 400}`, return the item at index 3.', starter: '', checks: [{ kind: 'value', label: 'Is 400', expect: 400, fail: '{100,200,300,400}{3} = 400.' }], hints: ['`{100, 200, 300, 400}{3}`.'] },
  quiz: [
    { q: 'A list literal uses…', opts: ['[]', '{}', '()'], a: 1, why: 'Lists use braces.' },
    { q: 'List.Count returns…', opts: ['the sum', 'the number of items', 'the max'], a: 1, why: 'It counts items.' },
    { q: 'First item of a list is at index…', opts: ['1', '0'], a: 1, why: 'Zero-based.' },
  ],
  recap: { takeaways: ['Lists `{…}` are ordered collections.', '`List.Count`/`Sum`/`Average`/`Max`/`Min` aggregate.', 'Items are read with `{index}` (zero-based).'], syntaxExamples: [{ label: 'List ops', code: 'List.Sum({1, 2, 3})\n{10, 20}{0}' }], commonMistakes: [{ mistake: 'One-based indexing', why: 'M is zero-based.', fix: 'First item is {0}.' }, { mistake: 'Summing a table', why: 'List.Sum needs a list.', fix: 'Project a column first.' }], knowledgeChecks: [{ q: 'Count items?', opts: ['List.Count', 'Table.RowCount'], a: 0, why: 'List.Count for lists.' }] },
  missions: [
    { id: 'li-m-extract-l04-seed', lessonId: 'li-m-extract-l04', tier: 'seed', title: 'Count', objective: 'Count a 5-item list.', expected: '5.', starter: '', hints: ['List.Count({…})'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 5', expect: 5 }, { kind: 'uses', label: 'List.Count', fn: 'List.Count' }] },
    { id: 'li-m-extract-l04-sprout', lessonId: 'li-m-extract-l04', tier: 'sprout', title: 'Sum', objective: 'Sum {7, 7, 7}.', expected: '21.', starter: '', hints: ['List.Sum({7,7,7})'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 21', expect: 21 }] },
    { id: 'li-m-extract-l04-bloom', lessonId: 'li-m-extract-l04', tier: 'bloom', title: 'Index', objective: 'Index 2 of {9,8,7,6}.', expected: '7.', starter: '', hints: ['{9,8,7,6}{2}'], xpReward: 50, checks: [{ kind: 'value', label: 'Is 7', expect: 7 }] },
  ],
});

const lesson05 = mk({
  ...L(5, 'Navigating structured data', 14, 170),
  objectives: ['Drill into tables, rows and fields', 'Combine {index} and [Field]', 'Reach a single cell'],
  discover: { heading: 'Drilling in', lede: 'Structured data nests: a table holds rows (records), a record holds fields, a field can hold a list or another record. Navigate by chaining: `Source{2}` is a row, `Source{2}[Units]` its Units, and you can project then index: `Source[Units]{0}` is the first Units value.', example: 'Source{2}[Units]      // 50  (row 2, Units)\nSource[Units]{0}      // 10  (Units column, item 0)', exampleNote: 'Two paths to data: navigate a row then a field, or project a column then index it.', tip: 'Chain {index} and [Field] to reach any cell.' },
  experiment: { heading: 'Drill down', lede: 'Reach a cell two ways.', steps: ['`Source{0}[Price]`', '`Source[Price]{0}`', 'Both reach the first price'], tip: 'Row-then-field, or column-then-index.', starter: 'Source{0}[Price]' },
  practice: { heading: 'A specific cell', lede: 'Return the Price of the fifth row of Source (index 4).', steps: ['Navigate `Source{4}[Price]`'], starter: '', checks: [{ kind: 'value', label: 'Is 20', expect: 20, fail: 'Source{4}[Price] = 20 (the copper ore row).' }], hints: ['`Source{4}[Price]`.', 'Index 4 is the fifth row.'] },
  challenge: { heading: 'Column then item', lede: 'Without steps: from the Region column, return the item at index 2.', starter: '', checks: [{ kind: 'value', label: 'Is "South"', expect: 'South', fail: 'Source[Region]{2} = "South".' }], hints: ['`Source[Region]{2}`.', 'Project then index.'] },
  quiz: [
    { q: '`Source{2}` is…', opts: ['the Units column', 'the third row (a record)', 'a number'], a: 1, why: 'Row access returns a record.' },
    { q: '`Source[Units]{0}` is…', opts: ['the first Units value', 'the row count', 'all units'], a: 0, why: 'Project then index the first.' },
    { q: 'You navigate nested data by…', opts: ['chaining {index} and [Field]', 'only SQL', 'guessing'], a: 0, why: 'Chain the accessors.' },
  ],
  recap: { takeaways: ['Nest: table → row (record) → field → maybe list/record.', 'Chain `{index}` and `[Field]` to reach a cell.', 'Row-then-field or column-then-index both work.'], syntaxExamples: [{ label: 'Navigation', code: 'Source{2}[Units]\nSource[Units]{0}' }], commonMistakes: [{ mistake: 'Mixing up {} and []', why: '{} indexes; [] reads a field.', fix: 'Index with {i}, field with [F].' }], knowledgeChecks: [{ q: 'Reach a row?', opts: ['Source{i}', 'Source[i]'], a: 0, why: '{i} indexes rows.' }] },
  missions: [
    { id: 'li-m-extract-l05-seed', lessonId: 'li-m-extract-l05', tier: 'seed', title: 'A cell', objective: 'Price of row 0.', expected: '40.', starter: '', hints: ['Source{0}[Price]'], xpReward: 15, checks: [{ kind: 'value', label: 'Is 40', expect: 40 }] },
    { id: 'li-m-extract-l05-sprout', lessonId: 'li-m-extract-l05', tier: 'sprout', title: 'Column item', objective: 'Second Units value.', expected: '8.', starter: '', hints: ['Source[Units]{1}'], xpReward: 30, checks: [{ kind: 'value', label: 'Is 8', expect: 8 }] },
    { id: 'li-m-extract-l05-bloom', lessonId: 'li-m-extract-l05', tier: 'bloom', title: 'Deep cell', objective: 'Region of row index 5.', expected: 'East.', starter: '', hints: ['Source{5}[Region]'], xpReward: 50, checks: [{ kind: 'value', label: 'Is "East"', expect: 'East' }] },
  ],
});

export const EXTRACT_LESSONS: MLesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05];
