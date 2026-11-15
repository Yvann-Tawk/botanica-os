// Galaxy 06 · The Network: reaching beyond the program.
// Files here live in the browser's own in-memory file system (they last until the interpreter restarts).
// The HTTP lesson reads the app's bundled sample API at /data/forecast.json, so it works offline and stays private.
import type { LessonCore as Lesson } from './types';

const files: Lesson = {
  id: 'g06-l01', conceptId: 'network.1', number: 1, title: 'Reading & writing files', minutes: 20, xp: 200, difficulty: 2,
  description: 'Save text to files and read it back, safely, with `with open(...)`.',
  objectives: ['write and append text with `open(name, "w")` / `"a"`', 'read a whole file or loop over its lines', 'let `with` close the file for you'],
  discover: {
    heading: 'The ship\'s logbook.',
    lede: '`open(name, mode)` gives you a file. Mode `"w"` **writes** (starting fresh, wiping what was there), `"a"` **appends** to the end, `"r"` (the default) **reads**. A `with` block closes the file automatically when it ends, even if something goes wrong. Here, files live in the browser\'s memory until the interpreter restarts.',
    example: 'with open("harvest.txt", "w") as f:\n    f.write("fern 12\\n")\n    f.write("moss 5\\n")\n\nwith open("harvest.txt", "a") as f:\n    f.write("oak 2\\n")\n\nwith open("harvest.txt") as f:\n    for line in f:\n        print("logged:", line.strip())\n\nwith open("harvest.txt") as f:\n    print(len(f.read().splitlines()), "lines")\n',
    tagsHeading: 'Modes',
    tags: [
      { name: '"w"', color: '#a8423c', desc: 'Write: wipes the file first', examples: 'start a fresh log' },
      { name: '"a"', color: '#345a04', desc: 'Append: add to the end', examples: 'keep a journal' },
      { name: '"r"', color: '#8a6000', desc: 'Read (the default)', examples: 'open(name)' },
      { name: 'with … as f', color: '#242820', desc: 'Closes the file for you', examples: 'always use it' },
    ],
    tip: '`write` does not add a newline for you: put `\\n` at the end of each line. When reading, `.strip()` removes it again.',
  },
  experiment: {
    heading: 'Write in the logbook.',
    lede: 'Run, then change modes.',
    steps: ['Run it as it is.', 'Change the append to `"w"` and see the earlier lines vanish.', 'Read a file that does not exist and read the FileNotFoundError.', 'Write a number with `f.write(str(42))`: write only takes text.'],
    code: 'with open("harvest.txt", "w") as f:\n    f.write("fern 12\\n")\n    f.write("moss 5\\n")\n\nwith open("harvest.txt", "a") as f:\n    f.write("oak 2\\n")\n\nwith open("harvest.txt") as f:\n    print(f.read())\n',
  },
  practice: {
    heading: 'Log the harvest.',
    lede: 'Write the three lines `fern 12`, `moss 5`, `oak 2` to `harvest.txt` (one per line). Then read the file back and store the number of lines in `line_count` and the first line, without its newline, in `first`.',
    starter: '# write harvest.txt\n\n# read it back\n\nprint(line_count, first)\n',
    checks: [
      { kind: 'expr', label: 'harvest.txt holds the three lines', cases: [{ expr: 'open("harvest.txt").read().splitlines()', equals: ['fern 12', 'moss 5', 'oak 2'] }] },
      { kind: 'var', label: 'line_count is 3', name: 'line_count', type: 'int', equals: 3 },
      { kind: 'var', label: 'first is "fern 12"', name: 'first', type: 'str', equals: 'fern 12' },
      { kind: 'source', label: 'Uses with open(...)', matches: '\\bwith\\s+open\\(' },
    ],
    hints: ['`with open("harvest.txt", "w") as f:` then `f.write("fern 12\\n")` and so on.', 'Read it back: `with open("harvest.txt") as f: lines = f.read().splitlines()`.', '`line_count = len(lines)` and `first = lines[0]`.'],
  },
  challenge: {
    heading: 'The journal forgets.',
    lede: 'The journal should keep one line per day: `day 1`, `day 2`, `day 3`. Only the last day survives. Fix it (keep the first line, which starts a fresh journal each run).',
    starter: 'open("journal.txt", "w").close()  # start fresh\n\nfor day in range(1, 4):\n    with open("journal.txt", "w") as f:\n        f.write(f"day {day}\\n")\n\nwith open("journal.txt") as f:\n    print(f.read())\n',
    checks: [
      { kind: 'runs', label: 'Runs without a traceback' },
      { kind: 'expr', label: 'journal.txt keeps all three days', cases: [{ expr: 'open("journal.txt").read().splitlines()', equals: ['day 1', 'day 2', 'day 3'] }] },
    ],
    hints: ['What does mode `"w"` do to a file that already has text?', 'Each pass should add to the end.', 'Use `"a"` inside the loop (or open once with `"w"` outside the loop).'],
  },
  quiz: [
    { q: 'What does open(name, "w") do to an existing file?', opts: ['Adds to the end', 'Empties it first', 'Raises an error'], a: 1, why: '"w" starts fresh; use "a" to append.' },
    { q: 'Why use with open(...) as f?', opts: ['It is faster', 'The file is closed automatically', 'It is required for reading'], a: 1, why: 'with closes the file when the block ends, even on errors.' },
    { q: 'f.write("fern") then f.write("moss") gives…', opts: ['two lines', '"fernmoss" on one line', 'an error'], a: 1, why: 'write adds exactly what you give it; add "\\n" yourself.' },
  ],
};

