import type { Solutions } from './types';

export const G02: Solutions = {
  'g02-l01': {
    practice: ['temperature_c = 23.5\nlight_hours = 14\nis_warm = temperature_c >= 22\nis_comfortable = 18 <= temperature_c <= 26\nneeds_light = light_hours < 12\nprint(is_warm, is_comfortable, needs_light)\n',
      'temperature_c = 23.5\nlight_hours = 14\nis_warm = not temperature_c < 22\nis_comfortable = temperature_c >= 18 and temperature_c <= 26\nneeds_light = light_hours <= 11\n'],
    challenge: ['label = "Moonfern"\ncount = 3\nready = bool(label) and count > 0\nprint("Ready to ship:", ready)\n', 'label = "Moonfern"\ncount = 3\nready = label != "" and count > 0\n'],
    wrong: { practice: ['temperature_c = 23.5\nlight_hours = 14\nis_warm = True\nis_comfortable = True\nneeds_light = False\n'], challenge: ['label = "Moonfern"\ncount = 3\nready = True\n'] },
  },
  'g02-l02': {
    practice: ['moisture = 42\nif moisture < 30:\n    status = "water now"\nelif moisture < 60:\n    status = "water soon"\nelse:\n    status = "fine"\nprint(status)\n'],
    challenge: ['score = 95\nif score >= 90:\n    grade = "gold"\nelif score >= 75:\n    grade = "silver"\nelif score >= 50:\n    grade = "bronze"\nelse:\n    grade = "none"\nprint("Grade:", grade)\n'],
    wrong: { practice: ['moisture = 42\nif moisture <= 30:\n    status = "water now"\nelif moisture <= 60:\n    status = "water soon"\nelse:\n    status = "fine"\n'], challenge: ['score = 95\ngrade = "gold"\n'] },
  },
  'g02-l03': {
    practice: ['countdown = 5\nwhile countdown > 0:\n    print(countdown)\n    countdown -= 1\nprint("Liftoff!")\n', 'countdown = 5\nwhile countdown:\n    print(countdown)\n    countdown = countdown - 1\nprint("Liftoff!")\n'],
    challenge: ['target = 50\nlevel = 0\ncycles = 0\nwhile level < target:\n    level += 7\n    cycles += 1\nprint(cycles, "cycles to reach", level, "litres")\n'],
    wrong: { practice: ['countdown = 5\nprint(5)\nprint(4)\nprint(3)\nprint(2)\nprint(1)\nprint("Liftoff!")\n'], challenge: ['target = 50\nlevel = 56\ncycles = 8\n'] },
  },
  'g02-l04': {
    practice: ['planters = 5\nseeds_each = 3\ntotal = 0\nfor n in range(1, planters + 1):\n    print(f"Planter {n}: {seeds_each} seeds")\n    total += seeds_each\nprint("Total:", total)\n'],
    challenge: ['name = "Moonfern Archive"\nvowels = 0\nfor ch in name:\n    if ch.lower() in "aeiou":\n        vowels += 1\nprint(name, "has", vowels, "vowels")\n', 'name = "Moonfern Archive"\nvowels = 0\nfor i in range(len(name)):\n    if name[i] in "aeiouAEIOU":\n        vowels += 1\n'],
    wrong: { challenge: ['name = "Moonfern Archive"\nvowels = 6\n'] },
  },
  'g02-l05': {
    inputs: ['4', '6', 'done'],
    practice: ['total = 0\nwhile True:\n    line = input()\n    if line == "done":\n        break\n    total += int(line)\nprint("Total:", total)\n'],
    challenge: ['total = 0\ncount = 0\nwhile True:\n    line = input()\n    if line == "done":\n        break\n    reading = float(line)\n    if reading < 0:\n        continue\n    total += reading\n    count += 1\nif count == 0:\n    print("No valid readings")\nelse:\n    print("Average:", round(total / count, 1))\n'],
    wrong: { practice: ['total = 0\nfor i in range(2):\n    total += int(input())\nprint("Total:", total)\n'] },
  },
  'g02-l06': {
    practice: ['rows = 3\ncols = 4\nplanted = 0\nfor r in range(1, rows + 1):\n    for c in range(1, cols + 1):\n        if (r + c) % 2 == 0:\n            print("X", end="")\n            planted += 1\n        else:\n            print(".", end="")\n    print()\nprint(planted, "planted")\n'],
    challenge: ['temp = -3\nwind = 10\nis_night = True\nif temp < 0:\n    if wind > 20:\n        alert = "severe"\n    else:\n        alert = "frost"\nelif temp < 4 and is_night:\n    alert = "watch"\nelse:\n    alert = "clear"\nprint("Alert:", alert)\n'],
    wrong: { challenge: ['temp = -3\nwind = 10\nis_night = True\nalert = "frost"\n'] },
  },
};
