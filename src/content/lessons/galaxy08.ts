// Galaxy 08 · The Expeditions: real-world specialisms, built with the standard library so they run in the browser.
// (Outside the browser, these ideas continue with pandas, Flask, pygame and scikit-learn; each lesson says so.)
import type { Lesson } from './types';

const data: Lesson = {
  id: 'g08-l01', conceptId: 'expeditions.1', number: 1, title: 'Data with csv & statistics', minutes: 25, xp: 250, difficulty: 3,
  description: 'Read tabular data, summarise it and group it, the way data analysis begins.',
  objectives: ['read CSV rows as dictionaries with `csv.DictReader`', 'summarise with `statistics.mean`, `median` and `stdev`', 'group rows by a column and summarise each group'],
  discover: {
    heading: 'The sensor archive.',
    lede: 'Data often arrives as **CSV**: rows of comma-separated values with a header line. `csv.DictReader` turns each row into a dict keyed by the header. Every value arrives as **text**, so convert numbers before doing maths. The `statistics` module does the summaries. (Outside the browser, the **pandas** package does all of this at scale.)',
    example: 'import csv, io, statistics\n\nRAW = """bay,temp\nB1,21.5\nB2,19.0\nB1,23.0\nB2,20.5\nB3,25.0\n"""\n\nrows = list(csv.DictReader(io.StringIO(RAW)))\ntemps = [float(r["temp"]) for r in rows]\nprint("mean", round(statistics.mean(temps), 2), "median", statistics.median(temps))\n\nby_bay = {}\nfor r in rows:\n    by_bay.setdefault(r["bay"], []).append(float(r["temp"]))\nprint({bay: statistics.mean(ts) for bay, ts in by_bay.items()})\n',
    tagsHeading: 'Data tools',
    tags: [
      { name: 'csv.DictReader', color: '#345a04', desc: 'Rows as dicts', examples: 'row["temp"]' },
      { name: 'float(...)', color: '#8a6000', desc: 'CSV values are text', examples: 'convert first' },
      { name: 'statistics', color: '#a8423c', desc: 'mean, median, stdev', examples: 'statistics.median(xs)' },
      { name: 'setdefault', color: '#242820', desc: 'Group into lists', examples: 'd.setdefault(k, []).append(v)' },
    ],
    tip: '`io.StringIO(text)` lets code that expects a file read from a string; with a real file you would pass `open("data.csv")` instead.',
  },
  experiment: {
    heading: 'Interrogate the archive.',
    lede: 'Summarise in different ways.',
    steps: ['Run it as it is.', 'Add `statistics.stdev(temps)`.', 'Find the hottest row with `max(rows, key=lambda r: float(r["temp"]))`.', 'Remove a `float()` and see `"19.0" < "2"`-style text comparisons go wrong.'],
    code: 'import csv, io, statistics\n\nRAW = """bay,temp\nB1,21.5\nB2,19.0\nB1,23.0\nB2,20.5\nB3,25.0\n"""\nrows = list(csv.DictReader(io.StringIO(RAW)))\ntemps = [float(r["temp"]) for r in rows]\nprint(statistics.mean(temps), statistics.median(temps))\n',
  },
  practice: {
    heading: 'Summarise the sensor log.',
    lede: 'Parse `RAW`. Store the mean of all temperatures in `mean_temp`, the median in `median_temp`, and a dict of each bay\'s **average** temperature in `by_bay`.',
    starter: 'import csv, io, statistics\n\nRAW = """bay,temp\nB1,21.5\nB2,19.0\nB1,23.0\nB2,20.5\nB3,25.0\n"""\n\n# rows = ...\n# mean_temp, median_temp, by_bay\n\nprint(mean_temp, median_temp, by_bay)\n',
    checks: [
      { kind: 'var', label: 'mean_temp is 21.8', name: 'mean_temp', equals: 21.8 },
      { kind: 'var', label: 'median_temp is 21.5', name: 'median_temp', equals: 21.5 },
      { kind: 'var', label: 'by_bay averages each bay', name: 'by_bay', type: 'dict', equals: { B1: 22.25, B2: 19.75, B3: 25.0 } },
      { kind: 'variants', label: 'Works for other logs (hidden cases)', variants: [{ set: { RAW: 'bay,temp\nZ,10\nZ,20\nY,4\n' }, expect: { by_bay: { Z: 15.0, Y: 4.0 }, median_temp: 10.0 } }] },
    ],
    hints: ['`rows = list(csv.DictReader(io.StringIO(RAW)))` and `temps = [float(r["temp"]) for r in rows]`.', '`statistics.mean(temps)` and `statistics.median(temps)`.', 'Group with `setdefault`, then `{bay: statistics.mean(ts) for bay, ts in groups.items()}`.'],
  },
  challenge: {
    heading: 'The hottest bay is wrong.',
    lede: 'Store the bay with the single hottest reading in `hottest_bay` and that reading (a float) in `hottest_temp`. The answer below is wrong because of how CSV values compare.',
    starter: 'import csv, io\n\nRAW = """bay,temp\nB1,9.5\nB2,19.0\nB3,25.0\nB4,100.5\n"""\nrows = list(csv.DictReader(io.StringIO(RAW)))\n\nhottest = max(rows, key=lambda r: r["temp"])\nhottest_bay = hottest["bay"]\nhottest_temp = hottest["temp"]\n\nprint(hottest_bay, hottest_temp)\n',
    checks: [
      { kind: 'var', label: 'hottest_bay is "B4"', name: 'hottest_bay', equals: 'B4' },
      { kind: 'var', label: 'hottest_temp is the float 100.5', name: 'hottest_temp', type: 'float', equals: 100.5 },
      { kind: 'variants', label: 'Right for other logs (hidden cases)', variants: [{ set: { RAW: 'bay,temp\nA,8\nB,10\n' }, expect: { hottest_bay: 'B', hottest_temp: 10.0 } }] },
    ],
    hints: ['Text compares letter by letter: "9.5" > "100.5".', 'Compare numbers: `key=lambda r: float(r["temp"])`.', 'And convert the stored reading too: `float(hottest["temp"])`.'],
  },
  quiz: [
    { q: 'What type is row["temp"] from csv.DictReader?', opts: ['float', 'str', 'int'], a: 1, why: 'CSV values are always read as text.' },
    { q: 'What is statistics.median([1, 9, 3])?', opts: ['3', '4.33', '9'], a: 0, why: 'Sorted: 1, 3, 9. The middle value is 3.' },
    { q: 'Why is max(["9.5", "100.5"]) "9.5"?', opts: ['A bug in Python', 'Strings compare character by character', 'It rounds'], a: 1, why: '"9" sorts after "1", so convert to numbers first.' },
  ],
};

