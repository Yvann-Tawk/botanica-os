// A small, fixed sample table for the Lithic Power Query M lessons. The M evaluator (evaluate.ts) runs a
// DOCUMENTED SUBSET of M against this `Source` table — it is a limited educational engine, not Power Query's
// mashup engine, and lessons say so. The data is deliberately a little messy (mixed case, a trailing space, a
// duplicate) so cleaning transformations have something to do.

export interface MRecord { __rec: true; fields: Record<string, MValue> }
export interface MTable { __tbl: true; columns: string[]; rows: MRecord[] }
export type MFunc = { __fn: true; arity: number; call: (args: MValue[]) => MValue };
export type MValue = number | string | boolean | null | MValue[] | MRecord | MTable | MFunc;

export const rec = (fields: Record<string, MValue>): MRecord => ({ __rec: true, fields });
export const table = (columns: string[], rows: Record<string, MValue>[]): MTable => ({ __tbl: true, columns, rows: rows.map(rec) });

export const SOURCE: MTable = table(['Product', 'Region', 'Units', 'Price'], [
  { Product: 'amethyst', Region: 'North', Units: 10, Price: 40 },
  { Product: 'Citrine ', Region: 'north', Units: 8, Price: 30 },
  { Product: 'QUARTZ', Region: 'South', Units: 50, Price: 12 },
  { Product: 'feldspar', Region: 'South', Units: 25, Price: 8 },
  { Product: 'copper ore', Region: 'West', Units: 18, Price: 20 },
  { Product: 'iron ore', Region: 'East', Units: 14, Price: 15 },
  { Product: 'amethyst', Region: 'West', Units: 4, Price: 40 },
  { Product: 'quartz', Region: 'East', Units: 30, Price: 11 },
]);

export const MODEL: Record<string, MTable> = { Source: SOURCE };

export const MODEL_SUMMARY = `Sample query input (limited educational engine):
• Source — a table of ${SOURCE.rows.length} rows, columns: Product, Region, Units, Price
  (deliberately messy: mixed case, a trailing space, a duplicate product)
Project a column as a list with Source[Column], e.g. Source[Units].`;
