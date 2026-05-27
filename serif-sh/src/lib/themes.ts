export type QuoteStyle = 'brutalist' | 'startup' | 'chirp' | 'editorial' | 'breeze' | 'aura' | 'paper' | 'noir' | 'glass' | 'claude-code';
export type Alignment = 'left' | 'center' | 'right';
export type FontFamily = 'playfair' | 'old-standard' | 'geist' | 'inter'|'mono'|'instrument-serif';
export type Brand = 'vercel' | 'peerlist' | 'x';

export interface Theme {
  id: string;
  name: string;
  quoteStyle: QuoteStyle;
  background: string;
  cardBackground?: string;
  text: string;
  accent: string;
  quoteMark: string;
  border?: string;
  shadow?: boolean;
  font: FontFamily;
  authorFont?: FontFamily;
  brand?: Brand;
  defaultAlignment?: Alignment;
  // Background image support
  backgroundImage?: string;
  backgroundSize?: string;
}

export interface ThemeQuote {
  text: string;
  author: string;
}

export const FONTS: Record<FontFamily, { name: string; css: string }> = {
  'geist': {
    name: 'Geist',
    css: '"Geist", sans-serif',
  },
  'inter': {
    name: 'Inter',
    css: '"Inter", sans-serif',
  },
   'playfair': {
    name: 'Playfair Display',
    css: '"Playfair Display", serif',
  },
  'old-standard': {
    name: 'Old Standard TT',
    css: '"Old Standard TT", serif',
  },
  'mono': {
    name: 'JetBrains Mono',
    css: '"JetBrains Mono", monospace',
  },
  'instrument-serif': {
    name: 'Instrument Serif',
    css: '"Instrument Serif", serif',
  }
};

export const THEMES: Record<string, Theme> = {
  "vercel-dark": {
    id: 'vercel-dark',
    name: 'Vercel Dark',
    quoteStyle: 'brutalist',
    background: '#000000',
    backgroundImage: 'url(/vercel-dark-bg.jpg)',
    backgroundSize: 'cover',
    cardBackground: '#000000',
    text: '#ffffff',
    accent: '#A0A0A0',
    quoteMark: '#0070F3',
    border: '#FFFFFF20',
    font: 'geist',
    authorFont: "geist",
    brand: 'vercel',
    defaultAlignment: 'left',
  },
  "vercel-light": {
    id: 'vercel-light',
    name: 'Vercel Light',
    quoteStyle: 'brutalist',
    background: '#ffffff',
    backgroundImage: 'url(/vercel-light-bg.jpg)',
    backgroundSize: 'cover',
    cardBackground: '#ffffff',
    text: '#111827',
    accent: '#666666',
    quoteMark: '#0070F3',
    border: '#0000001A',
    font: 'geist',
    authorFont: "geist",
    brand: 'vercel',
    defaultAlignment: 'left',
  },
  "peerlist-dark": {
    id: 'peerlist-dark',
    name: 'Peerlist Dark',
    quoteStyle: 'startup',
    background: "#171717",
    text: "#fafafa",
    accent: "#A0A0A0",
    quoteMark: "#00AA45",
    border: "#FFFFFF20",
    font: "instrument-serif",
    authorFont: "geist",
    brand: 'peerlist',
    defaultAlignment: 'left',
  },
  "peerlist-light": {
    id: 'peerlist-light',
    name: 'Peerlist Light',
    quoteStyle: 'startup',
    background: "#FFFFFF",
    text: "#0d0d0d",
    accent: "#666666",
    quoteMark: "#00AA45",
    border: "#0000001A",
    font: "instrument-serif",
    authorFont: "geist",
    brand: 'peerlist',
    defaultAlignment: 'left',
  },
  "x-dark": {
    id: 'x-dark',
    name: 'X Dark',
    quoteStyle: 'chirp',
    background: "#000000",
    text: "#ffffff",
    accent: "#71767b",
    quoteMark: "#1D9BF0",
    border: "#2f3336",
    font: "inter",
    authorFont: "inter",
    brand: 'x',
    defaultAlignment: 'left',
  },
  "x-light": {
    id: 'x-light',
    name: 'X Light',
    quoteStyle: 'chirp',
    background: "#ffffff",
    text: "#000000",
    accent: "#71767b",
    quoteMark: "#1D9BF0",
    border: "#EFF3F4",
    font: "inter",
    authorFont: "inter",
    brand: 'x',
    defaultAlignment: 'left',
  },
  "editorial": {
    id: 'editorial',
    name: 'Editorial',
    quoteStyle: 'editorial',
    background: '#FFFFF0',
    text: '#000000',
    accent: '#666666',
    quoteMark: '#000000',
    border: '#E5E7EB',
    font: 'playfair',
    authorFont: 'inter',
  },
  "breeze": {
    id: 'breeze',
    name: 'Breeze',
    quoteStyle: 'breeze',
    backgroundImage:'linear-gradient(180deg, rgb(196, 213, 255), rgb(255, 255, 255))',
    background: '#AEC6FF',
    cardBackground: '#FFFFFFF2',
    text: '#374151',
    accent: '#666666',
    quoteMark: '#AEC6FF',
    border: '#AEC6FF',
    font: 'old-standard',
    authorFont: 'inter',
    defaultAlignment: 'left',
  },
  "aura": {
    id: 'aura',
    name: 'Aura',
    quoteStyle: 'aura',
    backgroundImage:'linear-gradient(0deg, rgba(162, 89, 255, 0.5), rgb(255, 135, 38))',
    background: '#FFFFFF',
    cardBackground: '#FFFFFF80',
    text: '#514437',
    accent: '#666666',
    quoteMark: '#FF943E99',
    border: '#FF943E99',
    font: 'inter',
    authorFont: 'inter',
  },
  "paper": {
    id: 'paper',
    name: 'Paper',
    quoteStyle: 'paper',
    background: '#FFFFFF',
    backgroundImage: 'url(/paper-texture-bg.jpg)',
    backgroundSize: 'cover',
    text: '#3F3F46',
    accent: '#666666',
    quoteMark: '#A1A1A1',
    border: '#A1A1A1',
    font: 'inter',
    authorFont: "inter",
    defaultAlignment: 'left',
  },
   "noir": {
    id: 'noir',
    name: 'Noir',
    quoteStyle: 'noir',
    background: '#000000',
    text: '#FFFFFF',
    accent: '#A0A0A0',
    quoteMark: '#FFCC00',
    border: '#FFCC00',
    font: 'playfair',
    authorFont: 'inter',
  },
  "glass": {
    id: 'glass',
    name: 'Glass',
    quoteStyle: 'glass',
    backgroundImage:'linear-gradient(140deg, rgb(177, 177, 177), rgb(24, 24, 24))',
    background: '#000000',
    text: '#FFFFFF',
    accent: '#EDEDED',
    quoteMark: '#FFFFFF',
    border: '#EAEAEA',
    font: 'old-standard',
    authorFont: 'inter',
  },
  "claude-code": {
    id: 'claude-code',
    name: 'Claude code',
    quoteStyle: 'claude-code',
    background: '#DE7356',
    cardBackground: '#1a1815',
    text: '#737568',
    accent: '#DE7356',
    quoteMark: '#DE7356',
    border: '#3d3d3d',
    font: 'mono',
    defaultAlignment: 'left',
  }
};

