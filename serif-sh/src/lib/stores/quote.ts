import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { DEFAULT_QUOTE, DEFAULT_AUTHOR } from '$lib/themes';

// True once the user has manually typed in the quote or author field.
// Also starts true when the page loads with a custom quote already in the URL
// (i.e. a shared link), so we never hit someone else's shared text.
const _hasCustomQuoteInUrl = browser
  ? (() => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      return params.has('quote') || params.has('author');
    })()
  : false;

export const hasUserEdited = writable<boolean>(_hasCustomQuoteInUrl);

// Base64 encode/decode for URL safety
function base64Encode(str: string): string {
  if (browser) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    ));
  }
  return str;
}

function base64Decode(str: string): string {
  if (browser) {
    try {
      return decodeURIComponent(
        atob(str).split('').map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
    } catch (e) {
      return str;
    }
  }
  return str;
}

// Helper to sync store with URL hash (base64 encoded)
function createBase64HashStore(key: string, defaultValue: string) {
  const { subscribe, set } = writable<string>(defaultValue);

  // Initialize from URL hash on browser
  if (browser) {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const hashValue = params.get(key);
    if (hashValue !== null) {
      try {
        set(base64Decode(hashValue));
      } catch (e) {
        console.error(`Failed to decode ${key}:`, e);
      }
    }
  }

  // Update URL when store changes
  const setWithHash = (value: string) => {
    set(value);
    if (browser) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      if (value === defaultValue || value === '') {
        params.delete(key);
      } else {
        params.set(key, base64Encode(value));
      }
      const newHash = params.toString();
      window.location.hash = newHash ? `#${newHash}` : '';
    }
  };

  // Updates the displayed quote without saving it to the URL.
  // Theme quotes are temporary — they should disappear on a fresh visit,
  // not show up in the URL bar. If we wrote them to the URL, the next page
  // load would see a "quote" param and wrongly think the user had typed
  // something, which would prevent future theme switches from updating the quote.
  const setSilent = (value: string) => {
    set(value);
  };

  return {
    subscribe,
    set: setWithHash,
    setSilent,
    update: (fn: (val: string) => string) => {
      const currentVal = get({ subscribe });
      setWithHash(fn(currentVal));
    },
  };
}

export const quoteText = createBase64HashStore('quote', DEFAULT_QUOTE);
export const authorName = createBase64HashStore('author', DEFAULT_AUTHOR);
export const sourceName = createBase64HashStore('source', '');
