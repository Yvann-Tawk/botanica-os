// Galaxy 07 · The Frontier: the strange flora at the edge of the language.
import type { LessonCore as Lesson } from './types';

const gens: Lesson = {
  id: 'g07-l01', conceptId: 'frontier.1', number: 1, title: 'Iterators & generators', minutes: 22, xp: 225, difficulty: 3,
  description: 'Produce values one at a time, only when asked, with yield.',
  objectives: ['know that a `for` loop pulls values with `next()` from an iterator', 'write a generator function with `yield`', 'use a generator expression for a lazy sequence'],
  discover: {
    heading: 'Seeds released one at a time.',
    lede: 'A **generator** function uses `yield` instead of `return`. Calling it does not run it yet; it hands back an iterator that runs **until the next `yield`** each time a value is asked for. Values are produced lazily, so a generator can describe a huge (even endless) sequence without storing it.',
    example: 'def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\ngen = countdown(3)\nprint(next(gen), next(gen))      # 3 2\nprint(list(countdown(4)))         # [4, 3, 2, 1]\n\nsquares = (x * x for x in range(5))   # a generator expression: round brackets\nprint(sum(squares))\n\nfor n in countdown(2):\n    print("tick", n)\n',
    tagsHeading: 'Lazy machinery',
    tags: [
      { name: 'yield x', color: '#345a04', desc: 'Hand out x, pause here', examples: 'resumes on next()' },
      { name: 'next(it)', color: '#8a6000', desc: 'Ask for the next value', examples: 'StopIteration at the end' },
      { name: '(x for …)', color: '#a8423c', desc: 'Generator expression', examples: 'sum(x for x in xs)' },
      { name: 'list(gen)', color: '#242820', desc: 'Pull everything at once', examples: 'only if it ends!' },
    ],
    tip: 'A generator can be used up only once. Call the function again for a fresh one.',
  },
  experiment: {
    heading: 'Pull the seeds.',
    lede: 'Step through by hand.',
    steps: ['Run it as it is.', 'Call `next(gen)` two more times and read the StopIteration.', 'Make `squares` a list with square brackets and compare.', 'Write an endless generator with `while True` and take 5 values using `zip(range(5), it)`.'],
    code: 'def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\ngen = countdown(3)\nprint(next(gen), next(gen))\nprint(list(countdown(4)))\nprint(sum(x * x for x in range(5)))\n',
  },
  practice: {
    heading: 'A countdown generator.',
    lede: 'Write `countdown(n)` as a **generator** that yields `n`, `n - 1`, … down to `1`.',
    starter: '# define countdown(n) with yield\n\nprint(list(countdown(5)))\n',
    checks: [
      { kind: 'expr', label: 'countdown is a generator function', cases: [{ expr: '__import__("inspect").isgeneratorfunction(countdown)', equals: true }] },
      { kind: 'expr', label: 'list(countdown(5)) is [5, 4, 3, 2, 1]', cases: [{ expr: 'list(countdown(5))', equals: [5, 4, 3, 2, 1] }] },
      { kind: 'expr', label: 'Edge cases (hidden)', cases: [{ expr: 'list(countdown(0))', equals: [] }, { expr: 'list(countdown(1))', equals: [1] }] },
    ],
    hints: ['A loop that yields instead of appending to a list.', '`while n > 0:` / `    yield n` / `    n -= 1`', 'No return statement is needed.'],
  },
  challenge: {
    heading: 'The sensor filter loads everything.',
    lede: 'Rewrite `readings_above(values, limit)` as a **generator** that yields only readings **strictly above** `limit`. It currently builds a whole list, and it lets readings equal to the limit through.',
    starter: 'def readings_above(values, limit):\n    result = []\n    for v in values:\n        if v >= limit:\n            result.append(v)\n    return result\n\nprint(list(readings_above([18, 22, 25, 22, 30], 22)))\n',
    checks: [
      { kind: 'expr', label: 'It is a generator function', cases: [{ expr: '__import__("inspect").isgeneratorfunction(readings_above)', equals: true }] },
      { kind: 'expr', label: 'Only values above the limit', cases: [{ expr: 'list(readings_above([18, 22, 25, 22, 30], 22))', equals: [25, 30] }, { expr: 'list(readings_above([], 5))', equals: [] }] },
      { kind: 'expr', label: 'Works lazily on an endless stream (hidden case)', cases: [{ expr: 'next(readings_above(__import__("itertools").count(), 1000))', equals: 1001 }] },
    ],
    hints: ['Replace `result.append(v)` with `yield v` and drop the list.', 'Strictly above means `>`, not `>=`.', 'A generator never needs `return result`.'],
  },
  quiz: [
    { q: 'What does calling a generator function return?', opts: ['The first value', 'An iterator, without running the body yet', 'A list of all values'], a: 1, why: 'The body runs step by step as values are requested.' },
    { q: 'What happens at the end of a generator?', opts: ['It restarts', 'next() raises StopIteration', 'It returns None forever'], a: 1, why: 'A for loop handles StopIteration for you.' },
    { q: 'Which is a generator expression?', opts: ['[x for x in xs]', '(x for x in xs)', '{x for x in xs}'], a: 1, why: 'Round brackets make it lazy; square brackets build a list; curly braces build a set.' },
  ],
};

