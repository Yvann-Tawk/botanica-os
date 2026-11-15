// Galaxy 01 · Origins. Five lessons; the guided project (origins.project) arrives with Missions in Milestone 5.
// Lesson 03 keeps the prototype's content (jars, star log, oxygen readout, quiz) almost word for word.

import type { LessonCore as Lesson } from './types';

const hello: Lesson = {
  id: 'g01-l01', conceptId: 'origins.hello', number: 1, title: 'Hello, Python!',
  description: 'What Python is, how a program runs, and your first print().',
  objectives: ['say what Python is and what running a program means', 'show text with `print()`', 'write comments Python ignores'],
  difficulty: 1, minutes: 10, xp: 100,
  discover: {
    heading: 'The vessel speaks Python.',
    lede: 'Python is a language for giving a computer instructions. You write them in a file, one per line, and the **interpreter** reads them top to bottom and carries them out. That is all "running a program" means. The first instruction everyone learns is `print()`: whatever you put between the brackets appears in the console.',
    example: '# Lines starting with # are notes for humans. Python skips them.\nprint("Hello, Hortensia!")\nprint("Systems online:", 3)\n',
    tagsHeading: 'Four things to notice',
    tags: [
      { name: 'print()', color: '#345a04', desc: 'Shows a value in the console', examples: 'print("hi")' },
      { name: '"text"', color: '#a8423c', desc: 'Text goes inside quotes', examples: '"Deck 3" · \'ok\'' },
      { name: ',', color: '#8a6000', desc: 'Separates values; print adds a space', examples: 'print("a", 1)' },
      { name: '#', color: '#242820', desc: 'A comment: ignored by Python', examples: '# todo' },
    ],
    tip: 'Press **Run** (or `⌘ Enter`) on the right. Each `print()` becomes one line in the console, in order.',
  },
  experiment: {
    heading: 'Make it say something else.',
    lede: 'The code on the right is live. Change it, run it, see what happens. Errors are fine: they are how Python tells you what it needs.',
    steps: ['Run it as it is.', 'Change `Hortensia` to your own name and run again.', 'Add a line: `print("Deck", 3, "is green")`. Notice the spaces print adds between values.', 'Delete one of the quotes in line 2 and run. Read the last line of the error, then put the quote back.'],
    tip: 'Python reads from the top. If line 2 has an error, line 3 never runs.',
    code: '# Lines starting with # are notes for humans. Python skips them.\nprint("Hello, Hortensia!")\nprint("Systems online:", 3)\n',
  },
  practice: {
    heading: 'Greet the crew.',
    lede: 'Write a program that prints exactly these three lines, in this order.',
    steps: ['`Hello, crew!`', '`Deck 3 is green.`', '`Botanica OS ready.`'],
    starter: '# Print three lines, one print() for each\n',
    checks: [
      { kind: 'runs', label: 'Runs without a traceback' },
      { kind: 'output', label: 'Console shows the three lines, in order', lines: ['Hello, crew!', 'Deck 3 is green.', 'Botanica OS ready.'], fail: 'Compare letter by letter: capitals, commas and full stops all count.' },
    ],
    hints: ['Each line is its own `print()` with the text in quotes: `print("Hello, crew!")`.', 'Punctuation counts. `Deck 3 is green.` ends with a full stop.', 'The whole answer is three lines, each starting with `print(`.'],
  },
  challenge: {
    heading: 'The navigation log is garbled.',
    lede: 'Someone typed this log in a hurry. It should print the three lines below. Fix every mistake.',
    note: 'Expected output: `Navigation log` · `Course set for Origins` · `Engines at full power`',
    starter: 'print("Navigation log"\nPrint("Course set for Origins")\nprint(\'Engines at full power")\n',
    checks: [
      { kind: 'runs', label: 'Runs without a traceback' },
      { kind: 'output', label: 'Prints the three log lines exactly', lines: ['Navigation log', 'Course set for Origins', 'Engines at full power'] },
    ],
    hints: ['Run it and read the error. Python stops at the first problem, so fix one at a time.', 'Line 1 opens a bracket it never closes. Line 2: Python names are case-sensitive.', 'Line 3 starts its text with \' but ends with ". A string must open and close with the same kind of quote.'],
  },
  quiz: [
    { q: 'What does print("2 + 3") show?', opts: ['5', '2 + 3', 'An error'], a: 1, why: 'Inside quotes it is text, so Python shows it exactly as written. Without quotes, print(2 + 3) would show 5.' },
    { q: 'Which line does Python ignore?', opts: ['# check the fuel', 'print("# check the fuel")', '"check the fuel"'], a: 0, why: 'A line starting with # is a comment. In the second option the # is inside a string, so it is printed.' },
    { q: 'Why does Print("hi") fail?', opts: ['Names are case-sensitive: the function is print', 'Text needs single quotes', 'print needs two values'], a: 0, why: 'Python treats Print and print as different names, and only print exists.' },
  ],
};

