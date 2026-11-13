// Galaxy 03 · The Archives: collections.
import type { Lesson } from './types';

const lists: Lesson = {
  id: 'g03-l01', conceptId: 'archives.1', number: 1, title: 'Lists', minutes: 18, xp: 175, difficulty: 2,
  description: 'Keep many values in order, change them, and loop over them.',
  objectives: ['make a list and read items by index (from 0, and from the end with -1)', 'change a list with `append`, `remove` and assignment', 'use `len`, `sum`, `min` and `max` on a list'],
  discover: {
    heading: 'Strata of stored things.',
    lede: 'A **list** holds values in order inside square brackets. Positions (indexes) start at **0**; `-1` is the last item. Lists can change: add with `append`, take out with `remove` or `pop`, or replace an item by assigning to its index.',
    example: 'readings = [21.5, 23.0, 19.5]\nprint(readings[0])        # 21.5: the first\nprint(readings[-1])       # 19.5: the last\n\nreadings.append(24.0)\nreadings[1] = 22.5\nprint(readings, len(readings))\nprint("max", max(readings), "average", sum(readings) / len(readings))\n\nfor r in readings:\n    print("reading:", r)\n',
    tagsHeading: 'Everyday list moves',
    tags: [
      { name: 'xs[0] xs[-1]', color: '#345a04', desc: 'First and last item', examples: '[4, 7][-1] → 7' },
      { name: '.append(x)', color: '#8a6000', desc: 'Add to the end', examples: 'xs.append(3)' },
      { name: '.remove(x)', color: '#a8423c', desc: 'Take out the first x', examples: 'xs.remove("moss")' },
      { name: 'len sum min max', color: '#242820', desc: 'Measure the whole list', examples: 'sum([1, 2]) → 3' },
    ],
    tip: 'Asking for a position that does not exist (`xs[10]` in a short list) raises an IndexError. The last valid index is `len(xs) - 1`.',
  },
  experiment: {
    heading: 'Shuffle the shelf.',
    lede: 'Run it, then change the list.',
    steps: ['Run it as it is.', 'Append `"ivy"` and print the list again.', 'Print `shelf[5]` and read the IndexError.', 'Try `shelf.sort()` and print it.'],
    code: 'shelf = ["fern", "moss", "oak"]\nprint(shelf[0], shelf[-1], len(shelf))\nshelf.append("starwort")\nshelf.remove("moss")\nprint(shelf)\nfor plant in shelf:\n    print("-", plant)\n',
  },
  practice: {
    heading: 'Summarise the readings.',
    lede: 'A new reading of **22.0** just arrived. Add it to `readings`, then store the `average` and the `highest` reading. The checks also try other logs.',
    starter: 'readings = [21.5, 23.0, 19.5, 24.0]\n\n# add 22.0, then compute average and highest\n\nprint("Average:", average, "Highest:", highest)\n',
    checks: [
      { kind: 'var', label: 'readings now ends with 22.0', name: 'readings', type: 'list', equals: [21.5, 23.0, 19.5, 24.0, 22.0] },
      { kind: 'var', label: 'average is 22.0', name: 'average', type: 'float', equals: 22.0 },
      { kind: 'var', label: 'highest is 24.0', name: 'highest', equals: 24.0 },
      { kind: 'variants', label: 'Right for other logs (hidden cases)', variants: [{ set: { readings: [10.0, 30.0] }, expect: { average: 20.666666666666668, highest: 30.0 } }, { set: { readings: [25.5] }, expect: { average: 23.75, highest: 25.5 } }] },
    ],
    hints: ['`readings.append(22.0)` first, so the new value counts.', '`average = sum(readings) / len(readings)`', '`highest = max(readings)`'],
  },
  challenge: {
    heading: 'Some wilted plants survive the sweep.',
    lede: 'The sweep should leave only healthy plants in `plants`, but some `"wilted"` ones remain. Fix it.',
    note: 'Removing items from a list while looping over that same list makes the loop skip items.',
    starter: 'plants = ["fern", "wilted", "wilted", "moss", "wilted"]\n\nfor p in plants:\n    if p == "wilted":\n        plants.remove(p)\n\nprint(plants)\n',
    checks: [
      { kind: 'var', label: 'plants is ["fern", "moss"]', name: 'plants', type: 'list', equals: ['fern', 'moss'] },
      { kind: 'variants', label: 'Right for other shelves (hidden cases)', variants: [
        { set: { plants: ['wilted', 'wilted', 'wilted'] }, expect: { plants: [] } },
        { set: { plants: ['oak', 'wilted', 'ivy', 'wilted', 'wilted', 'fern'] }, expect: { plants: ['oak', 'ivy', 'fern'] } },
      ] },
    ],
    hints: ['Print `plants` inside the loop to watch it skip.', 'Build a new list instead of changing the one you are looping over.', '`healthy = []` / `for p in plants:` / `    if p != "wilted": healthy.append(p)` / then `plants = healthy`.'],
  },
  quiz: [
    { q: 'xs = [5, 8, 2]. What is xs[1]?', opts: ['5', '8', '2'], a: 1, why: 'Indexes start at 0, so position 1 is the second item.' },
    { q: 'What does xs[-1] give?', opts: ['The first item', 'The last item', 'An error'], a: 1, why: 'Negative indexes count from the end.' },
    { q: 'After xs = [1, 2]; xs.append([3]), what is len(xs)?', opts: ['3', '4', '2'], a: 0, why: 'append adds one item: here, the list [3] as a single element.' },
  ],
};

