// Galaxy 05 · The Machines: object-oriented Python.
import type { LessonCore as Lesson } from './types';

const classes: Lesson = {
  id: 'g05-l01', conceptId: 'machines.1', number: 1, title: 'Classes & objects', minutes: 20, xp: 200, difficulty: 2,
  description: 'Design your own kinds of thing, and make objects from them.',
  objectives: ['define a class with `class`', 'create separate objects (instances) by calling the class', 'give objects their own attributes and check their type'],
  discover: {
    heading: 'Blueprints in the glass orchard.',
    lede: 'A **class** is a blueprint for a kind of thing; an **object** (or instance) is one thing made from it. Call the class like a function to make a new object: `fern = Specimen()`. Each object keeps its own **attributes**, reached with a dot.',
    example: 'class Specimen:\n    """A plant in the collection."""\n\nfern = Specimen()\nmoss = Specimen()\nfern.name, fern.height = "Fern", 30\nmoss.name, moss.height = "Moss", 5\n\nprint(fern.name, fern.height)\nprint(fern is moss)                  # False: two separate objects\nprint(type(fern).__name__, isinstance(moss, Specimen))\n',
    tagsHeading: 'Words',
    tags: [
      { name: 'class Name:', color: '#345a04', desc: 'The blueprint (CapWords)', examples: 'class Specimen:' },
      { name: 'Name()', color: '#8a6000', desc: 'Make an object', examples: 'fern = Specimen()' },
      { name: 'obj.attr', color: '#a8423c', desc: 'An object\'s own value', examples: 'fern.height' },
      { name: 'isinstance', color: '#242820', desc: 'Is it that kind of thing?', examples: 'isinstance(fern, Specimen)' },
    ],
    tip: 'You have used objects all along: `"fern".upper()` calls a method on a str object. Classes let you make your own kinds.',
  },
  experiment: {
    heading: 'Fill the orchard.',
    lede: 'Make objects and poke at them.',
    steps: ['Run it as it is.', 'Make a third specimen with its own name.', 'Print `moss.colour` and read the AttributeError.', 'Print `fern` itself: it shows the class and an address.'],
    code: 'class Specimen:\n    pass\n\nfern = Specimen()\nmoss = Specimen()\nfern.name = "Fern"\nmoss.name = "Moss"\nprint(fern.name, moss.name, fern is moss)\n',
  },
  practice: {
    heading: 'Catalogue two specimens.',
    lede: 'Define an empty `Specimen` class. Make `fern` and `moss` from it, give each a `name` and a `height` (Fern 30, Moss 5), then store the **name** of the taller one in `taller`.',
    starter: '# class Specimen ...\n\n# fern = ...\n# moss = ...\n\n# taller = ...\nprint(taller)\n',
    checks: [
      { kind: 'expr', label: 'fern and moss are separate Specimen objects', cases: [{ expr: 'isinstance(fern, Specimen) and isinstance(moss, Specimen) and fern is not moss', equals: true }] },
      { kind: 'expr', label: 'Each has its name and height', cases: [{ expr: '(fern.name, fern.height, moss.name, moss.height)', equals: ['Fern', 30, 'Moss', 5] }] },
      { kind: 'var', label: 'taller is "Fern"', name: 'taller', equals: 'Fern' },
      { kind: 'source', label: 'taller is worked out by comparing heights', matches: 'height\\s*[<>]=?|max\\(' },
    ],
    hints: ['`class Specimen:` with `pass` (or a docstring) as its body.', '`fern = Specimen()` then `fern.name = "Fern"` and `fern.height = 30`.', '`taller = fern.name if fern.height > moss.height else moss.name`'],
  },
  challenge: {
    heading: 'Every specimen is called Moss.',
    lede: 'After labelling, both specimens claim to be `"Moss"`. Fix it so `fern.name` is `"Fern"` and `moss.name` is `"Moss"`.',
    starter: 'class Specimen:\n    pass\n\nfern = Specimen\nmoss = Specimen\nfern.name = "Fern"\nmoss.name = "Moss"\n\nprint(fern.name, moss.name)\n',
    checks: [
      { kind: 'expr', label: 'fern and moss are objects, not the class itself', cases: [{ expr: 'fern is not Specimen and moss is not Specimen and fern is not moss', equals: true }] },
      { kind: 'expr', label: 'fern.name is "Fern" and moss.name is "Moss"', cases: [{ expr: '(fern.name, moss.name)', equals: ['Fern', 'Moss'] }] },
    ],
    hints: ['`fern = Specimen` gives the class a second name; it does not make an object.', 'Both lines are labelling the same class.', 'Call the class: `fern = Specimen()` and `moss = Specimen()`.'],
  },
  quiz: [
    { q: 'What does fern = Specimen() do?', opts: ['Defines a class', 'Makes a new Specimen object', 'Copies the class'], a: 1, why: 'Calling a class creates an instance.' },
    { q: 'a = Specimen(); b = Specimen(). Is a is b True?', opts: ['Yes', 'No', 'Only if they have the same attributes'], a: 1, why: 'Each call makes a separate object.' },
    { q: 'What is the convention for class names?', opts: ['snake_case', 'CapWords', 'ALL_CAPS'], a: 1, why: 'Classes use CapWords, like Specimen or GreenhouseBay.' },
  ],
};