const variables: Lesson = {
  id: 'g01-l02', conceptId: 'origins.variables', number: 2, title: 'Variables',
  description: 'Give values names, reuse them, and change them.',
  objectives: ['create a variable with `=`', 'follow Python naming rules and conventions', 'reuse and update a value through its name'],
  difficulty: 1, minutes: 12, xp: 120,
  discover: {
    heading: 'Every specimen needs a label.',
    lede: 'A **variable** is a name you tie to a value, like a tag looped around a jar in the seed bank. Write the name, an equals sign, then the value. From then on, Python can find that value again whenever you use the name.',
    figure: 'jars',
    example: 'specimen = "Moonfern"\nage_days = 42\nprint(specimen, "is", age_days, "days old")\n\nage_days = age_days + 1    # the right side is worked out first\nprint("Tomorrow it will be", age_days)\n',
    tagsHeading: 'Naming rules',
    tags: [
      { name: 'letters_digits_', color: '#345a04', desc: 'Letters, digits and underscores only', examples: 'seed_count · deck3' },
      { name: '3rd ✗', color: '#a8423c', desc: 'Cannot start with a digit', examples: 'third_deck ✓' },
      { name: 'snake_case', color: '#8a6000', desc: 'The custom: lowercase, words joined by _', examples: 'height_cm' },
      { name: 'Seeds ≠ seeds', color: '#242820', desc: 'Capitals make a different name', examples: 'pick one, stick to it' },
    ],
    tip: '`=` means "tie this name to this value", not "is equal to". `age_days = age_days + 1` reads: work out `age_days + 1`, then move the tag to the result.',
  },
  experiment: {
    heading: 'Move the tags around.',
    lede: 'Run the code, then change it. Watch which lines change their output.',
    steps: ['Run it as it is.', 'Change `42` to `100`. Both printed lines change, because both use the name.', 'Add `specimen = "Starwort"` just before the last line, and print `specimen` again.', 'Try `print(Specimen)` with a capital S. Read the NameError.'],
    tip: 'A variable holds one value at a time. Assigning again replaces the old value; it does not keep both.',
    code: 'specimen = "Moonfern"\nage_days = 42\nprint(specimen, "is", age_days, "days old")\n\nage_days = age_days + 1\nprint("Tomorrow it will be", age_days)\n',
  },
  practice: {
    heading: 'Write the crew manifest.',
    lede: 'The last line is already written. It works once your two variables exist.',
    steps: ['`captain`: any name you like, as text in quotes', '`crew_size`: the number **12**'],
    starter: '# 1. Store the captain\'s name in captain\n\n# 2. Store the crew size in crew_size\n\nprint(captain, "leads a crew of", crew_size)\n',
    checks: [
      { kind: 'var', label: 'captain holds a name (text)', name: 'captain', type: 'str', nonEmpty: true },
      { kind: 'var', label: 'crew_size holds the number 12', name: 'crew_size', type: 'int', equals: 12 },
      { kind: 'output', label: 'The manifest line prints', regex: 'leads a crew of 12$' },
    ],
    hints: ['Text needs quotes: `captain = "Ada"`.', 'Numbers do not: `crew_size = 12`.', 'Put the two assignment lines above the print line. Python runs top to bottom, so names must exist before they are used.'],
  },
  challenge: {
    heading: 'The seed counter is stuck.',
    lede: 'A harvest adds **15** seeds to the vault. Update `seeds` on the empty line so the second line reports the new total. Use the variable itself: typing 55 would break the moment the vault starts with a different number.',
    starter: 'seeds = 40\nprint("Seeds in the vault:", seeds)\n# A harvest adds 15 seeds:\n\nprint("After the harvest:", seeds)\n',
    checks: [
      { kind: 'runs', label: 'Runs without a traceback' },
      { kind: 'output', label: 'Console reads "After the harvest: 55"', regex: '^After the harvest: 55$' },
      { kind: 'variants', label: 'Still right when the vault starts with 100 seeds', variants: [{ set: { seeds: 100 }, expect: { seeds: 115 } }, { set: { seeds: 0 }, expect: { seeds: 15 } }], fail: 'Add 15 to whatever seeds already holds, instead of writing the answer.' },
    ],
    hints: ['Reassign the name: `seeds = ...` on the empty line.', 'The right-hand side can use the old value: `seeds + 15`.', 'The line is `seeds = seeds + 15` (or the shortcut `seeds += 15`).'],
  },
  quiz: [
    { q: 'After x = 5 then x = x + 2, what does print(x) show?', opts: ['5', '7', 'x + 2'], a: 1, why: 'The right side is worked out first (5 + 2), then the name x is tied to the result.' },
    { q: 'Which is a valid variable name?', opts: ['2nd_star', 'second star', 'second_star'], a: 2, why: 'Names cannot start with a digit or contain spaces. snake_case is the custom.' },
    { q: 'Are Seeds and seeds the same variable?', opts: ['Yes, Python ignores case', 'No, capitals make a different name', 'Only inside print()'], a: 1, why: 'Python is case-sensitive everywhere: Seeds and seeds are two separate names.' },
  ],
};

