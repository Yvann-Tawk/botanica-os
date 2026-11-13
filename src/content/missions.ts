// Missions: the prototype's expedition board, with real exercises. "The Seed Vault" is the Origins guided project:
// one program built across four milestones, each validated before the next opens.

import type { Check } from './lessons/types';

export type MissionType = 'Micro' | 'Exploration' | 'Boss' | 'Expedition';

export interface Milestone { title: string; brief: string; checks: Check[]; hints: string[] }

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  region: string;
  xp: number;
  mins: string;
  diff: 1 | 2 | 3 | 4;
  brief: string;
  /** Concepts that must be complete to launch. */
  requires: string[];
  /** Shown while locked. */
  req: string;
  /** Concepts this mission practises (feeds mastery). */
  reinforces: string[];
  /** Completing the mission also completes this curriculum concept (projects). */
  completesConcept?: string;
  reward?: { artifact: string; desc: string };
  filename?: string;
  starter?: string;
  /** Lines fed to input() when checking. */
  inputs?: string[];
  /** Single-stage missions use `checks`; guided projects use `milestones`. */
  checks?: Check[];
  hints?: string[];
  milestones?: Milestone[];
  /** No content yet: shown on the board, never launchable. */
  sealed?: boolean;
}

export const GROUPS: Record<MissionType, string> = { Micro: 'Micro missions', Exploration: 'Exploration', Boss: 'Guided project', Expedition: 'Expeditions' };

const VAULT_INPUTS = ['Ada', '12', '40', '0.62'];