const inits: Lesson = {
  id: 'g05-l02', conceptId: 'machines.2', number: 2, title: '__init__ & attributes', minutes: 20, xp: 200, difficulty: 3,
  description: 'Set up every new object the same way with __init__ and self.',
  objectives: ['write an `__init__` method that runs when an object is made', 'store attributes on `self`', 'give parameters defaults, and keep mutable state per object'],
  discover: {
    heading: 'Every seed arrives labelled.',
    lede: '`__init__` runs automatically when you make an object. Its first parameter, `self`, **is the new object**; storing `self.name = name` gives that object its attribute. Values passed to the class call arrive as the other parameters.',
    example: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n        self.watered = False\n\nfern = Plant("fern", 30)\nseedling = Plant("moss")\nprint(fern.name, fern.height, fern.watered)\nprint(seedling.height)          # 0: the default\n',
    tagsHeading: 'Setting up',
    tags: [
      { name: '__init__', color: '#345a04', desc: 'Runs on creation', examples: 'Plant("fern")' },
      { name: 'self', color: '#8a6000', desc: 'The object being set up', examples: 'self.name = name' },
      { name: 'height=0', color: '#a8423c', desc: 'Defaults work as usual', examples: 'Plant("moss")' },
      { name: 'per object', color: '#242820', desc: 'Lists made in __init__ are not shared', examples: 'self.plants = []' },
    ],
    tip: 'A list written directly in the class body is shared by every object. Make per-object lists inside `__init__`.',
  },
  experiment: {
    heading: 'Germinate some plants.',
    lede: 'Run it, then make more.',
    steps: ['Run it as it is.', 'Make `Plant("oak", 120)` and print its height.', 'Call `Plant()` with no name and read the TypeError.', 'Add a `self.planted_on = "today"` attribute.'],
    code: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n        self.watered = False\n\nfern = Plant("fern", 30)\nprint(fern.name, fern.height, fern.watered)\n',
  },
  practice: {
    heading: 'The Plant blueprint.',
    lede: 'Write a `Plant` class whose `__init__` takes a `name` and an optional `height` (default **0**), stores both, and sets `watered` to `False`.',
    starter: '# class Plant with __init__ here\n\nfern = Plant("fern", 30)\nprint(fern.name, fern.height, fern.watered)\n',
    checks: [
      { kind: 'expr', label: 'Plant("fern", 30) stores name and height', cases: [{ expr: '(Plant("fern", 30).name, Plant("fern", 30).height)', equals: ['fern', 30] }] },
      { kind: 'expr', label: 'height defaults to 0', cases: [{ expr: 'Plant("moss").height', equals: 0 }] },
      { kind: 'expr', label: 'A new plant is not watered', cases: [{ expr: 'Plant("oak", 5).watered', equals: false }] },
    ],
    hints: ['`class Plant:` then an indented `def __init__(self, name, height=0):`.', 'Inside: `self.name = name` and `self.height = height`.', 'And `self.watered = False`.'],
  },
  challenge: {
    heading: 'Every tray holds every plant.',
    lede: 'Adding a plant to one tray makes it appear in **all** trays. Fix the class so each tray has its own list.',
    starter: 'class Tray:\n    plants = []\n\n    def __init__(self, label):\n        self.label = label\n\na = Tray("A")\nb = Tray("B")\na.plants.append("fern")\nprint(a.plants, b.plants)\n',
    checks: [
      { kind: 'expr', label: 'A new tray starts empty', cases: [{ expr: 'Tray("X").plants', equals: [] }] },
      { kind: 'expr', label: 'Adding to one tray leaves another empty', cases: [{ expr: '(lambda x, y: (x.plants.append("ivy"), y.plants)[1])(Tray("X"), Tray("Y"))', equals: [] }] },
      { kind: 'expr', label: 'Trays keep their labels', cases: [{ expr: 'Tray("Q").label', equals: 'Q' }] },
    ],
    hints: ['`plants = []` in the class body is one list shared by every tray.', 'Each tray needs its own list, created when the tray is made.', 'Move it into `__init__` as `self.plants = []`.'],
  },
  quiz: [
    { q: 'When does __init__ run?', opts: ['When the class is defined', 'Each time an object is created', 'When you print the object'], a: 1, why: 'Plant("fern") calls __init__ on the new object.' },
    { q: 'In __init__(self, name), what is self?', opts: ['The class', 'The new object', 'The name'], a: 1, why: 'self is the object being set up.' },
    { q: 'Where should a per-object list be created?', opts: ['In the class body', 'In __init__ as self.items = []', 'Anywhere'], a: 1, why: 'A list in the class body is shared by all objects.' },
  ],
};

