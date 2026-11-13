import type { Solutions } from './types';

export const G03: Solutions = {
  'g03-l01': {
    practice: ['readings = [21.5, 23.0, 19.5, 24.0]\nreadings.append(22.0)\naverage = sum(readings) / len(readings)\nhighest = max(readings)\nprint("Average:", average, "Highest:", highest)\n'],
    challenge: ['plants = ["fern", "wilted", "wilted", "moss", "wilted"]\nhealthy = []\nfor p in plants:\n    if p != "wilted":\n        healthy.append(p)\nplants = healthy\nprint(plants)\n', 'plants = ["fern", "wilted", "wilted", "moss", "wilted"]\nplants = [p for p in plants if p != "wilted"]\n', 'plants = ["fern", "wilted", "wilted", "moss", "wilted"]\nwhile "wilted" in plants:\n    plants.remove("wilted")\n'],
    wrong: { practice: ['readings = [21.5, 23.0, 19.5, 24.0]\naverage = sum(readings) / len(readings)\nhighest = max(readings)\n'], challenge: ['plants = ["fern", "moss"]\n'] },
  },
  'g03-l02': {
    practice: ['position = (3, 7)\nx, y = position\ndistance_sq = x * x + y * y\nmoved = (x + 1, y)\nprint(x, y, distance_sq, moved)\n'],
    challenge: ['left = "Moss"\nright = "Fern"\nleft, right = right, left\nprint("Left:", left, "Right:", right)\n', 'left = "Moss"\nright = "Fern"\ntemp = left\nleft = right\nright = temp\n'],
    wrong: { practice: ['position = (3, 7)\nx, y = position\ndistance_sq = 58\nmoved = [x + 1, y]\n'], challenge: ['left = "Fern"\nright = "Moss"\n'] },
  },
  'g03-l03': {
    practice: ['inventory = {"fern": 12, "moss": 5}\ninventory["starwort"] = 8\ninventory["fern"] += 3\ntotal = sum(inventory.values())\nprint(inventory, total)\n'],
    challenge: ['seen = ["fern", "moss", "fern", "oak", "fern"]\ncounts = {}\nfor species in seen:\n    counts[species] = counts.get(species, 0) + 1\nprint(counts)\n', 'seen = ["fern", "moss", "fern", "oak", "fern"]\ncounts = {}\nfor s in seen:\n    if s in counts:\n        counts[s] += 1\n    else:\n        counts[s] = 1\n'],
    wrong: { practice: ['inventory = {"fern": 15, "moss": 5, "starwort": 8}\ntotal = 28\n'] },
  },
  'g03-l04': {
    practice: ['deck_a = {"fern", "moss", "oak"}\ndeck_b = {"oak", "ivy", "fern"}\nboth = deck_a & deck_b\neither = deck_a | deck_b\nonly_a = deck_a - deck_b\nprint(sorted(both), sorted(either), sorted(only_a))\n', 'deck_a = {"fern", "moss", "oak"}\ndeck_b = {"oak", "ivy", "fern"}\nboth = deck_a.intersection(deck_b)\neither = deck_a.union(deck_b)\nonly_a = deck_a.difference(deck_b)\n'],
    challenge: ['tags = ["rare", "shade", "rare", "edible", "shade"]\nunique_count = len(set(tags))\nhas_edible = "edible" in tags\nprint(unique_count, has_edible)\n'],
    wrong: { practice: ['deck_a = {"fern", "moss", "oak"}\ndeck_b = {"oak", "ivy", "fern"}\nboth = ["fern", "oak"]\neither = ["fern", "moss", "oak", "ivy"]\nonly_a = ["moss"]\n'], challenge: ['tags = ["rare", "shade", "rare", "edible", "shade"]\nunique_count = 3\nhas_edible = True\n'] },
  },
  'g03-l05': {
    practice: ['log = "2026-11-13 Moonfern bloomed"\ndate = log[:10]\nevent = log[11:]\nyear = int(log[:4])\nprint(date, "|", event, "|", year)\n', 'log = "2026-11-13 Moonfern bloomed"\ndate, event = log.split(" ", 1)\nyear = int(date.split("-")[0])\n'],
    challenge: ['readings = [18, 19, 21, 24, 22, 20]\nrecent = readings[-3:]\nnewest_first = readings[::-1]\nprint(recent, newest_first)\n', 'readings = [18, 19, 21, 24, 22, 20]\nrecent = readings[len(readings) - 3:]\nnewest_first = list(reversed(readings))\n'],
  },
  'g03-l06': {
    practice: ['temps_c = [21, 25, 18, 30]\ntemps_f = [c * 9 / 5 + 32 for c in temps_c]\nhot = [c for c in temps_c if c > 24]\nprint(temps_f, hot)\n'],
    challenge: ['names = ["fern", "moss", "starwort", "ivy", "moonfern"]\nlengths = {n: len(n) for n in names}\nlong_names = [n for n in names if len(n) > 4]\nprint(lengths, long_names)\n'],
    wrong: { practice: ['temps_c = [21, 25, 18, 30]\ntemps_f = []\nhot = []\nfor c in temps_c:\n    temps_f.append(c * 9 / 5 + 32)\n    if c > 24:\n        hot.append(c)\n'] },
  },
};
