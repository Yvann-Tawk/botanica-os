// Galaxy 02 · The Flow: decisions and repetition.
import type { LessonCore as Lesson } from './types';

const bools: Lesson = {
  id: 'g02-l01', conceptId: 'flow.1', number: 1, title: 'Booleans & comparisons', minutes: 15, xp: 150, difficulty: 1,
  description: 'Ask yes-or-no questions of your data: comparisons, chained comparisons, and truthiness.',
  objectives: ['compare values with `==`, `!=`, `<`, `<=`, `>`, `>=`', 'chain comparisons like `18 <= t <= 26`', 'know which values count as true or false'],
  discover: {
    heading: 'Every river forks on a question.',
    lede: 'Programs decide by asking questions whose answer is a **bool**: `True` or `False`. Comparisons produce bools, and Python lets you chain them the way you would write them on paper. Every value also has a **truthiness**: empty things (`0`, `""`, `None`) count as false, everything else as true.',
    example: 'temperature_c = 23.5\nprint(temperature_c > 26)          # False\nprint(18 <= temperature_c <= 26)    # True: a chained comparison\nprint("fern" < "moss")              # True: text compares alphabetically\n\nlabel = ""\nprint(bool(label))                  # False: empty text is falsy\nprint(bool("False"))                # True: any non-empty text is truthy\n',
    tagsHeading: 'Questions you can ask',
    tags: [
      { name: '== !=', color: '#345a04', desc: 'Same value? Different?', examples: '3 == 3.0 → True' },
      { name: '< <= > >=', color: '#8a6000', desc: 'Order: numbers and text', examples: '"a" < "b" → True' },
      { name: 'a < b < c', color: '#a8423c', desc: 'Chained: both must hold', examples: '1 < 5 < 4 → False' },
      { name: 'falsy', color: '#242820', desc: '0, 0.0, "", None, False', examples: 'bool("") → False' },
    ],
    tip: '`and` and `or` return one of their operands, not always a bool: `"" or "default"` gives `"default"`. Wrap the result in `bool()` when you need a real `True`/`False`.',
  },
  experiment: {
    heading: 'Ask the greenhouse questions.',
    lede: 'Change the numbers and predict each line before you run.',
    steps: ['Run it as it is.', 'Set `temperature_c = 30` and predict which answers flip.', 'Try `print(1 < 5 < 4)` and explain why it is False.', 'Try `print("Fern" == "fern")`. Capitals matter.'],
    code: 'temperature_c = 23.5\nhumidity = 0.55\n\nprint("Warm?", temperature_c >= 22)\nprint("Comfortable?", 18 <= temperature_c <= 26)\nprint("Too dry?", humidity < 0.4)\nprint("Any problem?", temperature_c > 26 or humidity < 0.4)\n',
  },
  practice: {
    heading: 'Raise the sensor flags.',
    lede: 'Store three bools about the greenhouse. The checks also try other weather, so compute them from the readings.',
    steps: ['`is_warm`: temperature is **at least 22**', '`is_comfortable`: temperature between **18 and 26** inclusive (use a chained comparison)', '`needs_light`: fewer than **12** light hours'],
    starter: 'temperature_c = 23.5\nlight_hours = 14\n\n# is_warm = ...\n# is_comfortable = ...\n# needs_light = ...\n\nprint(is_warm, is_comfortable, needs_light)\n',
    checks: [
      { kind: 'var', label: 'is_warm is True today', name: 'is_warm', type: 'bool', equals: true },
      { kind: 'var', label: 'is_comfortable is True today', name: 'is_comfortable', type: 'bool', equals: true },
      { kind: 'var', label: 'needs_light is False today', name: 'needs_light', type: 'bool', equals: false },
      { kind: 'variants', label: 'Right for other readings (hidden cases)', variants: [
        { set: { temperature_c: 18, light_hours: 11 }, expect: { is_warm: false, is_comfortable: true, needs_light: true } },
        { set: { temperature_c: 26.5, light_hours: 12 }, expect: { is_warm: true, is_comfortable: false, needs_light: false } },
        { set: { temperature_c: 22, light_hours: 3 }, expect: { is_warm: true, is_comfortable: true, needs_light: true } },
      ], fail: 'Use comparisons on temperature_c and light_hours rather than writing True or False.' },
    ],
    hints: ['A comparison already is a bool: `is_warm = temperature_c >= 22`.', 'Chained: `18 <= temperature_c <= 26` includes both ends.', '`needs_light = light_hours < 12`'],
  },
  challenge: {
    heading: 'The shipping flag lies.',
    lede: 'A tray is ready to ship when it has a **label** (non-empty text) **and** at least one seedling. The flag should be a real bool, but it sometimes prints text. Fix `ready`.',
    note: 'Run it, then try `label = ""` to see what goes wrong.',
    starter: 'label = "Moonfern"\ncount = 3\n\nready = label and count > 0\nprint("Ready to ship:", ready)\n',
    checks: [
      { kind: 'var', label: 'ready is a bool (True here)', name: 'ready', type: 'bool', equals: true },
      { kind: 'variants', label: 'Right for other trays (hidden cases)', variants: [
        { set: { label: '', count: 5 }, expect: { ready: false } },
        { set: { label: 'Fern', count: 0 }, expect: { ready: false } },
        { set: { label: 'Starwort', count: 12 }, expect: { ready: true } },
      ], fail: 'With an empty label, `label and ...` gives the empty label itself, not False.' },
    ],
    hints: ['Try it with `label = ""`: what does `ready` hold then?', '`and` returns its first falsy operand. Turn the label into a bool first.', '`ready = bool(label) and count > 0` (or `label != "" and count > 0`).'],
  },
  quiz: [
    { q: 'What does 3 < 5 < 4 give?', opts: ['True', 'False', 'An error'], a: 1, why: 'It means 3 < 5 and 5 < 4. The second part is False.' },
    { q: 'What is bool("False")?', opts: ['False', 'True', 'An error'], a: 1, why: 'Any non-empty text is truthy, even the word False.' },
    { q: 'What does "" or "unnamed" give?', opts: ['""', 'True', '"unnamed"'], a: 2, why: '`or` returns the first truthy operand, here the second string.' },
  ],
};

