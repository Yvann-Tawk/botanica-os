import { describe, it, expect } from 'vitest';
import { M_LESSONS } from '../src/lithic/content/mIndex';
import { ALL_LITHIC_LESSONS } from '../src/lithic/curriculum';
import { TIERS } from '../src/lithic/content/types';
import { evaluateM } from '../src/lithic/runtime/m/evaluate';
import { runMChecks } from '../src/lithic/runtime/m/checks';

const val = (src: string) => { const r = evaluateM(src); if (!r.ok) throw new Error(`${src} → ${r.error}`); return r.value; };
const close = (a: unknown, b: number) => Math.abs((a as number) - b) < 0.01;

describe('Lithic Power Query M content integrity', () => {
  it('every M lesson matches a curriculum node and has three correct missions', () => {
    const ids = new Set(ALL_LITHIC_LESSONS.map((l) => l.id));
    for (const lesson of M_LESSONS) {
      expect(ids.has(lesson.id), `${lesson.id} in curriculum`).toBe(true);
      expect(lesson.planetId).toBe('refinery');
      expect(lesson.missions).toHaveLength(3);
      lesson.missions.forEach((m, i) => { expect(m.tier).toBe(TIERS[i].tier); expect(m.xpReward).toBe(TIERS[i].xp); expect(m.lessonId).toBe(lesson.id); });
    }
    expect(M_LESSONS.length).toBe(20);
  });

  it('every M check parses (no check fails to run)', () => {
    for (const lesson of M_LESSONS) {
      const sets = [lesson.practice.checks, lesson.challenge.checks, ...lesson.missions.map((m) => m.checks)];
      for (const checks of sets) for (const r of runMChecks('List.Sum(Source[Units])', checks)) {
        expect(r.detail ?? '', `${lesson.id}: ${r.label}`).not.toContain('Check could not run');
      }
    }
  });

  it('authored solution formulas produce the expected values', () => {
    expect(val('List.Count(Source[Units])')).toBe(8);
    expect(val('List.Sum(Source[Units])')).toBe(159);
    expect(val('List.Average(Source[Price])')).toBe(22);
    expect(val('"Hello " & "Lithic"')).toBe('Hello Lithic');
    expect(val('(10 + 5) * 2')).toBe(30);
    expect(val('let price = Source[Price], avg = List.Average(price) in avg')).toBe(22);
    expect(val('let f = Table.SelectRows(Source, each [Units] > 10), n = Table.RowCount(f) in n')).toBe(5);
    expect(val('[Product = "Quartz", Units = 50][Units]')).toBe(50);
    expect(val('{3, 6, 9, 12}{2}')).toBe(9);
    expect(val('let big = Table.SelectRows(Source, each [Units] > 20), rev = Table.AddColumn(big, "Revenue", each [Units] * [Price]) in List.Sum(rev[Revenue])')).toBe(1130);
    expect(val('Table.RowCount(Table.SelectRows(Source, each [Units] <= 10))')).toBe(3);

    expect(val('List.Count(Table.ColumnNames(Source))')).toBe(4);
    expect(val('List.Max(Source[Price])')).toBe(40);
    expect(val('Source{2}[Units]')).toBe(50);
    expect(val('[Name = "Topaz", Price = 35][Price]')).toBe(35);
    expect(val('{100, 200, 300, 400}{3}')).toBe(400);
    expect(val('Source{4}[Price]')).toBe(20);
    expect(val('Source[Region]{2}')).toBe('South');

    expect(val('Table.RowCount(Table.SelectRows(Source, each [Region] = "South"))')).toBe(2);
    expect(val('Table.RowCount(Table.SelectRows(Source, each [Units] > 20 and [Price] < 12))')).toBe(2);
    expect(val('Table.Sort(Source, "Price"){0}[Price]')).toBe(8);
    expect(val('Table.Sort(Source, "Price"){7}[Product]')).toBe('amethyst');
    expect(val('Table.RowCount(Table.Distinct(Table.SelectColumns(Source, {"Product"})))')).toBe(7);
    expect(val('List.Count(List.Distinct(Source[Region]))')).toBe(5);
    expect(val('Text.Replace("iron ore", " ", "_")')).toBe('iron_ore');
    expect(val('Text.Lower(Text.Trim("  QUARTZ  "))')).toBe('quartz');
    expect(val('let x = null in x ?? 99')).toBe(99);
    expect(val('List.Sum({5, null, 10, null, 15})')).toBe(30);

    expect(val('Text.Proper(Text.Trim("  quartz "))')).toBe('Quartz');
    expect(val('Text.Upper(Text.Start("amethyst", 3))')).toBe('AME');
    expect(val('Number.Round(List.Average(Source[Price]), 0)')).toBe(22);
    expect(val('List.Sum(Source[Price])')).toBe(176);
    expect(close(val('Number.Round(List.Average(Source[Units]), 2)'), 19.88)).toBe(true);
    expect(val('Number.From("40") + 2')).toBe(42);
    expect(val('"Rows: " & Table.RowCount(Source)')).toBe('Rows: 8');
    expect(val('Table.RowCount(Table.SelectRows(Table.AddColumn(Source, "Tier", each if [Units] > 20 then "High" else "Low"), each [Tier] = "High"))')).toBe(3);
    expect(val('List.Sum(Table.AddColumn(Source, "Revenue", each [Units] * [Price])[Revenue])')).toBe(2500);
  });
});
