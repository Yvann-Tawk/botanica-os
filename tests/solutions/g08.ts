import type { Solutions } from './types';

const ROOMS = 'ROOMS = {\n    "airlock": {"north": "nursery"},\n    "nursery": {"south": "airlock", "east": "archive"},\n    "archive": {"west": "nursery", "down": "vault"},\n    "vault": {},\n}\n\ndef move(room, direction):\n    return ROOMS[room].get(direction, room)\n\n';
const BAY = 'import json\nfrom dataclasses import dataclass, field\nfrom statistics import mean\n\n@dataclass\nclass Bay:\n    name: str\n    readings: list = field(default_factory=list)\n\n    def average(self):\n        return round(mean(self.readings), 1) if self.readings else None\n\n    def status(self):\n        if not self.readings:\n            return "no data"\n        avg = self.average()\n        if avg > 28:\n            return "too hot"\n        if avg < 15:\n            return "too cold"\n        return "ok"\n\n';
const TRAIN = 'import math\nfrom collections import Counter\n\nTRAIN = [((30, 4), "fern"), ((32, 5), "fern"), ((29, 4.5), "fern"), ((31, 4), "oak"),\n         ((5, 1), "moss"), ((6, 1.5), "moss"), ((120, 20), "oak"), ((110, 18), "oak")]\nTEST = [((31, 4.2), "fern"), ((5.5, 1.2), "moss"), ((115, 19), "oak")]\n\n';