const ifs: Lesson = {
  id: 'g02-l02', conceptId: 'flow.2', number: 2, title: 'if, elif, else', minutes: 15, xp: 150, difficulty: 1,
  description: 'Run different code depending on a condition.',
  objectives: ['write `if` blocks with a colon and an indented body', 'chain choices with `elif` and catch the rest with `else`', 'order conditions so the right branch wins'],
  discover: {
    heading: 'Where the river branches.',
    lede: 'An `if` runs its indented block only when its condition is true. Add `elif` branches for more choices and an `else` for everything left. Python checks them **top to bottom and takes the first true one**, then skips the rest.',
    example: 'moisture = 42\n\nif moisture < 30:\n    print("Water now")\nelif moisture < 60:\n    print("Water soon")\nelse:\n    print("Soil is fine")\n\nprint("Check done")   # not indented: always runs\n',
    tagsHeading: 'Shape of a decision',
    tags: [
      { name: 'if cond:', color: '#345a04', desc: 'Runs when cond is true', examples: 'if x > 3:' },
      { name: 'elif cond:', color: '#8a6000', desc: 'Tried only if all above were false', examples: 'elif x > 1:' },
      { name: 'else:', color: '#a8423c', desc: 'Everything left', examples: 'else:' },
      { name: '4 spaces', color: '#242820', desc: 'The indent marks the block', examples: '    print(...)' },
    ],
    tip: 'Order matters. Put the most specific (or most extreme) condition first, or a broader one above will catch it.',
  },
  experiment: {
    heading: 'Change the soil.',
    lede: 'Try moisture values that land in each branch.',
    steps: ['Run it as it is.', 'Set `moisture = 10`, then `75`. Which line prints each time?', 'Remove the indent from `print("Water now")` and read the IndentationError.', 'Add an `elif moisture > 90:` branch at the right place for "Waterlogged".'],
    code: 'moisture = 42\n\nif moisture < 30:\n    print("Water now")\nelif moisture < 60:\n    print("Water soon")\nelse:\n    print("Soil is fine")\n',
  },
  practice: {
    heading: 'Read the soil probe.',
    lede: 'Set `status` from the moisture reading and print it. The checks try every band.',
    steps: ['below **30** → `"water now"`', 'below **60** → `"water soon"`', 'otherwise → `"fine"`'],
    starter: 'moisture = 42\n\n# set status here\n\nprint(status)\n',
    checks: [
      { kind: 'var', label: 'status is "water soon" for 42', name: 'status', type: 'str', equals: 'water soon' },
      { kind: 'variants', label: 'Every band, including the edges (hidden cases)', variants: [
        { set: { moisture: 5 }, expect: { status: 'water now' } }, { set: { moisture: 29 }, expect: { status: 'water now' } },
        { set: { moisture: 30 }, expect: { status: 'water soon' } }, { set: { moisture: 60 }, expect: { status: 'fine' } }, { set: { moisture: 99 }, expect: { status: 'fine' } },
      ] },
    ],
    hints: ['Three branches: `if`, `elif`, `else`.', '`if moisture < 30:` then an indented `status = "water now"`.', 'Then `elif moisture < 60:` and `else:`, each setting `status`.'],
  },
  challenge: {
    heading: 'Every specimen gets bronze.',
    lede: 'The grading program gives **gold** for 90+, **silver** for 75+, **bronze** for 50+ and **none** below. Somehow a 95 gets bronze. Fix it.',
    starter: 'score = 95\n\nif score >= 50:\n    grade = "bronze"\nelif score >= 75:\n    grade = "silver"\nelif score >= 90:\n    grade = "gold"\nelse:\n    grade = "none"\n\nprint("Grade:", grade)\n',
    checks: [
      { kind: 'var', label: '95 gets "gold"', name: 'grade', type: 'str', equals: 'gold' },
      { kind: 'variants', label: 'Every grade, including the edges (hidden cases)', variants: [
        { set: { score: 90 }, expect: { grade: 'gold' } }, { set: { score: 89 }, expect: { grade: 'silver' } }, { set: { score: 75 }, expect: { grade: 'silver' } },
        { set: { score: 50 }, expect: { grade: 'bronze' } }, { set: { score: 49 }, expect: { grade: 'none' } },
      ] },
    ],
    hints: ['Python takes the first true branch. Is 95 >= 50?', 'Check the highest threshold first.', 'Order: `>= 90`, then `>= 75`, then `>= 50`, then `else`.'],
  },
  quiz: [
    { q: 'With x = 7, what prints?\nif x > 5: print("A")\nelif x > 3: print("B")', opts: ['A', 'B', 'A and B'], a: 0, why: 'Only the first true branch runs; the elif is skipped.' },
    { q: 'What marks the body of an if?', opts: ['Curly braces', 'Indentation after a colon', 'The word then'], a: 1, why: 'Python uses the colon and the indented lines that follow.' },
    { q: 'When does else run?', opts: ['Always', 'When every condition above was false', 'When the last elif was true'], a: 1, why: 'else catches whatever no earlier branch took.' },
  ],
};

