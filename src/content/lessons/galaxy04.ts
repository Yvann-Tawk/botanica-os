// Galaxy 04 · The Engine: functions.
import type { LessonCore as Lesson } from './types';

const defs: Lesson = {
  id: 'g04-l01', conceptId: 'engine.1', number: 1, title: 'Defining functions', minutes: 18, xp: 175, difficulty: 2,
  description: 'Name a block of code once and run it whenever you need it.',
  objectives: ['define a function with `def`', 'call it with parentheses, as often as you like', 'pass it a value through a parameter'],
  discover: {
    heading: 'Reusable machinery.',
    lede: 'A **function** is a named block of code. `def` defines it; it does nothing until you **call** it by name with parentheses. Values you pass in arrive as **parameters**. Define a function before the line that calls it: Python reads top to bottom.',
    example: 'def water(plant):\n    """Water one plant and say so."""\n    print("Watering", plant)\n\nwater("fern")\nwater("moss")\n\nfor p in ["oak", "ivy"]:\n    water(p)\n',
    tagsHeading: 'Anatomy',
    tags: [
      { name: 'def name():', color: '#345a04', desc: 'Define (nothing runs yet)', examples: 'def greet():' },
      { name: 'name()', color: '#8a6000', desc: 'Call: run the body', examples: 'greet()' },
      { name: '(plant)', color: '#a8423c', desc: 'A parameter', examples: 'water("fern")' },
      { name: '"""doc"""', color: '#242820', desc: 'Explains what it does', examples: 'help(water)' },
    ],
    tip: 'Writing `water` without parentheses does not run it: it is just the function object, which prints like `<function water at 0x…>`.',
  },
  experiment: {
    heading: 'Build a small machine.',
    lede: 'Run it, then reuse it.',
    steps: ['Run it as it is.', 'Call `water("starwort")` once more at the end.', 'Move the last call above the `def` and read the NameError.', 'Print `water` without parentheses.'],
    code: 'def water(plant):\n    print("Watering", plant)\n\nwater("fern")\nwater("moss")\n',
  },
  practice: {
    heading: 'The watering round.',
    lede: 'Define `water(plant)` that prints `Watering <plant>`, then call it for **fern**, **moss** and **oak**, in that order.',
    starter: '# define water(plant) here\n\n# call it three times\n',
    checks: [
      { kind: 'source', label: 'Defines water(plant)', matches: '^def water\\(\\s*\\w+\\s*\\):' },
      { kind: 'output', label: 'Prints the three watering lines', lines: ['Watering fern', 'Watering moss', 'Watering oak'] },
      { kind: 'call', label: 'water works for any plant (hidden cases)', fn: 'water', calls: [{ args: ['ivy'], prints: ['Watering ivy'] }, { args: ['Moonfern'], prints: ['Watering Moonfern'] }] },
    ],
    hints: ['`def water(plant):` then an indented `print("Watering", plant)`.', 'Call it with the plant name in quotes: `water("fern")`.', 'Three calls below the definition, not indented.'],
  },
  challenge: {
    heading: 'The status report never reports.',
    lede: 'The report should print `All decks green` twice. Instead it crashes, and the second line prints something odd. Fix it.',
    starter: 'report()\n\ndef report():\n    print("All decks green")\n\nreport\n',
    checks: [
      { kind: 'runs', label: 'Runs without a NameError' },
      { kind: 'output', label: 'Prints "All decks green" exactly twice', lines: ['All decks green', 'All decks green'] },
    ],
    hints: ['Python runs top to bottom: does `report` exist on line 1?', 'Move the definition above the first call.', 'The last line names the function but never calls it: add `()`.'],
  },
  quiz: [
    { q: 'When does the body of a def run?', opts: ['When Python reaches the def line', 'Each time the function is called', 'Never'], a: 1, why: 'def only defines; a call runs the body.' },
    { q: 'What does print(greet) show (without parentheses)?', opts: ['The greeting', 'Something like <function greet at 0x…>', 'An error'], a: 1, why: 'Without parentheses you get the function object itself.' },
    { q: 'In def water(plant): what is plant?', opts: ['A parameter', 'A global variable', 'A return value'], a: 0, why: 'Parameters receive the values passed in the call.' },
  ],
};

