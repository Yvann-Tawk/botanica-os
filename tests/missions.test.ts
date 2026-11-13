// @vitest-environment node
// Missions and the guided project, checked against real Python.
import { loadPyodide } from 'pyodide';
import { createRunner, type Runner } from '../src/runtime/pyCore';
import { MISSIONS, type Mission } from '../src/content/missions';
import type { Check } from '../src/content/lessons/types';

let runner: Runner;
beforeAll(async () => { runner = await createRunner(await loadPyodide(), { write: () => {}, input: () => null }); }, 60000);

const passes = async (m: Mission, checks: Check[], code: string) =>
  (await runner.check(code, m.filename!, JSON.stringify({ checks, inputs: m.inputs ?? [] }))).results.every(Boolean);
const M = (id: string) => MISSIONS.find((m) => m.id === id)!;

const VAULT = [
  'keeper = input("Keeper name: ")\nprint(f"Welcome, {keeper}.")\n',
  'packets = int(input("Packets: "))\nper_packet = int(input("Seeds per packet: "))\ntotal_seeds = packets * per_packet\nprint(total_seeds, "seeds in the vault")\n',
  'per_shelf = total_seeds // 4\nspare = total_seeds % 4\nprint(f"{per_shelf} per shelf, {spare} spare")\n',
  'humidity = float(input("Humidity: "))\nvault_open = total_seeds >= 500 and humidity <= 0.7\nprint("Vault open:", vault_open)\n',
];

describe('missions content', () => {
  it('every launchable mission has checks or milestones, hints and a file', () => {
    for (const m of MISSIONS.filter((x) => !x.sealed)) {
      expect(m.filename).toBeTruthy();
      expect(!!m.checks || !!m.milestones).toBe(true);
    }
  });

  it('micro missions: solutions pass, starters and hard-coded answers fail', async () => {
    const hello = M('hello'), label = M('label'), arith = M('arith');
    expect(await passes(hello, hello.checks!, 'print("Hello, Hortensia!")')).toBe(true);
    expect(await passes(hello, hello.checks!, hello.starter!)).toBe(false);
    expect(await passes(label, label.checks!, 'name = "Moonfern"\nage_days = 42\nheight_cm = 18.5\nis_flowering = False\nprint(name, "is", age_days, "days old")')).toBe(true);
    expect(await passes(label, label.checks!, label.starter!)).toBe(false);
    expect(await passes(label, label.checks!, 'name = "x"\nage_days = 42\nheight_cm = 18\nis_flowering = 0\nprint(1)')).toBe(false);
    expect(await passes(arith, arith.checks!, 'crates = 26\ndecks = 4\nper_deck = crates // decks\nin_hold = crates % decks\neven_split = in_hold == 0\nprint(per_deck)')).toBe(true);
    expect(await passes(arith, arith.checks!, 'crates = 26\ndecks = 4\nper_deck = 6\nin_hold = 2\neven_split = False')).toBe(false);
  });

  it('the vault project: each milestone passes with the code built so far, and not before', async () => {
    const v = M('vault');
    for (const [i, ms] of v.milestones!.entries()) {
      const upTo = VAULT.slice(0, i + 1).join('');
      expect(await passes(v, ms.checks, upTo)).toBe(true);
      if (i > 0) expect(await passes(v, ms.checks, VAULT.slice(0, i).join(''))).toBe(false);
    }
    expect(await passes(v, v.milestones![0].checks, v.starter!)).toBe(false);
  });

  it('the vault gate uses the right logic, not just today\'s answer', async () => {
    const v = M('vault');
    const wrong = VAULT.slice(0, 3).join('') + 'humidity = float(input())\nvault_open = False\nprint("Vault open:", vault_open)\n';
    expect(await passes(v, v.milestones![3].checks, wrong)).toBe(false);
    const orLogic = VAULT.slice(0, 3).join('') + 'humidity = float(input())\nvault_open = total_seeds >= 500 or humidity <= 0.7\nprint("Vault open:", vault_open)\n';
    expect(await passes(v, v.milestones![3].checks, orLogic)).toBe(false);
  });
});