const whiles: Lesson = {
  id: 'g02-l03', conceptId: 'flow.3', number: 3, title: 'while loops', minutes: 18, xp: 150, difficulty: 2,
  description: 'Repeat while a condition stays true, and make sure it stops.',
  objectives: ['repeat code with `while`', 'update the loop variable so the loop ends', 'count and accumulate inside a loop'],
  discover: {
    heading: 'A river that loops back.',
    lede: 'A `while` loop runs its block again and again **as long as its condition is true**. Something inside must change so the condition eventually becomes false; otherwise the loop runs forever. (If that happens here, press **Stop**.)',
    example: 'level = 0\ncycles = 0\nwhile level < 20:\n    level = level + 7\n    cycles += 1\n    print("Cycle", cycles, "level", level)\nprint("Tank full after", cycles, "cycles")\n',
    tagsHeading: 'Every loop needs',
    tags: [
      { name: 'a start', color: '#345a04', desc: 'Set variables before the loop', examples: 'level = 0' },
      { name: 'a condition', color: '#8a6000', desc: 'Checked before every pass', examples: 'while level < 20:' },
      { name: 'a change', color: '#a8423c', desc: 'Something moves toward the end', examples: 'level += 7' },
      { name: 'x += 1', color: '#242820', desc: 'Shortcut for x = x + 1', examples: 'count += 1' },
    ],
    tip: 'Before you run a loop, ask: what makes the condition become false? If you cannot answer, it will run forever.',
  },
  experiment: {
    heading: 'Fill the tank.',
    lede: 'Change the numbers and watch the number of cycles change.',
    steps: ['Run it as it is.', 'Change the step from 7 to 3. How many cycles now?', 'Change the condition to `level < 0`. Why does the loop body never run?', 'Remove the line `level = level + 7` and run. Press **Stop**: this is what an endless loop looks like.'],
    code: 'level = 0\ncycles = 0\nwhile level < 20:\n    level = level + 7\n    cycles += 1\n    print("Cycle", cycles, "level", level)\nprint("Tank full after", cycles, "cycles")\n',
  },
  practice: {
    heading: 'Count down to launch.',
    lede: 'Print the countdown from `countdown` down to 1, one number per line, then `Liftoff!`. Use a `while` loop.',
    starter: 'countdown = 5\n\n# your while loop here\n\nprint("Liftoff!")\n',
    checks: [
      { kind: 'source', label: 'Uses a while loop', matches: '^\\s*while\\b' },
      { kind: 'output', label: 'Prints 5, 4, 3, 2, 1, Liftoff!', lines: ['5', '4', '3', '2', '1', 'Liftoff!'] },
      { kind: 'variants', label: 'Counts all the way down from other starts (hidden cases)', variants: [{ set: { countdown: 3 }, expect: { countdown: 0 } }, { set: { countdown: 9 }, expect: { countdown: 0 } }], fail: 'Subtract 1 from countdown inside the loop until it reaches 0.' },
    ],
    hints: ['Keep looping while `countdown > 0`.', 'Inside: print the number, then make it one smaller.', '`while countdown > 0:` / `    print(countdown)` / `    countdown -= 1`'],
  },
  challenge: {
    heading: 'The pump never runs.',
    lede: 'Each pump cycle adds **7** litres. Count the cycles needed to reach at least `target` litres. The loop below never runs at all. Fix it so `cycles` is right for any target.',
    starter: 'target = 50\nlevel = 0\ncycles = 0\n\nwhile level > target:\n    level += 7\n    cycles += 1\n\nprint(cycles, "cycles to reach", level, "litres")\n',
    checks: [
      { kind: 'var', label: 'cycles is 8 for 50 litres', name: 'cycles', type: 'int', equals: 8 },
      { kind: 'var', label: 'level ends at 56', name: 'level', type: 'int', equals: 56 },
      { kind: 'variants', label: 'Right for other targets (hidden cases)', variants: [
        { set: { target: 21 }, expect: { cycles: 3, level: 21 } }, { set: { target: 1 }, expect: { cycles: 1, level: 7 } }, { set: { target: 0 }, expect: { cycles: 0, level: 0 } },
      ] },
    ],
    hints: ['A while loop runs while its condition is true. Is 0 > 50?', 'You want to keep pumping while the level is still below the target.', '`while level < target:`'],
  },
  quiz: [
    { q: 'How many times does this print?\nn = 0\nwhile n < 3:\n    print(n)\n    n += 1', opts: ['2', '3', '4'], a: 1, why: 'n is 0, 1, 2 inside the loop; at 3 the condition is false.' },
    { q: 'What happens if nothing in the loop changes the condition?', opts: ['Python stops after 100 passes', 'It runs forever', 'It raises an error at once'], a: 1, why: 'Python keeps going until something makes the condition false. Here, Stop or the time limit ends it.' },
    { q: 'What does count += 2 do?', opts: ['Sets count to 2', 'Adds 2 to count', 'Compares count with 2'], a: 1, why: 'It is shorthand for count = count + 2.' },
  ],
};