const tuples: Lesson = {
  id: 'g03-l02', conceptId: 'archives.2', number: 2, title: 'Tuples', minutes: 15, xp: 175, difficulty: 2,
  description: 'Fixed groups of values, and unpacking them into names.',
  objectives: ['make a tuple and read it like a list', 'know that tuples cannot be changed', 'unpack a tuple into several names, and swap two values'],
  discover: {
    heading: 'Pressed between glass.',
    lede: 'A **tuple** is an ordered group in round brackets that **cannot change** after it is made: good for things that belong together, like a coordinate. You can **unpack** a tuple into separate names in one line, which also gives Python its tidy swap.',
    example: 'position = (3, 7)\nx, y = position                # unpacking\nprint("x is", x, "and y is", y)\n\nmoved = (x + 1, y)             # make a new tuple instead of changing one\nprint(moved)\n\nleft, right = "moss", "fern"\nleft, right = right, left      # swap in one line\nprint(left, right)\n',
    tagsHeading: 'Tuple facts',
    tags: [
      { name: '(3, 7)', color: '#345a04', desc: 'A pair', examples: 'p[0] → 3' },
      { name: 'x, y = p', color: '#8a6000', desc: 'Unpack into names', examples: 'counts must match' },
      { name: 'a, b = b, a', color: '#a8423c', desc: 'Swap without a temp', examples: 'tidy and safe' },
      { name: 'immutable', color: '#242820', desc: 'p[0] = 5 → TypeError', examples: 'make a new one' },
    ],
    tip: 'A one-item tuple needs a comma: `(5,)`. Without it, `(5)` is just the number 5 in brackets.',
  },
  experiment: {
    heading: 'Try to bend it.',
    lede: 'Run it, then try to change a tuple.',
    steps: ['Run it as it is.', 'Add `position[0] = 10` and read the TypeError.', 'Try `a, b = (1, 2, 3)` and read the ValueError.', 'Print `type((5))` and `type((5,))`.'],
    code: 'position = (3, 7)\nx, y = position\nprint(x, y, position[0], len(position))\nleft, right = "moss", "fern"\nleft, right = right, left\nprint(left, right)\n',
  },
  practice: {
    heading: 'Plot the drone.',
    lede: 'Unpack `position` into `x` and `y`, store the squared distance from the origin in `distance_sq` (x² + y²), and make `moved` a **new tuple** one step to the right (x + 1, same y).',
    starter: 'position = (3, 7)\n\n# unpack, then compute distance_sq and moved\n\nprint(x, y, distance_sq, moved)\n',
    checks: [
      { kind: 'var', label: 'x is 3 and y is 7', name: 'y', type: 'int', equals: 7 },
      { kind: 'var', label: 'distance_sq is 58', name: 'distance_sq', type: 'int', equals: 58 },
      { kind: 'var', label: 'moved is the tuple (4, 7)', name: 'moved', type: 'tuple', equals: [4, 7] },
      { kind: 'variants', label: 'Right for other positions (hidden cases)', variants: [{ set: { position: { __tuple__: [0, 0] } }, expect: { distance_sq: 0, moved: [1, 0] } }, { set: { position: { __tuple__: [-2, 5] } }, expect: { distance_sq: 29, moved: [-1, 5] } }] },
    ],
    hints: ['`x, y = position`', '`distance_sq = x * x + y * y` (or `x ** 2 + y ** 2`)', '`moved = (x + 1, y)`'],
  },
  challenge: {
    heading: 'Both shelves say Fern.',
    lede: 'The two labels should swap places, but after the swap both read `"Fern"`. Fix it.',
    starter: 'left = "Moss"\nright = "Fern"\n\nleft = right\nright = left\n\nprint("Left:", left, "Right:", right)\n',
    checks: [
      { kind: 'var', label: 'left is "Fern"', name: 'left', equals: 'Fern' },
      { kind: 'var', label: 'right is "Moss"', name: 'right', equals: 'Moss' },
      { kind: 'variants', label: 'Swaps any two labels (hidden cases)', variants: [{ set: { left: 'Oak', right: 'Ivy' }, expect: { left: 'Ivy', right: 'Oak' } }] },
    ],
    hints: ['After `left = right`, what is the old value of left?', 'You could save it in a temporary name first.', 'Or the tuple way: `left, right = right, left`.'],
  },
  quiz: [
    { q: 'What happens with p = (1, 2); p[0] = 9?', opts: ['p becomes (9, 2)', 'TypeError', 'Nothing'], a: 1, why: 'Tuples cannot be changed in place.' },
    { q: 'Which is a one-item tuple?', opts: ['(5)', '(5,)', '[5]'], a: 1, why: 'The comma makes the tuple; (5) is just 5.' },
    { q: 'After a, b = 1, 2 then a, b = b, a, what is a?', opts: ['1', '2', 'An error'], a: 1, why: 'The right side (2, 1) is built first, then unpacked.' },
  ],
};