export const PADDING_PRESETS = [32, 64, 96, 128];

export const DEFAULT_QUOTE = "Writing doesn't just communicate ideas; it generates them. If you're bad at writing and don't like to do it, you'll miss out on most of the ideas writing would have generated.";
export const DEFAULT_AUTHOR = "Paul Graham";

export const THEME_QUOTES: Record<string, ThemeQuote> = {
  default: {
    text: DEFAULT_QUOTE,
    author: DEFAULT_AUTHOR,
  },
  vercel: {
    text: "Learn to ship. Shipping is a skill distinct from coding. Shipping is designing, coding, QAing, story-telling, teaching, marketing, selling, pivoting, iterating…",
    author: "Guillermo Rauch",
  },
  peerlist: {
    text: "Good projects start with a domain. Not because the domain itself matters that much, but because buying it means you're starting. You're committing.",
    author: "Akash Bhadange",
  },
  x: {
    text:"You guys are the magicians of the 21st century. Don't let anything hold you back. Imagination is the limit. Go out there and create some magic.",
    author: "Elon Musk",
  },
  "editorial": {
    text: "Everyone has an idea, but it's really about executing the idea and attracting other people to help you work on the idea.",
    author: "Jack Dorsey",
  },
  "breeze": {
    text: "Good design is as little as possible. Less, but better, because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity.",
    author: "Dieter Rams",
  },
  "aura": {
    text:"We shouldn't be afraid to fail- if we are not failing we are not pushing. 80% of the stuff in the studio is not going to work. If something is not good enough, stop doing it.",
    author: "Sir Jony Ive",
  },
  "paper": {
    text: "I was not born with a whole lot of natural talent... but I work hard and I never give up.",
    author: "Rock Lee",
  },
  "noir": {
    text: "Technology is not only the thing that moves the human race forward, but its the only thing that ever has. Without technology, we're just monkeys playing in the dirt.",
    author: "Naval Ravikant",
  },
  "glass": {
    text: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma - which is living with the results of other people's thinking.",
    author: "Steve Jobs",
  },
  "claude-code": {
    text: "The hottest new programming language is English. We're moving toward a world where you describe what you want, and the computer figures out how to do it.",
    author: "Andrej Karpathy",
  },
};

export function getThemeQuote(themeId: string): ThemeQuote {
  const theme = THEMES[themeId];
  return (
    THEME_QUOTES[themeId] ??
    (theme?.brand ? THEME_QUOTES[theme.brand] : undefined) ??
    THEME_QUOTES.default
  );
}