const exceptions: Lesson = {
  id: 'g06-l02', conceptId: 'network.2', number: 2, title: 'Exceptions', minutes: 20, xp: 200, difficulty: 3,
  description: 'Handle errors on purpose with try/except, and raise your own.',
  objectives: ['catch a specific exception with `try` / `except ValueError:`', 'use `else` and `finally` for the success path and clean-up', 'raise an exception yourself with `raise`'],
  discover: {
    heading: 'Storms on the network.',
    lede: 'Some errors are expected: a user types "seven", a file is missing. Wrap the risky line in `try` and handle the specific exception in `except`. Catch only what you expect: a bare `except:` also hides real bugs, like a typo. `raise` lets your own code report a problem.',
    example: 'def to_number(text):\n    try:\n        return float(text)\n    except ValueError:\n        return None\n\nprint(to_number("21.5"), to_number("seven"))\n\ndef plant(seeds):\n    if seeds < 0:\n        raise ValueError("seeds cannot be negative")\n    return f"planted {seeds}"\n\ntry:\n    print(plant(-3))\nexcept ValueError as e:\n    print("Refused:", e)\nfinally:\n    print("planter closed")\n',
    tagsHeading: 'Handling',
    tags: [
      { name: 'try:', color: '#345a04', desc: 'The risky part', examples: 'float(text)' },
      { name: 'except E:', color: '#8a6000', desc: 'Handle one kind of error', examples: 'except ValueError:' },
      { name: 'else / finally', color: '#a8423c', desc: 'If no error / always', examples: 'close up' },
      { name: 'raise', color: '#242820', desc: 'Signal your own error', examples: 'raise ValueError("…")' },
    ],
    tip: '`except ValueError as e:` gives you the error object; `print(e)` shows its message.',
  },
  experiment: {
    heading: 'Weather the storm.',
    lede: 'Break things on purpose.',
    steps: ['Run it as it is.', 'Call `to_number("")`.', 'Change `except ValueError` to `except ZeroDivisionError` and run: the error is no longer caught.', 'Call `plant(5)` inside the try.'],
    code: 'def to_number(text):\n    try:\n        return float(text)\n    except ValueError:\n        return None\n\nprint(to_number("21.5"), to_number("seven"))\n\ntry:\n    print(1 / 0)\nexcept ZeroDivisionError as e:\n    print("Caught:", e)\n',
  },
  practice: {
    heading: 'A forgiving number reader.',
    lede: 'Write `to_number(text)` that returns the text as a float, or `None` when it is not a number. Catch only `ValueError`.',
    starter: '# define to_number(text)\n\nprint(to_number("21.5"), to_number("seven"))\n',
    checks: [
      { kind: 'call', label: 'Numbers become floats', fn: 'to_number', calls: [{ args: ['21.5'], returns: 21.5 }, { args: ['3'], returns: 3.0 }, { args: [' 7 '], returns: 7.0 }] },
      { kind: 'call', label: 'Anything else gives None', fn: 'to_number', calls: [{ args: ['seven'], returns: null }, { args: [''], returns: null }] },
      { kind: 'source', label: 'Catches ValueError specifically', matches: 'except\\s+ValueError', notMatches: 'except\\s*:' },
    ],
    hints: ['Put `return float(text)` inside `try:`.', 'Add `except ValueError:` and return `None` there.', 'Avoid a bare `except:`; name the error you expect.'],
  },
  challenge: {
    heading: 'The averager always says 0.',
    lede: '`average([2, 4])` should be **3**, and an empty list should give **0** rather than crash. It returns 0 for everything because a bare `except` hides a bug. Find the bug and catch only the error you mean.',
    starter: 'def average(values):\n    try:\n        return sum(vaules) / len(values)\n    except:\n        return 0\n\nprint(average([2, 4]), average([]))\n',
    checks: [
      { kind: 'call', label: 'average([2, 4]) is 3', fn: 'average', calls: [{ args: [[2, 4]], returns: 3 }, { args: [[1, 2, 3, 4]], returns: 2.5 }] },
      { kind: 'call', label: 'average([]) is 0', fn: 'average', calls: [{ args: [[]], returns: 0 }] },
      { kind: 'source', label: 'No bare except', notMatches: 'except\\s*:' },
    ],
    hints: ['Remove the try/except for a moment and run: what error appears?', 'There is a typo in a variable name.', 'Fix `vaules` → `values` and use `except ZeroDivisionError:`.'],
  },
  quiz: [
    { q: 'Why avoid a bare except:?', opts: ['It is slow', 'It also hides unexpected bugs', 'Python forbids it'], a: 1, why: 'It catches everything, including typos and NameErrors.' },
    { q: 'When does finally run?', opts: ['Only on errors', 'Only on success', 'Always'], a: 2, why: 'finally is for clean-up that must happen either way.' },
    { q: 'What does raise ValueError("bad") do?', opts: ['Prints "bad"', 'Stops normal flow with a ValueError', 'Returns "bad"'], a: 1, why: 'It raises an exception that a caller can catch.' },
  ],
};