const decorators: Lesson = {
  id: 'g07-l02', conceptId: 'frontier.2', number: 2, title: 'Decorators', minutes: 22, xp: 225, difficulty: 3,
  description: 'Wrap functions with extra behaviour, using the @ syntax.',
  objectives: ['treat functions as values: pass them in and return them', 'write a decorator that returns a wrapper function', 'pass any arguments through with `*args, **kwargs`'],
  discover: {
    heading: 'Grafts on the stem.',
    lede: 'Functions are values: you can pass one into another function and get a new one back. A **decorator** does exactly that: it takes a function and returns a **wrapper** that adds behaviour around it. `@decorator` above a `def` is shorthand for `f = decorator(f)`.',
    example: 'import functools\n\ndef shout(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).upper()\n    return wrapper\n\n@shout\ndef greet(name):\n    return f"welcome aboard, {name}"\n\nprint(greet("ada"))          # WELCOME ABOARD, ADA\nprint(greet.__name__)        # greet, thanks to functools.wraps\n',
    tagsHeading: 'Decorator anatomy',
    tags: [
      { name: 'def deco(func):', color: '#345a04', desc: 'Takes a function', examples: 'shout(greet)' },
      { name: 'def wrapper(*a, **k):', color: '#8a6000', desc: 'Accepts any call', examples: 'forwards it' },
      { name: 'return wrapper', color: '#a8423c', desc: 'The new function', examples: 'not wrapper()' },
      { name: '@deco', color: '#242820', desc: 'Same as f = deco(f)', examples: 'above the def' },
    ],
    tip: '`functools.wraps(func)` copies the original name and docstring onto the wrapper, so tools and error messages still show the real name.',
  },
  experiment: {
    heading: 'Graft a new behaviour.',
    lede: 'Wrap and unwrap.',
    steps: ['Run it as it is.', 'Remove `@shout` and run again.', 'Write `quiet = shout(lambda: "hush")` and call `quiet()`.', 'Remove `@functools.wraps(func)` and print `greet.__name__`.'],
    code: 'import functools\n\ndef shout(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).upper()\n    return wrapper\n\n@shout\ndef greet(name):\n    return f"welcome aboard, {name}"\n\nprint(greet("ada"), greet.__name__)\n',
  },
  practice: {
    heading: 'A shouting decorator.',
    lede: 'Write a decorator `shout` whose wrapper calls the original function and returns its text result in **uppercase**. Use it on `greet`.',
    starter: '# define shout(func) here\n\n@shout\ndef greet(name):\n    return f"welcome aboard, {name}"\n\nprint(greet("ada"))\n',
    checks: [
      { kind: 'expr', label: 'greet("ada") is uppercased', cases: [{ expr: 'greet("ada")', equals: 'WELCOME ABOARD, ADA' }] },
      { kind: 'expr', label: 'shout works on any function (hidden cases)', cases: [{ expr: 'shout(lambda: "hi")()', equals: 'HI' }, { expr: 'shout(lambda a, b="x": a + b)("p", b="q")', equals: 'PQ' }] },
    ],
    hints: ['`def shout(func):` with an inner `def wrapper(*args, **kwargs):`.', 'Inside the wrapper: `return func(*args, **kwargs).upper()`.', 'The decorator must `return wrapper` (without calling it).'],
  },
  challenge: {
    heading: 'The call counter breaks everything.',
    lede: '`count_calls` should leave the function working and keep a running count in `wrapper.calls`. Decorated functions now return `None` and reject their arguments. Fix the decorator.',
    starter: 'def count_calls(func):\n    def wrapper():\n        wrapper.calls += 1\n        func()\n    wrapper.calls = 0\n\n@count_calls\ndef water(bay, litres=1):\n    return f"{bay}: {litres} L"\n\nprint(water("B1"), water("B2", litres=3))\nprint(water.calls)\n',
    checks: [
      { kind: 'expr', label: 'water still returns its result', cases: [{ expr: 'water("B1")', equals: 'B1: 1 L' }, { expr: 'water("B2", litres=3)', equals: 'B2: 3 L' }] },
      { kind: 'expr', label: 'Calls are counted', cases: [{ expr: '(lambda f: (f(), f(), f.calls)[2])(count_calls(lambda: None))', equals: 2 }] },
      { kind: 'runs', label: 'The program runs' },
    ],
    hints: ['The decorator never returns the wrapper.', 'The wrapper must accept and forward any arguments: `*args, **kwargs`.', 'And it must `return func(*args, **kwargs)`.'],
  },
  quiz: [
    { q: '@deco above def f(): … is the same as…', opts: ['f = deco', 'f = deco(f)', 'deco = f(deco)'], a: 1, why: 'The decorator is called with the function, and the result replaces it.' },
    { q: 'Why give the wrapper *args, **kwargs?', opts: ['Style', 'So it can forward any arguments', 'To make it faster'], a: 1, why: 'The wrapper should accept whatever the original accepts.' },
    { q: 'What does functools.wraps do?', opts: ['Caches results', 'Copies the original name and docstring', 'Times the function'], a: 1, why: 'It keeps the decorated function looking like the original.' },
  ],
};