const methods: Lesson = {
  id: 'g05-l03', conceptId: 'machines.3', number: 3, title: 'Methods', minutes: 20, xp: 200, difficulty: 3,
  description: 'Give objects behaviour: functions that belong to a class.',
  objectives: ['define methods that take `self`', 'change an object\'s state from a method', 'return values from methods'],
  discover: {
    heading: 'Machines that do things.',
    lede: 'A **method** is a function defined inside a class. Python passes the object as the first argument, `self`, so `fern.grow(2)` runs `grow(fern, 2)`. Methods can read and change the object\'s attributes and return results.',
    example: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n        self.watered = False\n\n    def grow(self, cm):\n        self.height += cm\n        return self.height\n\n    def water(self):\n        self.watered = True\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n\nfern = Plant("fern", 30)\nfern.grow(2)\nfern.water()\nprint(fern.describe(), fern.watered)\n',
    tagsHeading: 'Behaviour',
    tags: [
      { name: 'def m(self):', color: '#345a04', desc: 'A method (self first)', examples: 'def water(self):' },
      { name: 'obj.m()', color: '#8a6000', desc: 'Call it on an object', examples: 'fern.water()' },
      { name: 'self.attr', color: '#a8423c', desc: 'Read or change state', examples: 'self.height += cm' },
      { name: 'return', color: '#242820', desc: 'Hand back a result', examples: 'return self.height' },
    ],
    tip: 'Forgetting `self` in the def line gives "takes 0 positional arguments but 1 was given": the object was passed in, but there was no parameter to receive it.',
  },
  experiment: {
    heading: 'Operate the machine.',
    lede: 'Call methods and watch state change.',
    steps: ['Run it as it is.', 'Call `fern.grow(5)` twice and print the height.', 'Remove `self` from `water` and call it: read the TypeError.', 'Add a method `is_tall(self)` returning `self.height > 50`.'],
    code: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def grow(self, cm):\n        self.height += cm\n        return self.height\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n\nfern = Plant("fern", 30)\nprint(fern.grow(2), fern.describe())\n',
  },
  practice: {
    heading: 'Teach the plant to grow.',
    lede: 'Add two methods to `Plant`: `grow(cm)` adds `cm` to the height and **returns the new height**; `describe()` returns text like `"fern: 32 cm"`.',
    starter: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    # add grow and describe here\n\nfern = Plant("fern", 30)\nprint(fern.grow(2), fern.describe())\n',
    checks: [
      { kind: 'expr', label: 'grow adds and returns the new height', cases: [{ expr: 'Plant("fern", 30).grow(2)', equals: 32 }] },
      { kind: 'expr', label: 'grow changes the plant', cases: [{ expr: '(lambda p: (p.grow(5), p.grow(5), p.height)[2])(Plant("oak", 1))', equals: 11 }] },
      { kind: 'expr', label: 'describe() returns "name: N cm"', cases: [{ expr: 'Plant("fern", 32).describe()', equals: 'fern: 32 cm' }, { expr: 'Plant("moss").describe()', equals: 'moss: 0 cm' }] },
    ],
    hints: ['Methods sit inside the class, indented like `__init__`, with `self` first.', '`def grow(self, cm):` / `    self.height += cm` / `    return self.height`', '`def describe(self): return f"{self.name}: {self.height} cm"`'],
  },
  challenge: {
    heading: 'The watering can is jammed.',
    lede: 'Calling `fern.water()` crashes, and `is_thirsty()` should say whether the plant still needs water. Fix both methods.',
    starter: 'class Plant:\n    def __init__(self, name):\n        self.name = name\n        self.watered = False\n\n    def water():\n        self.watered = True\n\n    def is_thirsty(self):\n        self.watered == False\n\nfern = Plant("fern")\nprint(fern.is_thirsty())\nfern.water()\nprint(fern.is_thirsty())\n',
    checks: [
      { kind: 'runs', label: 'Runs without a TypeError' },
      { kind: 'expr', label: 'A new plant is thirsty', cases: [{ expr: 'Plant("x").is_thirsty()', equals: true }] },
      { kind: 'expr', label: 'After water() it is not', cases: [{ expr: '(lambda p: (p.water(), p.is_thirsty())[1])(Plant("x"))', equals: false }] },
    ],
    hints: ['Read the TypeError: `water` receives the object but has nowhere to put it.', '`def water(self):`', '`is_thirsty` computes a bool but never returns it: `return not self.watered`.'],
  },
  quiz: [
    { q: 'fern.grow(2) is the same as…', opts: ['grow(2)', 'Plant.grow(fern, 2)', 'fern.grow(fern, 2)'], a: 1, why: 'Python passes the object as self.' },
    { q: 'What does a method without return give back?', opts: ['self', 'None', 'The last attribute set'], a: 1, why: 'Methods are functions; no return means None.' },
    { q: 'Why must methods list self first?', opts: ['Style only', 'It receives the object the method was called on', 'To make them private'], a: 1, why: 'The object is passed automatically as the first argument.' },
  ],
};