const web: Lesson = {
  id: 'g08-l02', conceptId: 'expeditions.2', number: 2, title: 'A tiny web router', minutes: 25, xp: 250, difficulty: 3,
  description: 'How web apps answer requests: routes, handlers, status codes and safe HTML.',
  objectives: ['map URL paths to handler functions in a routing table', 'return a status code and HTML for each request (404 for unknown paths)', 'escape user-supplied text with `html.escape` before putting it in a page'],
  discover: {
    heading: 'The greenhouse\'s front desk.',
    lede: 'A web app receives a **request** for a path like `/plants` and returns a **response**: a status code (200 OK, 404 Not Found) and some HTML. At its heart is a **routing table** from paths to functions. Frameworks like **Flask** add the server and conveniences, but the idea is exactly this. Anything that came from a user must be **escaped** before it goes into HTML, or someone can inject their own scripts.',
    example: 'import html\n\nPLANTS = ["fern", "moss", "oak"]\n\ndef home():\n    return "<h1>Botanica</h1>"\n\ndef plant_list():\n    items = "".join(f"<li>{html.escape(p)}</li>" for p in PLANTS)\n    return f"<ul>{items}</ul>"\n\nroutes = {"/": home, "/plants": plant_list}\n\ndef handle(path):\n    if path in routes:\n        return 200, routes[path]()\n    return 404, "<h1>Not found</h1>"\n\nfor path in ["/", "/plants", "/secret"]:\n    print(path, handle(path))\nprint(html.escape("<script>alert(1)</script>"))\n',
    tagsHeading: 'Web ideas',
    tags: [
      { name: 'route', color: '#345a04', desc: 'Path → function', examples: '{"/": home}' },
      { name: '200 / 404', color: '#8a6000', desc: 'Found / not found', examples: 'status codes' },
      { name: 'handler', color: '#a8423c', desc: 'Builds the page', examples: 'returns HTML' },
      { name: 'html.escape', color: '#242820', desc: 'Make user text safe', examples: '< becomes &lt;' },
    ],
    tip: 'Never paste user input straight into HTML. Escaping turns `<script>` into harmless text.',
  },
  experiment: {
    heading: 'Make some requests.',
    lede: 'Add routes and pages.',
    steps: ['Run it as it is.', 'Add a route `/about`.', 'Request `/plants/` with a trailing slash: a 404. Real frameworks have rules for this.', 'Add `"<b>ivy</b>"` to `PLANTS` and see it escaped.'],
    code: 'import html\n\nPLANTS = ["fern", "moss", "oak"]\n\ndef home():\n    return "<h1>Botanica</h1>"\n\ndef plant_list():\n    return "<ul>" + "".join(f"<li>{html.escape(p)}</li>" for p in PLANTS) + "</ul>"\n\nroutes = {"/": home, "/plants": plant_list}\n\ndef handle(path):\n    if path in routes:\n        return 200, routes[path]()\n    return 404, "<h1>Not found</h1>"\n\nprint(handle("/plants"), handle("/nope"))\n',
  },
  practice: {
    heading: 'Route the front desk.',
    lede: 'Write `handle(path)` that returns `(200, page)` for a known path and `(404, "<h1>Not found</h1>")` otherwise. Route `/` to `home` and `/plants` to `plant_list` (both are written for you).',
    starter: 'PLANTS = ["fern", "moss", "oak"]\n\ndef home():\n    return "<h1>Botanica</h1>"\n\ndef plant_list():\n    return "<ul>" + "".join(f"<li>{p}</li>" for p in PLANTS) + "</ul>"\n\n# routes = ...\n# def handle(path): ...\n\nprint(handle("/"), handle("/nope"))\n',
    checks: [
      { kind: 'call', label: 'Known paths return 200 and their page', fn: 'handle', calls: [{ args: ['/'], returns: [200, '<h1>Botanica</h1>'] }, { args: ['/plants'], returns: [200, '<ul><li>fern</li><li>moss</li><li>oak</li></ul>'] }] },
      { kind: 'call', label: 'Unknown paths return 404', fn: 'handle', calls: [{ args: ['/secret'], returns: [404, '<h1>Not found</h1>'] }, { args: [''], returns: [404, '<h1>Not found</h1>'] }] },
      { kind: 'var', label: 'routes is a dict of paths to functions', name: 'routes', type: 'dict' },
    ],
    hints: ['`routes = {"/": home, "/plants": plant_list}` (the functions themselves, no brackets).', '`if path in routes: return 200, routes[path]()`', 'Otherwise `return 404, "<h1>Not found</h1>"`.'],
  },
  challenge: {
    heading: 'Someone injected a script.',
    lede: '`plant_page(name)` builds a page for `/plant/<name>`. A visitor requested a "plant" called `<script>…</script>`, and it ran. Make the page escape the name, and make `handle` route `/plant/<name>` paths to it.',
    starter: 'import html\n\ndef plant_page(name):\n    return f"<h1>{name}</h1><p>Care notes for {name}.</p>"\n\ndef handle(path):\n    if path == "/plant":\n        return 200, plant_page(path)\n    return 404, "<h1>Not found</h1>"\n\nprint(handle("/plant/fern"))\nprint(handle("/plant/<script>alert(1)</script>"))\n',
    checks: [
      { kind: 'call', label: '/plant/fern shows the fern page', fn: 'handle', calls: [{ args: ['/plant/fern'], returns: [200, '<h1>fern</h1><p>Care notes for fern.</p>'] }] },
      { kind: 'call', label: 'Script tags come out escaped', fn: 'handle', calls: [{ args: ['/plant/<script>x</script>'], returns: [200, '<h1>&lt;script&gt;x&lt;/script&gt;</h1><p>Care notes for &lt;script&gt;x&lt;/script&gt;.</p>'] }] },
      { kind: 'call', label: 'Other paths still 404 (hidden cases)', fn: 'handle', calls: [{ args: ['/plants'], returns: [404, '<h1>Not found</h1>'] }, { args: ['/plant/'], returns: [404, '<h1>Not found</h1>'] }] },
    ],
    hints: ['Check the prefix: `path.startswith("/plant/")`, and take the name with `path[len("/plant/"):]`.', 'An empty name should still be a 404.', 'Escape once at the top of `plant_page`: `name = html.escape(name)`.'],
  },
  quiz: [
    { q: 'What does status 404 mean?', opts: ['Server error', 'Not found', 'OK'], a: 1, why: '404 means nothing lives at that path.' },
    { q: 'What does html.escape("<b>") give?', opts: ['"<b>"', '"&lt;b&gt;"', '"b"'], a: 1, why: 'Angle brackets become entities, so the browser shows them as text.' },
    { q: 'In routes = {"/": home}, why no brackets after home?', opts: ['Typo', 'We store the function to call later', 'Brackets are optional'], a: 1, why: 'home() would call it now; the table holds the function itself.' },
  ],
};

