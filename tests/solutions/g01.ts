import type { Solutions } from './types';

export const G01: Solutions = {
  'g01-l01': {
    practice: ['print("Hello, crew!")\nprint("Deck 3 is green.")\nprint("Botanica OS ready.")\n', 'print("Hello, crew!\\nDeck 3 is green.\\nBotanica OS ready.")'],
    challenge: ['print("Navigation log")\nprint("Course set for Origins")\nprint(\'Engines at full power\')\n'],
    wrong: { practice: ['print("Hello crew!")\nprint("Deck 3 is green.")\nprint("Botanica OS ready.")'] },
  },
  'g01-l02': {
    practice: ['captain = "Ada"\ncrew_size = 12\nprint(captain, "leads a crew of", crew_size)\n'],
    challenge: ['seeds = 40\nprint("Seeds in the vault:", seeds)\nseeds = seeds + 15\nprint("After the harvest:", seeds)\n', 'seeds = 40\nprint("Seeds in the vault:", seeds)\nseeds += 15\nprint("After the harvest:", seeds)\n'],
    wrong: { practice: ['captain = "Ada"\ncrew_size = "12"\nprint(captain, "leads a crew of", crew_size)'], challenge: ['seeds = 40\nprint("Seeds in the vault:", seeds)\nseeds = 55\nprint("After the harvest:", seeds)\n'] },
  },
  'g01-l03': {
    practice: ['star = "Hortensia Prime"\ndistance_ly = 4.2\nmoons = 3\nprint(f"{star} is {distance_ly} light-years away, with {moons} moons.")\n'],
    challenge: ['oxygen = "21"\nreserve = 4\ntotal = int(oxygen) + reserve\nprint("Total oxygen:", total)\n'],
    wrong: { practice: ['star = "Hortensia Prime"\ndistance_ly = 4\nmoons = 3\nprint(star)'], challenge: ['oxygen = 21\nreserve = 4\ntotal = oxygen + reserve\nprint("Total oxygen:", total)\n'] },
  },
  'g01-l04': {
    practice: ['harvest = 47\nplanters = 5\nper_planter = harvest // planters\nleft_over = harvest % planters\nprint(per_planter, "each,", left_over, "left over")\n', 'harvest = 47\nplanters = 5\nper_planter, left_over = divmod(harvest, planters)\nprint(per_planter, "each,", left_over, "left over")\n'],
    challenge: ['temperature_c = 27.5\nhumidity = 0.62\n\nneeds_vent = temperature_c > 26 or humidity > 0.8\nalarm = temperature_c > 26 and humidity > 0.8\n\nprint("Vent:", needs_vent)\nprint("Alarm:", alarm)\n'],
    wrong: { practice: ['harvest = 47\nplanters = 5\nper_planter = 9\nleft_over = 2\nprint(per_planter, "each,", left_over, "left over")\n'], challenge: ['temperature_c = 27.5\nhumidity = 0.62\nneeds_vent = True\nalarm = False\nprint("Vent:", needs_vent)\nprint("Alarm:", alarm)\n'] },
  },
  'g01-l05': {
    practice: ['name = input("Name: ")\nprint(f"Welcome aboard, {name}!")\n', 'print("Welcome aboard, " + input() + "!")\n'],
    challenge: ['tank = int(input("Fuel in tank (litres): "))\nper_jump = int(input("Fuel per jump (litres): "))\njumps = tank // per_jump\nprint("You can make", jumps, "jumps")\n', 'tank = float(input())\nper_jump = float(input())\nprint("You can make", tank // per_jump, "jumps")\n'],
    wrong: { practice: ['input()\nprint("Welcome aboard, Ilse!")\n'], challenge: ['tank = int(input())\nper_jump = int(input())\nprint("You can make", tank / per_jump, "jumps")\n'] },
  },
};