const inherit: Lesson = {
  id: 'g05-l04', conceptId: 'machines.4', number: 4, title: 'Inheritance', minutes: 22, xp: 200, difficulty: 3,
  description: 'Build specialised classes on top of general ones.',
  objectives: ['make a subclass with `class Child(Parent):`', 'extend `__init__` with `super().__init__(...)`', 'override a method, and reuse the parent version'],
  discover: {
    heading: 'Grafting new branches.',
    lede: 'A **subclass** inherits everything from its parent class and can add or change parts. Call `super().__init__(...)` to let the parent set up its attributes first, then add your own. A method with the same name **overrides** the parent\'s; `super().method()` still reaches the original.',
    example: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n\nclass Cactus(Plant):\n    def __init__(self, name, height=0, spines=100):\n        super().__init__(name, height)\n        self.spines = spines\n\n    def describe(self):\n        return super().describe() + f", {self.spines} spines"\n\nc = Cactus("saguaro", 40)\nprint(c.describe())\nprint(isinstance(c, Plant))          # True: a cactus is a plant\n',
    tagsHeading: 'Family tree',
    tags: [
      { name: 'class C(P):', color: '#345a04', desc: 'C inherits from P', examples: 'class Cactus(Plant):' },
      { name: 'super().__init__', color: '#8a6000', desc: 'Parent setup first', examples: 'super().__init__(name)' },
      { name: 'override', color: '#a8423c', desc: 'Same name replaces', examples: 'def describe(self):' },
      { name: 'super().m()', color: '#242820', desc: 'Reach the parent version', examples: 'extend, don\'t copy' },
    ],
    tip: 'Inherit when the child really **is a** kind of parent (a cactus is a plant). Otherwise, store one object inside another instead.',
  },
  experiment: {
    heading: 'Graft a cactus.',
    lede: 'Change the family.',
    steps: ['Run it as it is.', 'Make a `Cactus("barrel", 10, spines=300)`.', 'Delete the `super().__init__` line and run: read the AttributeError.', 'Add a `Fern(Plant)` subclass with no body (`pass`) and use it.'],
    code: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n\nclass Cactus(Plant):\n    def __init__(self, name, height=0, spines=100):\n        super().__init__(name, height)\n        self.spines = spines\n\n    def describe(self):\n        return super().describe() + f", {self.spines} spines"\n\nprint(Cactus("saguaro", 40).describe())\n',
  },
  practice: {
    heading: 'Breed a cactus.',
    lede: 'Make `Cactus` a subclass of `Plant`. Its `__init__` takes `name`, `height=0` and `spines=100`, lets `Plant` set up name and height, then stores `spines`. Override `describe()` to add `", N spines"` to the plant description.',
    starter: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n\n# class Cactus here\n\nprint(Cactus("saguaro", 40).describe())\n',
    checks: [
      { kind: 'expr', label: 'Cactus is a kind of Plant', cases: [{ expr: 'issubclass(Cactus, Plant)', equals: true }] },
      { kind: 'expr', label: 'It stores name, height and spines', cases: [{ expr: '(lambda c: (c.name, c.height, c.spines))(Cactus("saguaro", 40))', equals: ['saguaro', 40, 100] }, { expr: 'Cactus("barrel", spines=300).spines', equals: 300 }] },
      { kind: 'expr', label: 'describe() adds the spines', cases: [{ expr: 'Cactus("saguaro", 40).describe()', equals: 'saguaro: 40 cm, 100 spines' }] },
      { kind: 'expr', label: 'Plant still works on its own', cases: [{ expr: 'Plant("fern", 3).describe()', equals: 'fern: 3 cm' }] },
    ],
    hints: ['`class Cactus(Plant):` and an `__init__(self, name, height=0, spines=100)`.', 'First line inside: `super().__init__(name, height)`, then `self.spines = spines`.', '`def describe(self): return super().describe() + f", {self.spines} spines"`'],
  },
  challenge: {
    heading: 'Orchids have no name.',
    lede: 'Asking an orchid to describe itself crashes with an AttributeError. Fix `Orchid` so it keeps everything a `Plant` has, plus its `colour`.',
    starter: 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n\nclass Orchid(Plant):\n    def __init__(self, name, colour, height=0):\n        self.colour = colour\n\n    def describe(self):\n        return f"{self.colour} " + super().describe()\n\nprint(Orchid("moth orchid", "white", 25).describe())\n',
    checks: [
      { kind: 'runs', label: 'Runs without an AttributeError' },
      { kind: 'expr', label: 'Describes colour, name and height', cases: [{ expr: 'Orchid("moth orchid", "white", 25).describe()', equals: 'white moth orchid: 25 cm' }, { expr: 'Orchid("vanilla", "green").describe()', equals: 'green vanilla: 0 cm' }] },
    ],
    hints: ['Orchid\'s `__init__` replaces Plant\'s, so name and height are never set.', 'Let the parent do its part first.', 'Add `super().__init__(name, height)` at the top of `Orchid.__init__`.'],
  },
  quiz: [
    { q: 'class Cactus(Plant): means…', opts: ['Plant inherits from Cactus', 'Cactus inherits from Plant', 'They share nothing'], a: 1, why: 'The parent goes in the brackets.' },
    { q: 'What does super().__init__(name) do?', opts: ['Makes a new parent object', 'Runs the parent\'s setup on this object', 'Deletes the parent'], a: 1, why: 'It lets the parent set its attributes on self.' },
    { q: 'If Cactus defines describe(), Cactus(...).describe() runs…', opts: ['Plant\'s version', 'Cactus\'s version', 'Both'], a: 1, why: 'The subclass method overrides the parent one.' },
  ],
};