const bots: Lesson = {
  id: 'g08-l03', conceptId: 'expeditions.3', number: 3, title: 'Automation bots', minutes: 25, xp: 250, difficulty: 3,
  description: 'A watering bot: dates, schedules and decisions, the core of any reminder bot.',
  objectives: ['parse and compare dates with `datetime.date`', 'add days with `timedelta`', 'turn a schedule into a list of actions for today'],
  discover: {
    heading: 'The watering bot.',
    lede: 'Reminder bots are loops over a **schedule** that compare **dates**. `date.fromisoformat("2026-11-10")` reads a date; adding `timedelta(days=3)` moves it forward, handling month and year ends for you. A real bot would then send a message or an email; here it prints its plan.',
    example: 'from datetime import date, timedelta\n\nschedule = [\n    {"plant": "fern", "last": "2026-11-10", "every_days": 3},\n    {"plant": "cactus", "last": "2026-11-01", "every_days": 14},\n    {"plant": "moss", "last": "2026-11-12", "every_days": 2},\n]\ntoday = date(2026, 11, 13)\n\nfor item in schedule:\n    due = date.fromisoformat(item["last"]) + timedelta(days=item["every_days"])\n    status = "water today" if due <= today else f"wait until {due.isoformat()}"\n    print(f"{item[\'plant\']}: {status}")\n',
    tagsHeading: 'Date tools',
    tags: [
      { name: 'date(y, m, d)', color: '#345a04', desc: 'A calendar date', examples: 'date(2026, 11, 13)' },
      { name: 'fromisoformat', color: '#8a6000', desc: 'Read "YYYY-MM-DD"', examples: '.isoformat() writes it' },
      { name: 'timedelta', color: '#a8423c', desc: 'A length of time', examples: 'timedelta(days=3)' },
      { name: 'd1 <= d2', color: '#242820', desc: 'Dates compare in order', examples: 'is it due?' },
    ],
    tip: 'Pass `today` into your functions instead of calling `date.today()` inside them: then tests can pretend it is any day.',
  },
  experiment: {
    heading: 'Run the bot.',
    lede: 'Change the day and schedule.',
    steps: ['Run it as it is.', 'Set `today = date(2026, 11, 20)`.', 'Add a plant due on New Year\'s Eve and check the date maths across the year end.', 'Print `today - date(2026, 1, 1)`: subtracting dates gives a timedelta.'],
    code: 'from datetime import date, timedelta\n\nschedule = [{"plant": "fern", "last": "2026-11-10", "every_days": 3}, {"plant": "cactus", "last": "2026-11-01", "every_days": 14}]\ntoday = date(2026, 11, 13)\nfor item in schedule:\n    due = date.fromisoformat(item["last"]) + timedelta(days=item["every_days"])\n    print(item["plant"], due, due <= today)\n',
  },
  practice: {
    heading: 'Who needs water today?',
    lede: 'Store, in schedule order, the names of plants whose next watering (last watering + `every_days`) is **on or before** `today`, in `due`.',
    starter: 'from datetime import date, timedelta\n\nschedule = [\n    {"plant": "fern", "last": "2026-11-10", "every_days": 3},\n    {"plant": "cactus", "last": "2026-11-01", "every_days": 14},\n    {"plant": "moss", "last": "2026-11-12", "every_days": 2},\n    {"plant": "ivy", "last": "2026-11-05", "every_days": 7},\n]\ntoday = date(2026, 11, 13)\n\n# due = [...]\n\nprint(due)\n',
    checks: [
      { kind: 'var', label: 'due is ["fern", "ivy"]', name: 'due', equals: ['fern', 'ivy'] },
      { kind: 'variants', label: 'Right on other days (hidden cases)', variants: [{ set: { today: { __date__: '2026-11-15' } }, expect: { due: ['fern', 'cactus', 'moss', 'ivy'] } }, { set: { today: { __date__: '2026-11-12' } }, expect: { due: ['ivy'] } }] },
    ],
    hints: ['For each item: `next_day = date.fromisoformat(item["last"]) + timedelta(days=item["every_days"])`.', 'Keep it when `next_day <= today`.', '`due = [i["plant"] for i in schedule if date.fromisoformat(i["last"]) + timedelta(days=i["every_days"]) <= today]`'],
  },
  challenge: {
    heading: 'The bot cannot count past the month.',
    lede: 'Write `next_watering(last, every_days)` returning the next watering date as a `"YYYY-MM-DD"` string. The string arithmetic below breaks at month and year ends.',
    starter: 'def next_watering(last, every_days):\n    year, month, day = last.split("-")\n    return f"{year}-{month}-{int(day) + every_days}"\n\nprint(next_watering("2026-11-10", 3), next_watering("2026-12-30", 3))\n',
    checks: [
      { kind: 'call', label: 'Within a month', fn: 'next_watering', calls: [{ args: ['2026-11-10', 3], returns: '2026-11-13' }] },
      { kind: 'call', label: 'Across month and year ends', fn: 'next_watering', calls: [{ args: ['2026-11-29', 3], returns: '2026-12-02' }, { args: ['2026-12-30', 3], returns: '2027-01-02' }] },
      { kind: 'call', label: 'Leap years (hidden case)', fn: 'next_watering', calls: [{ args: ['2028-02-27', 2], returns: '2028-02-29' }] },
    ],
    hints: ['Let `datetime` do the calendar work.', '`date.fromisoformat(last) + timedelta(days=every_days)`', 'Return it with `.isoformat()`.'],
  },
  quiz: [
    { q: 'What is date(2026, 12, 31) + timedelta(days=1)?', opts: ['2026-12-32', '2027-01-01', 'An error'], a: 1, why: 'timedelta handles month and year ends.' },
    { q: 'Why pass today into a function instead of calling date.today() inside?', opts: ['It is faster', 'Tests can choose the day', 'date.today() is deprecated'], a: 1, why: 'Functions that take their inputs are easy to test.' },
    { q: 'date.fromisoformat("2026-11-13") reads…', opts: ['a datetime with time', 'a date', 'a string'], a: 1, why: 'It parses the ISO date format YYYY-MM-DD.' },
  ],
};

