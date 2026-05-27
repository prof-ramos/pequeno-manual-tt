#!/usr/bin/env python3
"""
Daily Post Script - Conselho do Dia
Automatically posts a daily quote from "Pequeno Manual de Instruções para a Vida" to X (Twitter).

Usage:
    python daily-post.py                    # Post today's quote
    python daily-post.py --test            # Test without posting
    python daily-post.py --quote 123       # Post specific quote by number
    python daily-post.py --random          # Post a random quote
"""

import json
import os
import sys
import argparse
from datetime import datetime
from pathlib import Path
from typing import Optional

import requests
from urllib.parse import urlencode

# X API v2 configuration
# Required: OAuth 2.0 User Access Token with tweet.write scope.
# The Free tier has virtually no write credits; expect 402 CreditsDepleted.
# Generate token at: https://developer.twitter.com/en/portal/projects-and-apps
TWITTER_BEARER_TOKEN = os.environ.get('TWITTER_BEARER_TOKEN', '')

# Server URL - change for production
SERIF_SH_URL = os.environ.get('SERIF_SH_URL', 'http://localhost:5173')
OUTPUT_DIR = Path(__file__).parent / 'output'


def load_conselhos():
    """Load all 1001 conselhos from JSON file."""
    script_dir = Path(__file__).parent
    json_path = script_dir.parent / 'serif-sh' / 'src' / 'lib' / 'conselhos.json'

    if not json_path.exists():
        # Try alternate location
        json_path = script_dir / 'conselhos.json'

    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_quote_for_date(conselhos: dict, date: Optional[datetime] = None) -> tuple[int, str]:
    """
    Get a deterministic quote based on the date.
    Uses day of year to cycle through all 1001 quotes throughout the year.
    """
    if date is None:
        date = datetime.now()

    # Get day of year (1-366)
    day_of_year = date.timetuple().tm_yday

    # Calculate quote number (1-1001) - cycles through all quotes
    quote_num = ((day_of_year - 1) % 1001) + 1

    return quote_num, conselhos[str(quote_num)]


def get_random_quote(conselhos: dict) -> tuple[int, str]:
    """Get a random quote."""
    import random
    quote_num = random.randint(1, 1001)
    return quote_num, conselhos[str(quote_num)]


def get_quote_by_number(conselhos: dict, number: int) -> tuple[int, str]:
    """Get a specific quote by number."""
    if number < 1 or number > 1001:
        raise ValueError(f"Quote number must be between 1 and 1001, got {number}")
    return number, conselhos[str(number)]


def generate_image(quote: str, theme: str = 'noir', author: str = 'H. Jackson Brown, Jr.',
                   source: str = 'Pequeno Manual de Instruções para a Vida',
                   number: int = 0,
                   base_url: str = SERIF_SH_URL) -> bytes:
    """
    Call the serif.sh API to generate an image for the quote.
    """
    params = {
        'quote': quote,
        'theme': theme,
        'author': author,
        'source': source,
        'number': str(number),
        'marks': 'true',
        'bg': 'true'
    }

    url = f"{base_url}/api/generate?{urlencode(params)}"

    print(f"Generating image from: {url}")

    response = requests.get(url, timeout=60)
    response.raise_for_status()

    return response.content


def save_image(image_data: bytes, quote_num: int, output_dir: Path = OUTPUT_DIR) -> Path:
    """Save the image to a file."""
    output_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime('%Y-%m-%d')
    filename = f"conselho-{today}-{quote_num}.png"
    filepath = output_dir / filename

    with open(filepath, 'wb') as f:
        f.write(image_data)

    print(f"Image saved to: {filepath}")
    return filepath


def upload_media_to_twitter(image_data: bytes, bearer_token: str) -> str:
    """Upload image to X using v2 media endpoint with OAuth 2.0 Bearer Token."""
    response = requests.post(
        'https://api.x.com/2/media/upload',
        headers={
            'Authorization': f'Bearer {bearer_token}'
        },
        files={'media': ('image.png', image_data, 'image/png')}
    )

    response.raise_for_status()
    media_data = response.json()

    media_id = media_data.get('data', {}).get('id')
    if not media_id:
        raise ValueError(f"Unexpected media upload response: {media_data}")

    return media_id


def post_to_twitter(text: str, media_id: Optional[str] = None,
                     bearer_token: Optional[str] = None) -> dict:
    """Post a tweet with optional media to X using v2 API + OAuth 2.0 Bearer Token."""
    if not bearer_token:
        bearer_token = TWITTER_BEARER_TOKEN

    if not bearer_token:
        raise ValueError("TWITTER_BEARER_TOKEN must be set with tweet.write scope")

    payload = {
        'text': text
    }

    if media_id:
        payload['media'] = {'media_ids': [media_id]}

    response = requests.post(
        'https://api.x.com/2/tweets',
        headers={
            'Authorization': f'Bearer {bearer_token}',
            'Content-Type': 'application/json'
        },
        json=payload
    )

    response.raise_for_status()
    return response.json()