const params: Lesson = {
  id: 'g04-l02', conceptId: 'engine.2', number: 2, title: 'Parameters & return', minutes: 20, xp: 175, difficulty: 2,
  description: 'Hand values back with return, and give parameters defaults.',
  objectives: ['send a result back with `return`', 'know the difference between returning and printing', 'give parameters default values and call with keywords'],
  discover: {
    heading: 'What comes out of the machine.',
    lede: '`return` hands a value back to the caller and ends the function. **Printing is not returning**: a function that only prints gives back `None`. Parameters can have **defaults**, used when the caller leaves them out, and callers can name them: `seeds_needed(4, per_planter=2)`.',
    example: 'def seeds_needed(planters, per_planter=3):\n    return planters * per_planter\n\nprint(seeds_needed(5))                   # 15: default used\nprint(seeds_needed(4, per_planter=2))    # 8\ntotal = seeds_needed(2) + seeds_needed(1)\nprint(total)                             # 9\n\ndef shout(text):\n    print(text.upper())                  # prints, returns None\nresult = shout("hello")\nprint(result)                            # None\n',
    tagsHeading: 'In and out',
    tags: [
      { name: 'return x', color: '#345a04', desc: 'Give x back; stop here', examples: 'return a + b' },
      { name: 'None', color: '#8a6000', desc: 'What you get with no return', examples: 'print() returns None' },
      { name: 'p=3', color: '#a8423c', desc: 'Default value', examples: 'f(5) uses p=3' },
      { name: 'f(p=2)', color: '#242820', desc: 'Keyword argument', examples: 'clear at the call' },
    ],
    tip: 'Return values you want to use later; print only what a person should read.',
  },
  experiment: {
    heading: 'Return or print?',
    lede: 'Run it and compare.',
    steps: ['Run it as it is.', 'Try `seeds_needed(3, 10)`.', 'Add `print(shout("hi") + "!")` and read the TypeError.', 'Make `shout` return the text instead of printing it.'],
    code: 'def seeds_needed(planters, per_planter=3):\n    return planters * per_planter\n\nprint(seeds_needed(5), seeds_needed(4, per_planter=2))\n\ndef shout(text):\n    print(text.upper())\n\nprint(shout("hello"))\n',
  },
  practice: {
    heading: 'Seed calculator.',
    lede: 'Write `seeds_needed(planters, per_planter=3)` that **returns** how many seeds are needed.',
    starter: '# define seeds_needed here\n\nprint(seeds_needed(5))\nprint(seeds_needed(4, per_planter=2))\n',
    checks: [
      { kind: 'call', label: 'seeds_needed(5) returns 15', fn: 'seeds_needed', calls: [{ args: [5], returns: 15 }] },
      { kind: 'call', label: 'per_planter can be given', fn: 'seeds_needed', calls: [{ args: [4], kwargs: { per_planter: 2 }, returns: 8 }, { args: [3, 10], returns: 30 }] },
      { kind: 'call', label: 'Edge cases (hidden)', fn: 'seeds_needed', calls: [{ args: [0], returns: 0 }, { args: [7, 1], returns: 7 }] },
    ],
    hints: ['Give the second parameter a default in the def line: `per_planter=3`.', 'Use `return`, not `print`.', '`def seeds_needed(planters, per_planter=3):` / `    return planters * per_planter`'],
  },
  challenge: {
    heading: 'The area total crashes.',
    lede: 'Two beds are measured with `area`, then added. It crashes with a TypeError. Fix `area` so `total` becomes **16**.',
    starter: 'def area(width, length):\n    print(width * length)\n\ntotal = area(3, 4) + area(2, 2)\nprint("Total area:", total)\n',
    checks: [
      { kind: 'call', label: 'area(3, 4) returns 12', fn: 'area', calls: [{ args: [3, 4], returns: 12 }, { args: [2.5, 2], returns: 5.0 }] },
      { kind: 'var', label: 'total is 16', name: 'total', equals: 16 },
      { kind: 'output', label: 'Prints "Total area: 16"', regex: 'Total area: 16$' },
    ],
    hints: ['What does `area(3, 4)` give back? Print it on its own.', 'A function without return gives None, and None + None fails.', 'Change `print(width * length)` to `return width * length`.'],
  },
  quiz: [
    { q: 'What does a function return if it has no return line?', opts: ['0', 'None', 'The last value printed'], a: 1, why: 'Every function returns something; by default it is None.' },
    { q: 'def f(a, b=2): return a * b. What is f(5)?', opts: ['10', '5', 'An error'], a: 0, why: 'b uses its default, 2.' },
    { q: 'What happens to code after return in the same function?', opts: ['It runs next', 'It does not run', 'It runs at the end of the program'], a: 1, why: 'return ends the function immediately.' },
  ],
};