const contexts: Lesson = {
  id: 'g07-l03', conceptId: 'frontier.3', number: 3, title: 'Context managers', minutes: 20, xp: 225, difficulty: 3,
  description: 'Set up and always tidy up, with the with statement.',
  objectives: ['know what `with` does: enter, run the block, always exit', 'write a context manager with `@contextmanager` and `yield`', 'write one as a class with `__enter__` and `__exit__`'],
  discover: {
    heading: 'Airlocks.',
    lede: 'A `with` block runs set-up code, then your block, then clean-up code **even if the block fails**: like an airlock that always closes. You have used it with `open`. Write your own with `contextlib.contextmanager`: code before `yield` is the set-up, code after it (in a `finally`) the clean-up.',
    example: 'from contextlib import contextmanager\n\n@contextmanager\ndef bay_door(log):\n    log.append("open")\n    try:\n        yield\n    finally:\n        log.append("closed")\n\nlog = []\nwith bay_door(log):\n    log.append("planting")\nprint(log)\n\ntry:\n    with bay_door(log):\n        raise RuntimeError("seed spill")\nexcept RuntimeError:\n    pass\nprint(log)                  # still closed after the error\n',
    tagsHeading: 'Two ways to build one',
    tags: [
      { name: '@contextmanager', color: '#345a04', desc: 'A generator with one yield', examples: 'set-up / yield / clean-up' },
      { name: 'try / finally', color: '#8a6000', desc: 'Clean up even on errors', examples: 'around the yield' },
      { name: '__enter__', color: '#a8423c', desc: 'Class version: set-up', examples: 'its return is the as-value' },
      { name: '__exit__', color: '#242820', desc: 'Class version: clean-up', examples: 'always called' },
    ],
    tip: 'Whatever `__enter__` returns (or what the generator yields) becomes the name after `as`.',
  },
  experiment: {
    heading: 'Cycle the airlock.',
    lede: 'Try it with and without errors.',
    steps: ['Run it as it is.', 'Remove the `try`/`finally` and run the failing block: the door stays open.', 'Make it `yield len(log)` and use `with bay_door(log) as n:`.', 'Nest two `with bay_door(log):` blocks.'],
    code: 'from contextlib import contextmanager\n\n@contextmanager\ndef bay_door(log):\n    log.append("open")\n    try:\n        yield\n    finally:\n        log.append("closed")\n\nlog = []\nwith bay_door(log):\n    log.append("planting")\nprint(log)\n',
  },
  practice: {
    heading: 'The bay door.',
    lede: 'Write `bay_door(log)` with `@contextmanager`: it appends `"open"` to `log` on entry and `"closed"` on exit, **even if the block raises an error**.',
    starter: 'from contextlib import contextmanager\n\n# define bay_door(log)\n\nlog = []\nwith bay_door(log):\n    log.append("planting")\nprint(log)\n',
    checks: [
      { kind: 'var', label: 'log is ["open", "planting", "closed"]', name: 'log', equals: ['open', 'planting', 'closed'] },
      { kind: 'expr', label: 'Closes even when the block raises an error', cases: [{ expr: '(lambda L: (lambda c: (c.__enter__(), c.__exit__(ValueError, ValueError("boom"), None), L)[2])(bay_door(L)))([])', equals: ['open', 'closed'] }] },
      { kind: 'expr', label: 'Is a context manager built with @contextmanager', cases: [{ expr: 'hasattr(bay_door([]), "__enter__")', equals: true }] },
    ],
    hints: ['Decorate a generator function with `@contextmanager`.', 'Append `"open"`, then `try:` / `yield` / `finally:` append `"closed"`.', 'Without `try`/`finally`, an error skips the clean-up.'],
  },
  challenge: {
    heading: 'The greenhouse lock is broken.',
    lede: 'The `Greenhouse` class should work with `with Greenhouse("B2") as gh:`. Inside the block, `gh` should be the greenhouse itself, and `gh.locked` should be `False`; after the block it must be `True` again. Fix the class.',
    starter: 'class Greenhouse:\n    def __init__(self, bay):\n        self.bay = bay\n        self.locked = True\n\n    def __enter__(self):\n        self.locked = False\n\nwith Greenhouse("B2") as gh:\n    print(gh.bay, "unlocked:", not gh.locked)\nprint("locked again:", gh.locked)\n',
    checks: [
      { kind: 'runs', label: 'Runs without an error' },
      { kind: 'expr', label: 'with gives back the greenhouse, unlocked', cases: [{ expr: '(lambda g: (g.__enter__() is g, g.locked))(Greenhouse("A1"))', equals: [true, false] }] },
      { kind: 'expr', label: 'Locks again on exit', cases: [{ expr: '(lambda g: (g.__enter__(), g.__exit__(None, None, None), g.locked)[2])(Greenhouse("A1"))', equals: true }] },
    ],
    hints: ['`with` needs both `__enter__` and `__exit__`.', '`__enter__` must `return self` so `as gh` gets the greenhouse.', '`def __exit__(self, exc_type, exc, tb): self.locked = True`'],
  },
  quiz: [
    { q: 'When does a context manager\'s clean-up run?', opts: ['Only on success', 'Only on error', 'Always, when the block ends'], a: 2, why: 'That is the point of with: clean-up is guaranteed.' },
    { q: 'In with X() as y:, what is y?', opts: ['The X object always', 'Whatever __enter__ returns', 'None'], a: 1, why: 'The as-name gets __enter__\'s return value (often self).' },
    { q: 'In a @contextmanager function, what separates set-up from clean-up?', opts: ['return', 'yield', 'pass'], a: 1, why: 'Code before yield runs on entry, after it on exit.' },
  ],
};