export const MISSIONS: Mission[] = [
  {
    id: 'hello', type: 'Micro', title: 'Hello, Hortensia', region: 'Origins', xp: 50, mins: '3 min', diff: 1,
    brief: 'The vessel has been quiet since launch. Make it greet its home with a single `print()`: the console must read exactly `Hello, Hortensia!`',
    requires: ['origins.hello'], req: 'Unlocks with Hello, Python! (Origins · Lesson 01).', reinforces: ['origins.hello'],
    reward: { artifact: 'Hello, Hortensia', desc: 'Postcard · first transmission' },
    filename: 'hello.py', starter: '# One line is enough\n',
    checks: [
      { kind: 'runs', label: 'Runs without a traceback' },
      { kind: 'output', label: 'The console reads "Hello, Hortensia!"', lines: ['Hello, Hortensia!'], fail: 'Exactly one line, with the comma and the exclamation mark.' },
    ],
    hints: ['`print()` with the text in quotes.', '`print("Hello, Hortensia!")`'],
  },
  {
    id: 'label', type: 'Micro', title: 'Label the Specimen', region: 'Origins', xp: 120, mins: '6 min', diff: 1,
    brief: 'A seed pod drifted through the airlock at 04:12 ship-time. The archive will not accept it until it is labelled, and the archive is fussy about types. Replace each `None` with a value of the right type: a name (str), its age in days (int), its height in cm (float) and whether it is flowering (bool).',
    requires: ['origins.types'], req: 'Unlocks with Data types (Origins · Lesson 03).', reinforces: ['origins.variables', 'origins.types'],
    reward: { artifact: 'Specimen Tag No. 1', desc: 'From Label the Specimen' },
    filename: 'specimen.py',
    starter: '# Specimen intake: the archive wants four labels\nname = None\nage_days = None\nheight_cm = None\nis_flowering = None\n\nprint(name, "is", age_days, "days old")\n',
    checks: [
      { kind: 'var', label: 'name is a str', name: 'name', type: 'str', nonEmpty: true },
      { kind: 'var', label: 'age_days is an int', name: 'age_days', type: 'int' },
      { kind: 'var', label: 'height_cm is a float', name: 'height_cm', type: 'float' },
      { kind: 'var', label: 'is_flowering is a bool', name: 'is_flowering', type: 'bool' },
      { kind: 'runs', label: 'The intake line prints' },
    ],
    hints: ['Text in quotes, whole numbers plain, decimals with a point, and True or False with a capital letter.', 'For example: `height_cm = 18.5` and `is_flowering = False`.'],
  },
  {
    id: 'arith', type: 'Micro', title: 'Even Decks', region: 'Origins', xp: 80, mins: '5 min', diff: 2,
    brief: 'Supplies are split evenly across the decks. Work out how many crates each deck gets, how many are left in the hold, and whether the split came out even (a bool). The checks also try other cargo.',
    requires: ['origins.operators'], req: 'Unlocks with Operators (Origins · Lesson 04).', reinforces: ['origins.operators', 'origins.types'],
    filename: 'cargo.py',
    starter: 'crates = 26\ndecks = 4\n\n# per_deck = ...\n# in_hold = ...\n# even_split = ...   (True when nothing is left over)\n\nprint(per_deck, "per deck,", in_hold, "in the hold. Even:", even_split)\n',
    checks: [
      { kind: 'var', label: 'per_deck is 6', name: 'per_deck', type: 'int', equals: 6 },
      { kind: 'var', label: 'in_hold is 2', name: 'in_hold', type: 'int', equals: 2 },
      { kind: 'var', label: 'even_split is a bool (False here)', name: 'even_split', type: 'bool', equals: false },
      { kind: 'variants', label: 'Right for other cargo (hidden cases)', variants: [
        { set: { crates: 40 }, expect: { per_deck: 10, in_hold: 0, even_split: true } },
        { set: { crates: 7, decks: 3 }, expect: { per_deck: 2, in_hold: 1, even_split: false } },
      ], fail: 'Calculate from crates and decks instead of typing the answers.' },
    ],
    hints: ['`//` for whole crates per deck, `%` for what is left.', 'A comparison gives a bool: `in_hold == 0`.'],
  },
  {
    id: 'vault', type: 'Boss', title: 'The Seed Vault', region: 'Origins', xp: 600, mins: '40 min', diff: 3,
    brief: 'The vault door asks questions only a fluent pilot can answer. Build its gate program in four milestones, each one adding to the same file. Clear it to complete Origins and chart the route to The Flow.',
    requires: ['origins.hello', 'origins.variables', 'origins.types', 'origins.operators', 'origins.input'],
    req: 'Complete all five Origins lessons to face the vault.', reinforces: ['origins.variables', 'origins.types', 'origins.operators', 'origins.input'],
    completesConcept: 'origins.project',
    reward: { artifact: 'Seed Vault Key', desc: 'Origins guided project' },
    filename: 'vault.py', inputs: VAULT_INPUTS,
    starter: '# The Seed Vault gate program\n# The checks answer input() in this order: keeper name, packets, seeds per packet, humidity\n\n',
    milestones: [
      {
        title: 'Greet the keeper',
        brief: 'Ask for the keeper\'s name with `input()` and print `Welcome, <name>.`',
        checks: [
          { kind: 'source', label: 'Uses input()', matches: 'input\\(' },
          { kind: 'cases', label: 'Greets "Ada" as "Welcome, Ada."', cases: [{ inputs: VAULT_INPUTS, regex: 'Welcome, Ada\\.' }] },
          { kind: 'cases', label: 'Greets any keeper (hidden cases)', cases: [{ inputs: ['Tomas', '1', '1', '0.5'], regex: 'Welcome, Tomas\\.' }] },
        ],
        hints: ['`keeper = input("Keeper name: ")`', '`print(f"Welcome, {keeper}.")`'],
      },
      {
        title: 'Count the seeds',
        brief: 'Ask how many **packets** there are and how many **seeds per packet** (both whole numbers). Store the product in `total_seeds` and print `<total> seeds in the vault`.',
        checks: [
          { kind: 'var', label: 'total_seeds is 480 for 12 packets of 40', name: 'total_seeds', type: 'int', equals: 480 },
          { kind: 'cases', label: 'Prints "480 seeds in the vault"', cases: [{ inputs: VAULT_INPUTS, regex: '480 seeds in the vault' }] },
          { kind: 'cases', label: 'Works for other stock (hidden cases)', cases: [{ inputs: ['Bo', '3', '7', '0.5'], regex: '21 seeds in the vault', expect: { total_seeds: 21 } }] },
          { kind: 'cases', label: 'Still greets the keeper', cases: [{ inputs: VAULT_INPUTS, regex: 'Welcome, Ada\\.' }] },
        ],
        hints: ['`input()` gives text. Wrap it: `packets = int(input("Packets: "))`.', '`total_seeds = packets * per_packet`, then print it with the words after.'],
      },
      {
        title: 'Shelve them',
        brief: 'The vault has **4 shelves**. Store how many seeds go on each shelf in `per_shelf` and how many are spare in `spare`, then print `<per_shelf> per shelf, <spare> spare`.',
        checks: [
          { kind: 'var', label: 'per_shelf is 120 for 480 seeds', name: 'per_shelf', type: 'int', equals: 120 },
          { kind: 'cases', label: 'Prints "120 per shelf, 0 spare"', cases: [{ inputs: VAULT_INPUTS, regex: '120 per shelf, 0 spare' }] },
          { kind: 'cases', label: 'Right for other stock (hidden cases)', cases: [{ inputs: ['Bo', '3', '7', '0.5'], regex: '5 per shelf, 1 spare', expect: { per_shelf: 5, spare: 1 } }] },
        ],
        hints: ['Floor division and remainder: `//` and `%`.', '`per_shelf = total_seeds // 4` and `spare = total_seeds % 4`.'],
      },
      {
        title: 'Open the gate',
        brief: 'Ask for the **humidity** (a decimal, like 0.62). The gate opens only if there are **at least 500 seeds and** humidity is **at most 0.7**. Store the answer in `vault_open` and print `Vault open: True` or `Vault open: False`.',
        checks: [
          { kind: 'var', label: 'vault_open is a bool', name: 'vault_open', type: 'bool' },
          { kind: 'cases', label: '480 seeds keeps the gate shut', cases: [{ inputs: VAULT_INPUTS, regex: 'Vault open: False', expect: { vault_open: false } }] },
          { kind: 'cases', label: '520 seeds at 0.5 opens it; too humid shuts it (hidden cases)', cases: [
            { inputs: ['Ada', '13', '40', '0.5'], regex: 'Vault open: True', expect: { vault_open: true } },
            { inputs: ['Ada', '20', '40', '0.9'], regex: 'Vault open: False', expect: { vault_open: false } },
            { inputs: ['Ada', '25', '20', '0.7'], regex: 'Vault open: True', expect: { vault_open: true } },
          ] },
          { kind: 'cases', label: 'Earlier milestones still work', cases: [{ inputs: VAULT_INPUTS, regex: 'Welcome, Ada\\.[\\s\\S]*480 seeds in the vault[\\s\\S]*120 per shelf, 0 spare' }] },
        ],
        hints: ['`humidity = float(input("Humidity: "))`', '`vault_open = total_seeds >= 500 and humidity <= 0.7`'],
      },
    ],
  },
  {
    id: 'climate', type: 'Exploration', title: 'Greenhouse Climate Report', region: 'Origins + The Flow', xp: 300, mins: '20 min', diff: 3,
    brief: 'Read a week of sensor values and decide which bays need venting.', requires: [], sealed: true,
    req: 'Needs decisions and loops from The Flow. Its lessons are not written yet.', reinforces: [],
  },
  {
    id: 'care', type: 'Expedition', title: 'Plant-Care Reminder Bot', region: 'The Expeditions', xp: 1500, mins: '3 sessions', diff: 4,
    brief: 'Build a real tool that watches a schedule file and nudges you when a plant needs water.', requires: [], sealed: true,
    req: 'Opens once you reach The Network.', reinforces: [],
  },
];

export const missionById = (id: string) => MISSIONS.find((m) => m.id === id);
/** Missions that practise a concept (for mastery). */
export const reinforcing = (conceptId: string) => MISSIONS.filter((m) => m.reinforces.includes(conceptId)).map((m) => m.id);