const scope: Lesson = {
  id: 'g04-l03', conceptId: 'engine.3', number: 3, title: 'Scope', minutes: 18, xp: 175, difficulty: 3,
  description: 'Which names a function can see, and why its own names stay inside it.',
  objectives: ['know that names assigned inside a function are local to it', 'read outer (global) names from inside a function', 'pass values in and return results instead of changing globals'],
  discover: {
    heading: 'What happens in the machine stays in the machine.',
    lede: 'Names you assign **inside** a function are **local**: they exist only while it runs and do not touch names outside. A function can **read** names from outside, but assigning to one creates a new local name instead. The clean pattern is: pass values in, return results out.',
    example: 'label = "unchanged"\nRATE = 1.5                       # a constant read from inside\n\ndef describe(name):\n    label = name.upper()         # a local label, separate from the global one\n    return f"[{label}] x{RATE}"\n\nprint(describe("fern"))          # [FERN] x1.5\nprint(label)                     # unchanged\n\ndef add_visit(visits):\n    return visits + 1\n\nvisits = 0\nvisits = add_visit(visits)\nvisits = add_visit(visits)\nprint(visits)                    # 2\n',
    tagsHeading: 'Scope rules',
    tags: [
      { name: 'local', color: '#345a04', desc: 'Assigned inside: lives inside', examples: 'gone after return' },
      { name: 'global', color: '#8a6000', desc: 'Defined at the top level', examples: 'readable inside' },
      { name: 'UnboundLocalError', color: '#a8423c', desc: 'Read a name before assigning it locally', examples: 'x = x + 1 inside' },
      { name: 'in → out', color: '#242820', desc: 'Pass values in, return results', examples: 'v = f(v)' },
    ],
    tip: 'Python has a `global` keyword to assign to an outer name, but passing and returning keeps functions easier to test and reuse.',
  },
  experiment: {
    heading: 'Look inside the machine.',
    lede: 'Run it and probe the names.',
    steps: ['Run it as it is.', 'After the call, add `print(name)` and read the NameError: name was local.', 'Inside `describe`, print `label` before assigning it and read the error.', 'Change `RATE` at the top and see `describe` pick it up.'],
    code: 'label = "unchanged"\nRATE = 1.5\n\ndef describe(name):\n    label = name.upper()\n    return f"[{label}] x{RATE}"\n\nprint(describe("fern"))\nprint(label)\n',
  },
  practice: {
    heading: 'A label maker that leaves the shelf alone.',
    lede: 'Write `describe(name)` that returns the name in capitals inside square brackets, like `"[FERN]"`. Use a local variable called `label` inside it. The global `label` must still be `"unchanged"` afterwards.',
    starter: 'label = "unchanged"\n\n# define describe(name) here\n\nprint(describe("fern"))\nprint(label)\n',
    checks: [
      { kind: 'call', label: 'describe("fern") returns "[FERN]"', fn: 'describe', calls: [{ args: ['fern'], returns: '[FERN]' }, { args: ['Moon fern'], returns: '[MOON FERN]' }] },
      { kind: 'var', label: 'The global label is still "unchanged"', name: 'label', equals: 'unchanged' },
      { kind: 'source', label: 'Uses a local label inside the function', matches: '^\\s+label\\s*=' },
    ],
    hints: ['Inside the function: `label = name.upper()`.', 'Return it with brackets: `return "[" + label + "]"` or an f-string.', 'Do not use the `global` keyword: the point is that the local label is separate.'],
  },
  challenge: {
    heading: 'The visit counter will not count.',
    lede: 'Each call to `log_visit` should add one visit. It crashes with an UnboundLocalError. Fix it so `visits` is **2** after the two calls. Passing the count in and returning it is the cleanest fix.',
    starter: 'visits = 0\n\ndef log_visit():\n    visits = visits + 1\n\nlog_visit()\nlog_visit()\nprint("Visits:", visits)\n',
    checks: [
      { kind: 'runs', label: 'Runs without an UnboundLocalError' },
      { kind: 'var', label: 'visits is 2 after two visits', name: 'visits', type: 'int', equals: 2 },
      { kind: 'output', label: 'Prints "Visits: 2"', regex: 'Visits: 2$' },
    ],
    hints: ['Inside the function, `visits = ...` makes visits local, so reading it first fails.', 'Give the function a parameter and return the new count.', '`def log_visit(visits): return visits + 1`, then `visits = log_visit(visits)` twice.'],
  },
  quiz: [
    { q: 'A name assigned inside a function is…', opts: ['global', 'local to that function', 'shared by every function'], a: 1, why: 'Assignment inside a function creates a local name.' },
    { q: 'Can a function read a global constant like RATE?', opts: ['Yes', 'No', 'Only with import'], a: 0, why: 'Reading outer names works; assigning creates a local.' },
    { q: 'Why prefer passing values in and returning them?', opts: ['It is required by Python', 'Functions become predictable and testable', 'It is faster to type'], a: 1, why: 'The function depends only on its inputs, so it is easy to reason about.' },
  ],
};