const hints: Lesson = {
  id: 'g07-l04', conceptId: 'frontier.4', number: 4, title: 'Type hints', minutes: 18, xp: 225, difficulty: 2,
  description: 'Document what types functions expect and return, so people and tools can check.',
  objectives: ['annotate parameters and return values', 'use `list[float]`, `dict[str, int]` and `X | None`', 'know hints are not enforced when the program runs'],
  discover: {
    heading: 'Labels on the specimen drawers.',
    lede: '**Type hints** say what a function expects and returns: `def average(values: list[float]) -> float:`. Python itself ignores them when running, but editors and checkers (like mypy) use them to catch mistakes, and readers use them to understand code quickly. `int | None` means "an int, or None".',
    example: 'def average(values: list[float]) -> float:\n    return sum(values) / len(values)\n\ndef find(names: list[str], target: str) -> int | None:\n    for i, name in enumerate(names):\n        if name == target:\n            return i\n    return None\n\nstock: dict[str, int] = {"fern": 12}\nprint(average([20.0, 22.0]), find(["fern", "moss"], "moss"), find([], "oak"))\nprint(average.__annotations__)\n',
    tagsHeading: 'Hint shapes',
    tags: [
      { name: 'x: int', color: '#345a04', desc: 'A parameter\'s type', examples: 'def f(x: int)' },
      { name: '-> str', color: '#8a6000', desc: 'The return type', examples: 'def f() -> str:' },
      { name: 'list[float]', color: '#a8423c', desc: 'Containers with contents', examples: 'dict[str, int]' },
      { name: 'int | None', color: '#242820', desc: 'Either type', examples: 'might be missing' },
    ],
    tip: '`enumerate(names)` gives `(index, item)` pairs: handy when you need positions.',
  },
  experiment: {
    heading: 'Label the drawers.',
    lede: 'See what hints do, and do not do.',
    steps: ['Run it as it is.', 'Call `average(["a", "b"])`: Python still runs it and fails inside, hints did not stop it.', 'Print `find.__annotations__`.', 'Add hints to a function of your own.'],
    code: 'def average(values: list[float]) -> float:\n    return sum(values) / len(values)\n\nprint(average([20.0, 22.0]))\nprint(average.__annotations__)\n',
  },
  practice: {
    heading: 'Annotate the averager.',
    lede: 'Add hints to `average`: `values` is a `list[float]` and it returns a `float`. Its behaviour stays the same.',
    starter: 'def average(values):\n    return sum(values) / len(values)\n\nprint(average([20.0, 22.0]))\n',
    checks: [
      { kind: 'expr', label: 'values is hinted as list[float]', cases: [{ expr: 'average.__annotations__.get("values") == list[float]', equals: true }] },
      { kind: 'expr', label: 'It returns float (hinted)', cases: [{ expr: 'average.__annotations__.get("return") is float', equals: true }] },
      { kind: 'call', label: 'It still averages', fn: 'average', calls: [{ args: [[20.0, 22.0]], returns: 21.0 }] },
    ],
    hints: ['Hints go after parameter names with a colon.', 'The return hint goes before the final colon: `-> float`.', '`def average(values: list[float]) -> float:`'],
  },
  challenge: {
    heading: 'find() lies with -1.',
    lede: 'Rewrite `find(names, target)` so it returns the index of `target`, or **`None`** (not -1) when it is missing. Hint it: `names: list[str]`, `target: str`, returning `int | None`.',
    starter: 'def find(names, target):\n    for i in range(len(names)):\n        if names[i] == target:\n            return i\n    return -1\n\nprint(find(["fern", "moss"], "moss"), find(["fern"], "oak"))\n',
    checks: [
      { kind: 'call', label: 'Finds positions', fn: 'find', calls: [{ args: [['fern', 'moss'], 'moss'], returns: 1 }, { args: [['oak'], 'oak'], returns: 0 }] },
      { kind: 'call', label: 'Missing gives None', fn: 'find', calls: [{ args: [['fern'], 'oak'], returns: null }, { args: [[], 'x'], returns: null }] },
      { kind: 'expr', label: 'Hinted as (list[str], str) -> int | None', cases: [{ expr: '(lambda a: a.get("names") == list[str] and a.get("target") is str and a.get("return") == (int | None))(find.__annotations__)', equals: true }] },
    ],
    hints: ['Return `None` at the end instead of `-1`.', 'Hints: `def find(names: list[str], target: str) -> int | None:`', '`enumerate` gives you index and name together.'],
  },
  quiz: [
    { q: 'Does Python stop average("ab") if values is hinted list[float]?', opts: ['Yes, a TypeError from the hint', 'No, hints are not enforced at runtime', 'Only in a with block'], a: 1, why: 'Checkers and editors use hints; the interpreter does not enforce them.' },
    { q: 'What does -> str after the parameters mean?', opts: ['The function returns a str', 'The first parameter is a str', 'The function prints a str'], a: 0, why: 'It is the return type hint.' },
    { q: 'How do you hint "a list of whole numbers"?', opts: ['list(int)', 'list[int]', '[int]'], a: 1, why: 'Square brackets give the type of the contents.' },
  ],
};

