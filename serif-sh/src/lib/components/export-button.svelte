<script lang="ts">
  import {
    exportToPng,
    exportToSvg,
    copyToClipboard,
    isPngClipboardSupported
  } from '$lib/utils/export'
  import { quoteText, authorName } from '$lib/stores/quote'
  import { selectedThemeId, copyShareableUrl } from '$lib/stores'
  import { get } from 'svelte/store'
  import { tick } from 'svelte'
  import { browser } from '$app/environment'
  import ChevronDown from '$lib/components/icons/chevron-down.svelte'
  import Spinner from '$lib/components/icons/spinner.svelte'
  import ExportIcon from '$lib/components/icons/export.svelte'
  import ImageIcon from '$lib/components/icons/image.svelte'
  import CopyIcon from '$lib/components/icons/copy.svelte'
  import LinkIcon from '$lib/components/icons/link.svelte'

  export let frameRef: HTMLDivElement | null = null
  export const variant: 'default' | 'navbar' = 'default'

  export let onToast:
    | ((detail: { message: string; type?: 'success' | 'error' }) => void)
    | undefined = undefined

  function emitToast(detail: { message: string; type?: 'success' | 'error' }) {
    onToast?.(detail)
  }

  let isExporting = false
  let showDropdown = false

  $: clipboardSupported = browser && isPngClipboardSupported()

  function getFilename(): string {
    const author = get(authorName)
    if (author) {
      return `quote-${author.toLowerCase().replace(/\s+/g, '-')}`
    }
    return 'quote-serifsh'
  }

  // Track export in backend
  async function trackExport(exportType: 'png' | 'svg' | 'clipboard' | 'url') {
    try {
      const url = browser ? window.location.href : ''
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          exportType,
          quote: get(quoteText).slice(0, 100), // First 100 chars
          author: get(authorName),
          themeId: get(selectedThemeId),
          timestamp: Date.now()
        })
      })
    } catch (e) {
      // Silently fail - don't block export
      console.error('Failed to track export:', e)
    }
  }

  async function handleExportPng() {
    if (!frameRef || isExporting) return
    isExporting = true
    showDropdown = false
    await tick()

    try {
      emitToast({ message: 'Exporting PNG...' })
      // Small delay to let the toast show up before blocking main thread
      await new Promise((r) => setTimeout(r, 100))

      await exportToPng(frameRef, getFilename())
      trackExport('png')
      emitToast({ message: 'PNG exported!', type: 'success' })
    } catch (error) {
      console.error('Export failed:', error)
      emitToast({ message: 'Export failed', type: 'error' })
    } finally {
      // Give the browser a moment before allowing another export/interaction
      setTimeout(() => {
        isExporting = false
      }, 500)
    }
  }

  async function handleExportSvg() {
    if (!frameRef || isExporting) return
    isExporting = true
    showDropdown = false
    await tick()

    try {
      emitToast({ message: 'Exporting SVG...' })
      await new Promise((r) => setTimeout(r, 100))

      await exportToSvg(frameRef, getFilename())
      trackExport('svg')
      emitToast({ message: 'SVG exported!', type: 'success' })
    } catch (error) {
      console.error('Export failed:', error)
      emitToast({ message: 'Export failed', type: 'error' })
    } finally {
      setTimeout(() => {
        isExporting = false
      }, 500)
    }
  }

  async function handleCopyToClipboard() {
    if (!frameRef || isExporting) return
    isExporting = true
    showDropdown = false
    await tick()

    try {
      emitToast({ message: 'Copying to clipboard...' })
      await new Promise((r) => setTimeout(r, 100))

      await copyToClipboard(frameRef)
      trackExport('clipboard')
      emitToast({ message: 'Copied to clipboard!', type: 'success' })
    } catch (error) {
      console.error('Copy failed:', error)
      emitToast({ message: 'Copy failed', type: 'error' })
    } finally {
      setTimeout(() => {
        isExporting = false
      }, 500)
    }
  }

  async function handleCopyUrl() {
    showDropdown = false
    await tick()

    try {
      const url = copyShareableUrl()
      await navigator.clipboard.writeText(url)
      trackExport('url')
      emitToast({ message: 'URL copied to clipboard!', type: 'success' })
    } catch (error) {
      console.error('Copy URL failed:', error)
      emitToast({ message: 'Failed to copy URL', type: 'error' })
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (!showDropdown) return

    const path = event.composedPath()
    const clickedInside = path.some(
      (node) => node instanceof Element && node.closest('.export-dropdown')
    )

    if (!clickedInside) {
      showDropdown = false
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative export-dropdown">
  <button
    class="inline-flex items-center h-[30px] rounded-lg overflow-hidden text-sm font-medium bg-parchment-200/50 ml-2 sm:ml-3 hover:bg-parchment-200 transition-colors duration-150 ease-out cursor-pointer shadow-custom [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    class:opacity-50={isExporting}
    on:click|stopPropagation={() => !isExporting && (showDropdown = !showDropdown)}
    aria-label="Export options"
    aria-expanded={showDropdown}
    aria-busy={isExporting}
  >
    <span class="group flex items-center gap-1.5 px-3 h-full">
      {#if isExporting}
        <Spinner class="size-4.5 text-ink-900" />
      {:else}
        <ExportIcon class="size-5 text-ink-900" />
      {/if}
      <span class="text-ink-900">{isExporting ? 'Exporting…' : 'Export'}</span>
    </span>
    <span class="w-px h-[30px] bg-parchment-300 shrink-0"></span>
    <span class="flex items-center px-3 h-full">
      <ChevronDown
        class="size-4.5 transition-transform duration-150 text-ink-900 {showDropdown
          ? 'rotate-180'
          : ''}"
      />
    </span>
  </button>

  {#if showDropdown}
    {@const itemClass =
      'group w-full px-2 py-1.5 text-left text-[13px] text-ink-600 hover:text-ink-700 hover:bg-parchment-200 rounded-lg h-9 flex items-center gap-2 transition-colors duration-150'}
    <div
      class="export-dropdown--open absolute right-0 top-full mt-1.5 w-48 p-1 rounded-xl z-50
        bg-parchment-50 border border-black/10 shadow-xs"
    >
      <button class={itemClass} on:click={handleExportPng}>
        <ImageIcon class="size-5 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
        Save as PNG
      </button>
      <button class={itemClass} on:click={handleExportSvg}>
        <ImageIcon class="size-5 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
        Save as SVG
      </button>
      {#if clipboardSupported}
        <button class={itemClass} on:click={handleCopyToClipboard}>
          <CopyIcon class="size-5 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
          Copy Image
        </button>
      {/if}
      <div class="my-1 -mx-1 h-px bg-black/10"></div>
      <button class={itemClass} on:click={handleCopyUrl}>
        <LinkIcon class="size-5 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
        Copy URL
      </button>
    </div>
  {/if}
</div>