const json: Lesson = {
  id: 'g06-l03', conceptId: 'network.3', number: 3, title: 'JSON', minutes: 18, xp: 200, difficulty: 2,
  description: 'Turn Python data into JSON text and back: the language of APIs and config files.',
  objectives: ['convert data to JSON text with `json.dumps` and back with `json.loads`', 'save and load JSON files with `json.dump` / `json.load`', 'know how JSON maps onto dicts, lists, str, numbers, bools and None'],
  discover: {
    heading: 'A common tongue.',
    lede: '**JSON** is a text format almost every program and web service understands. Its objects look like Python dicts and its arrays like lists. `json.dumps` turns Python data into a JSON string; `json.loads` parses a JSON string back into Python. `dump`/`load` (no s) do the same with files.',
    example: 'import json\n\nspecimen = {"name": "Moonfern", "height_cm": 18.5, "tags": ["shade", "rare"], "flowering": False}\ntext = json.dumps(specimen)\nprint(text)                       # note: false, not False\nback = json.loads(text)\nprint(back["tags"][0])\n\nwith open("specimen.json", "w") as f:\n    json.dump(specimen, f, indent=2)\nwith open("specimen.json") as f:\n    print(json.load(f)["name"])\n',
    tagsHeading: 'Python ↔ JSON',
    tags: [
      { name: 'dict ↔ object', color: '#345a04', desc: 'Keys become text', examples: '{"name": "fern"}' },
      { name: 'list ↔ array', color: '#8a6000', desc: 'Tuples become arrays too', examples: '[1, 2]' },
      { name: 'True ↔ true', color: '#a8423c', desc: 'None ↔ null', examples: 'lowercase in JSON' },
      { name: 'dumps / loads', color: '#242820', desc: 'To and from text (s = string)', examples: 'dump / load for files' },
    ],
    tip: '`json.dumps(data, indent=2)` makes the text readable for people.',
  },
  experiment: {
    heading: 'Translate a specimen.',
    lede: 'Round-trip some data.',
    steps: ['Run it as it is.', 'Add `indent=2` to `dumps`.', 'Try `json.loads("{\'a\': 1}")` with single quotes and read the error: JSON needs double quotes.', 'Store a tuple and see it come back as a list.'],
    code: 'import json\n\nspecimen = {"name": "Moonfern", "height_cm": 18.5, "tags": ["shade", "rare"], "flowering": False}\ntext = json.dumps(specimen)\nprint(text)\nback = json.loads(text)\nprint(back == specimen, back["tags"])\n',
  },
  practice: {
    heading: 'Archive a specimen.',
    lede: 'Turn `specimen` into JSON text in `text`, parse it back into `back`, and also save it to `specimen.json` with `json.dump`.',
    starter: 'import json\n\nspecimen = {"name": "Moonfern", "height_cm": 18.5, "tags": ["shade", "rare"]}\n\n# text = ...\n# back = ...\n# save to specimen.json\n\nprint(text)\n',
    checks: [
      { kind: 'var', label: 'text is JSON text', name: 'text', type: 'str', equals: '{"name": "Moonfern", "height_cm": 18.5, "tags": ["shade", "rare"]}' },
      { kind: 'var', label: 'back equals the original', name: 'back', type: 'dict', equals: { name: 'Moonfern', height_cm: 18.5, tags: ['shade', 'rare'] } },
      { kind: 'expr', label: 'specimen.json holds the same data', cases: [{ expr: '__import__("json").load(open("specimen.json"))', equals: { name: 'Moonfern', height_cm: 18.5, tags: ['shade', 'rare'] } }] },
    ],
    hints: ['`text = json.dumps(specimen)` and `back = json.loads(text)`.', 'To save: `with open("specimen.json", "w") as f:`', 'Inside: `json.dump(specimen, f)`.'],
  },
  challenge: {
    heading: 'The sensor feed will not parse.',
    lede: 'A bay sends its readings as JSON text in `raw`. Store the bay name in `bay` and the average reading in `average`. The code treats the text as if it were already a dict.',
    starter: 'import json\n\nraw = \'{"bay": "B2", "readings": [21.5, 22.0, 23.5]}\'\n\nbay = raw["bay"]\naverage = sum(raw["readings"]) / len(raw["readings"])\n\nprint(bay, average)\n',
    checks: [
      { kind: 'var', label: 'bay is "B2"', name: 'bay', equals: 'B2' },
      { kind: 'var', label: 'average is 22.333…', name: 'average', type: 'float', equals: 22.333333333333332 },
      { kind: 'variants', label: 'Works for other feeds (hidden cases)', variants: [{ set: { raw: '{"bay": "A1", "readings": [10, 20]}' }, expect: { bay: 'A1', average: 15.0 } }] },
    ],
    hints: ['`raw` is a str: indexing it with "bay" fails.', 'Parse it first: `data = json.loads(raw)`.', 'Then use `data["bay"]` and `data["readings"]`.'],
  },
  quiz: [
    { q: 'How does JSON write Python\'s False?', opts: ['False', 'false', '"False"'], a: 1, why: 'JSON uses lowercase true, false and null.' },
    { q: 'json.loads takes…', opts: ['a file', 'a string', 'a dict'], a: 1, why: 'loads parses a string; load reads a file.' },
    { q: 'What does a tuple become after a JSON round-trip?', opts: ['A tuple', 'A list', 'A string'], a: 1, why: 'JSON only has arrays, which come back as lists.' },
  ],
};

