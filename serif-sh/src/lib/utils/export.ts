import { toSvg, toBlob } from 'html-to-image';

const imageFilter = (node: HTMLElement) => {
  return !node.dataset?.ignoreInExport;
};

// Embedding fonts is required for self-hosted faces (Instrument Serif / Peerlist). skipFonts
// disables all @font-face inlining and was reverted after it broke exports.
const defaultOptions = {
  filter: imageFilter,
  pixelRatio: 2,
  skipAutoScale: true,
  // Optimization: use cache to avoid re-calculating styles if possible
  cacheBust: false,
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Clean-up to prevent memory leaks
  setTimeout(() => {
    if (link.parentNode) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 200);
}

export async function exportToPng(node: HTMLElement, filename: string = 'quote'): Promise<void> {
  // Wait for fonts to be ready (Lightweight & Reliable)
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }
  
  const blob = await toBlob(node, defaultOptions);
  
  if (!blob) {
    throw new Error('Failed to create image blob');
  }

  triggerDownload(blob, `${filename}.png`);
}

export async function exportToSvg(node: HTMLElement, filename: string = 'quote'): Promise<void> {
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }
  
  const dataUrl = await toSvg(node, defaultOptions);
  
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  triggerDownload(blob, `${filename}.svg`);
}

export async function copyToClipboard(node: HTMLElement): Promise<void> {
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }
  const blob = await toBlob(node, defaultOptions);

  if (!blob) {
    throw new Error('Failed to create image blob');
  }

  const clipboardItem = new ClipboardItem({
    'image/png': blob,
  });

  await navigator.clipboard.write([clipboardItem]);
}

export function isPngClipboardSupported(): boolean {
  return typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function';
}