const fors: Lesson = {
  id: 'g02-l04', conceptId: 'flow.4', number: 4, title: 'for loops & range()', minutes: 18, xp: 150, difficulty: 2,
  description: 'Repeat a known number of times, and walk through text one character at a time.',
  objectives: ['loop a fixed number of times with `for i in range(...)`', 'use `range(start, stop, step)` and know stop is excluded', 'walk through a string character by character'],
  discover: {
    heading: 'Walking the planter rows.',
    lede: 'A `for` loop takes the items of something one at a time. `range(n)` gives the numbers `0` to `n - 1`; `range(1, n + 1)` gives `1` to `n`. A string is a sequence too, so `for ch in "fern"` visits each letter.',
    example: 'for i in range(3):\n    print("pass", i)          # 0, 1, 2\n\nfor row in range(1, 4):\n    print("Planter", row)     # 1, 2, 3\n\nfor n in range(10, 0, -3):\n    print(n)                  # 10, 7, 4, 1\n\nfor ch in "fern":\n    print(ch.upper())\n',
    tagsHeading: 'range() at a glance',
    tags: [
      { name: 'range(4)', color: '#345a04', desc: '0 up to 3', examples: '0 1 2 3' },
      { name: 'range(1, 4)', color: '#8a6000', desc: 'start to stop - 1', examples: '1 2 3' },
      { name: 'range(0, 10, 3)', color: '#a8423c', desc: 'with a step', examples: '0 3 6 9' },
      { name: 'for ch in s', color: '#242820', desc: 'each character', examples: '"ab" → a, b' },
    ],
    tip: 'Use `for` when you know how many times (or have a sequence to walk); use `while` when you only know when to stop.',
  },
  experiment: {
    heading: 'Count the rows.',
    lede: 'Predict, then run.',
    steps: ['Run it as it is.', 'Change `range(1, 4)` to `range(1, 6)`.', 'Make the countdown go `10, 8, 6, 4, 2`.', 'Loop over your own name and print each letter.'],
    code: 'for row in range(1, 4):\n    print("Planter", row)\n\nfor n in range(10, 0, -3):\n    print(n)\n\nfor ch in "fern":\n    print(ch)\n',
  },
  practice: {
    heading: 'Seed a row of planters.',
    lede: 'For each planter from 1 to `planters`, print `Planter <n>: <seeds_each> seeds`. Keep a running `total` of all seeds.',
    starter: 'planters = 5\nseeds_each = 3\ntotal = 0\n\n# your for loop here\n\nprint("Total:", total)\n',
    checks: [
      { kind: 'output', label: 'Prints Planter 1 to Planter 5, then the total', lines: ['Planter 1: 3 seeds', 'Planter 2: 3 seeds', 'Planter 3: 3 seeds', 'Planter 4: 3 seeds', 'Planter 5: 3 seeds', 'Total: 15'] },
      { kind: 'var', label: 'total is 15', name: 'total', type: 'int', equals: 15 },
      { kind: 'variants', label: 'Right for other rows (hidden cases)', variants: [{ set: { planters: 8, seeds_each: 2 }, expect: { total: 16 } }, { set: { planters: 0 }, expect: { total: 0 } }] },
    ],
    hints: ['`range(1, planters + 1)` counts 1 to planters.', 'Inside the loop: print the line, then `total += seeds_each`.', '`for n in range(1, planters + 1):` / `    print(f"Planter {n}: {seeds_each} seeds")` / `    total += seeds_each`'],
  },
  challenge: {
    heading: 'The vowel counter undercounts.',
    lede: 'Count the vowels (a, e, i, o, u, in either case) in `name`. This version misses some. Fix it so `vowels` is right for any name.',
    starter: 'name = "Moonfern Archive"\nvowels = 0\n\nfor i in range(1, len(name)):\n    if name[i] in "aeiou":\n        vowels += 1\n\nprint(name, "has", vowels, "vowels")\n',
    checks: [
      { kind: 'var', label: '"Moonfern Archive" has 6 vowels', name: 'vowels', type: 'int', equals: 6 },
      { kind: 'variants', label: 'Right for other names (hidden cases)', variants: [
        { set: { name: 'AEIOU xyz' }, expect: { vowels: 5 } }, { set: { name: '' }, expect: { vowels: 0 } }, { set: { name: 'Elm' }, expect: { vowels: 1 } },
      ] },
    ],
    hints: ['Two bugs: where does the loop start, and what about capital letters?', '`range(len(name))` starts at 0. Even simpler: `for ch in name:`.', 'Compare a lowercase copy: `if ch.lower() in "aeiou":`.'],
  },
  quiz: [
    { q: 'What numbers does range(2, 6) give?', opts: ['2 3 4 5 6', '2 3 4 5', '3 4 5 6'], a: 1, why: 'The stop value is never included.' },
    { q: 'How many times does for i in range(10, 0, -2) loop?', opts: ['5', '10', '4'], a: 0, why: '10, 8, 6, 4, 2: five values before reaching 0.' },
    { q: 'What does for ch in "oak" give ch?', opts: ['"oak" three times', '"o", "a", "k"', '0, 1, 2'], a: 1, why: 'Looping over a string visits each character.' },
  ],
};