const game: Lesson = {
  id: 'g08-l04', conceptId: 'expeditions.4', number: 4, title: 'A text adventure', minutes: 25, xp: 250, difficulty: 3,
  description: 'A game loop: state, commands and a goal, the bones of every game.',
  objectives: ['model a game world as data (rooms and exits)', 'write a game loop that reads commands until the game ends', 'keep game logic in small testable functions'],
  discover: {
    heading: 'Lost in the greenhouse.',
    lede: 'Every game has the same bones: **state** (where you are), a **loop** that reads an action, updates the state and shows the result, and an **end condition**. Here the world is a dict of rooms and their exits. (Graphical games with the **pygame** package use the same loop, drawing a frame each pass instead of printing.)',
    example: 'ROOMS = {\n    "airlock": {"north": "nursery"},\n    "nursery": {"south": "airlock", "east": "archive"},\n    "archive": {"west": "nursery", "down": "vault"},\n    "vault": {},\n}\n\ndef move(room, direction):\n    return ROOMS[room].get(direction, room)   # blocked: stay put\n\nroom = "airlock"\nfor command in ["north", "west", "east", "down"]:\n    new_room = move(room, command)\n    print(command, "→", new_room if new_room != room else "you can\'t go that way")\n    room = new_room\nprint("You are in the", room)\n',
    tagsHeading: 'Game parts',
    tags: [
      { name: 'state', color: '#345a04', desc: 'Where things are now', examples: 'room = "airlock"' },
      { name: 'world data', color: '#8a6000', desc: 'Rooms and exits', examples: 'ROOMS[room]' },
      { name: 'loop', color: '#a8423c', desc: 'Read, update, show', examples: 'while True' },
      { name: 'end', color: '#242820', desc: 'Win, lose or quit', examples: 'break' },
    ],
    tip: 'When you run the full game, type commands in the console: `north`, `east`, `down`, or `quit`.',
  },
  experiment: {
    heading: 'Explore the map.',
    lede: 'Change the world.',
    steps: ['Run it as it is.', 'Add a room `"pond"` east of the airlock.', 'Make `move` print a message when blocked.', 'Change the route so the player never reaches the vault.'],
    code: 'ROOMS = {"airlock": {"north": "nursery"}, "nursery": {"south": "airlock", "east": "archive"}, "archive": {"west": "nursery", "down": "vault"}, "vault": {}}\n\ndef move(room, direction):\n    return ROOMS[room].get(direction, room)\n\nroom = "airlock"\nfor command in ["north", "west", "east", "down"]:\n    room = move(room, command)\n    print(command, "→", room)\n',
  },
  practice: {
    heading: 'The movement rules.',
    lede: 'Write `move(room, direction)` that returns the room in that direction, or the **same room** when there is no exit that way.',
    starter: 'ROOMS = {\n    "airlock": {"north": "nursery"},\n    "nursery": {"south": "airlock", "east": "archive"},\n    "archive": {"west": "nursery", "down": "vault"},\n    "vault": {},\n}\n\n# def move(room, direction): ...\n\nprint(move("airlock", "north"), move("airlock", "west"))\n',
    checks: [
      { kind: 'call', label: 'Follows exits', fn: 'move', calls: [{ args: ['airlock', 'north'], returns: 'nursery' }, { args: ['archive', 'down'], returns: 'vault' }] },
      { kind: 'call', label: 'Blocked directions stay put', fn: 'move', calls: [{ args: ['airlock', 'west'], returns: 'airlock' }, { args: ['vault', 'up'], returns: 'vault' }] },
    ],
    hints: ['Each room\'s exits are a dict: `ROOMS[room]`.', '`.get(direction, room)` falls back to the current room.', '`def move(room, direction): return ROOMS[room].get(direction, room)`'],
  },
  challenge: {
    heading: 'Find the Seed Vault.',
    lede: 'Write the game loop. Start in the airlock. Repeatedly read a command with `input("> ")`: `quit` ends the game with `Goodbye.`; anything else is a direction. Print `You can\'t go that way.` when blocked, otherwise `You are in the <room>.`. Reaching the vault prints `You found the Seed Vault!` and ends the game.',
    starter: 'ROOMS = {\n    "airlock": {"north": "nursery"},\n    "nursery": {"south": "airlock", "east": "archive"},\n    "archive": {"west": "nursery", "down": "vault"},\n    "vault": {},\n}\n\ndef move(room, direction):\n    return ROOMS[room].get(direction, room)\n\nroom = "airlock"\n# the game loop\n',
    inputs: ['north', 'east', 'down'],
    checks: [
      { kind: 'cases', label: 'north, east, down finds the vault', cases: [{ inputs: ['north', 'east', 'down'], regex: 'You are in the nursery\\.\\n[\\s\\S]*You are in the archive\\.[\\s\\S]*You found the Seed Vault!' }] },
      { kind: 'cases', label: 'Blocked moves are reported (hidden case)', cases: [{ inputs: ['west', 'north', 'quit'], regex: "You can't go that way\\.[\\s\\S]*You are in the nursery\\.[\\s\\S]*Goodbye\\." }] },
      { kind: 'cases', label: 'quit ends at once (hidden case)', cases: [{ inputs: ['quit', 'north'], regex: '\\A> quit\\nGoodbye\\.\\s*\\Z' }] },
    ],
    hints: ['`while True:` then `command = input("> ")`.', 'Check `quit` first, then `new_room = move(room, command)` and compare with `room`.', 'After moving: `if room == "vault": print("You found the Seed Vault!"); break`.'],
  },
  quiz: [
    { q: 'What are the three parts of a game loop?', opts: ['Read, update, show', 'Import, run, exit', 'Draw, sleep, quit'], a: 0, why: 'Each pass reads an action, updates state and shows the result.' },
    { q: 'Why keep move() separate from the loop?', opts: ['Python needs it', 'It is easy to test on its own', 'Loops cannot call functions'], a: 1, why: 'Small pure functions can be checked without playing the game.' },
    { q: 'd.get(k, default) returns what when k is missing?', opts: ['None always', 'default', 'A KeyError'], a: 1, why: 'get falls back to the default you give.' },
  ],
};