const http: Lesson = {
  id: 'g06-l04', conceptId: 'network.4', number: 4, title: 'HTTP & APIs', minutes: 22, xp: 200, difficulty: 3,
  description: 'Request data from a web API and work with the JSON it returns.',
  objectives: ['know what an HTTP GET request and an API are', 'fetch a URL from Python in the browser with `pyodide.http.open_url`', 'navigate nested JSON from an API'],
  discover: {
    heading: 'Calling the weather station.',
    lede: 'An **API** is a URL that answers with data (usually JSON) instead of a web page. Your program sends an HTTP **GET** request and parses the reply. In a normal Python install you would use `urllib.request` or the `requests` package; Python running in a browser uses the browser\'s own fetch, exposed as `pyodide.http.open_url`. This lesson\'s API is a forecast file that ships with Botanica, so it works offline and nothing leaves your device.',
    example: 'import json\nfrom pyodide.http import open_url\n\nURL = "/data/forecast.json"\nforecast = json.loads(open_url(URL).read())\n\nprint(forecast["location"], "in", forecast["units"])\nfor day in forecast["days"]:\n    print(day["date"], "high", day["high"], "rain", day["rain_mm"], "mm")\n',
    tagsHeading: 'Request → data',
    tags: [
      { name: 'GET', color: '#345a04', desc: 'Ask for data', examples: 'open_url(URL)' },
      { name: '.read()', color: '#8a6000', desc: 'The reply as text', examples: 'often JSON' },
      { name: 'json.loads', color: '#a8423c', desc: 'Text → dicts and lists', examples: 'forecast["days"]' },
      { name: 'nested', color: '#242820', desc: 'Dicts inside lists inside dicts', examples: 'days[0]["high"]' },
    ],
    tip: 'Print the parsed reply (or `forecast.keys()`) first to learn its shape before you write code against it.',
  },
  experiment: {
    heading: 'Read the forecast.',
    lede: 'Explore the reply.',
    steps: ['Run it as it is.', 'Print `forecast.keys()` and `forecast["days"][0]`.', 'Print only the days with rain.', 'Try a URL that does not exist and see what comes back.'],
    code: 'import json\nfrom pyodide.http import open_url\n\nforecast = json.loads(open_url("/data/forecast.json").read())\nprint(forecast["location"])\nprint(len(forecast["days"]), "days")\nprint(forecast["days"][0])\n',
  },
  practice: {
    heading: 'Summarise the forecast.',
    lede: 'Fetch `/data/forecast.json`, store the parsed reply in `forecast`, the number of days in `days`, and the highest `high` temperature in `warmest`.',
    starter: 'import json\nfrom pyodide.http import open_url\n\nURL = "/data/forecast.json"\n\n# forecast = ...\n# days = ...\n# warmest = ...\n\nprint(days, "days, warmest", warmest)\n',
    checks: [
      { kind: 'var', label: 'forecast is the parsed reply (a dict)', name: 'forecast', type: 'dict' },
      { kind: 'var', label: 'days is 5', name: 'days', type: 'int', equals: 5 },
      { kind: 'var', label: 'warmest is 26', name: 'warmest', equals: 26 },
      { kind: 'source', label: 'Fetches the URL', matches: 'open_url\\(' },
    ],
    hints: ['`forecast = json.loads(open_url(URL).read())`', '`days = len(forecast["days"])`', '`warmest = max(day["high"] for day in forecast["days"])`'],
  },
  challenge: {
    heading: 'Which days need the shutters?',
    lede: 'Store the dates of every day with rain (`rain_mm` above 0) in `rainy_dates`, in order, and their total rain in `total_rain`. The loop below walks the wrong thing.',
    starter: 'import json\nfrom pyodide.http import open_url\n\nforecast = json.loads(open_url("/data/forecast.json").read())\n\nrainy_dates = []\ntotal_rain = 0\nfor day in forecast:\n    if day["rain_mm"] > 0:\n        rainy_dates.append(day["date"])\n        total_rain += day["rain_mm"]\n\nprint(rainy_dates, total_rain)\n',
    checks: [
      { kind: 'var', label: 'rainy_dates lists the three rainy days', name: 'rainy_dates', equals: ['2026-11-15', '2026-11-16', '2026-11-18'] },
      { kind: 'var', label: 'total_rain is 12.7', name: 'total_rain', equals: 12.7 },
    ],
    hints: ['Looping over a dict gives its keys ("location", "units", "days").', 'The days are in `forecast["days"]`.', '`for day in forecast["days"]:`'],
  },
  quiz: [
    { q: 'What does an API usually return?', opts: ['A web page for people', 'Data such as JSON', 'Python code'], a: 1, why: 'APIs answer programs, usually with JSON.' },
    { q: 'open_url(URL).read() gives you…', opts: ['a dict', 'text', 'a file on disk'], a: 1, why: 'The reply is text; json.loads turns it into Python data.' },
    { q: 'for x in some_dict: loops over…', opts: ['values', 'keys', 'key-value pairs'], a: 1, why: 'Iterating a dict gives its keys; use .items() for pairs.' },
  ],
};