const varargs: Lesson = {
  id: 'g04-l04', conceptId: 'engine.4', number: 4, title: '*args & **kwargs', minutes: 20, xp: 175, difficulty: 3,
  description: 'Functions that accept any number of values or named options.',
  objectives: ['collect any number of positional arguments with `*args`', 'collect named options with `**kwargs`', 'unpack a list or dict into a call with `*` and `**`'],
  discover: {
    heading: 'Machines with open hoppers.',
    lede: 'A parameter written `*amounts` collects every extra positional argument into a **tuple**. `**traits` collects extra keyword arguments into a **dict**. At a call, `*` and `**` work the other way: they spread a list or dict out into separate arguments.',
    example: 'def total(*amounts):\n    return sum(amounts)\n\nprint(total())              # 0\nprint(total(3, 4, 5))       # 12\n\ndef make_tag(name, **traits):\n    if not traits:\n        return name\n    details = ", ".join(f"{k}={v}" for k, v in traits.items())\n    return f"{name}: {details}"\n\nprint(make_tag("fern", color="green", size="small"))\nharvest = [2, 9, 4]\nprint(total(*harvest))      # spread a list into the call\n',
    tagsHeading: 'Stars',
    tags: [
      { name: '*args', color: '#345a04', desc: 'Extra positionals → tuple', examples: 'f(1, 2, 3)' },
      { name: '**kwargs', color: '#8a6000', desc: 'Extra keywords → dict', examples: 'f(a=1, b=2)' },
      { name: 'f(*xs)', color: '#a8423c', desc: 'Spread a list', examples: 'total(*[1, 2])' },
      { name: 'f(**d)', color: '#242820', desc: 'Spread a dict', examples: 'make_tag("x", **opts)' },
    ],
    tip: 'The names `args` and `kwargs` are only custom; the stars do the work. Pick names that say what they hold.',
  },
  experiment: {
    heading: 'Feed the hopper.',
    lede: 'Call the functions in different ways.',
    steps: ['Run it as it is.', 'Call `total(*range(5))`.', 'Print `type` of `amounts` inside `total`.', 'Call `make_tag("ivy", **{"light": "shade"})`.'],
    code: 'def total(*amounts):\n    return sum(amounts)\n\ndef make_tag(name, **traits):\n    details = ", ".join(f"{k}={v}" for k, v in traits.items())\n    return f"{name}: {details}" if traits else name\n\nprint(total(), total(3, 4, 5))\nprint(make_tag("fern", color="green"))\n',
  },
  practice: {
    heading: 'Weigh any number of baskets.',
    lede: 'Write `total(*amounts)` that returns the sum of however many amounts it is given (0 for none), and `heaviest(*amounts)` that returns the largest, or `None` when there are none.',
    starter: '# define total and heaviest\n\nprint(total(3, 4, 5), heaviest(3, 9, 2), heaviest())\n',
    checks: [
      { kind: 'call', label: 'total adds any number of amounts', fn: 'total', calls: [{ args: [3, 4, 5], returns: 12 }, { args: [], returns: 0 }, { args: [2.5], returns: 2.5 }] },
      { kind: 'call', label: 'heaviest returns the largest', fn: 'heaviest', calls: [{ args: [3, 9, 2], returns: 9 }, { args: [7], returns: 7 }] },
      { kind: 'call', label: 'heaviest() with nothing returns None', fn: 'heaviest', calls: [{ args: [], returns: null }] },
    ],
    hints: ['`def total(*amounts): return sum(amounts)`', '`max()` of an empty tuple raises an error, so check first.', '`if not amounts: return None` then `return max(amounts)`.'],
  },
  challenge: {
    heading: 'The tag printer rejects options.',
    lede: '`make_tag("fern", color="green", size="small")` should return `"fern: color=green, size=small"`, and `make_tag("moss")` just `"moss"`. It currently rejects keyword options. Fix the signature (and anything else needed).',
    starter: 'def make_tag(name, traits):\n    details = ", ".join(f"{k}={v}" for k, v in traits.items())\n    return f"{name}: {details}"\n\nprint(make_tag("fern", color="green", size="small"))\nprint(make_tag("moss"))\n',
    checks: [
      { kind: 'call', label: 'Accepts keyword options', fn: 'make_tag', calls: [{ args: ['fern'], kwargs: { color: 'green', size: 'small' }, returns: 'fern: color=green, size=small' }] },
      { kind: 'call', label: 'No options → just the name', fn: 'make_tag', calls: [{ args: ['moss'], returns: 'moss' }] },
      { kind: 'call', label: 'Any options (hidden cases)', fn: 'make_tag', calls: [{ args: ['ivy'], kwargs: { light: 'shade' }, returns: 'ivy: light=shade' }] },
    ],
    hints: ['To collect keyword arguments, the parameter needs two stars.', '`def make_tag(name, **traits):`', 'Then return just `name` when `traits` is empty.'],
  },
  quiz: [
    { q: 'Inside def f(*xs), what type is xs?', opts: ['list', 'tuple', 'dict'], a: 1, why: 'Extra positional arguments are collected into a tuple.' },
    { q: 'What does f(**{"a": 1}) pass?', opts: ['A dict as one argument', 'The keyword argument a=1', 'Nothing'], a: 1, why: '** spreads a dict into keyword arguments.' },
    { q: 'What is sum(*[1, 2]) vs sum([1, 2])?', opts: ['Both 3', 'The first is an error', 'The second is an error'], a: 1, why: 'sum(1, 2) treats 2 as a start value and 1 as the iterable, which fails. Spread only when the function wants separate arguments.' },
  ],
};