const dunders: Lesson = {
  id: 'g05-l05', conceptId: 'machines.5', number: 5, title: 'Dunder methods', minutes: 22, xp: 200, difficulty: 3,
  description: 'Make your objects work with print, len, ==, sorting and more.',
  objectives: ['control printing with `__str__` and `__repr__`', 'support `len()` with `__len__` and `==` with `__eq__`', 'make objects sortable with `__lt__`'],
  discover: {
    heading: 'Machines that speak Python.',
    lede: '"Dunder" (double-underscore) methods let your objects join in with Python\'s built-in tools. `print(obj)` calls `__str__`, `len(obj)` calls `__len__`, `a == b` calls `__eq__`, and `sorted` uses `__lt__` (less than) to compare.',
    example: 'class Tray:\n    def __init__(self, plants):\n        self.plants = list(plants)\n\n    def __len__(self):\n        return len(self.plants)\n\n    def __str__(self):\n        return f"Tray({len(self)} plants)"\n\n    def __eq__(self, other):\n        return sorted(self.plants) == sorted(other.plants)\n\nt = Tray(["fern", "moss"])\nprint(t, len(t))\nprint(t == Tray(["moss", "fern"]))       # True: same plants\n',
    tagsHeading: 'Common dunders',
    tags: [
      { name: '__str__', color: '#345a04', desc: 'print() and str()', examples: 'readable text' },
      { name: '__repr__', color: '#8a6000', desc: 'Developer view', examples: 'Plant(\'fern\', 30)' },
      { name: '__len__ __eq__', color: '#a8423c', desc: 'len() and ==', examples: 'len(tray)' },
      { name: '__lt__', color: '#242820', desc: '< and sorting', examples: 'sorted(plants)' },
    ],
    tip: 'Without `__eq__`, `==` asks "is it the very same object?". With it, you decide what equal means.',
  },
  experiment: {
    heading: 'Teach it manners.',
    lede: 'Add and remove dunders.',
    steps: ['Run it as it is.', 'Comment out `__str__` and print the tray.', 'Comment out `__eq__` and compare the trays again.', 'Try `sorted([Tray(["a"]), Tray([])])` and read the TypeError.'],
    code: 'class Tray:\n    def __init__(self, plants):\n        self.plants = list(plants)\n\n    def __len__(self):\n        return len(self.plants)\n\n    def __str__(self):\n        return f"Tray({len(self)} plants)"\n\nt = Tray(["fern", "moss"])\nprint(t, len(t))\n',
  },
  practice: {
    heading: 'A tray that counts itself.',
    lede: 'Give `Tray` a `__len__` that returns how many plants it holds, and a `__str__` that returns text like `"Tray(2 plants)"`.',
    starter: 'class Tray:\n    def __init__(self, plants):\n        self.plants = list(plants)\n\n    # add __len__ and __str__\n\nt = Tray(["fern", "moss"])\nprint(t, len(t))\n',
    checks: [
      { kind: 'expr', label: 'len(tray) is the number of plants', cases: [{ expr: 'len(Tray(["a", "b", "c"]))', equals: 3 }, { expr: 'len(Tray([]))', equals: 0 }] },
      { kind: 'expr', label: 'str(tray) reads "Tray(N plants)"', cases: [{ expr: 'str(Tray(["fern", "moss"]))', equals: 'Tray(2 plants)' }] },
      { kind: 'expr', label: 'print(tray) uses it', cases: [{ expr: 'print(Tray(["x"]))', prints: ['Tray(1 plants)'] }] },
    ],
    hints: ['Both are methods with `self`.', '`def __len__(self): return len(self.plants)`', '`def __str__(self): return f"Tray({len(self.plants)} plants)"`'],
  },
  challenge: {
    heading: 'The plants refuse to line up.',
    lede: 'Sorting plants crashes, and two plants with the same name and height do not count as equal. Add `__lt__` (compare by **height**) and `__eq__` (same name **and** height).',
    starter: 'class Plant:\n    def __init__(self, name, height):\n        self.name = name\n        self.height = height\n\n    def __repr__(self):\n        return f"Plant({self.name!r}, {self.height})"\n\nplants = [Plant("oak", 120), Plant("moss", 5), Plant("fern", 30)]\nprint(sorted(plants))\nprint(Plant("fern", 30) == Plant("fern", 30))\n',
    checks: [
      { kind: 'expr', label: 'sorted() orders by height', cases: [{ expr: '[p.name for p in sorted([Plant("oak", 120), Plant("moss", 5), Plant("fern", 30)])]', equals: ['moss', 'fern', 'oak'] }] },
      { kind: 'expr', label: 'Same name and height are equal', cases: [{ expr: 'Plant("fern", 30) == Plant("fern", 30)', equals: true }] },
      { kind: 'expr', label: 'Different ones are not', cases: [{ expr: 'Plant("fern", 30) == Plant("fern", 31)', equals: false }, { expr: 'Plant("fern", 30) == Plant("moss", 30)', equals: false }] },
    ],
    hints: ['`sorted` compares with `<`, which calls `__lt__(self, other)`.', '`def __lt__(self, other): return self.height < other.height`', '`def __eq__(self, other): return (self.name, self.height) == (other.name, other.height)`'],
  },
  quiz: [
    { q: 'Which method does print(obj) use?', opts: ['__init__', '__str__', '__len__'], a: 1, why: 'print calls str(), which calls __str__.' },
    { q: 'Without __eq__, a == b for two separate objects is…', opts: ['True if attributes match', 'False', 'An error'], a: 1, why: 'The default compares identity: are they the same object?' },
    { q: 'Which method lets sorted() order your objects?', opts: ['__lt__', '__sort__', '__order__'], a: 0, why: 'Sorting compares items with <, i.e. __lt__.' },
  ],
};