const automation: Lesson = {
  id: 'g06-l05', conceptId: 'network.5', number: 5, title: 'Automation scripts', minutes: 22, xp: 200, difficulty: 3,
  description: 'Let Python do repetitive chores: generate reports and clean up names in bulk.',
  objectives: ['loop over data to produce many files at once', 'build file names and contents with f-strings', 'write small, testable helper functions for a script'],
  discover: {
    heading: 'Chores the vessel does itself.',
    lede: 'Automation is everyday Python: the same small step done for every bay, file or row. Write the step once as a **function**, test it on one item, then loop. Here the script writes one report file per greenhouse bay.',
    example: 'bays = {"B1": [21.0, 22.5, 23.0], "B2": [19.5, 20.0]}\n\ndef report_line(bay, readings):\n    avg = sum(readings) / len(readings)\n    return f"{bay} average: {avg:.1f}"\n\nwritten = []\nfor bay, readings in bays.items():\n    name = f"report_{bay}.txt"\n    with open(name, "w") as f:\n        f.write(report_line(bay, readings) + "\\n")\n    written.append(name)\n\nprint(written)\nprint(open("report_B1.txt").read())\n',
    tagsHeading: 'A script\'s shape',
    tags: [
      { name: 'one step', color: '#345a04', desc: 'A function for one item', examples: 'report_line(bay, …)' },
      { name: 'loop', color: '#8a6000', desc: 'Apply it to everything', examples: 'for bay in bays' },
      { name: 'f-strings', color: '#a8423c', desc: 'Names and text', examples: 'f"report_{bay}.txt"' },
      { name: ':.1f', color: '#242820', desc: 'Format a float', examples: 'f"{2/3:.1f}" → 0.7' },
    ],
    tip: 'Test the one-item function before looping. If it is right for one bay, it is right for a hundred.',
  },
  experiment: {
    heading: 'Run the chores.',
    lede: 'Add bays and watch the files appear.',
    steps: ['Run it as it is.', 'Add a bay `"B3": [25.0]`.', 'Print the contents of every file in `written`.', 'Change the format to two decimals.'],
    code: 'bays = {"B1": [21.0, 22.5, 23.0], "B2": [19.5, 20.0]}\n\ndef report_line(bay, readings):\n    return f"{bay} average: {sum(readings) / len(readings):.1f}"\n\nfor bay, readings in bays.items():\n    with open(f"report_{bay}.txt", "w") as f:\n        f.write(report_line(bay, readings) + "\\n")\n    print(open(f"report_{bay}.txt").read().strip())\n',
  },
  practice: {
    heading: 'Write the daily bay reports.',
    lede: 'For every bay, write `report_<bay>.txt` containing one line, `<bay> average: <avg>` with one decimal place. Collect the file names in `written`, in the same order as `bays`.',
    starter: 'bays = {"B1": [21.0, 22.5, 23.0], "B2": [19.5, 20.0], "B3": [25.0]}\nwritten = []\n\n# write one report per bay\n\nprint(written)\n',
    checks: [
      { kind: 'var', label: 'written lists the three files in order', name: 'written', equals: ['report_B1.txt', 'report_B2.txt', 'report_B3.txt'] },
      { kind: 'expr', label: 'Each report has the right line', cases: [{ expr: '[open(n).read().strip() for n in ["report_B1.txt", "report_B2.txt", "report_B3.txt"]]', equals: ['B1 average: 22.2', 'B2 average: 19.8', 'B3 average: 25.0'] }] },
      { kind: 'variants', label: 'Works for any set of bays (hidden cases)', variants: [{ set: { bays: { X9: [1, 2] } }, expect: { written: ['report_X9.txt'] } }] },
    ],
    hints: ['`for bay, readings in bays.items():`', 'Name: `f"report_{bay}.txt"`; line: `f"{bay} average: {sum(readings) / len(readings):.1f}"`.', 'Write it with `with open(name, "w") as f:` and `written.append(name)`.'],
  },
  challenge: {
    heading: 'Tidy the specimen photos.',
    lede: 'Write `clean_name(name)` that turns messy file names into tidy ones: lowercase, spaces become underscores, surrounding spaces removed, and the extension lowercased too. Then build `cleaned` from `photos`.',
    note: 'Examples: `"Moon Fern.JPG"` → `"moon_fern.jpg"`, `"  Ivy  .png"` → `"ivy.png"`.',
    starter: 'photos = ["Moon Fern.JPG", "  Ivy  .png", "STARWORT  Bloom.Jpeg"]\n\ndef clean_name(name):\n    return name.replace(" ", "_")\n\ncleaned = [clean_name(p) for p in photos]\nprint(cleaned)\n',
    checks: [
      { kind: 'call', label: 'clean_name tidies names', fn: 'clean_name', calls: [{ args: ['Moon Fern.JPG'], returns: 'moon_fern.jpg' }, { args: ['  Ivy  .png'], returns: 'ivy.png' }] },
      { kind: 'call', label: 'Repeated spaces become one underscore (hidden cases)', fn: 'clean_name', calls: [{ args: ['STARWORT  Bloom.Jpeg'], returns: 'starwort_bloom.jpeg' }, { args: ['a.TXT'], returns: 'a.txt' }] },
      { kind: 'var', label: 'cleaned is built from photos', name: 'cleaned', equals: ['moon_fern.jpg', 'ivy.png', 'starwort_bloom.jpeg'] },
    ],
    hints: ['Split off the extension first: `stem, ext = name.rsplit(".", 1)`.', 'Tidy the stem: `.strip().lower()`, and `"_".join(stem.split())` turns any run of spaces into one underscore.', 'Return `stem + "." + ext.lower()`.'],
  },
  quiz: [
    { q: 'Why write the per-item step as a function?', opts: ['Python requires it', 'So you can test it on one item, then loop', 'It runs faster'], a: 1, why: 'Small functions are easy to check and reuse.' },
    { q: 'What does f"{2/3:.1f}" give?', opts: ['"0.6"', '"0.7"', '"0.67"'], a: 1, why: ':.1f rounds to one decimal place.' },
    { q: 'What does "_".join("a  b".split()) give?', opts: ['"a__b"', '"a_b"', '"ab"'], a: 1, why: 'split() with no argument splits on any run of whitespace.' },
  ],
};