const dicts: Lesson = {
  id: 'g03-l03', conceptId: 'archives.3', number: 3, title: 'Dictionaries', minutes: 20, xp: 175, difficulty: 2,
  description: 'Look values up by name: keys and values.',
  objectives: ['make a dictionary and read a value by its key', 'add, update and safely read keys with `.get`', 'loop over keys and values with `.items()`'],
  discover: {
    heading: 'The card catalogue.',
    lede: 'A **dictionary** maps **keys** to **values**: `{"fern": 12}`. Look up with `d["fern"]`, add or change with `d["moss"] = 5`. Asking for a missing key raises a KeyError, so use `d.get(key, default)` when it might not be there.',
    example: 'inventory = {"fern": 12, "moss": 5}\nprint(inventory["fern"])            # 12\ninventory["starwort"] = 8           # add\ninventory["fern"] += 3              # update\nprint(inventory.get("ivy", 0))      # 0: missing, so the default\n\nfor plant, count in inventory.items():\n    print(plant, "→", count)\nprint("total", sum(inventory.values()))\n',
    tagsHeading: 'Catalogue moves',
    tags: [
      { name: 'd[key]', color: '#345a04', desc: 'Read (KeyError if missing)', examples: 'd["fern"]' },
      { name: 'd[key] = v', color: '#8a6000', desc: 'Add or replace', examples: 'd["ivy"] = 2' },
      { name: 'd.get(k, 0)', color: '#a8423c', desc: 'Read with a fallback', examples: 'no KeyError' },
      { name: '.items()', color: '#242820', desc: 'Pairs to loop over', examples: 'for k, v in d.items()' },
    ],
    tip: 'Keys are unique: assigning to an existing key replaces its value. `key in d` asks whether a key exists.',
  },
  experiment: {
    heading: 'Catalogue a few specimens.',
    lede: 'Run it, then add and look things up.',
    steps: ['Run it as it is.', 'Print `inventory["ivy"]` and read the KeyError.', 'Use `.get("ivy", 0)` instead.', 'Add `"oak": 2` and loop again.'],
    code: 'inventory = {"fern": 12, "moss": 5}\ninventory["starwort"] = 8\nprint(inventory)\nprint("fern" in inventory, "ivy" in inventory)\nfor plant, count in inventory.items():\n    print(plant, count)\n',
  },
  practice: {
    heading: 'Update the seed inventory.',
    lede: 'Add **8 starwort**, add **3** more fern to the existing count, then store the number of seeds across every plant in `total`.',
    starter: 'inventory = {"fern": 12, "moss": 5}\n\n# update the inventory, then compute total\n\nprint(inventory, total)\n',
    checks: [
      { kind: 'var', label: 'inventory is fern 15, moss 5, starwort 8', name: 'inventory', type: 'dict', equals: { fern: 15, moss: 5, starwort: 8 } },
      { kind: 'var', label: 'total is 28', name: 'total', type: 'int', equals: 28 },
      { kind: 'variants', label: 'Works from other starting stock (hidden cases)', variants: [{ set: { inventory: { fern: 1, oak: 4 } }, expect: { total: 16, inventory: { fern: 4, oak: 4, starwort: 8 } } }] },
    ],
    hints: ['`inventory["starwort"] = 8`', '`inventory["fern"] += 3`', '`total = sum(inventory.values())`'],
  },
  challenge: {
    heading: 'The species counter crashes.',
    lede: 'Count how often each species was seen and store the counts in `counts`. It crashes on the very first sighting. Fix it.',
    starter: 'seen = ["fern", "moss", "fern", "oak", "fern"]\ncounts = {}\n\nfor species in seen:\n    counts[species] += 1\n\nprint(counts)\n',
    checks: [
      { kind: 'runs', label: 'Runs without a KeyError' },
      { kind: 'var', label: 'counts is fern 3, moss 1, oak 1', name: 'counts', type: 'dict', equals: { fern: 3, moss: 1, oak: 1 } },
      { kind: 'variants', label: 'Right for other logs (hidden cases)', variants: [{ set: { seen: [] }, expect: { counts: {} } }, { set: { seen: ['ivy', 'ivy'] }, expect: { counts: { ivy: 2 } } }] },
    ],
    hints: ['The first time a species appears, it has no count yet.', 'Read with a default: `counts.get(species, 0)`.', '`counts[species] = counts.get(species, 0) + 1`'],
  },
  quiz: [
    { q: 'd = {"a": 1}. What does d.get("b", 0) give?', opts: ['KeyError', '0', 'None'], a: 1, why: 'get returns the default when the key is missing.' },
    { q: 'What happens with d["a"] = 5 when "a" already exists?', opts: ['A second "a" is added', 'The value is replaced', 'KeyError'], a: 1, why: 'Keys are unique; assignment replaces the value.' },
    { q: 'What does for k, v in d.items() give each pass?', opts: ['A key and its value', 'Only keys', 'Index and key'], a: 0, why: 'items() yields (key, value) pairs.' },
  ],
};