const asyncs: Lesson = {
  id: 'g07-l05', conceptId: 'frontier.5', number: 5, title: 'async & await', minutes: 25, xp: 225, difficulty: 3,
  description: 'Wait for many slow things at once with coroutines and asyncio.',
  objectives: ['define a coroutine with `async def` and wait inside it with `await`', 'run coroutines together with `asyncio.gather`', 'start everything with `asyncio.run`'],
  discover: {
    heading: 'Watering every bay at once.',
    lede: 'Some work is mostly **waiting**: for a network reply, a sensor, a timer. A **coroutine** (`async def`) can `await` such a wait and let other coroutines run meanwhile. `asyncio.gather` runs several together; `asyncio.run(main())` starts the whole thing. Three 1-second waits gathered take about 1 second, not 3.',
    example: 'import asyncio, time\n\nasync def water(bay, seconds):\n    await asyncio.sleep(seconds)      # pretend this is slow\n    return f"{bay} watered"\n\nasync def main():\n    return await asyncio.gather(water("B1", 0.3), water("B2", 0.2), water("B3", 0.1))\n\nstart = time.perf_counter()\nprint(asyncio.run(main()))\nprint(f"took {time.perf_counter() - start:.1f} s")   # about 0.3, not 0.6\n',
    tagsHeading: 'Async words',
    tags: [
      { name: 'async def', color: '#345a04', desc: 'Defines a coroutine', examples: 'calling it does not run it' },
      { name: 'await x', color: '#8a6000', desc: 'Wait here, let others run', examples: 'await asyncio.sleep(1)' },
      { name: 'gather(…)', color: '#a8423c', desc: 'Run several together', examples: 'results in order' },
      { name: 'asyncio.run', color: '#242820', desc: 'Start the event loop', examples: 'asyncio.run(main())' },
    ],
    tip: 'This needs a browser that supports WebAssembly stack switching (current Chrome and Edge do). If yours does not, the console will say `asyncio.run` is unavailable.',
  },
  experiment: {
    heading: 'Time the watering.',
    lede: 'Compare gathered and one-by-one.',
    steps: ['Run it as it is and note the time.', 'Replace gather with three separate `await water(...)` lines and compare the time.', 'Call `water("B1", 1)` without await and print it: a coroutine object, not a result.', 'Gather ten bays with a comprehension.'],
    code: 'import asyncio, time\n\nasync def water(bay, seconds):\n    await asyncio.sleep(seconds)\n    return f"{bay} watered"\n\nasync def main():\n    return await asyncio.gather(water("B1", 0.3), water("B2", 0.2), water("B3", 0.1))\n\nstart = time.perf_counter()\nprint(asyncio.run(main()), f"{time.perf_counter() - start:.1f} s")\n',
  },
  practice: {
    heading: 'Water the bays together.',
    lede: 'Write `water(bay)` as a coroutine that waits 0.1 seconds (`asyncio.sleep`) and returns `"<bay> watered"`. In `main()`, gather it for every bay in `bays`. Store the result of `asyncio.run(main())` in `results`.',
    starter: 'import asyncio\n\nbays = ["B1", "B2", "B3"]\n\n# async def water(bay): ...\n# async def main(): ...\n\n# results = ...\nprint(results)\n',
    checks: [
      { kind: 'var', label: 'results lists every bay, in order', name: 'results', equals: ['B1 watered', 'B2 watered', 'B3 watered'] },
      { kind: 'expr', label: 'water is a coroutine function', cases: [{ expr: '__import__("inspect").iscoroutinefunction(water)', equals: true }] },
      { kind: 'source', label: 'Uses asyncio.gather', matches: 'gather\\(' },
      { kind: 'variants', label: 'Works for other bays (hidden cases)', variants: [{ set: { bays: ['X'] }, expect: { results: ['X watered'] } }] },
    ],
    hints: ['`async def water(bay):` / `    await asyncio.sleep(0.1)` / `    return f"{bay} watered"`', '`async def main(): return await asyncio.gather(*(water(b) for b in bays))`', '`results = asyncio.run(main())`'],
  },
  challenge: {
    heading: 'The sensors never answer.',
    lede: '`readings` should be the three sensor values. Instead it holds strange coroutine objects (and Python warns that they were never awaited). Fix it so the coroutines actually run, together.',
    starter: 'import asyncio\n\nasync def read_sensor(bay, value):\n    await asyncio.sleep(0.05)\n    return value\n\nasync def main():\n    return [read_sensor("B1", 21.5), read_sensor("B2", 19.0), read_sensor("B3", 23.0)]\n\nreadings = asyncio.run(main())\nprint(readings)\n',
    checks: [
      { kind: 'var', label: 'readings is [21.5, 19.0, 23.0]', name: 'readings', equals: [21.5, 19.0, 23.0] },
      { kind: 'source', label: 'Awaits them together with gather', matches: 'await\\s+asyncio\\.gather\\(' },
    ],
    hints: ['Calling a coroutine function only creates a coroutine; nothing runs until it is awaited.', 'Gather them and await the gather.', '`return await asyncio.gather(read_sensor("B1", 21.5), …)`'],
  },
  quiz: [
    { q: 'What does calling an async def function return?', opts: ['Its result', 'A coroutine object', 'None'], a: 1, why: 'It must be awaited (or run) to execute.' },
    { q: 'Three gathered sleeps of 1 s each take about…', opts: ['1 s', '3 s', '0 s'], a: 0, why: 'They wait at the same time.' },
    { q: 'Where can you use await?', opts: ['Anywhere', 'Inside async def functions', 'Only at the top of a file'], a: 1, why: 'await belongs inside coroutines.' },
  ],
};