def format_tweet(quote_num: int, quote: str, author: str = 'Pequeno Manual de Instruções para a Vida') -> str:
    """Format the tweet text."""
    max_length = 280 - 24  # Leave room for the hashtag and URL
    text = f'"{quote}"\n\n— {author}\n\n#{quote_num}'

    if len(text) > max_length:
        # Truncate quote if needed
        truncated_quote = quote[:max_length - len(author) - len(f'"..."\n\n— {author}\n\n#{quote_num}')] + "..."
        text = f'"{truncated_quote}"\n\n— {author}\n\n#{quote_num}'

    return text


def main():
    parser = argparse.ArgumentParser(
        description='Post daily quote from Pequeno Manual de Instruções para a Vida to X'
    )
    parser.add_argument('--test', action='store_true',
                        help='Test without posting to Twitter')
    parser.add_argument('--quote', type=int, metavar='N',
                        help='Post specific quote number (1-1001)')
    parser.add_argument('--random', action='store_true',
                        help='Post a random quote')
    parser.add_argument('--theme', default='noir',
                        help='Theme for the image (default: noir)')
    parser.add_argument('--url', default=SERIF_SH_URL,
                        help=f'Serif.sh server URL (default: {SERIF_SH_URL})')
    parser.add_argument('--save-only', action='store_true',
                        help='Only save the image, do not post to Twitter')

    args = parser.parse_args()

    print("=" * 50)
    print("Conselho do Dia - Daily Post Script")
    print("=" * 50)

    # Load conselhos
    print("\nLoading conselhos...")
    conselhos = load_conselhos()
    print(f"Loaded {len(conselhos)} conselhos")

    # Get quote based on arguments
    if args.quote:
        quote_num, quote = get_quote_by_number(conselhos, args.quote)
    elif args.random:
        quote_num, quote = get_random_quote(conselhos)
    else:
        quote_num, quote = get_quote_for_date(conselhos)

    print(f"\nQuote #{quote_num}: {quote}")

    # Generate image
    print(f"\nGenerating image with theme '{args.theme}'...")
    try:
        image_data = generate_image(quote, theme=args.theme, base_url=args.url, source='Pequeno Manual de Instruções para a Vida', number=quote_num)
        print(f"Image generated successfully ({len(image_data)} bytes)")
    except Exception as e:
        print(f"Error generating image: {e}")
        sys.exit(1)

    # Save image
    if args.save_only or args.test:
        filepath = save_image(image_data, quote_num)
        print(f"\nImage saved to: {filepath}")

    if args.test:
        print("\nTest mode - not posting to Twitter")
        return

    if args.save_only:
        print("\nSave only mode - not posting to Twitter")
        return

    # Post to Twitter
    print("\nPosting to Twitter...")

    try:
        # Get OAuth 2.0 Bearer Token
        bearer_token = TWITTER_BEARER_TOKEN
        if not bearer_token:
            raise ValueError("TWITTER_BEARER_TOKEN must be set (OAuth 2.0 User Token with tweet.write scope)")

        # Upload media
        print("Uploading media...")
        media_id = upload_media_to_twitter(image_data, bearer_token)
        print(f"Media uploaded: {media_id}")

        # Format and post tweet
        tweet_text = format_tweet(quote_num, quote)
        print(f"Tweet text:\n{tweet_text}")

        result = post_to_twitter(tweet_text, media_id, bearer_token)
        print(f"\nTweet posted successfully!")
        print(f"Tweet ID: {result.get('data', {}).get('id', 'N/A')}")
        print(f"URL: https://x.com/i/web/status/{result.get('data', {}).get('id', '')}")

    except requests.HTTPError as e:
        status = e.response.status_code if hasattr(e, 'response') else 0
        if status == 402:
            print(f"\nError 402 CreditsDepleted: Your X API account has run out of write credits.")
            print("The Free tier has virtually no write credits. Options:")
            print("  1. Wait for the monthly reset (cycle: ~8th of each month)")
            print("  2. Upgrade to Basic tier ($100/month) at https://developer.x.com/en/portal/products")
            print("  3. Use --save-only to generate images without posting")
        else:
            print(f"Error posting to Twitter: {e}")
        print("\nNote: Make sure Twitter API OAuth 2.0 User Token is set:")
        print("  TWITTER_BEARER_TOKEN (with tweet.write scope)")
        sys.exit(1)
    except Exception as e:
        print(f"Error posting to Twitter: {e}")
        print("\nNote: Make sure Twitter API OAuth 2.0 User Token is set:")
        print("  TWITTER_BEARER_TOKEN (with tweet.write scope)")
        sys.exit(1)

    print("\n" + "=" * 50)
    print("Done!")
    print("=" * 50)


if __name__ == '__main__':
    main()