const sets: Lesson = {
  id: 'g03-l04', conceptId: 'archives.4', number: 4, title: 'Sets', minutes: 15, xp: 175, difficulty: 2,
  description: 'Unique items, fast membership, and comparing groups.',
  objectives: ['remove duplicates by making a set', 'test membership with `in`', 'combine groups with `|`, `&` and `-`'],
  discover: {
    heading: 'One of each.',
    lede: 'A **set** keeps each value once and has no order. It answers "is this in there?" quickly, and compares groups: **union** `|` (in either), **intersection** `&` (in both), **difference** `-` (in the first but not the second).',
    example: 'tags = ["rare", "shade", "rare", "edible"]\nunique = set(tags)\nprint(unique, len(unique))          # 3 unique tags\nprint("edible" in unique)           # True\n\ndeck_a = {"fern", "moss", "oak"}\ndeck_b = {"oak", "ivy", "fern"}\nprint(deck_a & deck_b)              # in both\nprint(deck_a | deck_b)              # in either\nprint(deck_a - deck_b)              # only on deck A\n',
    tagsHeading: 'Set operations',
    tags: [
      { name: 'set(xs)', color: '#345a04', desc: 'Drop duplicates', examples: '{1, 2}' },
      { name: 'a & b', color: '#8a6000', desc: 'In both', examples: 'intersection' },
      { name: 'a | b', color: '#a8423c', desc: 'In either', examples: 'union' },
      { name: 'a - b', color: '#242820', desc: 'In a, not in b', examples: 'difference' },
    ],
    tip: '`{}` is an empty **dict**. An empty set is `set()`.',
  },
  experiment: {
    heading: 'Compare the decks.',
    lede: 'Run it and change the decks.',
    steps: ['Run it as it is.', 'Add `"ivy"` to deck A. Which results change?', 'Print `deck_b - deck_a`.', 'Try `deck_a[0]` and read the TypeError: sets have no positions.'],
    code: 'deck_a = {"fern", "moss", "oak"}\ndeck_b = {"oak", "ivy", "fern"}\nprint("both:", sorted(deck_a & deck_b))\nprint("either:", sorted(deck_a | deck_b))\nprint("only A:", sorted(deck_a - deck_b))\n',
  },
  practice: {
    heading: 'Compare two decks.',
    lede: 'Store the plants on **both** decks in `both`, on **either** deck in `either`, and on deck A **only** in `only_a`. The checks also try other decks.',
    starter: 'deck_a = {"fern", "moss", "oak"}\ndeck_b = {"oak", "ivy", "fern"}\n\n# both = ...\n# either = ...\n# only_a = ...\n\nprint(sorted(both), sorted(either), sorted(only_a))\n',
    checks: [
      { kind: 'var', label: 'both is {fern, oak}', name: 'both', type: 'set', equals: ['fern', 'oak'] },
      { kind: 'var', label: 'either has all four', name: 'either', type: 'set', equals: ['fern', 'moss', 'oak', 'ivy'] },
      { kind: 'var', label: 'only_a is {moss}', name: 'only_a', type: 'set', equals: ['moss'] },
      { kind: 'variants', label: 'Right for other decks (hidden cases)', variants: [{ set: { deck_a: { __set__: [1, 2] }, deck_b: { __set__: [3] } }, expect: { both: [], either: [1, 2, 3], only_a: [1, 2] } }] },
    ],
    hints: ['Use the operators on the two sets.', '`both = deck_a & deck_b`, `either = deck_a | deck_b`', '`only_a = deck_a - deck_b`'],
  },
  challenge: {
    heading: 'The tag report double counts.',
    lede: 'Store how many **different** tags there are in `unique_count`, and whether `"edible"` is among them in `has_edible`. The report counts repeats.',
    starter: 'tags = ["rare", "shade", "rare", "edible", "shade"]\n\nunique_count = len(tags)\nhas_edible = tags.count("edible")\n\nprint(unique_count, has_edible)\n',
    checks: [
      { kind: 'var', label: 'unique_count is 3', name: 'unique_count', type: 'int', equals: 3 },
      { kind: 'var', label: 'has_edible is True (a bool)', name: 'has_edible', type: 'bool', equals: true },
      { kind: 'variants', label: 'Right for other tags (hidden cases)', variants: [{ set: { tags: [] }, expect: { unique_count: 0, has_edible: false } }, { set: { tags: ['edible', 'edible'] }, expect: { unique_count: 1, has_edible: true } }] },
    ],
    hints: ['A set drops repeats.', '`unique_count = len(set(tags))`', '`has_edible = "edible" in tags` gives a real bool.'],
  },
  quiz: [
    { q: 'What is len(set([1, 1, 2]))?', opts: ['3', '2', '1'], a: 1, why: 'The set keeps 1 and 2 once each.' },
    { q: 'What does {} create?', opts: ['An empty set', 'An empty dict', 'An empty list'], a: 1, why: 'Use set() for an empty set.' },
    { q: 'a = {1, 2, 3}, b = {2, 3, 4}. What is a - b?', opts: ['{1}', '{4}', '{1, 4}'], a: 0, why: 'Difference keeps what is in a but not in b.' },
  ],
};