const testing: Lesson = {
  id: 'g07-l06', conceptId: 'frontier.6', number: 6, title: 'Testing with assert & unittest', minutes: 22, xp: 225, difficulty: 3,
  description: 'Write code that checks your code, so mistakes announce themselves.',
  objectives: ['state an expectation with `assert`', 'write test functions that fail loudly when behaviour is wrong', 'organise tests in a `unittest.TestCase` and run them'],
  discover: {
    heading: 'Instruments that watch the instruments.',
    lede: 'An `assert condition` does nothing when the condition is true and raises `AssertionError` when it is false. A **test** is a function full of asserts about another function. `unittest` (in the standard library) groups tests into classes, runs them all and reports which failed. Outside the browser, many projects use the `pytest` package, which runs plain assert-based tests.',
    example: 'import unittest\n\ndef celsius_to_f(c):\n    return c * 9 / 5 + 32\n\ndef test_conversion():\n    assert celsius_to_f(0) == 32\n    assert celsius_to_f(100) == 212\n    assert celsius_to_f(-40) == -40\n\ntest_conversion()\nprint("assert tests passed")\n\nclass TestConversion(unittest.TestCase):\n    def test_freezing(self):\n        self.assertEqual(celsius_to_f(0), 32)\n\n    def test_body_temperature(self):\n        self.assertAlmostEqual(celsius_to_f(37), 98.6)\n\nunittest.main(argv=["tests"], exit=False)\n',
    tagsHeading: 'Testing tools',
    tags: [
      { name: 'assert x == y', color: '#345a04', desc: 'Fails loudly if false', examples: 'AssertionError' },
      { name: 'TestCase', color: '#8a6000', desc: 'A class of tests', examples: 'methods named test_…' },
      { name: 'assertEqual', color: '#a8423c', desc: 'Compare with a clear message', examples: 'assertAlmostEqual for floats' },
      { name: 'unittest.main', color: '#242820', desc: 'Find and run tests', examples: 'exit=False here' },
    ],
    tip: 'Good tests include edge cases: zero, negatives, empty lists, the boundaries between branches.',
  },
  experiment: {
    heading: 'Break it on purpose.',
    lede: 'Watch the tests catch a bug.',
    steps: ['Run it as it is; read the unittest report in the console.', 'Change `+ 32` to `+ 30` and run again.', 'Add a test for `celsius_to_f(37.5)`.', 'Add a deliberately wrong assert and read the AssertionError.'],
    code: 'import unittest\n\ndef celsius_to_f(c):\n    return c * 9 / 5 + 32\n\nclass TestConversion(unittest.TestCase):\n    def test_freezing(self):\n        self.assertEqual(celsius_to_f(0), 32)\n\n    def test_boiling(self):\n        self.assertEqual(celsius_to_f(100), 212)\n\nunittest.main(argv=["tests"], exit=False)\n',
  },
  practice: {
    heading: 'Guard the converter.',
    lede: 'Write `test_conversion()` with **at least three** asserts about `celsius_to_f` (for example 0 → 32, 100 → 212, -40 → -40), then call it. It must pass for the correct converter.',
    starter: 'def celsius_to_f(c):\n    return c * 9 / 5 + 32\n\n# def test_conversion(): ...\n\ntest_conversion()\nprint("all tests passed")\n',
    checks: [
      { kind: 'call', label: 'test_conversion passes for the correct converter', fn: 'test_conversion', calls: [{ args: [], returns: null }] },
      { kind: 'source', label: 'Has at least three asserts', matches: '(?s)assert\\b.*assert\\b.*assert\\b' },
      { kind: 'output', label: 'Reports success', regex: 'all tests passed' },
    ],
    hints: ['A test is a plain function: `def test_conversion():`.', 'Each line states one fact: `assert celsius_to_f(0) == 32`.', 'Add at least two more, such as 100 → 212 and -40 → -40.'],
  },
  challenge: {
    heading: 'The tests caught something.',
    lede: 'The `TestTray` tests fail: `Tray.add` has a bug. Run the program to see which test fails, then fix **the code** (not the tests) so both tests pass.',
    starter: 'import unittest\n\nclass Tray:\n    def __init__(self):\n        self.plants = []\n\n    def add(self, plant):\n        if plant not in self.plants:\n            self.plants = [plant]\n\n    def count(self):\n        return len(self.plants)\n\nclass TestTray(unittest.TestCase):\n    def test_adds_plants(self):\n        t = Tray()\n        t.add("fern")\n        t.add("moss")\n        self.assertEqual(t.count(), 2)\n\n    def test_ignores_duplicates(self):\n        t = Tray()\n        t.add("fern")\n        t.add("fern")\n        self.assertEqual(t.count(), 1)\n\nunittest.main(argv=["tests"], exit=False)\n',
    checks: [
      { kind: 'expr', label: 'Both TestTray tests pass', cases: [{ expr: '(lambda u, io: (lambda r: (r.testsRun, r.wasSuccessful()))(u.TextTestRunner(stream=io.StringIO()).run(u.defaultTestLoader.loadTestsFromTestCase(TestTray))))(__import__("unittest"), __import__("io"))', equals: [2, true] }] },
      { kind: 'expr', label: 'Tray keeps plants in order (hidden case)', cases: [{ expr: '(lambda t: (t.add("a"), t.add("b"), t.add("a"), t.plants)[3])(Tray())', equals: ['a', 'b'] }] },
    ],
    hints: ['Read the failure: `test_adds_plants` expected 2 and got 1.', '`self.plants = [plant]` replaces the whole list.', 'Use `self.plants.append(plant)`.'],
  },
  quiz: [
    { q: 'What does assert 2 + 2 == 4 do?', opts: ['Prints True', 'Nothing', 'Raises AssertionError'], a: 1, why: 'A true assert is silent.' },
    { q: 'How does unittest find tests in a TestCase?', opts: ['Every method', 'Methods whose names start with test', 'Methods with assert'], a: 1, why: 'Only test_… methods are run as tests.' },
    { q: 'When a test fails, what should you usually change?', opts: ['The test, so it passes', 'The code, if the test states the right behaviour', 'Nothing'], a: 1, why: 'Tests describe intended behaviour; fix the code unless the test itself is wrong.' },
  ],
};

export const GALAXY_07: Lesson[] = [gens, decorators, contexts, hints, asyncs, testing];
