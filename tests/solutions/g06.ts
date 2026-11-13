import type { Solutions } from './types';

const FETCH = 'import json\nfrom pyodide.http import open_url\n';

export const G06: Solutions = {
  'g06-l01': {
    practice: ['with open("harvest.txt", "w") as f:\n    f.write("fern 12\\n")\n    f.write("moss 5\\n")\n    f.write("oak 2\\n")\n\nwith open("harvest.txt") as f:\n    lines = f.read().splitlines()\nline_count = len(lines)\nfirst = lines[0]\nprint(line_count, first)\n', 'with open("harvest.txt", "w") as f:\n    f.write("fern 12\\nmoss 5\\noak 2\\n")\nwith open("harvest.txt") as f:\n    lines = [l.strip() for l in f]\nline_count, first = len(lines), lines[0]\n'],
    challenge: ['open("journal.txt", "w").close()  # start fresh\n\nfor day in range(1, 4):\n    with open("journal.txt", "a") as f:\n        f.write(f"day {day}\\n")\n\nwith open("journal.txt") as f:\n    print(f.read())\n', 'open("journal.txt", "w").close()\nwith open("journal.txt", "w") as f:\n    for day in range(1, 4):\n        f.write(f"day {day}\\n")\n'],
    wrong: { practice: ['line_count = 3\nfirst = "fern 12"\n'] },
  },
  'g06-l02': {
    practice: ['def to_number(text):\n    try:\n        return float(text)\n    except ValueError:\n        return None\n\nprint(to_number("21.5"), to_number("seven"))\n'],
    challenge: ['def average(values):\n    try:\n        return sum(values) / len(values)\n    except ZeroDivisionError:\n        return 0\n\nprint(average([2, 4]), average([]))\n', 'def average(values):\n    if not values:\n        return 0\n    return sum(values) / len(values)\n'],
    wrong: { practice: ['def to_number(text):\n    try:\n        return float(text)\n    except:\n        return None\n'] },
  },
  'g06-l03': {
    practice: ['import json\n\nspecimen = {"name": "Moonfern", "height_cm": 18.5, "tags": ["shade", "rare"]}\ntext = json.dumps(specimen)\nback = json.loads(text)\nwith open("specimen.json", "w") as f:\n    json.dump(specimen, f)\nprint(text)\n'],
    challenge: ['import json\n\nraw = \'{"bay": "B2", "readings": [21.5, 22.0, 23.5]}\'\ndata = json.loads(raw)\nbay = data["bay"]\naverage = sum(data["readings"]) / len(data["readings"])\nprint(bay, average)\n'],
  },
  'g06-l04': {
    practice: [FETCH + 'URL = "/data/forecast.json"\nforecast = json.loads(open_url(URL).read())\ndays = len(forecast["days"])\nwarmest = max(day["high"] for day in forecast["days"])\nprint(days, "days, warmest", warmest)\n'],
    challenge: [FETCH + 'forecast = json.loads(open_url("/data/forecast.json").read())\nrainy_dates = []\ntotal_rain = 0\nfor day in forecast["days"]:\n    if day["rain_mm"] > 0:\n        rainy_dates.append(day["date"])\n        total_rain += day["rain_mm"]\nprint(rainy_dates, total_rain)\n'],
    wrong: { practice: ['forecast = {}\ndays = 5\nwarmest = 26\n'] },
  },
  'g06-l05': {
    practice: ['bays = {"B1": [21.0, 22.5, 23.0], "B2": [19.5, 20.0], "B3": [25.0]}\nwritten = []\nfor bay, readings in bays.items():\n    name = f"report_{bay}.txt"\n    with open(name, "w") as f:\n        f.write(f"{bay} average: {sum(readings) / len(readings):.1f}\\n")\n    written.append(name)\nprint(written)\n'],
    challenge: ['photos = ["Moon Fern.JPG", "  Ivy  .png", "STARWORT  Bloom.Jpeg"]\n\ndef clean_name(name):\n    stem, ext = name.rsplit(".", 1)\n    stem = "_".join(stem.strip().lower().split())\n    return stem + "." + ext.lower()\n\ncleaned = [clean_name(p) for p in photos]\nprint(cleaned)\n'],
    wrong: { challenge: ['photos = ["Moon Fern.JPG", "  Ivy  .png", "STARWORT  Bloom.Jpeg"]\n\ndef clean_name(name):\n    return name.strip().lower().replace(" ", "_")\n\ncleaned = [clean_name(p) for p in photos]\n'] },
  },
  'g06-l06': {
    practice: ['from pathlib import Path\nimport shutil\nshutil.rmtree("archive", ignore_errors=True)\n\nplants = ["oak", "fern", "moss"]\nfolder = Path("archive") / "2026"\nfolder.mkdir(parents=True, exist_ok=True)\nfor plant in plants:\n    (folder / f"{plant}.txt").write_text(f"{plant} notes")\nnames = sorted(p.name for p in folder.glob("*.txt"))\nprint(names)\n'],
    challenge: ['from pathlib import Path\n\ndef backup_path(filename):\n    return Path("backups") / (Path(filename).stem + ".bak")\n\nprint(backup_path("fern.txt"))\n', 'from pathlib import Path\n\ndef backup_path(filename):\n    return (Path("backups") / filename).with_suffix(".bak")\n'],
    wrong: { challenge: ['from pathlib import Path\n\ndef backup_path(filename):\n    return "backups/" + filename.split(".")[0] + ".bak"\n'] },
  },
};