const dataclasses: Lesson = {
  id: 'g05-l06', conceptId: 'machines.6', number: 6, title: 'Dataclasses', minutes: 18, xp: 200, difficulty: 3,
  description: 'Let Python write __init__, __repr__ and __eq__ for data-holding classes.',
  objectives: ['declare a dataclass with typed fields', 'give fields defaults, including lists via `field(default_factory=list)`', 'get `__init__`, `__repr__` and `__eq__` for free'],
  discover: {
    heading: 'Labelled jars, factory-made.',
    lede: 'Many classes mostly hold data. The `@dataclass` decorator reads the fields you list (with type hints) and writes `__init__`, `__repr__` and `__eq__` for you. Mutable defaults like lists need `field(default_factory=list)` so each object gets its own.',
    example: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Plant:\n    name: str\n    height: int = 0\n    tags: list = field(default_factory=list)\n\n    def grow(self, cm):\n        self.height += cm\n\nfern = Plant("fern", 30)\nfern.tags.append("shade")\nprint(fern)                              # Plant(name=\'fern\', height=30, tags=[\'shade\'])\nprint(Plant("moss") == Plant("moss", 0)) # True\n',
    tagsHeading: 'Dataclass parts',
    tags: [
      { name: '@dataclass', color: '#345a04', desc: 'Writes the boilerplate', examples: '__init__, __repr__, __eq__' },
      { name: 'name: str', color: '#8a6000', desc: 'A field with a type hint', examples: 'required' },
      { name: 'height: int = 0', color: '#a8423c', desc: 'A field with a default', examples: 'optional' },
      { name: 'default_factory', color: '#242820', desc: 'A fresh list per object', examples: 'field(default_factory=list)' },
    ],
    tip: 'Type hints in a dataclass describe fields; Python does not enforce them at runtime.',
  },
  experiment: {
    heading: 'Press the factory button.',
    lede: 'See what the decorator wrote for you.',
    steps: ['Run it as it is.', 'Remove `@dataclass` and run: the class no longer accepts arguments.', 'Change `tags` to `tags: list = []` and read the ValueError.', 'Add a field `watered: bool = False`.'],
    code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Plant:\n    name: str\n    height: int = 0\n    tags: list = field(default_factory=list)\n\nfern = Plant("fern", 30)\nprint(fern, Plant("moss") == Plant("moss", 0))\n',
  },
  practice: {
    heading: 'A factory-made Plant.',
    lede: 'Write `Plant` as a dataclass with fields `name` (str) and `height` (int, default **0**). Keep the `grow(cm)` method.',
    starter: 'from dataclasses import dataclass\n\n# @dataclass class Plant here, with a grow(cm) method\n\nfern = Plant("fern", 30)\nfern.grow(2)\nprint(fern)\n',
    checks: [
      { kind: 'expr', label: 'Plant("fern", 30) has the right fields', cases: [{ expr: '(Plant("fern", 30).name, Plant("fern", 30).height, Plant("moss").height)', equals: ['fern', 30, 0] }] },
      { kind: 'expr', label: 'It prints like a dataclass', cases: [{ expr: 'repr(Plant("fern", 30))', equals: "Plant(name='fern', height=30)" }] },
      { kind: 'expr', label: 'Equal fields mean equal plants', cases: [{ expr: 'Plant("moss") == Plant("moss", 0)', equals: true }] },
      { kind: 'expr', label: 'grow still works', cases: [{ expr: '(lambda p: (p.grow(2), p.height)[1])(Plant("x", 1))', equals: 3 }] },
    ],
    hints: ['Put `@dataclass` on the line above `class Plant:`.', 'Fields: `name: str` and `height: int = 0`.', 'Methods go below the fields as usual: `def grow(self, cm): self.height += cm`.'],
  },
  challenge: {
    heading: 'The tag field will not compile.',
    lede: 'Python refuses this dataclass. Fix the `tags` field so each specimen gets its **own** empty list.',
    starter: 'from dataclasses import dataclass\n\n@dataclass\nclass Specimen:\n    name: str\n    tags: list = []\n\na = Specimen("fern")\nb = Specimen("moss")\na.tags.append("shade")\nprint(a.tags, b.tags)\n',
    checks: [
      { kind: 'runs', label: 'Runs without a ValueError' },
      { kind: 'expr', label: 'A new specimen has no tags', cases: [{ expr: 'Specimen("x").tags', equals: [] }] },
      { kind: 'expr', label: 'Tags are not shared between specimens', cases: [{ expr: '(lambda a, b: (a.tags.append("t"), b.tags)[1])(Specimen("a"), Specimen("b"))', equals: [] }] },
    ],
    hints: ['Read the ValueError: it suggests the fix.', 'Import `field` too: `from dataclasses import dataclass, field`.', '`tags: list = field(default_factory=list)`'],
  },
  quiz: [
    { q: 'What does @dataclass add?', opts: ['Only __init__', '__init__, __repr__ and __eq__', 'Type checking'], a: 1, why: 'It writes the usual data-class methods from your fields.' },
    { q: 'Why not write tags: list = [] in a dataclass?', opts: ['Lists are not allowed', 'One list would be shared, so Python refuses', 'It is slower'], a: 1, why: 'Mutable defaults would be shared; use field(default_factory=list).' },
    { q: 'Does height: int stop you storing "tall"?', opts: ['Yes, a TypeError', 'No, hints are not enforced at runtime', 'Only in strict mode'], a: 1, why: 'Type hints document intent; tools can check them, Python does not.' },
  ],
};

export const GALAXY_05: Lesson[] = [classes, inits, methods, inherit, dunders, dataclasses];