const modules: Lesson = {
  id: 'g04-l05', conceptId: 'engine.5', number: 5, title: 'Modules & imports', minutes: 18, xp: 175, difficulty: 2,
  description: "Use Python's standard library: import whole modules or just what you need.",
  objectives: ['`import` a module and use its contents with a dot', 'import just a name with `from … import …`, or rename with `as`', 'find useful tools in `math`, `random` and `datetime`'],
  discover: {
    heading: 'Parts from the stores.',
    lede: 'Python ships with a large **standard library** of modules. `import math` gives you the module; reach inside with a dot: `math.sqrt(16)`. `from math import sqrt` brings in just one name. Your own files are modules too: in a project, `import helpers` loads `helpers.py`.',
    example: 'import math\nimport random\nfrom datetime import date\nimport statistics as stats\n\nprint(math.sqrt(16), math.pi)\nprint(round(math.pi * 2.5 ** 2, 2))   # area of a circle\n\nrandom.seed(7)                         # same "random" results every run\nprint(random.randint(1, 6), random.choice(["fern", "moss", "oak"]))\n\nprint(date(2026, 11, 13).strftime("%A"))\nprint(stats.mean([3, 4, 8]))\n',
    tagsHeading: 'Import shapes',
    tags: [
      { name: 'import math', color: '#345a04', desc: 'Whole module; use math.x', examples: 'math.floor(2.7)' },
      { name: 'from m import x', color: '#8a6000', desc: 'Just one name', examples: 'sqrt(9)' },
      { name: 'import m as s', color: '#a8423c', desc: 'A shorter name', examples: 'stats.mean' },
      { name: 'random.seed(n)', color: '#242820', desc: 'Repeatable randomness', examples: 'good for tests' },
    ],
    tip: 'This in-browser Python includes the whole standard library. Third-party packages (installed with pip elsewhere) are not available here.',
  },
  experiment: {
    heading: 'Raid the stores.',
    lede: 'Run it and explore.',
    steps: ['Run it as it is.', 'Remove `random.seed(7)` and run twice: the dice change.', 'Try `math.floor(2.7)` and `math.ceil(2.1)`.', 'Try `import notreal` and read the ModuleNotFoundError.'],
    code: 'import math\nimport random\n\nprint(math.sqrt(16), math.pi)\nrandom.seed(7)\nprint(random.randint(1, 6), random.choice(["fern", "moss", "oak"]))\n',
  },
  practice: {
    heading: 'Measure the round bed.',
    lede: 'Using the `math` module, store the bed\'s `area` (π × radius²), the same value rounded to 2 decimals in `rounded`, and the side of a square with the same area in `side` (its square root).',
    starter: 'radius = 2.5\n\n# import math, then area, rounded, side\n\nprint(rounded, round(side, 3))\n',
    checks: [
      { kind: 'var', label: 'rounded is 19.63', name: 'rounded', type: 'float', equals: 19.63 },
      { kind: 'var', label: 'side is √area (about 4.431)', name: 'side', type: 'float', equals: 4.4311346272637895 },
      { kind: 'source', label: 'Uses the math module', matches: '\\bimport math\\b|\\bfrom math import\\b' },
      { kind: 'variants', label: 'Right for other beds (hidden cases)', variants: [{ set: { radius: 1 }, expect: { rounded: 3.14, side: 1.7724538509055159 } }] },
    ],
    hints: ['`import math` at the top, then use `math.pi` and `math.sqrt`.', '`area = math.pi * radius ** 2`', '`rounded = round(area, 2)` and `side = math.sqrt(area)`.'],
  },
  challenge: {
    heading: 'The planting robot is missing parts.',
    lede: 'This script uses `sqrt` and `random` without importing them. Add the imports it needs so it runs. Keep `random.seed(7)` so the choice is repeatable.',
    starter: 'random.seed(7)\nroot = sqrt(16)\nplants = ["fern", "moss", "oak", "ivy"]\npick = random.choice(plants)\nprint(root, pick)\n',
    checks: [
      { kind: 'runs', label: 'Runs without a NameError' },
      { kind: 'var', label: 'root is 4.0', name: 'root', type: 'float', equals: 4.0 },
      { kind: 'source', label: 'Imports random and sqrt', matches: '(?s)(import random|from random import).*' },
      { kind: 'var', label: 'pick is one of the plants', name: 'pick', type: 'str', nonEmpty: true },
    ],
    hints: ['Each name must come from somewhere: which module has sqrt?', '`from math import sqrt`', 'And `import random` at the top.'],
  },
  quiz: [
    { q: 'After import math, how do you call sqrt?', opts: ['sqrt(9)', 'math.sqrt(9)', 'math(sqrt, 9)'], a: 1, why: 'Use the module name and a dot.' },
    { q: 'What does random.seed(1) do?', opts: ['Makes results truly random', 'Makes the sequence repeatable', 'Plants a seed'], a: 1, why: 'The same seed gives the same "random" sequence, which is handy for tests.' },
    { q: 'What does import statistics as stats do?', opts: ['Copies the module', 'Lets you write stats.mean', 'Imports only mean'], a: 1, why: 'as gives the module a shorter name.' },
  ],
};