const breaks: Lesson = {
  id: 'g02-l05', conceptId: 'flow.5', number: 5, title: 'break & continue', minutes: 15, xp: 150, difficulty: 2,
  description: 'Leave a loop early, or skip to the next pass.',
  objectives: ['stop a loop at once with `break`', 'skip the rest of one pass with `continue`', 'read input until a stop word with `while True`'],
  discover: {
    heading: 'Dams and side channels.',
    lede: '`break` leaves the loop immediately. `continue` abandons the current pass and jumps to the next one. A common pattern is `while True:` (loop forever) with a `break` when a stop word arrives.',
    example: 'for n in range(1, 10):\n    if n % 3 == 0:\n        continue        # skip multiples of 3\n    if n > 7:\n        break           # stop entirely\n    print(n)            # 1 2 4 5 7\n\ntotal = 0\nwhile True:\n    reading = input("Reading (or done): ")\n    if reading == "done":\n        break\n    total += int(reading)\nprint("Total:", total)\n',
    tagsHeading: 'Two exits',
    tags: [
      { name: 'break', color: '#a8423c', desc: 'Leave the loop now', examples: 'if found: break' },
      { name: 'continue', color: '#8a6000', desc: 'Skip to the next pass', examples: 'if bad: continue' },
      { name: 'while True:', color: '#345a04', desc: 'Loop until a break', examples: 'read until "done"' },
      { name: 'loop else', color: '#242820', desc: 'Runs if no break happened', examples: 'for…else' },
    ],
    tip: 'When you run the example, the console asks for readings. Type a few numbers, then `done`.',
  },
  experiment: {
    heading: 'Open and close the dam.',
    lede: 'Run it and answer in the console.',
    steps: ['Run it; enter `4`, `6`, `done`.', 'Change `continue` to `break` in the first loop. What prints now?', 'Enter `done` straight away. What is the total?', 'Enter `seven` and read the ValueError.'],
    code: 'for n in range(1, 10):\n    if n % 3 == 0:\n        continue\n    if n > 7:\n        break\n    print(n)\n\ntotal = 0\nwhile True:\n    reading = input("Reading (or done): ")\n    if reading == "done":\n        break\n    total += int(reading)\nprint("Total:", total)\n',
  },
  practice: {
    heading: 'Total the sensor log.',
    lede: 'Read numbers with `input()` until someone types `done`, then print `Total: <sum>`.',
    starter: 'total = 0\n\n# read until "done"\n\nprint("Total:", total)\n',
    inputs: ['3', '4', 'done'],
    checks: [
      { kind: 'cases', label: '3, 4, done → Total: 7', cases: [{ inputs: ['3', '4', 'done'], regex: 'Total: 7$' }] },
      { kind: 'cases', label: 'Stops at "done" and ignores later lines (hidden cases)', cases: [{ inputs: ['done'], regex: 'Total: 0$' }, { inputs: ['10', 'done', '99'], regex: 'Total: 10$' }, { inputs: ['1', '1', '1', '1', 'done'], regex: 'Total: 4$' }] },
      { kind: 'source', label: 'Uses break', matches: '\\bbreak\\b' },
    ],
    hints: ['`while True:` loops until you break out.', 'Read a line; if it is `"done"`, `break`.', 'Otherwise `total += int(line)`.'],
  },
  challenge: {
    heading: 'One bad sensor ruins the average.',
    lede: 'Faulty sensors send negative readings. **Skip** them, keep reading until `done`, then print `Average: <value>` rounded to 1 decimal place, or `No valid readings` if none were valid. The current version stops at the first bad reading and can crash.',
    starter: 'total = 0\ncount = 0\nwhile True:\n    line = input()\n    if line == "done":\n        break\n    reading = float(line)\n    if reading < 0:\n        break\n    total += reading\n    count += 1\n\nprint("Average:", round(total / count, 1))\n',
    inputs: ['20', '-1', '22', 'done'],
    checks: [
      { kind: 'cases', label: '20, -1, 22 → Average: 21.0', cases: [{ inputs: ['20', '-1', '22', 'done'], regex: 'Average: 21\\.0$' }] },
      { kind: 'cases', label: 'Skips every bad reading (hidden cases)', cases: [{ inputs: ['-5', '10', '-2', '11', '12', 'done'], regex: 'Average: 11\\.0$' }, { inputs: ['1', '2', 'done'], regex: 'Average: 1\\.5$' }] },
      { kind: 'cases', label: 'Handles no valid readings (hidden cases)', cases: [{ inputs: ['done'], regex: 'No valid readings' }, { inputs: ['-1', '-2', 'done'], regex: 'No valid readings' }] },
    ],
    hints: ['A bad reading should skip just that pass: which keyword does that?', 'Swap the second `break` for `continue`.', 'After the loop: `if count == 0: print("No valid readings")` else print the average.'],
  },
  quiz: [
    { q: 'What does continue do?', opts: ['Ends the loop', 'Skips to the next pass', 'Repeats the current pass'], a: 1, why: 'The rest of this pass is skipped; the loop carries on.' },
    { q: 'What prints?\nfor n in range(5):\n    if n == 2: break\n    print(n)', opts: ['0 1', '0 1 2', '0 1 3 4'], a: 0, why: 'At n == 2 the loop ends before printing.' },
    { q: 'Why pair while True with break?', opts: ['To loop until a condition met inside the body', 'It is faster', 'Python requires it for input()'], a: 0, why: 'It suits loops whose stop condition is only known mid-pass, like reading until "done".' },
  ],
};

