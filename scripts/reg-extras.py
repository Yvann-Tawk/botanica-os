# Registers galaxy N's extras and mission solutions in their index files: python3 scripts/reg-extras.py N
import sys
n = int(sys.argv[1])
for path, name, fname in [('src/content/lessons/extras/index.ts', 'X', 'g'), ('tests/solutions/missions.ts', 'M', 'm')]:
    s = open(path).read()
    prev = f"import {{ {name}0{n-1} }} from './{fname}0{n-1}';"
    assert prev in s, path
    s = s.replace(prev, prev + f"\nimport {{ {name}0{n} }} from './{fname}0{n}';").replace(f"...{name}0{n-1} }};", f"...{name}0{n-1}, ...{name}0{n} }};")
    open(path, 'w').write(s)