const ml: Lesson = {
  id: 'g08-l05', conceptId: 'expeditions.5', number: 5, title: 'Intro to ML: nearest neighbours', minutes: 30, xp: 250, difficulty: 3,
  description: 'Teach a program to classify plants from examples, from scratch.',
  objectives: ['represent examples as features and labels', 'measure similarity with Euclidean distance', 'classify by majority vote of the k nearest neighbours, and measure accuracy'],
  discover: {
    heading: 'Which species is this?',
    lede: '**Machine learning** finds patterns in examples instead of following rules you wrote. In **k-nearest neighbours**, each known plant is a point (height, leaf width) with a label. To classify a new plant, find the **k** closest known points and take a **vote**. (Outside the browser, **scikit-learn** provides this and many more models.)',
    example: 'import math\nfrom collections import Counter\n\nTRAIN = [((30, 4), "fern"), ((32, 5), "fern"), ((5, 1), "moss"), ((6, 1.5), "moss"), ((120, 20), "oak"), ((110, 18), "oak")]\n\ndef distance(a, b):\n    return math.dist(a, b)            # √((x1-x2)² + (y1-y2)²)\n\ndef classify(sample, k=3):\n    nearest = sorted(TRAIN, key=lambda ex: distance(sample, ex[0]))[:k]\n    votes = Counter(label for _, label in nearest)\n    return votes.most_common(1)[0][0]\n\nprint(classify((28, 4)), classify((7, 1)), classify((100, 15)))\n',
    tagsHeading: 'The recipe',
    tags: [
      { name: 'features', color: '#345a04', desc: 'Numbers describing an example', examples: '(height, width)' },
      { name: 'label', color: '#8a6000', desc: 'The right answer', examples: '"fern"' },
      { name: 'distance', color: '#a8423c', desc: 'How similar two examples are', examples: 'math.dist(a, b)' },
      { name: 'vote', color: '#242820', desc: 'Most common nearby label', examples: 'Counter.most_common' },
    ],
    tip: 'Accuracy is only meaningful on examples the model has **not** seen: keep a separate test set.',
  },
  experiment: {
    heading: 'Classify some specimens.',
    lede: 'Change the samples and k.',
    steps: ['Run it as it is.', 'Classify `(60, 10)`: halfway between fern and oak.', 'Try `k=1` and `k=5`.', 'Add a mislabelled training example and see how k=1 suffers.'],
    code: 'import math\nfrom collections import Counter\n\nTRAIN = [((30, 4), "fern"), ((32, 5), "fern"), ((5, 1), "moss"), ((6, 1.5), "moss"), ((120, 20), "oak"), ((110, 18), "oak")]\n\ndef classify(sample, k=3):\n    nearest = sorted(TRAIN, key=lambda ex: math.dist(sample, ex[0]))[:k]\n    return Counter(label for _, label in nearest).most_common(1)[0][0]\n\nprint(classify((28, 4)), classify((60, 10)))\n',
  },
  practice: {
    heading: 'Distance and the nearest neighbour.',
    lede: 'Write `distance(a, b)` (Euclidean distance between two points) and `nearest_label(sample)` that returns the label of the single closest example in `TRAIN`.',
    starter: 'import math\n\nTRAIN = [((30, 4), "fern"), ((32, 5), "fern"), ((5, 1), "moss"), ((6, 1.5), "moss"), ((120, 20), "oak"), ((110, 18), "oak")]\n\n# def distance(a, b): ...\n# def nearest_label(sample): ...\n\nprint(distance((0, 0), (3, 4)), nearest_label((28, 4)))\n',
    checks: [
      { kind: 'call', label: 'distance((0, 0), (3, 4)) is 5', fn: 'distance', calls: [{ args: [[0, 0], [3, 4]], returns: 5.0 }, { args: [[1, 1], [1, 1]], returns: 0.0 }] },
      { kind: 'call', label: 'nearest_label picks the closest example', fn: 'nearest_label', calls: [{ args: [[28, 4]], returns: 'fern' }, { args: [[7, 1]], returns: 'moss' }, { args: [[100, 15]], returns: 'oak' }] },
    ],
    hints: ['`math.dist(a, b)` computes it, or `math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)`.', '`best = min(TRAIN, key=lambda ex: distance(sample, ex[0]))`', 'Return its label: `best[1]`.'],
  },
  challenge: {
    heading: 'One bad example fools the classifier.',
    lede: 'A mislabelled example has crept into `TRAIN`, so classifying by the single nearest neighbour gets the test set wrong. Make `classify(sample, k=3)` vote among the **k** nearest examples, then compute `accuracy` (fraction correct on `TEST`).',
    starter: 'import math\nfrom collections import Counter\n\nTRAIN = [((30, 4), "fern"), ((32, 5), "fern"), ((29, 4.5), "fern"), ((31, 4), "oak"),\n         ((5, 1), "moss"), ((6, 1.5), "moss"), ((120, 20), "oak"), ((110, 18), "oak")]\nTEST = [((31, 4.2), "fern"), ((5.5, 1.2), "moss"), ((115, 19), "oak")]\n\ndef classify(sample, k=3):\n    nearest = sorted(TRAIN, key=lambda ex: math.dist(sample, ex[0]))\n    return nearest[0][1]\n\naccuracy = 0\nprint(accuracy)\n',
    checks: [
      { kind: 'call', label: 'The vote outweighs the bad example', fn: 'classify', calls: [{ args: [[31, 4.2]], returns: 'fern' }] },
      { kind: 'call', label: 'Other species still right', fn: 'classify', calls: [{ args: [[5.5, 1.2]], returns: 'moss' }, { args: [[115, 19]], returns: 'oak' }] },
      { kind: 'call', label: 'k=1 is still allowed (hidden case)', fn: 'classify', calls: [{ args: [[31, 4.2]], kwargs: { k: 1 }, returns: 'oak' }] },
      { kind: 'var', label: 'accuracy on TEST is 1.0', name: 'accuracy', equals: 1.0 },
    ],
    hints: ['Take the first k: `sorted(...)[:k]`.', 'Vote: `Counter(label for _, label in nearest).most_common(1)[0][0]`.', '`accuracy = sum(classify(x) == y for x, y in TEST) / len(TEST)`'],
  },
  quiz: [
    { q: 'What does a label mean in ML?', opts: ['A feature', 'The right answer for an example', 'The distance'], a: 1, why: 'Training examples pair features with their labels.' },
    { q: 'Why use k = 3 instead of 1?', opts: ['It is faster', 'One noisy example matters less', 'It needs less data'], a: 1, why: 'A vote among several neighbours smooths out mistakes.' },
    { q: 'Where should you measure accuracy?', opts: ['On the training examples', 'On examples the model has not seen', 'Anywhere'], a: 1, why: 'Unseen test data shows how well it generalises.' },
  ],
};