const nested: Lesson = {
  id: 'g02-l06', conceptId: 'flow.6', number: 6, title: 'Nested logic', minutes: 20, xp: 150, difficulty: 3,
  description: 'Loops inside loops and decisions inside decisions.',
  objectives: ['put a loop inside a loop to walk a grid', 'nest `if` blocks for decisions that depend on earlier ones', 'build up a line of output with `end=""`'],
  discover: {
    heading: 'Braids in the river.',
    lede: 'A loop inside another loop runs completely for **each** pass of the outer one: 3 rows × 4 columns is 12 passes. Decisions nest the same way: an inner `if` is only asked when the outer one was true.',
    example: 'rows, cols = 3, 4\nfor r in range(1, rows + 1):\n    for c in range(1, cols + 1):\n        print(f"{r}{c}", end=" ")\n    print()                       # end the line\n\ntemp, wind = -3, 25\nif temp < 0:\n    if wind > 20:\n        print("Severe frost")\n    else:\n        print("Frost")\nelse:\n    print("Clear")\n',
    tagsHeading: 'Nesting',
    tags: [
      { name: 'for … for', color: '#345a04', desc: 'Inner loop runs fully each outer pass', examples: '3 × 4 = 12' },
      { name: 'if … if', color: '#8a6000', desc: 'Inner question only if outer was true', examples: 'frost → wind?' },
      { name: 'end=""', color: '#a8423c', desc: 'print without a new line', examples: 'print("x", end="")' },
      { name: 'print()', color: '#242820', desc: 'just a new line', examples: 'finish a row' },
    ],
    tip: 'Indentation shows nesting. Count the spaces: each level adds four.',
  },
  experiment: {
    heading: 'Weave a grid.',
    lede: 'Change sizes and conditions.',
    steps: ['Run it as it is.', 'Make the grid 5 × 2.', 'Print `#` when `r == c` and `.` otherwise.', 'Set `temp = 2` and see which branch runs.'],
    code: 'rows, cols = 3, 4\nfor r in range(1, rows + 1):\n    for c in range(1, cols + 1):\n        print(f"{r}{c}", end=" ")\n    print()\n\ntemp, wind = -3, 25\nif temp < 0:\n    if wind > 20:\n        print("Severe frost")\n    else:\n        print("Frost")\nelse:\n    print("Clear")\n',
  },
  practice: {
    heading: 'Checkerboard planting.',
    lede: 'Plant a seed where **row + column is even** (rows and columns start at 1). Print the bed with `X` for planted and `.` for empty, one row per line, and count the seeds in `planted`.',
    note: 'For 3 rows × 4 columns: `X.X.` / `.X.X` / `X.X.` and 6 planted.',
    starter: 'rows = 3\ncols = 4\nplanted = 0\n\n# nested loops here\n\nprint(planted, "planted")\n',
    checks: [
      { kind: 'output', label: 'Draws the 3 × 4 bed', regex: '^X\\.X\\.\\n\\.X\\.X\\nX\\.X\\.\\n' },
      { kind: 'var', label: 'planted is 6', name: 'planted', type: 'int', equals: 6 },
      { kind: 'variants', label: 'Right for other beds (hidden cases)', variants: [{ set: { rows: 5, cols: 5 }, expect: { planted: 13 } }, { set: { rows: 1, cols: 1 }, expect: { planted: 1 } }, { set: { rows: 2, cols: 3 }, expect: { planted: 3 } }] },
    ],
    hints: ['Outer loop over rows, inner over columns, both from 1.', 'Inside: `if (r + c) % 2 == 0:` print `X` with `end=""` and count it; else print `.` with `end=""`.', 'After the inner loop, `print()` to finish the row.'],
  },
  challenge: {
    heading: 'The frost alert cries wolf.',
    lede: 'Rules: below **0 °C** it is `"severe"` if wind is over **20**, otherwise `"frost"`. Otherwise, below **4 °C** at night it is `"watch"`. Anything else is `"clear"`. The flattened version below gets several cases wrong. Fix `alert`.',
    starter: 'temp = -3\nwind = 10\nis_night = True\n\nif temp < 0 or wind > 20:\n    alert = "severe"\nelif temp < 4:\n    alert = "watch"\nelse:\n    alert = "clear"\n\nprint("Alert:", alert)\n',
    checks: [
      { kind: 'var', label: '-3 °C, calm night → "frost"', name: 'alert', type: 'str', equals: 'frost' },
      { kind: 'variants', label: 'Every rule (hidden cases)', variants: [
        { set: { temp: -1, wind: 30 }, expect: { alert: 'severe' } },
        { set: { temp: 10, wind: 40 }, expect: { alert: 'clear' } },
        { set: { temp: 2, wind: 5, is_night: true }, expect: { alert: 'watch' } },
        { set: { temp: 2, wind: 5, is_night: false }, expect: { alert: 'clear' } },
      ] },
    ],
    hints: ['Wind only matters when it is already below freezing.', 'Nest: `if temp < 0:` then inside `if wind > 20:` / `else:`.', 'The watch branch needs both: `elif temp < 4 and is_night:`.'],
  },
  quiz: [
    { q: 'How many times does the inner print run?\nfor a in range(3):\n    for b in range(2):\n        print(a, b)', opts: ['5', '6', '3'], a: 1, why: '3 outer passes × 2 inner passes.' },
    { q: 'What does print("x", end="") do?', opts: ['Prints x without a new line', 'Prints nothing', 'Prints x and an empty line'], a: 0, why: 'end replaces the usual newline.' },
    { q: 'An inner if inside an outer if runs when…', opts: ['always', 'only when the outer condition is true', 'only when the outer condition is false'], a: 1, why: 'The inner block is part of the outer block.' },
  ],
};

export const GALAXY_02: Lesson[] = [bools, ifs, whiles, fors, breaks, nested];
