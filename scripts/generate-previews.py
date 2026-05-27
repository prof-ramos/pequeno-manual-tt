#!/usr/bin/env python3
"""
Script para gerar imagens dos 10 primeiros conselhos.
Útil para testar e criar materiais de preview.
"""

import json
import os
import sys
import subprocess
from pathlib import Path

# Configuration
SERIF_SH_URL = os.environ.get('SERIF_SH_URL', 'http://localhost:5173')
OUTPUT_DIR = Path(__file__).parent / 'preview-images'
THEME = 'noir'

def load_conselhos():
    """Load all 1001 conselhos from JSON file."""
    script_dir = Path(__file__).parent
    json_path = script_dir.parent / 'serif-sh' / 'src' / 'lib' / 'conselhos.json'

    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_image(quote: str, quote_num: int, theme: str = 'noir', base_url: str = SERIF_SH_URL) -> bytes:
    """
    Call the serif.sh API to generate an image for the quote.
    """
    import requests
    from urllib.parse import urlencode

    params = {
        'quote': quote,
        'theme': theme,
        'author': 'Pequeno Manual de Instruções para a Vida',
        'marks': 'true',
        'bg': 'true'
    }

    url = f"{base_url}/api/generate?{urlencode(params)}"
    print(f"  Generating #{quote_num}: {url}")

    response = requests.get(url, timeout=60)
    response.raise_for_status()
    return response.content

def save_image(image_data: bytes, quote_num: int, output_dir: Path = OUTPUT_DIR) -> Path:
    """Save the image to a file."""
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = f"conselho-{quote_num:04d}.png"
    filepath = output_dir / filename

    with open(filepath, 'wb') as f:
        f.write(image_data)

    return filepath

def main():
    print("=" * 50)
    print("Gerando Imagens dos 10 Primeiros Conselhos")
    print("=" * 50)

    # Load conselhos
    conselhos = load_conselhos()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for i in range(1, 11):
        quote = conselhos[str(i)]
        print(f"\n[{i}/10] Conselho #{i}")
        print(f"  Texto: {quote}")

        try:
            image_data = generate_image(quote, i, THEME)
            filepath = save_image(image_data, i)
            print(f"  Salvo: {filepath} ({len(image_data)} bytes)")
        except Exception as e:
            print(f"  Erro: {e}")

    print("\n" + "=" * 50)
    print(f"Imagens salvas em: {OUTPUT_DIR}")
    print("=" * 50)

if __name__ == '__main__':
    main()