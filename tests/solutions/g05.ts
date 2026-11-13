import type { Solutions } from './types';

const PLANT = 'class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n\n';

export const G05: Solutions = {
  'g05-l01': {
    practice: ['class Specimen:\n    pass\n\nfern = Specimen()\nmoss = Specimen()\nfern.name = "Fern"\nfern.height = 30\nmoss.name = "Moss"\nmoss.height = 5\ntaller = fern.name if fern.height > moss.height else moss.name\nprint(taller)\n', 'class Specimen:\n    """A plant."""\n\nfern, moss = Specimen(), Specimen()\nfern.name, fern.height = "Fern", 30\nmoss.name, moss.height = "Moss", 5\ntaller = max([fern, moss], key=lambda s: s.height).name\n'],
    challenge: ['class Specimen:\n    pass\n\nfern = Specimen()\nmoss = Specimen()\nfern.name = "Fern"\nmoss.name = "Moss"\nprint(fern.name, moss.name)\n'],
    wrong: { practice: ['class Specimen:\n    pass\n\nfern = Specimen()\nmoss = Specimen()\nfern.name, fern.height = "Fern", 30\nmoss.name, moss.height = "Moss", 5\ntaller = "Fern"\n'] },
  },
  'g05-l02': {
    practice: ['class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n        self.watered = False\n\nfern = Plant("fern", 30)\nprint(fern.name, fern.height, fern.watered)\n'],
    challenge: ['class Tray:\n    def __init__(self, label):\n        self.label = label\n        self.plants = []\n\na = Tray("A")\nb = Tray("B")\na.plants.append("fern")\nprint(a.plants, b.plants)\n'],
    wrong: { practice: ['class Plant:\n    def __init__(self, name, height):\n        self.name = name\n        self.height = height\n        self.watered = False\n'] },
  },
  'g05-l03': {
    practice: ['class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def grow(self, cm):\n        self.height += cm\n        return self.height\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n\nfern = Plant("fern", 30)\nprint(fern.grow(2), fern.describe())\n'],
    challenge: ['class Plant:\n    def __init__(self, name):\n        self.name = name\n        self.watered = False\n\n    def water(self):\n        self.watered = True\n\n    def is_thirsty(self):\n        return not self.watered\n\nfern = Plant("fern")\nprint(fern.is_thirsty())\nfern.water()\nprint(fern.is_thirsty())\n'],
    wrong: { practice: ['class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def grow(self, cm):\n        return self.height + cm\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm"\n'] },
  },
  'g05-l04': {
    practice: [PLANT + 'class Cactus(Plant):\n    def __init__(self, name, height=0, spines=100):\n        super().__init__(name, height)\n        self.spines = spines\n\n    def describe(self):\n        return super().describe() + f", {self.spines} spines"\n\nprint(Cactus("saguaro", 40).describe())\n'],
    challenge: [PLANT + 'class Orchid(Plant):\n    def __init__(self, name, colour, height=0):\n        super().__init__(name, height)\n        self.colour = colour\n\n    def describe(self):\n        return f"{self.colour} " + super().describe()\n\nprint(Orchid("moth orchid", "white", 25).describe())\n'],
    wrong: { practice: [PLANT + 'class Cactus:\n    def __init__(self, name, height=0, spines=100):\n        self.name = name\n        self.height = height\n        self.spines = spines\n\n    def describe(self):\n        return f"{self.name}: {self.height} cm, {self.spines} spines"\n'] },
  },
  'g05-l05': {
    practice: ['class Tray:\n    def __init__(self, plants):\n        self.plants = list(plants)\n\n    def __len__(self):\n        return len(self.plants)\n\n    def __str__(self):\n        return f"Tray({len(self)} plants)"\n\nt = Tray(["fern", "moss"])\nprint(t, len(t))\n'],
    challenge: ['class Plant:\n    def __init__(self, name, height):\n        self.name = name\n        self.height = height\n\n    def __repr__(self):\n        return f"Plant({self.name!r}, {self.height})"\n\n    def __lt__(self, other):\n        return self.height < other.height\n\n    def __eq__(self, other):\n        return (self.name, self.height) == (other.name, other.height)\n\nplants = [Plant("oak", 120), Plant("moss", 5), Plant("fern", 30)]\nprint(sorted(plants))\nprint(Plant("fern", 30) == Plant("fern", 30))\n'],
    wrong: { challenge: ['class Plant:\n    def __init__(self, name, height):\n        self.name = name\n        self.height = height\n\n    def __lt__(self, other):\n        return self.height < other.height\n\n    def __eq__(self, other):\n        return self.height == other.height\n'] },
  },
  'g05-l06': {
    practice: ['from dataclasses import dataclass\n\n@dataclass\nclass Plant:\n    name: str\n    height: int = 0\n\n    def grow(self, cm):\n        self.height += cm\n\nfern = Plant("fern", 30)\nfern.grow(2)\nprint(fern)\n'],
    challenge: ['from dataclasses import dataclass, field\n\n@dataclass\nclass Specimen:\n    name: str\n    tags: list = field(default_factory=list)\n\na = Specimen("fern")\nb = Specimen("moss")\na.tags.append("shade")\nprint(a.tags, b.tags)\n'],
    wrong: { practice: ['class Plant:\n    def __init__(self, name, height=0):\n        self.name = name\n        self.height = height\n\n    def grow(self, cm):\n        self.height += cm\n'] },
  },
};