const paths: Lesson = {
  id: 'g06-l06', conceptId: 'network.6', number: 6, title: 'pathlib', minutes: 18, xp: 200, difficulty: 2,
  description: 'Work with folders and paths as objects: build, create, list and inspect.',
  objectives: ['build paths with `Path` and the `/` operator', 'create folders with `mkdir(parents=True, exist_ok=True)`', 'list files with `glob` and read `name`, `stem` and `suffix`'],
  discover: {
    heading: 'Charting the file system.',
    lede: '`pathlib.Path` treats a path as an object instead of a string. Join parts with `/`, make folders with `mkdir`, read and write with `read_text`/`write_text`, and find files with `glob("*.txt")`. Each path knows its `name`, `stem` (name without extension) and `suffix`.',
    example: 'from pathlib import Path\n\nfolder = Path("archive") / "2026"\nfolder.mkdir(parents=True, exist_ok=True)\nfor plant in ["fern", "moss", "oak"]:\n    (folder / f"{plant}.txt").write_text(f"{plant} notes\\n")\n\nfor p in sorted(folder.glob("*.txt")):\n    print(p.name, p.stem, p.suffix, p.read_text().strip())\n\nprint(folder.exists(), (folder / "ivy.txt").exists())\n',
    tagsHeading: 'Path tools',
    tags: [
      { name: 'Path("a") / "b"', color: '#345a04', desc: 'Join parts safely', examples: 'a/b' },
      { name: '.mkdir(…)', color: '#8a6000', desc: 'Make folders', examples: 'parents=True, exist_ok=True' },
      { name: '.glob("*.txt")', color: '#a8423c', desc: 'Find matching files', examples: 'sorted(...)' },
      { name: '.name .stem .suffix', color: '#242820', desc: 'Parts of a name', examples: 'fern.txt → fern, .txt' },
    ],
    tip: '`/` between paths works on every operating system, unlike gluing strings with `"/"` or `"\\\\"` yourself.',
  },
  experiment: {
    heading: 'Build the archive.',
    lede: 'Make folders and list them.',
    steps: ['Run it as it is.', 'Add a `notes.md` file and glob `"*.md"`.', 'Remove `exist_ok=True` and run twice: read the FileExistsError.', 'Print `folder.parent` and `folder.resolve()`.'],
    code: 'from pathlib import Path\n\nfolder = Path("archive") / "2026"\nfolder.mkdir(parents=True, exist_ok=True)\n(folder / "fern.txt").write_text("fern notes\\n")\nfor p in sorted(folder.glob("*.txt")):\n    print(p, p.stem, p.suffix)\n',
  },
  practice: {
    heading: 'File the season\'s notes.',
    lede: 'Create the folder `archive/2026`, write one file per plant named `<plant>.txt` containing `<plant> notes`, then store the sorted names of the `.txt` files in that folder in `names`.',
    starter: 'from pathlib import Path\nimport shutil\nshutil.rmtree("archive", ignore_errors=True)  # start fresh\n\nplants = ["oak", "fern", "moss"]\n\n# create archive/2026 and write the files\n\n# names = ...\nprint(names)\n',
    checks: [
      { kind: 'var', label: 'names is ["fern.txt", "moss.txt", "oak.txt"]', name: 'names', equals: ['fern.txt', 'moss.txt', 'oak.txt'] },
      { kind: 'expr', label: 'Each file has its note', cases: [{ expr: '__import__("pathlib").Path("archive/2026/fern.txt").read_text().strip()', equals: 'fern notes' }] },
      { kind: 'source', label: 'Uses pathlib', matches: '\\bPath\\(' },
    ],
    hints: ['`folder = Path("archive") / "2026"` then `folder.mkdir(parents=True, exist_ok=True)`.', 'For each plant: `(folder / f"{plant}.txt").write_text(f"{plant} notes")`.', '`names = sorted(p.name for p in folder.glob("*.txt"))`'],
  },
  challenge: {
    heading: 'Backups land in the wrong place.',
    lede: 'Write `backup_path(filename)` that returns the `Path` of the backup: inside the `backups` folder, same stem, extension `.bak`. For example `"fern.txt"` → `Path("backups/fern.bak")`. The string-gluing version below is wrong.',
    starter: 'from pathlib import Path\n\ndef backup_path(filename):\n    return "backups" + filename + ".bak"\n\nprint(backup_path("fern.txt"))\n',
    checks: [
      { kind: 'expr', label: 'Returns a Path', cases: [{ expr: 'isinstance(backup_path("fern.txt"), Path)', equals: true }] },
      { kind: 'expr', label: 'fern.txt → backups/fern.bak', cases: [{ expr: 'backup_path("fern.txt").as_posix()', equals: 'backups/fern.bak' }] },
      { kind: 'expr', label: 'Works for other names (hidden cases)', cases: [{ expr: 'backup_path("moss.notes.md").as_posix()', equals: 'backups/moss.notes.bak' }, { expr: 'backup_path("ivy").as_posix()', equals: 'backups/ivy.bak' }] },
    ],
    hints: ['Use `Path(filename).stem` for the name without its extension.', 'Join with `/`: `Path("backups") / ...`', '`return Path("backups") / (Path(filename).stem + ".bak")` (or `.with_suffix(".bak")`).'],
  },
  quiz: [
    { q: 'What is Path("fern.txt").stem?', opts: ['"fern.txt"', '"fern"', '".txt"'], a: 1, why: 'stem is the name without its last extension.' },
    { q: 'What does mkdir(parents=True, exist_ok=True) avoid?', opts: ['Errors for missing parents or an existing folder', 'Writing files', 'Deleting folders'], a: 0, why: 'It creates parents as needed and does not fail if the folder exists.' },
    { q: 'Why build paths with / instead of "+"?', opts: ['It is shorter only', 'It inserts the right separator for you', 'Strings cannot hold paths'], a: 1, why: 'Path joining handles separators correctly everywhere.' },
  ],
};

export const GALAXY_06: Lesson[] = [files, exceptions, json, http, automation, paths];