export const G08: Solutions = {
  'g08-l01': {
    practice: ['import csv, io, statistics\n\nRAW = """bay,temp\nB1,21.5\nB2,19.0\nB1,23.0\nB2,20.5\nB3,25.0\n"""\nrows = list(csv.DictReader(io.StringIO(RAW)))\ntemps = [float(r["temp"]) for r in rows]\nmean_temp = statistics.mean(temps)\nmedian_temp = statistics.median(temps)\ngroups = {}\nfor r in rows:\n    groups.setdefault(r["bay"], []).append(float(r["temp"]))\nby_bay = {bay: statistics.mean(ts) for bay, ts in groups.items()}\nprint(mean_temp, median_temp, by_bay)\n'],
    challenge: ['import csv, io\n\nRAW = """bay,temp\nB1,9.5\nB2,19.0\nB3,25.0\nB4,100.5\n"""\nrows = list(csv.DictReader(io.StringIO(RAW)))\nhottest = max(rows, key=lambda r: float(r["temp"]))\nhottest_bay = hottest["bay"]\nhottest_temp = float(hottest["temp"])\nprint(hottest_bay, hottest_temp)\n'],
    wrong: { challenge: ['hottest_bay = "B4"\nhottest_temp = 100.5\n'] },
  },
  'g08-l02': {
    practice: ['PLANTS = ["fern", "moss", "oak"]\n\ndef home():\n    return "<h1>Botanica</h1>"\n\ndef plant_list():\n    return "<ul>" + "".join(f"<li>{p}</li>" for p in PLANTS) + "</ul>"\n\nroutes = {"/": home, "/plants": plant_list}\n\ndef handle(path):\n    if path in routes:\n        return 200, routes[path]()\n    return 404, "<h1>Not found</h1>"\n\nprint(handle("/"), handle("/nope"))\n'],
    challenge: ['import html\n\ndef plant_page(name):\n    name = html.escape(name)\n    return f"<h1>{name}</h1><p>Care notes for {name}.</p>"\n\ndef handle(path):\n    prefix = "/plant/"\n    if path.startswith(prefix) and path[len(prefix):]:\n        return 200, plant_page(path[len(prefix):])\n    return 404, "<h1>Not found</h1>"\n\nprint(handle("/plant/fern"))\n'],
    wrong: { challenge: ['def plant_page(name):\n    return f"<h1>{name}</h1><p>Care notes for {name}.</p>"\n\ndef handle(path):\n    if path.startswith("/plant/"):\n        return 200, plant_page(path[7:])\n    return 404, "<h1>Not found</h1>"\n'] },
  },
  'g08-l03': {
    practice: ['from datetime import date, timedelta\n\nschedule = [\n    {"plant": "fern", "last": "2026-11-10", "every_days": 3},\n    {"plant": "cactus", "last": "2026-11-01", "every_days": 14},\n    {"plant": "moss", "last": "2026-11-12", "every_days": 2},\n    {"plant": "ivy", "last": "2026-11-05", "every_days": 7},\n]\ntoday = date(2026, 11, 13)\n\ndue = [i["plant"] for i in schedule if date.fromisoformat(i["last"]) + timedelta(days=i["every_days"]) <= today]\nprint(due)\n'],
    challenge: ['from datetime import date, timedelta\n\ndef next_watering(last, every_days):\n    return (date.fromisoformat(last) + timedelta(days=every_days)).isoformat()\n\nprint(next_watering("2026-11-10", 3))\n'],
    wrong: { practice: ['due = ["fern", "ivy"]\n'] },
  },
  'g08-l04': {
    practice: [ROOMS + 'print(move("airlock", "north"), move("airlock", "west"))\n'],
    challenge: [ROOMS + 'room = "airlock"\nwhile True:\n    command = input("> ")\n    if command == "quit":\n        print("Goodbye.")\n        break\n    new_room = move(room, command)\n    if new_room == room:\n        print("You can\'t go that way.")\n        continue\n    room = new_room\n    print(f"You are in the {room}.")\n    if room == "vault":\n        print("You found the Seed Vault!")\n        break\n'],
    wrong: { practice: ['ROOMS = {}\n\ndef move(room, direction):\n    return direction\n'] },
  },
  'g08-l05': {
    practice: ['import math\n\nTRAIN = [((30, 4), "fern"), ((32, 5), "fern"), ((5, 1), "moss"), ((6, 1.5), "moss"), ((120, 20), "oak"), ((110, 18), "oak")]\n\ndef distance(a, b):\n    return math.dist(a, b)\n\ndef nearest_label(sample):\n    return min(TRAIN, key=lambda ex: distance(sample, ex[0]))[1]\n\nprint(distance((0, 0), (3, 4)), nearest_label((28, 4)))\n', 'import math\n\nTRAIN = [((30, 4), "fern"), ((32, 5), "fern"), ((5, 1), "moss"), ((6, 1.5), "moss"), ((120, 20), "oak"), ((110, 18), "oak")]\n\ndef distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef nearest_label(sample):\n    best = None\n    for features, label in TRAIN:\n        d = distance(sample, features)\n        if best is None or d < best[0]:\n            best = (d, label)\n    return best[1]\n'],
    challenge: [TRAIN + 'def classify(sample, k=3):\n    nearest = sorted(TRAIN, key=lambda ex: math.dist(sample, ex[0]))[:k]\n    return Counter(label for _, label in nearest).most_common(1)[0][0]\n\naccuracy = sum(classify(x) == y for x, y in TEST) / len(TEST)\nprint(accuracy)\n'],
    wrong: { challenge: [TRAIN + 'def classify(sample, k=3):\n    return sorted(TRAIN, key=lambda ex: math.dist(sample, ex[0]))[0][1]\n\naccuracy = 1.0\n'] },
  },
  'g08-l06': {
    practice: ['from dataclasses import dataclass, field\nfrom statistics import mean\n\n@dataclass\nclass Bay:\n    name: str\n    readings: list = field(default_factory=list)\n\n    def average(self):\n        return round(mean(self.readings), 1) if self.readings else None\n\n    def status(self):\n        if not self.readings:\n            return "no data"\n        avg = self.average()\n        if avg > 28:\n            return "too hot"\n        if avg < 15:\n            return "too cold"\n        return "ok"\n\nprint(Bay("B1", [21.5, 22.0]).status(), Bay("B2", [30.5, 29.0]).status(), Bay("B3").status())\n'],
    challenge: [BAY + 'RAW = \'{"B2": [30.5, 29.0], "B1": [21.5, 22.0], "B3": []}\'\n\ndef monitor(raw_json):\n    bays = sorted((Bay(n, t) for n, t in json.loads(raw_json).items()), key=lambda b: b.name)\n    lines = [f"{b.name}: {b.status()} ({b.average()})" if b.readings else f"{b.name}: no data" for b in bays]\n    with open("report.txt", "w") as f:\n        f.write("\\n".join(lines) + "\\n")\n    return lines\n\ndef test_monitor():\n    lines = monitor(\'{"A": [20.0], "B": []}\')\n    assert lines[0] == "A: ok (20.0)"\n    assert lines[1] == "B: no data"\n\ntest_monitor()\nprint(monitor(RAW))\n'],
    wrong: { challenge: [BAY + 'def monitor(raw_json):\n    return [f"{n}: {Bay(n, t).status()}" for n, t in json.loads(raw_json).items()]\n\ndef test_monitor():\n    assert True\n    assert True\n'] },
  },
};