const capstone: Lesson = {
  id: 'g08-l06', conceptId: 'expeditions.6', number: 6, title: 'Capstone: Greenhouse Monitor', minutes: 40, xp: 250, difficulty: 3,
  description: 'Bring it all together: classes, JSON, functions, files and tests in one small tool.',
  objectives: ['design a small class around real data', 'load data from JSON and produce a report', 'write the report to a file and check it with a test'],
  discover: {
    heading: 'Your own expedition.',
    lede: 'The capstone combines the galaxy\'s tools into one program you could actually use: load sensor data from **JSON**, wrap each bay in a **class** with methods, decide alerts with **conditions**, write a **report file**, and keep it honest with a **test**. Build it in two steps: the `Bay` class, then the `monitor` function.',
    example: 'import json\nfrom dataclasses import dataclass, field\nfrom statistics import mean\n\n@dataclass\nclass Bay:\n    name: str\n    readings: list = field(default_factory=list)\n\n    def average(self):\n        return round(mean(self.readings), 1) if self.readings else None\n\nRAW = \'{"B1": [21.5, 22.0], "B2": [30.5, 29.0], "B3": []}\'\nbays = [Bay(name, temps) for name, temps in json.loads(RAW).items()]\nfor b in bays:\n    print(b.name, b.average())\n',
    tagsHeading: 'What it uses',
    tags: [
      { name: '@dataclass', color: '#345a04', desc: 'The Bay model', examples: 'Bay("B1", [21.5])' },
      { name: 'json.loads', color: '#8a6000', desc: 'Sensor data in', examples: '{"B1": [...]}' },
      { name: 'if / elif', color: '#a8423c', desc: 'Alert rules', examples: 'too hot, too cold' },
      { name: 'files + tests', color: '#242820', desc: 'Report out, checked', examples: 'report.txt' },
    ],
    tip: 'Ideas to go further on your own: add humidity, read a real CSV export, or turn the report into a web page with the router from Lesson 02.',
  },
  experiment: {
    heading: 'Prototype the monitor.',
    lede: 'Play with the data.',
    steps: ['Run it as it is.', 'Add a bay with no readings and see `None`.', 'Add a `status()` method using thresholds of your choice.', 'Sort the bays by average, hottest first.'],
    code: 'import json\nfrom dataclasses import dataclass, field\nfrom statistics import mean\n\n@dataclass\nclass Bay:\n    name: str\n    readings: list = field(default_factory=list)\n\n    def average(self):\n        return round(mean(self.readings), 1) if self.readings else None\n\nRAW = \'{"B1": [21.5, 22.0], "B2": [30.5, 29.0], "B3": []}\'\nfor name, temps in json.loads(RAW).items():\n    print(Bay(name, temps).average())\n',
  },
  practice: {
    heading: 'Step 1: the Bay model.',
    lede: 'Make `Bay` a dataclass with `name` and `readings` (a list, empty by default). Give it `average()` (rounded to 1 decimal, `None` with no readings) and `status()`: `"no data"` without readings, `"too hot"` when the average is above **28**, `"too cold"` below **15**, otherwise `"ok"`.',
    starter: 'from dataclasses import dataclass, field\nfrom statistics import mean\n\n# @dataclass class Bay ...\n\nprint(Bay("B1", [21.5, 22.0]).status(), Bay("B2", [30.5, 29.0]).status(), Bay("B3").status())\n',
    checks: [
      { kind: 'expr', label: 'Bay holds a name and its own readings list', cases: [{ expr: '(Bay("B9").readings, Bay("B1", [1.0]).name)', equals: [[], 'B1'] }, { expr: '(lambda a, b: (a.readings.append(5), b.readings)[1])(Bay("a"), Bay("b"))', equals: [] }] },
      { kind: 'expr', label: 'average() rounds to 1 decimal, None when empty', cases: [{ expr: 'Bay("B1", [21.5, 22.0]).average()', equals: 21.8 }, { expr: 'Bay("B3").average()', equals: null }] },
      { kind: 'expr', label: 'status() applies the rules', cases: [{ expr: '[Bay("a", [21.0]).status(), Bay("b", [30.5, 29.0]).status(), Bay("c", [10.0]).status(), Bay("d").status()]', equals: ['ok', 'too hot', 'too cold', 'no data'] }] },
      { kind: 'expr', label: 'The thresholds are exact (hidden cases)', cases: [{ expr: '[Bay("a", [28.0]).status(), Bay("b", [15.0]).status(), Bay("c", [28.1]).status()]', equals: ['ok', 'ok', 'too hot'] }] },
    ],
    hints: ['Fields: `name: str` and `readings: list = field(default_factory=list)`.', '`def average(self): return round(mean(self.readings), 1) if self.readings else None`', 'In `status`, check "no data" first, then compare `self.average()`.'],
  },
  challenge: {
    heading: 'Step 2: the monitor.',
    lede: 'Write `monitor(raw_json)` that builds a `Bay` for each entry, writes `report.txt` with one line per bay in the form `B1: ok (21.8)` (or `B3: no data`), sorted by bay name, and returns the list of lines. Then make `test_monitor()` assert at least two facts about it, and call it.',
    starter: 'import json\nfrom dataclasses import dataclass, field\nfrom statistics import mean\n\n@dataclass\nclass Bay:\n    name: str\n    readings: list = field(default_factory=list)\n\n    def average(self):\n        return round(mean(self.readings), 1) if self.readings else None\n\n    def status(self):\n        if not self.readings:\n            return "no data"\n        avg = self.average()\n        if avg > 28:\n            return "too hot"\n        if avg < 15:\n            return "too cold"\n        return "ok"\n\nRAW = \'{"B2": [30.5, 29.0], "B1": [21.5, 22.0], "B3": []}\'\n\n# def monitor(raw_json): ...\n# def test_monitor(): ...\n\nprint(monitor(RAW))\n',
    checks: [
      { kind: 'call', label: 'monitor returns sorted report lines', fn: 'monitor', calls: [{ args: ['{"B2": [30.5, 29.0], "B1": [21.5, 22.0], "B3": []}'], returns: ['B1: ok (21.8)', 'B2: too hot (29.8)', 'B3: no data'] }] },
      { kind: 'expr', label: 'report.txt holds the same lines', cases: [{ expr: '(monitor(\'{"Z": [10.0], "A": [20.0]}\'), open("report.txt").read().splitlines())[1]', equals: ['A: ok (20.0)', 'Z: too cold (10.0)'] }] },
      { kind: 'call', label: 'test_monitor passes', fn: 'test_monitor', calls: [{ args: [], returns: null }] },
      { kind: 'source', label: 'test_monitor has at least two asserts', matches: '(?s)def test_monitor.*assert\\b.*assert\\b' },
    ],
    hints: ['`bays = sorted((Bay(n, t) for n, t in json.loads(raw_json).items()), key=lambda b: b.name)`', 'Line: `f"{b.name}: {b.status()} ({b.average()})"`, or `f"{b.name}: no data"` without readings. Write them joined with `"\\n"`.', 'In `test_monitor`, call `monitor` on a small JSON string and assert on the lines.'],
  },
  quiz: [
    { q: 'Why use field(default_factory=list) for readings?', opts: ['Speed', 'Each Bay gets its own list', 'JSON needs it'], a: 1, why: 'A shared default list would mix bays together.' },
    { q: 'Why sort the report by bay name?', opts: ['Python requires it', 'Stable, predictable output that is easy to test and read', 'Files must be sorted'], a: 1, why: 'Deterministic output makes reports and tests reliable.' },
    { q: 'What should a test of monitor check?', opts: ['That it runs quickly', 'That known input gives the expected lines', 'Nothing; reports cannot be tested'], a: 1, why: 'Feed known data in and assert on what comes out.' },
  ],
};

export const GALAXY_08: Lesson[] = [data, web, bots, game, ml, capstone];