const types: Lesson = {
  id: 'g01-l03', conceptId: 'origins.types', number: 3, title: 'Data types',
  description: 'Strings, integers, floats and booleans, and how to convert between them.',
  objectives: ['tell `int`, `float`, `str` and `bool` apart', 'inspect any value with `type()`', 'convert with `int()`, `float()` and `str()`'],
  difficulty: 1, minutes: 12, xp: 150,
  discover: {
    heading: 'Every jar holds one kind of thing.',
    lede: 'Each value in Python has a **type** that decides what you can do with it. You can add two numbers, and you can join two pieces of text, but Python will not guess how to mix them. The four you meet first are below.',
    figure: 'jars',
    example: 'specimen = "Moonfern"   # a str: text\nage_days = 42           # an int: whole number\nheight_cm = 18.5        # a float: decimal number\nis_flowering = False    # a bool: True or False',
    tagsHeading: 'The four types you will meet first',
    tags: [
      { name: 'int', color: '#345a04', desc: 'Whole numbers', examples: '42 · -7 · 0' },
      { name: 'float', color: '#8a6000', desc: 'Numbers with a decimal point', examples: '18.5 · 3.0 · -0.25' },
      { name: 'str', color: '#a8423c', desc: 'Text, always in quotes', examples: '"Moonfern" · \'42\'' },
      { name: 'bool', color: '#242820', desc: 'Truth: one of two values', examples: 'True · False' },
    ],
    tip: '**Field tip.** Not sure what you are holding? `type()` tells you. The code on the right already prints `type(height_cm)`. Press Run and read the console. To convert, call the type by name: `int("21")` is 21, `str(4)` is "4".',
  },
  experiment: {
    heading: 'Change the jar, watch the label change.',
    lede: 'The code on the right is live. Run it, then poke at it. Nothing you type here can damage the vessel, and every error is a clue.',
    steps: ['Run it as it is. Press **Run** or `⌘ Enter`.', 'Change `42` to `42.0` and add `print(type(age_days))`. The label switches from `int` to `float`.', 'Put the number in quotes: `age_days = "42"`. Now it is a `str`, text that only looks like a number.', 'Try `print(specimen + age_days)`. Read the last line of the error slowly.'],
    tip: 'Python decides the type from the **value**, never from the name. Names are for you, so make them describe what they hold.',
    code: 'specimen = "Moonfern"\nage_days = 42\nheight_cm = 18.5\nis_flowering = False\n\nprint(specimen, "is", age_days, "days old")\nprint(type(height_cm))\n',
  },
  practice: {
    heading: "Log the vessel's home star.",
    lede: 'The navigation log needs three facts about Hortensia Prime. Each one is a different type. The last line is already written: it fills itself in once your variables exist.',
    steps: ['`star`: the name **Hortensia Prime**, as a str', '`distance_ly`: **4.2** light-years, as a float', '`moons`: **3** moons, as an int'],
    starter: '# 1. Name the star (a str)\nstar = \n\n# 2. Its distance in light-years (a float)\n\n# 3. How many moons orbit it (an int)\n\nprint(f"{star} is {distance_ly} light-years away, with {moons} moons.")\n',
    checks: [
      { kind: 'var', label: 'star holds a str', name: 'star', type: 'str', nonEmpty: true },
      { kind: 'var', label: 'distance_ly holds a float', name: 'distance_ly', type: 'float' },
      { kind: 'var', label: 'moons holds an int', name: 'moons', type: 'int' },
      { kind: 'runs', label: 'The log line prints without errors' },
    ],
    hints: ['A str needs quotes around it: `star = "Hortensia Prime"`', 'A float has a decimal point. Write `distance_ly = 4.2` on the empty line under comment 2.', '`moons = 3` makes an int. Run it: the last line fills itself in once all three names exist.'],
  },
  challenge: {
    heading: 'The oxygen readout is lying.',
    lede: "Deck 3 reports a crash every time it adds the reserve tank. Someone stored the main tank's reading as text. Fix the code so the console reads `Total oxygen: 25`, without changing line 1.",
    note: 'No step-by-step this time. Run it first, read the traceback, then decide.',
    starter: 'oxygen = "21"\nreserve = 4\ntotal = oxygen + reserve\nprint("Total oxygen:", total)\n',
    checks: [
      { kind: 'runs', label: 'Runs without a traceback' },
      { kind: 'var', label: 'total is the number 25, an int', name: 'total', type: 'int', equals: 25 },
      { kind: 'output', label: 'Console reads "Total oxygen: 25"', regex: '^Total oxygen: 25$' },
      { kind: 'var', label: 'Line 1 still stores "21" as text', name: 'oxygen', type: 'str', equals: '21' },
    ],
    hints: ['Read the last line of the traceback. Python refuses to add text ("21") to a number (4).', '`int("21")` turns the text into the number 21. You may change line 3.', 'Line 3 becomes: `total = int(oxygen) + reserve`'],
  },
  quiz: [
    { q: 'What does print(type(3.0)) show?', opts: ["<class 'int'>", "<class 'float'>", "<class 'str'>"], a: 1, why: 'The decimal point makes it a float, even when the fraction is zero.' },
    { q: 'Which line stores a bool?', opts: ['is_ripe = "True"', 'is_ripe = True', 'is_ripe = 1'], a: 1, why: 'True with a capital T and no quotes is a bool. In quotes it is a str; 1 is an int.' },
    { q: 'After x = 5 and then x = "five", what is type(x)?', opts: ["<class 'int'>", "<class 'str'>", 'An error: Python forbids it'], a: 1, why: 'A variable is a label, not a box with a fixed shape. Re-tie it to text and it becomes a str.' },
  ],
};

