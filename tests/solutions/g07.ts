import type { Solutions } from './types';

export const G07: Solutions = {
  'g07-l01': {
    practice: ['def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nprint(list(countdown(5)))\n', 'def countdown(n):\n    for i in range(n, 0, -1):\n        yield i\n'],
    challenge: ['def readings_above(values, limit):\n    for v in values:\n        if v > limit:\n            yield v\n\nprint(list(readings_above([18, 22, 25, 22, 30], 22)))\n', 'def readings_above(values, limit):\n    yield from (v for v in values if v > limit)\n'],
    wrong: { practice: ['def countdown(n):\n    return list(range(n, 0, -1))\n'], challenge: ['def readings_above(values, limit):\n    return [v for v in values if v > limit]\n'] },
  },
  'g07-l02': {
    practice: ['import functools\n\ndef shout(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).upper()\n    return wrapper\n\n@shout\ndef greet(name):\n    return f"welcome aboard, {name}"\n\nprint(greet("ada"))\n'],
    challenge: ['def count_calls(func):\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n\n@count_calls\ndef water(bay, litres=1):\n    return f"{bay}: {litres} L"\n\nprint(water("B1"), water("B2", litres=3))\nprint(water.calls)\n'],
    wrong: { practice: ['def shout(func):\n    def wrapper(name):\n        return func(name).upper()\n    return wrapper\n\n@shout\ndef greet(name):\n    return f"welcome aboard, {name}"\n'] },
  },
  'g07-l03': {
    practice: ['from contextlib import contextmanager\n\n@contextmanager\ndef bay_door(log):\n    log.append("open")\n    try:\n        yield\n    finally:\n        log.append("closed")\n\nlog = []\nwith bay_door(log):\n    log.append("planting")\nprint(log)\n'],
    challenge: ['class Greenhouse:\n    def __init__(self, bay):\n        self.bay = bay\n        self.locked = True\n\n    def __enter__(self):\n        self.locked = False\n        return self\n\n    def __exit__(self, exc_type, exc, tb):\n        self.locked = True\n\nwith Greenhouse("B2") as gh:\n    print(gh.bay, "unlocked:", not gh.locked)\nprint("locked again:", gh.locked)\n'],
    wrong: { practice: ['from contextlib import contextmanager\n\n@contextmanager\ndef bay_door(log):\n    log.append("open")\n    yield\n    log.append("closed")\n\nlog = []\nwith bay_door(log):\n    log.append("planting")\n'] },
  },
  'g07-l04': {
    practice: ['def average(values: list[float]) -> float:\n    return sum(values) / len(values)\n\nprint(average([20.0, 22.0]))\n'],
    challenge: ['def find(names: list[str], target: str) -> int | None:\n    for i, name in enumerate(names):\n        if name == target:\n            return i\n    return None\n\nprint(find(["fern", "moss"], "moss"), find(["fern"], "oak"))\n'],
    wrong: { challenge: ['def find(names: list[str], target: str) -> int | None:\n    return names.index(target) if target in names else -1\n'] },
  },
  'g07-l05': {
    practice: ['import asyncio\n\nbays = ["B1", "B2", "B3"]\n\nasync def water(bay):\n    await asyncio.sleep(0.1)\n    return f"{bay} watered"\n\nasync def main():\n    return await asyncio.gather(*(water(b) for b in bays))\n\nresults = asyncio.run(main())\nprint(results)\n'],
    challenge: ['import asyncio\n\nasync def read_sensor(bay, value):\n    await asyncio.sleep(0.05)\n    return value\n\nasync def main():\n    return await asyncio.gather(read_sensor("B1", 21.5), read_sensor("B2", 19.0), read_sensor("B3", 23.0))\n\nreadings = asyncio.run(main())\nprint(readings)\n'],
    wrong: { practice: ['bays = ["B1", "B2", "B3"]\nresults = [f"{b} watered" for b in bays]\n'] },
  },
  'g07-l06': {
    practice: ['def celsius_to_f(c):\n    return c * 9 / 5 + 32\n\ndef test_conversion():\n    assert celsius_to_f(0) == 32\n    assert celsius_to_f(100) == 212\n    assert celsius_to_f(-40) == -40\n\ntest_conversion()\nprint("all tests passed")\n'],
    challenge: ['import unittest\n\nclass Tray:\n    def __init__(self):\n        self.plants = []\n\n    def add(self, plant):\n        if plant not in self.plants:\n            self.plants.append(plant)\n\n    def count(self):\n        return len(self.plants)\n\nclass TestTray(unittest.TestCase):\n    def test_adds_plants(self):\n        t = Tray()\n        t.add("fern")\n        t.add("moss")\n        self.assertEqual(t.count(), 2)\n\n    def test_ignores_duplicates(self):\n        t = Tray()\n        t.add("fern")\n        t.add("fern")\n        self.assertEqual(t.count(), 1)\n\nunittest.main(argv=["tests"], exit=False)\n'],
    wrong: { practice: ['def celsius_to_f(c):\n    return c * 9 / 5 + 32\n\ndef test_conversion():\n    assert celsius_to_f(0) == 32\n\ntest_conversion()\nprint("all tests passed")\n'] },
  },
};
