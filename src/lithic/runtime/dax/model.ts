// A small, fixed sample tabular model for the Lithic DAX lessons. The DAX evaluator (see evaluate.ts) runs a
// DOCUMENTED SUBSET of DAX against this model — it is a limited educational engine, not Power BI's VertiPaq, and
// lessons say so. Two tables with one many-to-one relationship (Sales → Products) let us teach aggregation,
// iterators, filter/row context, CALCULATE and RELATED honestly with real, checkable results.

export type Cell = number | string;
export interface Table { name: string; columns: string[]; rows: Record<string, Cell>[] }
export interface Relationship { fromTable: string; fromColumn: string; toTable: string; toColumn: string }
export interface DaxModel { tables: Record<string, Table>; relationships: Relationship[] }

const products: Record<string, Cell>[] = [
  { ProductKey: 1, Product: 'Amethyst', Category: 'Gems', ListPrice: 40 },
  { ProductKey: 2, Product: 'Citrine', Category: 'Gems', ListPrice: 30 },
  { ProductKey: 3, Product: 'Quartz', Category: 'Minerals', ListPrice: 12 },
  { ProductKey: 4, Product: 'Feldspar', Category: 'Minerals', ListPrice: 8 },
  { ProductKey: 5, Product: 'Copper ore', Category: 'Ore', ListPrice: 20 },
  { ProductKey: 6, Product: 'Iron ore', Category: 'Ore', ListPrice: 15 },
];

// Units × UnitPrice = Revenue; a Cost column supports margin examples. Regions and Channels support filtering.
const salesRaw: [number, string, string, number, number, number][] = [
  // ProductKey, Region, Channel, Units, UnitPrice, UnitCost
  [1, 'North', 'Online', 10, 40, 22],
  [1, 'South', 'Retail', 6, 40, 22],
  [2, 'North', 'Retail', 8, 30, 15],
  [2, 'East', 'Online', 12, 28, 15],
  [3, 'North', 'Online', 50, 12, 6],
  [3, 'South', 'Online', 40, 12, 6],
  [3, 'East', 'Retail', 30, 11, 6],
  [4, 'South', 'Retail', 25, 8, 4],
  [4, 'West', 'Online', 35, 8, 4],
  [5, 'West', 'Retail', 18, 20, 12],
  [5, 'North', 'Online', 22, 20, 12],
  [6, 'East', 'Retail', 14, 15, 9],
  [6, 'West', 'Online', 16, 15, 9],
  [1, 'West', 'Online', 4, 40, 22],
];

const sales: Record<string, Cell>[] = salesRaw.map(([ProductKey, Region, Channel, Units, UnitPrice, UnitCost]) => ({
  ProductKey, Region, Channel, Units, UnitPrice, UnitCost, Revenue: Units * UnitPrice, Cost: Units * UnitCost,
}));

export const SALES_MODEL: DaxModel = {
  tables: {
    Sales: { name: 'Sales', columns: ['ProductKey', 'Region', 'Channel', 'Units', 'UnitPrice', 'UnitCost', 'Revenue', 'Cost'], rows: sales },
    Products: { name: 'Products', columns: ['ProductKey', 'Product', 'Category', 'ListPrice'], rows: products },
  },
  relationships: [{ fromTable: 'Sales', fromColumn: 'ProductKey', toTable: 'Products', toColumn: 'ProductKey' }],
};

/** A short, human description of the sample model, shown in the DAX workspace so learners know the data. */
export const MODEL_SUMMARY = `Sample model (limited educational engine):
• Sales(ProductKey, Region, Channel, Units, UnitPrice, UnitCost, Revenue, Cost) — ${sales.length} rows
• Products(ProductKey, Product, Category, ListPrice) — ${products.length} rows
• Relationship: Sales[ProductKey] → Products[ProductKey] (many-to-one)`;