const slicing: Lesson = {
  id: 'g03-l05', conceptId: 'archives.5', number: 5, title: 'Slicing', minutes: 15, xp: 175, difficulty: 2,
  description: 'Cut out parts of lists and strings with [start:stop:step].',
  objectives: ['take a slice `[start:stop]` and know stop is excluded', 'leave out start or stop, and use negative positions', 'step through with `[::step]`, including `[::-1]` to reverse'],
  discover: {
    heading: 'Core samples.',
    lede: 'A **slice** copies part of a list or string: `xs[start:stop]` takes from `start` up to (not including) `stop`. Leave either out to go from the beginning or to the end. Negative numbers count from the end, and a third number is the step.',
    example: 'log = "2026-11-13 Moonfern bloomed"\nprint(log[:10])        # 2026-11-13\nprint(log[11:])        # Moonfern bloomed\nprint(log[:4])         # 2026\n\nreadings = [18, 19, 21, 24, 22, 20]\nprint(readings[-3:])   # last three\nprint(readings[::2])   # every other one\nprint(readings[::-1])  # reversed copy\n',
    tagsHeading: 'Slice shapes',
    tags: [
      { name: 'xs[a:b]', color: '#345a04', desc: 'From a up to b - 1', examples: '"fern"[1:3] → "er"' },
      { name: 'xs[:b] xs[a:]', color: '#8a6000', desc: 'From start / to end', examples: '"fern"[2:] → "rn"' },
      { name: 'xs[-3:]', color: '#a8423c', desc: 'The last three', examples: 'negative = from end' },
      { name: 'xs[::-1]', color: '#242820', desc: 'A reversed copy', examples: '"oak" → "kao"' },
    ],
    tip: 'Slices never raise IndexError: going past the end just gives you what is there.',
  },
  experiment: {
    heading: 'Take samples.',
    lede: 'Change the numbers and predict each slice.',
    steps: ['Run it as it is.', 'Print `log[5:7]`: which part of the date is it?', 'Print `readings[1:-1]`.', 'Print `readings[100:]`: no error, just an empty list.'],
    code: 'log = "2026-11-13 Moonfern bloomed"\nprint(log[:10], "|", log[11:])\nreadings = [18, 19, 21, 24, 22, 20]\nprint(readings[-3:], readings[::2], readings[::-1])\n',
  },
  practice: {
    heading: 'Parse the logbook line.',
    lede: 'Every log line starts with a 10-character date, a space, then the event. Store the `date`, the `event` and the `year` (as an int).',
    starter: 'log = "2026-11-13 Moonfern bloomed"\n\n# date = ...\n# event = ...\n# year = ...\n\nprint(date, "|", event, "|", year)\n',
    checks: [
      { kind: 'var', label: 'date is "2026-11-13"', name: 'date', equals: '2026-11-13' },
      { kind: 'var', label: 'event is "Moonfern bloomed"', name: 'event', equals: 'Moonfern bloomed' },
      { kind: 'var', label: 'year is the int 2026', name: 'year', type: 'int', equals: 2026 },
      { kind: 'variants', label: 'Works for other log lines (hidden cases)', variants: [{ set: { log: '1999-01-02 Ivy rescued' }, expect: { date: '1999-01-02', event: 'Ivy rescued', year: 1999 } }] },
    ],
    hints: ['The date is the first 10 characters: `log[:10]`.', 'The event starts after the space at position 10: `log[11:]`.', '`year = int(log[:4])`'],
  },
  challenge: {
    heading: 'The recent-readings panel is wrong.',
    lede: 'The panel should show the **last three** readings in `recent` and the whole log **newest first** in `newest_first`. Fix both slices so they work for any length of log.',
    starter: 'readings = [18, 19, 21, 24, 22, 20]\n\nrecent = readings[3:6]\nnewest_first = readings[5:0:-1]\n\nprint(recent, newest_first)\n',
    checks: [
      { kind: 'var', label: 'recent is [24, 22, 20]', name: 'recent', equals: [24, 22, 20] },
      { kind: 'var', label: 'newest_first is the full log reversed', name: 'newest_first', equals: [20, 22, 24, 21, 19, 18] },
      { kind: 'variants', label: 'Right for other logs (hidden cases)', variants: [{ set: { readings: [1, 2, 3, 4, 5, 6, 7, 8] }, expect: { recent: [6, 7, 8], newest_first: [8, 7, 6, 5, 4, 3, 2, 1] } }, { set: { readings: [5] }, expect: { recent: [5], newest_first: [5] } }] },
    ],
    hints: ['Fixed positions break when the log length changes.', 'Count from the end: `readings[-3:]`.', 'A step of -1 over the whole list: `readings[::-1]`.'],
  },
  quiz: [
    { q: 'What is "botanica"[1:4]?', opts: ['"bot"', '"ota"', '"otan"'], a: 1, why: 'Positions 1, 2 and 3; position 4 is excluded.' },
    { q: 'What is [1, 2, 3, 4][-2:]?', opts: ['[3, 4]', '[1, 2]', '[4]'], a: 0, why: 'From the second-last item to the end.' },
    { q: 'What does [1, 2][5:] give?', opts: ['IndexError', '[]', 'None'], a: 1, why: 'Slices past the end are just empty.' },
  ],
};