const operators: Lesson = {
  id: 'g01-l04', conceptId: 'origins.operators', number: 4, title: 'Operators',
  description: 'Arithmetic, comparisons and the logic words and, or, not.',
  objectives: ['calculate with `+ - * /`, `//`, `%` and `**`', 'compare values with `==`, `!=`, `<`, `>`, `<=`, `>=`', 'combine conditions with `and`, `or`, `not`'],
  difficulty: 2, minutes: 15, xp: 150,
  discover: {
    heading: 'Dividing the harvest.',
    lede: '**Operators** are the symbols that work on values. Arithmetic ones give numbers back. Comparisons give a bool: `True` or `False`. The logic words `and`, `or` and `not` combine those bools into bigger questions.',
    example: 'seeds = 47\nplanters = 5\n\nprint(seeds / planters)    # 9.4  true division always gives a float\nprint(seeds // planters)   # 9    how many whole planters\' worth\nprint(seeds % planters)    # 2    what is left over\nprint(2 ** 3)              # 8    power\n\nprint(seeds > 40)                    # True\nprint(seeds > 40 and planters > 10)  # False: both must be True\nprint(seeds > 40 or planters > 10)   # True: one is enough\n',
    tagsHeading: 'Three families',
    tags: [
      { name: '+ - * / // % **', color: '#345a04', desc: 'Arithmetic: numbers in, number out', examples: '7 // 2 → 3 · 7 % 2 → 1' },
      { name: '== != < > <= >=', color: '#8a6000', desc: 'Comparison: numbers in, bool out', examples: '3 == 3.0 → True' },
      { name: 'and or not', color: '#a8423c', desc: 'Logic: bools in, bool out', examples: 'not True → False' },
      { name: '=  vs  ==', color: '#242820', desc: 'One = assigns; two == compares', examples: 'x = 3 · x == 3' },
    ],
    tip: 'Python follows the maths order: `**` first, then `* / // %`, then `+ -`, then comparisons, then `not`, `and`, `or`. Brackets make your intent obvious.',
  },
  experiment: {
    heading: 'Bend the numbers.',
    lede: 'Run it, then change the inputs and predict each line before you run again.',
    steps: ['Run it as it is.', 'Change `planters` to `4`. Which lines change, and why does `/` still give a float?', 'Try `print(seeds / 0)`. Read the error name.', 'Add `print(not seeds > 40)` and predict it first.'],
    tip: '`//` and `%` are a pair: `seeds == planters * (seeds // planters) + seeds % planters` is always True.',
    code: 'seeds = 47\nplanters = 5\n\nprint(seeds / planters)\nprint(seeds // planters)\nprint(seeds % planters)\nprint(2 ** 3)\n\nprint(seeds > 40)\nprint(seeds > 40 and planters > 10)\nprint(seeds > 40 or planters > 10)\n',
  },
  practice: {
    heading: 'Seed arithmetic.',
    lede: 'Split the harvest evenly across the deck planters and report what is left over. Calculate both numbers with operators so the program still works when the harvest changes.',
    steps: ['`per_planter`: how many whole seeds each planter gets', '`left_over`: how many seeds remain', 'print them as `9 each, 2 left over` (already written for you)'],
    starter: 'harvest = 47\nplanters = 5\n\n# per_planter = ...\n# left_over = ...\n\nprint(per_planter, "each,", left_over, "left over")\n',
    checks: [
      { kind: 'var', label: 'per_planter is 9 (an int)', name: 'per_planter', type: 'int', equals: 9 },
      { kind: 'var', label: 'left_over is 2 (an int)', name: 'left_over', type: 'int', equals: 2 },
      { kind: 'output', label: 'Prints "9 each, 2 left over"', regex: '^9 each, 2 left over$' },
      { kind: 'variants', label: 'Still right for other harvests (hidden cases)', variants: [{ set: { harvest: 100 }, expect: { per_planter: 20, left_over: 0 } }, { set: { harvest: 3 }, expect: { per_planter: 0, left_over: 3 } }, { set: { harvest: 58, planters: 7 }, expect: { per_planter: 8, left_over: 2 } }], fail: 'Use harvest and planters in the calculation instead of typing the answers.' },
    ],
    hints: ['Floor division `//` gives whole planters\' worth; `%` gives the remainder.', '`per_planter = harvest // planters`', '`left_over = harvest % planters`'],
  },
  challenge: {
    heading: 'The vent logic is backwards.',
    lede: 'The greenhouse should **vent** when it is too hot (above 26 °C) **or** too humid (above 0.8). The **alarm** should sound only when **both** are true. The two conditions are mixed up. Fix them.',
    note: 'The checks also try other weather, so make the logic right, not just today\'s output.',
    starter: 'temperature_c = 27.5\nhumidity = 0.62\n\nneeds_vent = temperature_c > 26 and humidity > 0.8\nalarm = temperature_c > 26 or humidity > 0.8\n\nprint("Vent:", needs_vent)\nprint("Alarm:", alarm)\n',
    checks: [
      { kind: 'runs', label: 'Runs without a traceback' },
      { kind: 'output', label: 'Today: "Vent: True" and "Alarm: False"', regex: '^Vent: True\\nAlarm: False$' },
      { kind: 'variants', label: 'Right for other weather (hidden cases)', variants: [
        { set: { temperature_c: 20, humidity: 0.9 }, expect: { needs_vent: true, alarm: false } },
        { set: { temperature_c: 30, humidity: 0.9 }, expect: { needs_vent: true, alarm: true } },
        { set: { temperature_c: 20, humidity: 0.5 }, expect: { needs_vent: false, alarm: false } },
      ] },
    ],
    hints: ['Read each sentence in the brief and look for the words "or" and "both".', '`and` is True only when both sides are True; `or` when at least one is.', 'Swap them: `needs_vent` uses `or`, `alarm` uses `and`.'],
  },
  quiz: [
    { q: 'What is 7 // 2?', opts: ['3.5', '3', '4'], a: 1, why: '// is floor division: the whole number of times 2 fits into 7.' },
    { q: 'What is 7 % 2?', opts: ['1', '3', '0.5'], a: 0, why: '% gives the remainder: 7 = 2 × 3 + 1.' },
    { q: 'What does 5 == 5.0 give?', opts: ['True', 'False', 'An error'], a: 0, why: 'Comparison looks at the value, and 5 and 5.0 are the same number even though their types differ.' },
  ],
};

