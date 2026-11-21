import { describe, it, expect } from 'vitest';
import { evaluateM } from '../src/lithic/runtime/m/evaluate';
import { runMChecks, allMPass } from '../src/lithic/runtime/m/checks';

const v = (src: string) => { const r = evaluateM(src); if (!r.ok) throw new Error(`${src} → ${r.error}`); return r.value; };

describe('Lithic Power Query M limited evaluator', () => {
  it('evaluates literals, let/in, if and operators', () => {
    expect(v('let x = 1 in x + 2')).toBe(3);
    expect(v('if 5 > 3 then "big" else "small"')).toBe('big');
    expect(v('"a" & "b"')).toBe('ab');
    expect(v('10 - 2 * 3')).toBe(4);
    expect(v('null ?? 7')).toBe(7);
    expect(v('{1, 2, 3}{1}')).toBe(2);
    expect(v('[A = 1, B = 2][B]')).toBe(2);
  });

  it('projects columns and runs list functions', () => {
    expect(v('List.Count(Source[Units])')).toBe(8);
    expect(v('List.Sum(Source[Units])')).toBe(159);
    expect(v('List.Max(Source[Units])')).toBe(50);
    expect(v('List.Average(Source[Price])')).toBe(22);
    expect(v('List.Count(List.Distinct(Source[Region]))')).toBe(5);
    expect(v('List.Count(List.Distinct(List.Transform(Source[Region], each Text.Lower(_))))')).toBe(4);
    expect(v('List.Sum(List.Select({5, 12, 20, 3}, each _ > 10))')).toBe(32);
  });

  it('runs text and number functions', () => {
    expect(v('Text.Upper("amethyst")')).toBe('AMETHYST');
    expect(v('Text.Trim("Citrine ")')).toBe('Citrine');
    expect(v('Text.Length("quartz")')).toBe(6);
    expect(v('Text.Combine({"a", "b", "c"}, "-")')).toBe('a-b-c');
    expect(v('Number.Round(3.14159, 2)')).toBe(3.14);
  });

  it('transforms tables with each / Table functions', () => {
    expect(v('Table.RowCount(Source)')).toBe(8);
    expect(v('Table.RowCount(Table.SelectRows(Source, each [Units] > 20))')).toBe(3);
    expect(v('Table.ColumnNames(Table.SelectColumns(Source, {"Product", "Units"}))')).toEqual(['Product', 'Units']);
    expect(v('Table.RowCount(Table.Distinct(Table.SelectColumns(Source, {"Product"})))')).toBe(7);
    expect(v('List.Sum(Table.AddColumn(Source, "Revenue", each [Units] * [Price])[Revenue])')).toBe(2500);
  });

  it('reports clear errors for unsupported or malformed input', () => {
    expect(evaluateM('FooBar(1)').ok).toBe(false);
    expect(evaluateM('Source[Nope]').ok).toBe(false);
    expect(evaluateM('let x = in x').ok).toBe(false);
  });

  it('the check engine validates value, rows, list, uses and source', () => {
    expect(allMPass(runMChecks('List.Sum(Source[Units])', [
      { kind: 'runs', label: 'runs' }, { kind: 'value', label: '159', expect: 159 }, { kind: 'uses', label: 'List.Sum', fn: 'List.Sum' },
    ]))).toBe(true);
    expect(runMChecks('Table.SelectRows(Source, each [Units] > 20)', [{ kind: 'rows', label: '3 rows', expect: 3 }])[0].ok).toBe(true);
    expect(runMChecks('List.Distinct({1, 1, 2, 3})', [{ kind: 'list', label: 'list', expect: [1, 2, 3] }])[0].ok).toBe(true);
    expect(runMChecks('List.Sum(Source[Units])', [{ kind: 'value', label: 'wrong', expect: 1 }])[0].ok).toBe(false);
  });
});
