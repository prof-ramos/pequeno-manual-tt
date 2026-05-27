#!/usr/bin/env python3
"""
Extract quotes from 'Pequeno Manual de Instruções para a Vida.md'
and generate conselhos.json / conselhos.py for use by the app and scripts.
"""

import json
import re
from pathlib import Path


def extract_conselhos(md_path: Path) -> dict[str, str]:
    """Parse numbered quotes from the markdown file."""
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    conselhos: dict[str, str] = {}
    current_num: str | None = None
    current_text: list[str] = []

    for line in lines:
        line = line.rstrip('\n')
        m = re.match(r'^(\d+)\.\s+(.*)', line)
        if m:
            if current_num is not None:
                conselhos[current_num] = ' '.join(current_text).strip()
            current_num = m.group(1)
            current_text = [m.group(2)]
        elif current_num is not None and line.startswith('    '):
            current_text.append(line.strip())

    if current_num is not None:
        conselhos[current_num] = ' '.join(current_text).strip()

    return conselhos


def generate_json(conselhos: dict[str, str], out_path: Path) -> None:
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(conselhos, f, ensure_ascii=False, indent=2)
    print(f'Wrote {len(conselhos)} entries to {out_path}')


def generate_python(conselhos: dict[str, str], out_path: Path) -> None:
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('# Auto-generated from Pequeno Manual de Instruções para a Vida.md\n')
        f.write('# Do not edit manually — run extract-conselhos.py instead\n\n')
        f.write('CONSELHOS = {\n')
        for num in sorted(conselhos.keys(), key=int):
            text = conselhos[num]
            f.write(f'    "{num}": "{text}",\n')
        f.write('}\n')
    print(f'Wrote {len(conselhos)} entries to {out_path}')


def main():
    repo_root = Path(__file__).parent.parent
    md_path = repo_root / 'Pequeno Manual de Instruções para a Vida.md'
    json_out = repo_root / 'serif-sh' / 'src' / 'lib' / 'conselhos.json'
    py_out = repo_root / 'serif-sh' / 'src' / 'lib' / 'conselhos.py'

    if not md_path.exists():
        print(f'Error: {md_path} not found')
        sys.exit(1)

    conselhos = extract_conselhos(md_path)
    print(f'Extracted {len(conselhos)} conselhos from {md_path.name}')

    generate_json(conselhos, json_out)
    generate_python(conselhos, py_out)


if __name__ == '__main__':
    import sys
    main()