const input: Lesson = {
  id: 'g01-l05', conceptId: 'origins.input', number: 5, title: 'User input',
  description: 'Ask questions with input(), convert the answers, and write interactive programs.',
  objectives: ['ask the user a question with `input()`', 'remember that `input()` always returns a str', 'convert answers with `int()` and `float()`'],
  difficulty: 2, minutes: 15, xp: 150,
  discover: {
    heading: 'The vessel asks back.',
    lede: '`input()` pauses the program, shows a prompt, and waits for someone to type a line and press Enter. Whatever they type comes back as a **str**, even if it looks like a number. To do maths with it, convert it first.',
    example: 'name = input("Pilot name: ")\nseeds = int(input("Seeds to plant: "))\n\nprint("Welcome,", name)\nprint("In a week you will have", seeds * 2, "seedlings")\n',
    tagsHeading: 'What comes back',
    tags: [
      { name: 'input()', color: '#345a04', desc: 'Always a str', examples: '"12" · "Ilse"' },
      { name: 'int(input())', color: '#8a6000', desc: 'A whole number', examples: '12' },
      { name: 'float(input())', color: '#a8423c', desc: 'A decimal number', examples: '12.5' },
      { name: 'ValueError', color: '#242820', desc: 'When the text is not a number', examples: 'int("twelve")' },
    ],
    tip: 'When you press Run, the console will ask you. Type your answer after the prompt and press Enter.',
  },
  experiment: {
    heading: 'Answer the vessel.',
    lede: 'Run it and answer in the console. Then break it on purpose.',
    steps: ['Run it and answer both questions.', 'Remove `int( ... )` around the second `input()`. Run with `5`. Why do you get `55555...`?', 'Put `int()` back, run, and type `five` for the seeds. Read the ValueError.', 'Change it to `float()` and plant `2.5` seeds.'],
    tip: '`"5" * 2` is `"55"`: multiplying text repeats it. That is why converting matters.',
    code: 'name = input("Pilot name: ")\nseeds = int(input("Seeds to plant: "))\n\nprint("Welcome,", name)\nprint("In a week you will have", seeds * 2, "seedlings")\n',
  },
  practice: {
    heading: 'Greet the pilot.',
    lede: 'Ask for the pilot\'s name, then greet them by it.',
    steps: ['ask with `input()` (any prompt you like)', 'print `Welcome aboard, <name>!` with their name in place of `<name>`'],
    starter: '# Ask for a name, then greet the pilot\n',
    inputs: ['Ilse'],
    checks: [
      { kind: 'source', label: 'Uses input()', matches: 'input\\(' },
      { kind: 'cases', label: 'Greets "Ilse" as "Welcome aboard, Ilse!"', cases: [{ inputs: ['Ilse'], regex: 'Welcome aboard, Ilse!' }] },
      { kind: 'cases', label: 'Works for any name (hidden cases)', cases: [{ inputs: ['Tomas'], regex: 'Welcome aboard, Tomas!' }, { inputs: ['Mei Lin'], regex: 'Welcome aboard, Mei Lin!' }], fail: 'Use the variable holding the answer, not a fixed name.' },
    ],
    hints: ['Store the answer: `name = input("Name: ")`.', 'An f-string puts a variable inside text: `f"Welcome aboard, {name}!"`.', '`print(f"Welcome aboard, {name}!")` (or `print("Welcome aboard, " + name + "!")`).'],
  },
  challenge: {
    heading: 'The fuel calculator crashes.',
    lede: 'It should ask for the fuel in the tank and the fuel each jump uses (both whole litres), then say how many **whole** jumps are possible. Run it and fix it.',
    note: 'Example: 100 in the tank, 30 per jump → `You can make 3 jumps`.',
    starter: 'tank = input("Fuel in tank (litres): ")\nper_jump = input("Fuel per jump (litres): ")\njumps = tank // per_jump\nprint("You can make", jumps, "jumps")\n',
    inputs: ['100', '30'],
    checks: [
      { kind: 'runs', label: 'Runs without a traceback (with 100 and 30)' },
      { kind: 'cases', label: '100 and 30 → 3 jumps', cases: [{ inputs: ['100', '30'], regex: 'You can make 3(\\.0)? jumps' }] },
      { kind: 'cases', label: 'Right for other tanks (hidden cases)', cases: [{ inputs: ['45', '9'], regex: 'You can make 5(\\.0)? jumps' }, { inputs: ['7', '10'], regex: 'You can make 0(\\.0)? jumps' }] },
    ],
    hints: ['The traceback says `//` does not work on two strs. Where do the strs come from?', 'Convert each answer with `int(...)` before dividing.', 'Wrap each input: `tank = int(input("Fuel in tank (litres): "))`, and the same for `per_jump`.'],
  },
  quiz: [
    { q: 'You type 42 at an input() prompt. What is the type of the result?', opts: ["<class 'int'>", "<class 'str'>", 'It depends on what you type'], a: 1, why: 'input() always returns text. Convert it with int() or float() to get a number.' },
    { q: 'What does int("4.5") do?', opts: ['Gives 4', 'Gives 4.5', 'Raises ValueError'], a: 2, why: 'int() only reads whole-number text. Use float("4.5"), or int(float("4.5")) to drop the fraction.' },
    { q: 'Which line asks a question and gets a whole number?', opts: ['n = input(int("How many? "))', 'n = int(input("How many? "))', 'n = int("How many? ")'], a: 1, why: 'Ask first with input(), then convert the answer with int(). The order of the brackets matters.' },
  ],
};

export const GALAXY_01: Lesson[] = [hello, variables, types, operators, input];
export const lessonById = (id: string) => GALAXY_01.find((l) => l.id === id);