const comps: Lesson = {
  id: 'g03-l06', conceptId: 'archives.6', number: 6, title: 'Comprehensions', minutes: 20, xp: 175, difficulty: 3,
  description: 'Build lists and dictionaries in one readable line.',
  objectives: ['write a list comprehension `[expr for x in xs]`', 'filter with `if` inside a comprehension', 'build a dictionary with `{k: v for ...}`'],
  discover: {
    heading: 'The catalogue writes itself.',
    lede: 'A **comprehension** builds a new collection from an old one in a single expression: `[c * 2 for c in xs]`. Add `if` at the end to keep only some items. Curly braces with `key: value` build a dictionary the same way.',
    example: 'temps_c = [21, 25, 18, 30]\ntemps_f = [c * 9 / 5 + 32 for c in temps_c]\nhot = [c for c in temps_c if c > 24]\nprint(temps_f)\nprint(hot)\n\nnames = ["fern", "moss", "starwort"]\nlengths = {n: len(n) for n in names}\nprint(lengths)\n',
    tagsHeading: 'Shapes',
    tags: [
      { name: '[f(x) for x in xs]', color: '#345a04', desc: 'Transform each', examples: '[x * 2 for x in xs]' },
      { name: '[x for x in xs if …]', color: '#8a6000', desc: 'Keep some', examples: '[x for x in xs if x > 0]' },
      { name: '{k: v for …}', color: '#a8423c', desc: 'Build a dict', examples: '{n: len(n) for n in ns}' },
      { name: 'same as a loop', color: '#242820', desc: 'Just shorter', examples: 'append in a for' },
    ],
    tip: 'If a comprehension stops being readable on one line, a normal loop is better. Clarity first.',
  },
  experiment: {
    heading: 'Rewrite loops as one line.',
    lede: 'Run, then change the expressions.',
    steps: ['Run it as it is.', 'Make `hot` keep temperatures of 21 and above.', 'Round each Fahrenheit value with `round(...)`.', 'Build `{n: n.upper() for n in names}`.'],
    code: 'temps_c = [21, 25, 18, 30]\ntemps_f = [c * 9 / 5 + 32 for c in temps_c]\nhot = [c for c in temps_c if c > 24]\nnames = ["fern", "moss", "starwort"]\nlengths = {n: len(n) for n in names}\nprint(temps_f, hot, lengths)\n',
  },
  practice: {
    heading: 'Convert the climate log.',
    lede: 'Using comprehensions, store every reading converted to Fahrenheit (`c * 9 / 5 + 32`) in `temps_f`, and only the readings **above 24** (in Celsius) in `hot`.',
    starter: 'temps_c = [21, 25, 18, 30]\n\n# temps_f = [...]\n# hot = [...]\n\nprint(temps_f, hot)\n',
    checks: [
      { kind: 'var', label: 'temps_f is [69.8, 77.0, 64.4, 86.0]', name: 'temps_f', type: 'list', equals: [69.8, 77.0, 64.4, 86.0] },
      { kind: 'var', label: 'hot is [25, 30]', name: 'hot', type: 'list', equals: [25, 30] },
      { kind: 'source', label: 'Uses comprehensions', matches: '\\[[^\\]]*\\bfor\\b[^\\]]*\\bin\\b' },
      { kind: 'variants', label: 'Right for other logs (hidden cases)', variants: [{ set: { temps_c: [0, 100] }, expect: { temps_f: [32.0, 212.0], hot: [100] } }, { set: { temps_c: [] }, expect: { temps_f: [], hot: [] } }] },
    ],
    hints: ['`[c * 9 / 5 + 32 for c in temps_c]`', 'Filter at the end: `[c for c in temps_c if c > 24]`.', 'Both lines start with a name and `=`, then the square brackets.'],
  },
  challenge: {
    heading: 'Index the specimen names.',
    lede: 'Build `lengths`, a dictionary from each name to its length, and `long_names`, a list of names longer than **4** letters. Use comprehensions. The loop below has a bug and is longer than it needs to be.',
    starter: 'names = ["fern", "moss", "starwort", "ivy", "moonfern"]\n\nlengths = {}\nlong_names = []\nfor n in names:\n    lengths[n] = len(names)\n    if len(n) > 4:\n        long_names.append(n)\n\nprint(lengths, long_names)\n',
    checks: [
      { kind: 'var', label: 'lengths maps each name to its length', name: 'lengths', type: 'dict', equals: { fern: 4, moss: 4, starwort: 8, ivy: 3, moonfern: 8 } },
      { kind: 'var', label: 'long_names is ["starwort", "moonfern"]', name: 'long_names', equals: ['starwort', 'moonfern'] },
      { kind: 'source', label: 'Builds the dictionary with a comprehension', matches: '\\{[^}]*:[^}]*\\bfor\\b' },
      { kind: 'variants', label: 'Right for other names (hidden cases)', variants: [{ set: { names: ['a', 'abcde'] }, expect: { lengths: { a: 1, abcde: 5 }, long_names: ['abcde'] } }] },
    ],
    hints: ['The loop uses `len(names)` where it means the length of one name.', '`lengths = {n: len(n) for n in names}`', '`long_names = [n for n in names if len(n) > 4]`'],
  },
  quiz: [
    { q: 'What is [x * 2 for x in [1, 2, 3]]?', opts: ['[1, 2, 3, 1, 2, 3]', '[2, 4, 6]', '12'], a: 1, why: 'Each item is doubled into a new list.' },
    { q: 'What is [x for x in [1, -2, 3] if x > 0]?', opts: ['[1, 3]', '[-2]', '[True, False, True]'], a: 0, why: 'The if keeps only the positive items.' },
    { q: 'What does {n: 0 for n in "ab"} build?', opts: ['{"ab": 0}', '{"a": 0, "b": 0}', '["a", "b"]'], a: 1, why: 'Each character becomes a key.' },
  ],
};

export const GALAXY_03: Lesson[] = [lists, tuples, dicts, sets, slicing, comps];
