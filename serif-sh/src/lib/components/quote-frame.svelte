<script lang="ts">
  import {
    selectedTheme,
    selectedFontId,
    alignment,
    padding,
    currentFontCSS,
    authorFontCSS,
    showBackground,
    showQuoteMarks,
    showBrandLogo,
    showXVerifiedBadge
  } from '$lib/stores'
  import { quoteText, authorName, sourceName, hasUserEdited } from '$lib/stores/quote'
  import type { QuoteStyle } from '$lib/themes'
  import VercelWordmark from './icons/vercel-wordmark.svelte'
  import PeerlistWordMark from './icons/peerlist-wordmark.svelte'
  import XLogoMark from './icons/x-logo-mark.svelte'
  import XVerifiedBadge from './icons/x-verified-badge.svelte'
  import QuoteBrutalist from './icons/quote-brutalist.svelte'
  import QuoteStartup from './icons/quote-startup.svelte'
  import QuoteChirp from './icons/quote-chirp.svelte'
  import QuoteEditorial from './icons/quote-editorial.svelte'
  import QuoteBreeze from './icons/quote-breeze.svelte'
  import QuoteClaude from './icons/quote-claude.svelte'

  export let frameRef: HTMLDivElement | null = null
  export let editable: boolean = true
  export let quoteNumber: number | null = null

  $: theme = $selectedTheme
  $: bg = theme.background
  $: bgImage = theme.backgroundImage || null
  $: bgSize = theme.backgroundSize || 'cover'
  $: textColor = theme.text
  $: accentColor = theme.accent
  $: quoteMarkColor = theme.quoteMark
  $: borderColor = theme.border || 'transparent'
  $: isGradient = bg.includes('gradient')
  $: hasBackgroundImage = !!bgImage && $showBackground

  $: alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[$alignment]

  $: justifyClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[$alignment]

  /** X brand themes use `.quote-card.style-x` */
  $: frameFontFamily =
    theme.brand === 'x' && !$selectedFontId ? '' : `font-family: ${$currentFontCSS};`

  $: authorFontInline =
    $authorFontCSS && (theme.brand !== 'x' || $selectedFontId)
      ? ` font-family: ${$authorFontCSS}`
      : ''

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.target as HTMLElement).dataset.field === 'author') {
      e.preventDefault()
    }
  }

  let quoteWasFocused = false

  function handleQuoteMouseDown(e: MouseEvent) {
    quoteWasFocused = document.activeElement === e.currentTarget
  }

  function handleQuoteMouseUp(e: MouseEvent) {
    if (quoteWasFocused) return
    const el = e.currentTarget as HTMLElement
    const sel = window.getSelection()
    if (!sel) return
    const range = document.createRange()
    range.selectNodeContents(el)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  // Use actions instead of reactive text inside contenteditable to prevent cursor resets.
  // Svelte's reactive {$store} inside contenteditable re-renders the text node on every
  // keystroke, which destroys the cursor position.
  // Unified action for contenteditable stores
  function editableStore(node: HTMLElement, store: { subscribe: Function; set: Function }) {
    function onInput() {
      hasUserEdited.set(true)
      store.set(node.innerText)
    }

    function onPaste(e: ClipboardEvent) {
      e.preventDefault()
      const text = e.clipboardData?.getData('text/plain') ?? ''
      const selection = window.getSelection()
      if (!selection?.rangeCount) return
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      store.set(node.innerText)
    }

    const unsub = store.subscribe((val: string) => {
      if (document.activeElement !== node) {
        node.textContent = val
      }
    })

    node.addEventListener('input', onInput)
    node.addEventListener('paste', onPaste)

    return {
      destroy() {
        unsub()
        node.removeEventListener('input', onInput)
        node.removeEventListener('paste', onPaste)
      }
    }
  }
</script>

<div
  bind:this={frameRef}
  class="quote-frame quote-card"
  class:style-x={theme.brand === 'x'}
  style="
    padding: {$padding}px;
    {hasBackgroundImage
    ? `background-color: ${bg}; background-image: ${bgImage}; background-size: ${bgSize}; background-position: center;`
    : isGradient
      ? `background: ${$showBackground ? bg : 'transparent'}`
      : `background-color: ${$showBackground ? bg : 'transparent'}`};
    {frameFontFamily}
  "
>
  {#if !$showBackground}
    <div class="transparent-pattern absolute inset-0" data-ignore-in-export></div>
  {/if}

  <div class="quote-content" style="color: {textColor}">
    {@render quoteContent()}
  </div>
</div>

{#snippet auraOverlay()}
  {#if $showBackground}
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-white/50"></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(to_bottom,#A259FF_0%,#A259FF_65%,rgba(255,255,255,0.65)_100%)] opacity-60"
      ></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(to_bottom,#FF8726_0%,rgba(255,255,255,0.65)_100%)] opacity-60"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_300px_at_50%_-15%,transparent_20%,white_70%,transparent_85%,white_100%)] opacity-50 mix-blend-soft-light"
      ></div>
    </div>
  {/if}
{/snippet}

{#snippet editableQuote(extraClass = '')}
  <blockquote
    class="{extraClass} outline-none min-h-[1.5em] w-full"
    contenteditable={editable}
    use:editableStore={quoteText}
    on:keydown={handleKeyDown}
    on:mousedown={handleQuoteMouseDown}
    on:mouseup={handleQuoteMouseUp}
    data-placeholder="Enter your quote..."
  ></blockquote>
{/snippet}

{#snippet editableAuthor(extraClass = '', fieldColor = accentColor)}
  <cite
    class="{extraClass} outline-none min-h-[1.5em] not-italic"
    style="color: {fieldColor};{authorFontInline}"
    contenteditable={editable}
    use:editableStore={authorName}
    on:keydown={handleKeyDown}
    data-field="author"
    data-placeholder="AUTHOR"
    role="textbox"
    tabindex="0"
  ></cite>
{/snippet}

{#snippet editableSource(extraClass = '', fieldColor = accentColor)}
  <span
    class="{extraClass} outline-none min-h-[1.2em] not-italic block"
    style="color: {fieldColor};{authorFontInline}"
    contenteditable={editable}
    use:editableStore={sourceName}
    on:keydown={handleKeyDown}
    data-field="source"
    data-placeholder=""
    role="textbox"
    tabindex="0"
  ></span>
{/snippet}

{#snippet quoteIcon(type: QuoteStyle)}
  {#if $showQuoteMarks}
    {#if type === 'brutalist'}
      <QuoteBrutalist color={quoteMarkColor} size={40} class="mb-8" />
    {:else if type === 'startup'}
      <QuoteStartup color={quoteMarkColor} size={40} class="mb-8 shrink-0" />
    {:else if type === 'chirp'}
      <QuoteChirp color={quoteMarkColor} size={40} class="mb-4 shrink-0" />
    {:else if type === 'editorial' || type === 'noir'}
      <QuoteEditorial color={quoteMarkColor} size={40} class="mb-8 shrink-0" />
    {:else if type === 'breeze' || type === 'aura' || type === 'glass' || type === 'paper'}
      <QuoteBreeze color={quoteMarkColor} size={40} class="mb-4 md:mb-8 shrink-0" />
    {:else if type === 'claude-code'}
      <QuoteClaude color={quoteMarkColor} size={40} class="mb-4 md:mb-8 shrink-0" />
    {/if}
  {/if}
{/snippet}

{#snippet quoteContent()}
  <!-- Brutalist themes -->
  {#if theme.quoteStyle === 'brutalist'}
    <div
      class="relative z-10 flex w-full max-w-3xl mx-auto shadow-2xl p-4 md:p-8"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative flex flex-col w-full" style="border: 1px solid {borderColor};">
        <div class="absolute w-4 h-4 -top-2 -left-2 pointer-events-none">
          <div
            class="absolute top-1/2 left-0 w-full h-[0.5px] -translate-y-1/2"
            style="background-color: {accentColor};"
          ></div>
          <div
            class="absolute left-1/2 top-0 h-full w-[0.5px] -translate-x-1/2"
            style="background-color: {accentColor};"
          ></div>
        </div>

        <div class="absolute w-4 h-4 -bottom-2 -right-2 pointer-events-none">
          <div
            class="absolute top-1/2 left-0 w-full h-[0.5px] -translate-y-1/2"
            style="background-color: {accentColor};"
          ></div>
          <div
            class="absolute left-1/2 top-0 h-full w-[0.5px] -translate-x-1/2"
            style="background-color: {accentColor};"
          ></div>
        </div>

        <div
          class="relative z-10 flex flex-col pt-2 px-2 pb-2 md:pt-10 md:px-10 md:pb-8 min-h-50 {alignmentClass}"
        >
          {@render quoteIcon('brutalist')}
          {@render editableQuote('text-xl md:text-2xl font-medium leading-snug')}
        </div>

        <div
          class="relative z-10 flex items-center {justifyClass} px-10 min-h-14 py-4 mt-auto"
          style="border-top: 1px solid {borderColor};"
        >
          {@render editableAuthor('text-sm font-semibold uppercase tracking-widest whitespace-nowrap')}

          {#if $showBrandLogo}
            <span class="mx-3 text-lg opacity-40 font-light" style="color: {accentColor}">|</span>
            <VercelWordmark color={textColor} size={60} />
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Startup themes -->
  {#if theme.quoteStyle === 'startup'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('startup')}
      {@render editableQuote('text-xl md:text-3xl font-normal leading-relaxed')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      <div class="flex items-center {justifyClass} h-8 w-full">
        {@render editableAuthor('text-sm font-medium uppercase tracking-wider mr-4 whitespace-nowrap')}

        {#if $showBrandLogo}
          <span class="mr-4 text-sm font-light opacity-50" style="color: {accentColor}">|</span>
          <PeerlistWordMark color={textColor} size={60} />
        {/if}
      </div>
    </div>
  {/if}

  <!-- Chirp themes -->
  {#if theme.quoteStyle === 'chirp'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('chirp')}
      {@render editableQuote('text-xl md:text-2xl font-normal leading-normal tracking-normal')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      <div class="flex items-center {justifyClass} h-8 w-full gap-1">
        <div class="flex min-w-0 items-center gap-1 mr-2">
          {@render editableAuthor('text-sm font-medium uppercase tracking-wider whitespace-nowrap')}
          {#if $showXVerifiedBadge}
            <XVerifiedBadge color={quoteMarkColor} size={18} />
          {/if}
        </div>

        {#if $showBrandLogo}
          <span class="mr-2 text-sm font-light opacity-50" style="color: {accentColor}">|</span>
          <XLogoMark color={textColor} size={14} />
        {/if}
      </div>
    </div>
  {/if}

  <!-- Editorial theme -->
  {#if theme.quoteStyle === 'editorial'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('editorial')}
      {@render editableQuote('text-xl md:text-2xl font-normal italic leading-relaxed')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      {@render editableAuthor('text-sm font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Breeze theme -->
  {#if theme.quoteStyle === 'breeze'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl card-shadow {alignmentClass}"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative z-10 flex flex-col min-h-50">
        {@render quoteIcon('breeze')}
        {@render editableQuote('text-xl md:text-2xl lg:text-3xl font-medium leading-snug')}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor('text-base font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Aura theme -->
  {#if theme.quoteStyle === 'aura'}
    {@render auraOverlay()}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl card-shadow {alignmentClass}"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative z-10 flex flex-col min-h-50">
        {@render quoteIcon('aura')}
        {@render editableQuote('text-xl md:text-2xl lg:text-3xl font-medium leading-snug')}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor('text-sm font-semibold uppercase tracking-widest')}
    </div>
  {/if}

  <!-- Paper theme -->
  {#if theme.quoteStyle === 'paper'}
    <div class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}">
      {@render quoteIcon('paper')}
      {@render editableQuote('text-xl md:text-3xl font-medium italic leading-relaxed')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      {@render editableAuthor('text-base font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Noir theme -->
  {#if theme.quoteStyle === 'noir'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('noir')}
      {@render editableQuote('text-xl md:text-2xl font-normal leading-relaxed')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      {@render editableAuthor('text-base font-normal normal-case tracking-normal italic mr-4')}
      {@render editableSource('text-sm font-medium normal-case tracking-normal opacity-90 mt-2 mr-4')}
    </div>

    {#if quoteNumber !== null}
      <div class="absolute bottom-6 right-6 text-xs tracking-[0.3em] uppercase font-medium" style="color: {accentColor}; opacity: 0.5;">
        {String(quoteNumber).padStart(3, '0')} / 1001
      </div>
    {/if}
  {/if}

  <!-- Glass theme -->
  {#if theme.quoteStyle === 'glass'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl glassmorphism {alignmentClass}"
    >
      <div class="relative z-10 flex flex-col min-h-50">
        {@render quoteIcon('glass')}
        {@render editableQuote('text-xl md:text-2xl lg:text-3xl font-medium leading-snug')}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor('text-base font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Claude terminal theme -->
  {#if theme.quoteStyle === 'claude-code'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto rounded-md md:rounded-lg card-shadow overflow-hidden"
      style="background-color: {theme.cardBackground || bg};"
    >
      <!-- Terminal title bar -->
      <div
        class="flex items-center gap-2 px-4 h-9 shrink-0"
        style="background-color: #2d2d2d;"
        aria-hidden="true"
      >
        <div class="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
        <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
        <div class="w-3 h-3 rounded-full bg-[#27C93F]"></div>
      </div>

      <!-- Terminal body -->
      <div class="flex flex-col p-4 md:p-6">
        <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
          {@render quoteIcon('claude-code')}
          {@render editableQuote('text-xl md:text-2xl font-light leading-snug')}
        </div>

        <div class="w-full h-[0.5px] mt-6 mb-3" style="background-color: {borderColor};"></div>
        <div class="flex items-center h-8 w-full">
          <span class="mr-3 font-bold text-lg select-none" style="color: {accentColor}">&gt;</span>
          {@render editableAuthor('text-base font-medium uppercase tracking-wider mr-4')}
        </div>
        <div class="w-full h-[0.5px] mt-3" style="background-color: {borderColor};"></div>
      </div>
    </div>
  {/if}
{/snippet}

<style>
  .quote-frame {
    min-width: 400px;
    min-height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .quote-content {
    width: 100%;
  }

  [contenteditable]:empty:before {
    content: attr(data-placeholder);
    opacity: 0.4;
    pointer-events: none;
  }

  [contenteditable]:focus {
    outline: none;
  }

  [contenteditable] {
    cursor: text;
  }

  :global(.inline-marks::before) {
    content: '\201C';
  }

  :global(.inline-marks::after) {
    content: '\201D';
  }
</style>
