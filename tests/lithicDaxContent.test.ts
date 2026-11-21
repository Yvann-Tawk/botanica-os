import { describe, it, expect } from 'vitest';
import { DAX_LESSONS } from '../src/lithic/content/daxIndex';
import { ALL_LITHIC_LESSONS } from '../src/lithic/curriculum';
import { TIERS } from '../src/lithic/content/types';
import { evaluateDax } from '../src/lithic/runtime/dax/evaluate';
import { runDaxChecks } from '../src/lithic/runtime/dax/checks';
import { SALES_MODEL } from '../src/lithic/runtime/dax/model';

const val = (src: string) => { const r = evaluateDax(src, SALES_MODEL); if (!r.ok) throw new Error(`${src} → ${r.error}`); return r.value; };
const close = (a: unknown, b: number) => Math.abs((a as number) - b) < 0.01;

describe('Lithic DAX content integrity', () => {
  it('every DAX lesson matches a curriculum node and has three correct missions', () => {
    const ids = new Set(ALL_LITHIC_LESSONS.map((l) => l.id));
    for (const lesson of DAX_LESSONS) {
      expect(ids.has(lesson.id), `${lesson.id} in curriculum`).toBe(true);
      expect(lesson.planetId).toBe('matrix');
      expect(lesson.missions).toHaveLength(3);
      lesson.missions.forEach((m, i) => { expect(m.tier).toBe(TIERS[i].tier); expect(m.xpReward).toBe(TIERS[i].xp); expect(m.lessonId).toBe(lesson.id); });
    }
    expect(DAX_LESSONS.length).toBe(20);
  });

  it('every DAX check parses (no check fails to run) and regexes compile', () => {
    for (const lesson of DAX_LESSONS) {
      const sets = [lesson.practice.checks, lesson.challenge.checks, ...lesson.missions.map((m) => m.checks)];
      for (const checks of sets) for (const r of runDaxChecks('SUM(Sales[Revenue])', checks)) {
        expect(r.detail ?? '', `${lesson.id}: ${r.label}`).not.toContain('Check could not run');
      }
    }
  });

  // The solution formulas for the authored exercises must evaluate to the expected values in the lessons.
  it('authored solution formulas produce the expected values', () => {
    expect(val('SUM(Sales[Units])')).toBe(290);
    expect(val('SUM(Sales[Cost])')).toBe(2450);
    expect(close(val('SUM(Sales[Revenue]) / COUNTROWS(Sales)'), 322.5714)).toBe(true);
    expect(close(val('(SUM(Sales[Revenue]) - SUM(Sales[Cost])) / SUM(Sales[Revenue])'), 0.4575)).toBe(true);
    expect(val('SUMX(Sales, (Sales[UnitPrice] - Sales[UnitCost]) * Sales[Units])')).toBe(2066);
    expect(val('SUMX(Sales, RELATED(Products[ListPrice]) * Sales[Units])')).toBe(4570);
    expect(val('"Revenue: " & SUM(Sales[Revenue])')).toBe('Revenue: 4516');
    expect(val('"Double units = " & (SUM(Sales[Units]) * 2)')).toBe('Double units = 580');
    expect(val('DISTINCTCOUNT(Sales[ProductKey])')).toBe(6);
    expect(val('MAX(Sales[Units]) - MIN(Sales[Units])')).toBe(46);

    expect(close(val('AVERAGE(Sales[Revenue])'), 322.5714)).toBe(true);
    expect(close(val('AVERAGE(Sales[UnitCost])'), 11.7143)).toBe(true);
    expect(val('COUNT(Sales[UnitPrice])')).toBe(14);
    expect(val('COUNTROWS(FILTER(Sales, Sales[Channel] = "Online"))')).toBe(8);
    expect(val('COUNTROWS(FILTER(FILTER(Sales, Sales[Region] = "North"), Sales[Units] > 20))')).toBe(2);
    expect(val('COUNTROWS(FILTER(FILTER(Sales, Sales[Region] = "West"), Sales[Units] < 20))')).toBe(3);
    expect(val('DISTINCTCOUNT(Sales[Channel])')).toBe(2);
    expect(close(val('DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Units]))'), 15.5724)).toBe(true);
    expect(close(val('DIVIDE(SUM(Sales[Cost]), SUM(Sales[Revenue]))'), 0.5425)).toBe(true);

    expect(val('CALCULATE(SUM(Sales[Revenue]), Sales[Channel] = "Online")')).toBe(2936);
    expect(val('CALCULATE(SUM(Sales[Revenue]), Sales[Channel] = "Retail")')).toBe(1580);
    expect(val('CALCULATE(COUNTROWS(Sales), Sales[Region] = "South")')).toBe(3);
    expect(val('CALCULATE(AVERAGE(Sales[Revenue]), Sales[Region] = "North")')).toBe(420);
    expect(val('CALCULATE(AVERAGE(Sales[Units]), Sales[Channel] = "Online")')).toBe(23.625);
    expect(val('CALCULATE(SUM(Sales[Revenue]), Sales[Region] = "East")')).toBe(876);
    expect(val('CALCULATE(SUM(Sales[Revenue]), FILTER(Sales, Sales[Units] > 20))')).toBe(2330);
    expect(val('CALCULATE(SUM(Sales[Revenue]), FILTER(Sales, Sales[Units] < 20))')).toBe(2186);
    expect(val('CALCULATE(SUM(Sales[Revenue]), FILTER(Sales, Sales[Revenue] > 300))')).toBe(2946);
    expect(close(val('CALCULATE(AVERAGE(Sales[Revenue]), Sales[Region] = "South")'), 306.6667)).toBe(true);

    expect(val('MAXX(Sales, Sales[Units] * Sales[UnitPrice])')).toBe(600);
    expect(val('MINX(Sales, Sales[Units] * Sales[UnitPrice])')).toBe(160);
    expect(close(val('AVERAGEX(Sales, (Sales[UnitPrice] - Sales[UnitCost]) * Sales[Units])'), 147.5714)).toBe(true);
    expect(close(val('VAR Rev = SUM(Sales[Revenue]) VAR Cost = SUM(Sales[Cost]) RETURN DIVIDE(Rev - Cost, Rev)'), 0.4575)).toBe(true);
    expect(val('SUMX(Sales, RELATED(Products[ListPrice]))')).toBe(302);
    expect(val('SUMX(Sales, (RELATED(Products[ListPrice]) - Sales[UnitPrice]) * Sales[Units])')).toBe(54);
    expect(close(val('CALCULATE(DIVIDE(SUM(Sales[Revenue]) - SUM(Sales[Cost]), SUM(Sales[Revenue])), Sales[Channel] = "Online")'), 0.4632)).toBe(true);
    expect(close(val('DIVIDE(CALCULATE(SUM(Sales[Revenue]), Sales[Region] = "North"), SUM(Sales[Revenue]))'), 0.372)).toBe(true);
  });
});
