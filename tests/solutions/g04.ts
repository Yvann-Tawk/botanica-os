import type { Solutions } from './types';

export const G04: Solutions = {
  'g04-l01': {
    practice: ['def water(plant):\n    print("Watering", plant)\n\nwater("fern")\nwater("moss")\nwater("oak")\n', 'def water(plant):\n    print(f"Watering {plant}")\n\nfor p in ["fern", "moss", "oak"]:\n    water(p)\n'],
    challenge: ['def report():\n    print("All decks green")\n\nreport()\nreport()\n'],
    wrong: { practice: ['print("Watering fern")\nprint("Watering moss")\nprint("Watering oak")\n'] },
  },
  'g04-l02': {
    practice: ['def seeds_needed(planters, per_planter=3):\n    return planters * per_planter\n\nprint(seeds_needed(5))\nprint(seeds_needed(4, per_planter=2))\n'],
    challenge: ['def area(width, length):\n    return width * length\n\ntotal = area(3, 4) + area(2, 2)\nprint("Total area:", total)\n'],
    wrong: { practice: ['def seeds_needed(planters, per_planter=3):\n    print(planters * per_planter)\n'], challenge: ['def area(width, length):\n    print(width * length)\ntotal = 16\nprint("Total area:", total)\n'] },
  },
  'g04-l03': {
    practice: ['label = "unchanged"\n\ndef describe(name):\n    label = name.upper()\n    return f"[{label}]"\n\nprint(describe("fern"))\nprint(label)\n'],
    challenge: ['visits = 0\n\ndef log_visit(visits):\n    return visits + 1\n\nvisits = log_visit(visits)\nvisits = log_visit(visits)\nprint("Visits:", visits)\n', 'visits = 0\n\ndef log_visit():\n    global visits\n    visits = visits + 1\n\nlog_visit()\nlog_visit()\nprint("Visits:", visits)\n'],
    wrong: { practice: ['label = "unchanged"\n\ndef describe(name):\n    global label\n    label = name.upper()\n    return f"[{label}]"\n\nprint(describe("fern"))\n'] },
  },
  'g04-l04': {
    practice: ['def total(*amounts):\n    return sum(amounts)\n\ndef heaviest(*amounts):\n    if not amounts:\n        return None\n    return max(amounts)\n\nprint(total(3, 4, 5), heaviest(3, 9, 2), heaviest())\n', 'def total(*a):\n    t = 0\n    for x in a:\n        t += x\n    return t\n\ndef heaviest(*a):\n    return max(a) if a else None\n'],
    challenge: ['def make_tag(name, **traits):\n    if not traits:\n        return name\n    details = ", ".join(f"{k}={v}" for k, v in traits.items())\n    return f"{name}: {details}"\n\nprint(make_tag("fern", color="green", size="small"))\nprint(make_tag("moss"))\n'],
    wrong: { practice: ['def total(a, b, c):\n    return a + b + c\n\ndef heaviest(*amounts):\n    return max(amounts)\n'] },
  },
  'g04-l05': {
    practice: ['import math\nradius = 2.5\narea = math.pi * radius ** 2\nrounded = round(area, 2)\nside = math.sqrt(area)\nprint(rounded, round(side, 3))\n', 'from math import pi, sqrt\nradius = 2.5\narea = pi * radius * radius\nrounded = round(area, 2)\nside = sqrt(area)\n'],
    challenge: ['import random\nfrom math import sqrt\nrandom.seed(7)\nroot = sqrt(16)\nplants = ["fern", "moss", "oak", "ivy"]\npick = random.choice(plants)\nprint(root, pick)\n', 'import random, math\nsqrt = math.sqrt\nrandom.seed(7)\nroot = sqrt(16)\nplants = ["fern", "moss", "oak", "ivy"]\npick = random.choice(plants)\n'],
    wrong: { practice: ['radius = 2.5\narea = 3.14 * radius ** 2\nrounded = round(area, 2)\nside = area ** 0.5\n'] },
  },
  'g04-l06': {
    practice: ['plants = [("fern", 30), ("moss", 5), ("oak", 120), ("ivy", 45)]\nby_height = sorted(plants, key=lambda p: p[1])\ntallest_first = sorted(plants, key=lambda p: p[1], reverse=True)\ntallest = max(plants, key=lambda p: p[1])[0]\nprint(by_height, tallest)\n', 'plants = [("fern", 30), ("moss", 5), ("oak", 120), ("ivy", 45)]\nby_height = sorted(plants, key=lambda p: p[1])\ntallest_first = by_height[::-1]\ntallest = tallest_first[0][0]\n'],
    challenge: ['names = ["fern", "Moss", "ivy", "Starwort", "aloe"]\nordered = sorted(names, key=str.lower)\nlong_names = [n for n in ordered if len(n) > 4]\nprint(ordered, long_names)\n', 'names = ["fern", "Moss", "ivy", "Starwort", "aloe"]\nordered = sorted(names, key=lambda n: n.lower())\nlong_names = list(filter(lambda n: len(n) > 4, ordered))\n'],
    wrong: { practice: ['plants = [("fern", 30), ("moss", 5), ("oak", 120), ("ivy", 45)]\nby_height = sorted(plants)\ntallest_first = sorted(plants, reverse=True)\ntallest = "oak"\n'] },
  },
};