const lambdas: Lesson = {
  id: 'g04-l06', conceptId: 'engine.6', number: 6, title: 'Lambdas', minutes: 15, xp: 175, difficulty: 3,
  description: 'Small unnamed functions, mostly for sorting and filtering.',
  objectives: ['write a one-expression function with `lambda`', 'sort by a key with `sorted(…, key=…)` and `reverse=True`', 'use `max`/`min` with a key'],
  discover: {
    heading: 'Tiny levers.',
    lede: 'A **lambda** is a nameless, one-expression function: `lambda p: p[1]` takes `p` and returns its second item. They shine as the `key` for `sorted`, `max` and `min`, which call the key on each item and compare the results.',
    example: 'plants = [("fern", 30), ("moss", 5), ("oak", 120)]\n\nby_height = sorted(plants, key=lambda p: p[1])\ntallest_first = sorted(plants, key=lambda p: p[1], reverse=True)\nprint(by_height)\nprint(tallest_first[0])\nprint(max(plants, key=lambda p: p[1]))\n\nnames = ["fern", "Moss", "ivy"]\nprint(sorted(names, key=str.lower))   # a named function works as a key too\n',
    tagsHeading: 'Keys',
    tags: [
      { name: 'lambda x: …', color: '#345a04', desc: 'A one-line function', examples: 'lambda n: n * 2' },
      { name: 'key=', color: '#8a6000', desc: 'What to compare by', examples: 'sorted(xs, key=len)' },
      { name: 'reverse=True', color: '#a8423c', desc: 'Largest first', examples: 'sorted(xs, reverse=True)' },
      { name: 'str.lower', color: '#242820', desc: 'Any function can be a key', examples: 'case-insensitive' },
    ],
    tip: 'If a lambda grows beyond a short expression, give it a name with `def`: it will be easier to read and test.',
  },
  experiment: {
    heading: 'Sort the specimens.',
    lede: 'Change the keys.',
    steps: ['Run it as it is.', 'Sort plants by name instead: `key=lambda p: p[0]`.', 'Find the shortest plant with `min`.', 'Sort `names` without a key and see where "Moss" lands.'],
    code: 'plants = [("fern", 30), ("moss", 5), ("oak", 120)]\nprint(sorted(plants, key=lambda p: p[1]))\nprint(max(plants, key=lambda p: p[1]))\nnames = ["fern", "Moss", "ivy"]\nprint(sorted(names), sorted(names, key=str.lower))\n',
  },
  practice: {
    heading: 'Line up the specimens.',
    lede: 'Store the plants sorted **shortest first** in `by_height`, **tallest first** in `tallest_first`, and the name of the tallest plant in `tallest`.',
    starter: 'plants = [("fern", 30), ("moss", 5), ("oak", 120), ("ivy", 45)]\n\n# by_height = ...\n# tallest_first = ...\n# tallest = ...\n\nprint(by_height, tallest)\n',
    checks: [
      { kind: 'var', label: 'by_height is shortest first', name: 'by_height', equals: [['moss', 5], ['fern', 30], ['ivy', 45], ['oak', 120]] },
      { kind: 'var', label: 'tallest_first is tallest first', name: 'tallest_first', equals: [['oak', 120], ['ivy', 45], ['fern', 30], ['moss', 5]] },
      { kind: 'var', label: 'tallest is "oak"', name: 'tallest', equals: 'oak' },
      { kind: 'variants', label: 'Right for other specimens (hidden cases)', variants: [{ set: { plants: [['a', 3], ['b', 1]] }, expect: { by_height: [['b', 1], ['a', 3]], tallest: 'a' } }] },
    ],
    hints: ['`sorted(plants, key=lambda p: p[1])`', 'Add `reverse=True` for tallest first.', '`tallest = max(plants, key=lambda p: p[1])[0]`'],
  },
  challenge: {
    heading: 'The catalogue sorts capitals first.',
    lede: 'Names should be sorted alphabetically **ignoring case** into `ordered`, and `long_names` should keep names longer than 4 letters in that same order. Right now capitals jump to the front.',
    starter: 'names = ["fern", "Moss", "ivy", "Starwort", "aloe"]\n\nordered = sorted(names)\nlong_names = [n for n in names if len(n) > 4]\n\nprint(ordered, long_names)\n',
    checks: [
      { kind: 'var', label: 'ordered ignores case', name: 'ordered', equals: ['aloe', 'fern', 'ivy', 'Moss', 'Starwort'] },
      { kind: 'var', label: 'long_names is ["Starwort"]', name: 'long_names', equals: ['Starwort'] },
      { kind: 'variants', label: 'Right for other names (hidden cases)', variants: [{ set: { names: ['b', 'A', 'Cedar', 'birch'] }, expect: { ordered: ['A', 'b', 'birch', 'Cedar'], long_names: ['birch', 'Cedar'] } }] },
    ],
    hints: ['Capital letters sort before lowercase ones by default.', 'Compare lowercase copies: `key=str.lower` (or `key=lambda n: n.lower()`).', 'Build `long_names` from `ordered`, not from `names`.'],
  },
  quiz: [
    { q: 'What does (lambda n: n * 2)(5) give?', opts: ['5', '10', 'A function'], a: 1, why: 'The lambda is called with 5 and returns 10.' },
    { q: 'What does sorted(["b", "A", "a"]) give?', opts: ['["a", "A", "b"]', '["A", "a", "b"]', '["b", "a", "A"]'], a: 1, why: 'Capitals sort before lowercase by default.' },
    { q: 'max(words, key=len) returns…', opts: ['the length of the longest word', 'the longest word', 'the last word'], a: 1, why: 'key decides how to compare; max still returns the item.' },
  ],
};

export const GALAXY_04: Lesson[] = [defs, params, scope, varargs, modules, lambdas];
