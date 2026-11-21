import { describe, it, expect } from 'vitest';
import { evaluateDax } from '../src/lithic/runtime/dax/evaluate';
import { SALES_MODEL } from '../src/lithic/runtime/dax/model';
import { runDaxChecks, allDaxPass } from '../src/lithic/runtime/dax/checks';

const ev = (src: string) => evaluateDax(src, SALES_MODEL);
const val = (src: string) => { const r = ev(src); if (!r.ok) throw new Error(r.error); return r.value; };

describe('Lithic DAX limited evaluator', () => {
  it('evaluates basic aggregations', () => {
    expect(val('SUM(Sales[Revenue])')).toBe(4516);
    expect(val('SUM(Sales[Units])')).toBe(290);
    expect(val('COUNTROWS(Sales)')).toBe(14);
    expect(val('DISTINCTCOUNT(Sales[Region])')).toBe(4);
    expect(val('DISTINCTCOUNT(Sales[Channel])')).toBe(2);
    expect(val('MAX(Sales[Units])')).toBe(50);
    expect(val('MIN(Sales[Units])')).toBe(4);
  });

  it('handles arithmetic and DIVIDE', () => {
    expect(val('SUM(Sales[Revenue]) - SUM(Sales[Cost])')).toBe(2066);
    expect(val('DIVIDE(10, 0)')).toBe(0);
    expect(val('DIVIDE(10, 0, -1)')).toBe(-1);
    expect(Math.round((val('DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units]))') as number) * 100) / 100).toBe(15.57);
  });

  it('iterates with row context (SUMX) and VAR/RETURN', () => {
    expect(val('SUMX(Sales, Sales[Units] * Sales[UnitPrice])')).toBe(4516);
    expect(val('VAR r = SUM(Sales[Revenue]) VAR c = SUM(Sales[Cost]) RETURN r - c')).toBe(2066);
  });

  it('applies filter context with CALCULATE', () => {
    expect(val('CALCULATE(SUM(Sales[Revenue]), Sales[Region] = "North")')).toBe(1680);
    expect(val('CALCULATE(COUNTROWS(Sales), Sales[Channel] = "Online")')).toBe(8);
    expect(val('CALCULATE(SUM(Sales[Revenue]), FILTER(Sales, Sales[Units] > 20))')).toBe(2330);
  });

  it('follows the relationship with RELATED inside an iterator', () => {
    expect(val('SUMX(Sales, RELATED(Products[ListPrice]) * Sales[Units])')).toBe(4570);
  });

  it('reports clear errors for unsupported or malformed input', () => {
    expect(ev('FOO(Sales[Revenue])').ok).toBe(false);
    expect(ev('RELATED(Products[Category])').ok).toBe(false); // no row context
    expect(ev('SUM(Sales[Nope])').ok).toBe(false);
    expect(ev('1 +').ok).toBe(false);
  });

  it('accepts a "Measure := expr" or "= expr" preamble', () => {
    expect(val('Total Revenue := SUM(Sales[Revenue])')).toBe(4516);
    expect(val('= SUM(Sales[Units])')).toBe(290);
  });

  it('the check engine validates value, runs, uses and source', () => {
    expect(allDaxPass(runDaxChecks('SUM(Sales[Revenue])', [
      { kind: 'runs', label: 'runs' },
      { kind: 'value', label: 'is 4516', expect: 4516 },
      { kind: 'uses', label: 'uses SUM', fn: 'SUM' },
    ]))).toBe(true);
    expect(runDaxChecks('AVERAGE(Sales[Units])', [{ kind: 'uses', label: 'uses SUM', fn: 'SUM' }])[0].ok).toBe(false);
    expect(runDaxChecks('SUM(Sales[Units])', [{ kind: 'value', label: 'wrong', expect: 1 }])[0].ok).toBe(false);
  });
});
