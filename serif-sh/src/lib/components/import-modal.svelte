<script lang="ts">
  import { quoteText, authorName, hasUserEdited } from '$lib/stores/quote'
  import { selectedThemeId } from '$lib/stores'
  import XLogoMark from './icons/x-logo-mark.svelte'
  import PeerlistLogoMark from './icons/peerlist-logo-mark.svelte'
  import CloseIcon from '$lib/components/icons/close.svelte'
  import Checkmark from '$lib/components/icons/checkmark.svelte'
  import Spinner from '$lib/components/icons/spinner.svelte'
  import Alert from '$lib/components/icons/alert.svelte'
  import { fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import { onDestroy, onMount } from 'svelte'

  export let open = false

  let url = ''
  let status: 'idle' | 'loading' | 'success' | 'error' = 'idle'
  let errorMessage = ''
  let isLong = false
  let inputRef: HTMLInputElement
  let isFocused = false

  const loadingMessages = [
    'Bypassing the digital bouncers...',
    'Searching for the wisdom...',
    'Polishing the pixels...',
    'Negotiating with the API...'
  ]
  let currentMessageIndex = 0
  let messageInterval: any

  const placeholderMessages = [
    'https://x.com/username/status/...',
    'https://peerlist.io/scroll/post/...'
  ]
  let currentPlaceholderIndex = 0
  let placeholderInterval: any

  $: if (status === 'loading') {
    if (!messageInterval) {
      messageInterval = setInterval(() => {
        currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length
      }, 2500)
    }
  } else {
    clearInterval(messageInterval)
    messageInterval = null
    currentMessageIndex = 0
  }

  onMount(() => {
    placeholderInterval = setInterval(() => {
      currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholderMessages.length
    }, 3000)
  })

  onDestroy(() => {
    if (messageInterval) clearInterval(messageInterval)
    if (placeholderInterval) clearInterval(placeholderInterval)
  })

  async function handleImport() {
    if (!url) return
    status = 'loading'
    errorMessage = ''

    try {
      const res = await fetch(`/api/parse-quote?url=${encodeURIComponent(url)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to import quote')
      }

      hasUserEdited.set(true)

      quoteText.set(data.text)
      if (data.author) {
        authorName.set(data.author)
      }

      // smart theme switching: if user imports from X, maybe switch to an X theme if they aren't on one
      if (data.platform === 'x' && !$selectedThemeId.includes('x')) {
        selectedThemeId.set('x-dark')
      } else if (data.platform === 'peerlist' && !$selectedThemeId.includes('peerlist')) {
        selectedThemeId.set('peerlist-dark')
      }

      isLong = data.isLong
      status = 'success'

      const closeDelay = isLong ? 3000 : 2000

      setTimeout(() => {
        if (status === 'success') {
          handleClose()
        }
      }, closeDelay)
    } catch (err: any) {
      status = 'error'
      errorMessage = err.message
    }
  }

  function handleClose() {
    open = false
    setTimeout(() => {
      status = 'idle'
      url = ''
      errorMessage = ''
      isLong = false
    }, 300)
  }

  function handleTryAgain() {
    status = 'idle'
    errorMessage = ''
    url = ''
  }

  function handlePaste() {
    setTimeout(() => {
      if (inputRef) {
        inputRef.scrollLeft = 0
        inputRef.setSelectionRange(0, 0)
      }
    }, 10)
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
    on:click|self={handleClose}
  >
    <div
      class="bg-parchment-100 p-4 w-full max-w-md h-75 flex flex-col rounded-3xl border border-parchment-500 overflow-hidden transition-all duration-300 transform scale-100 shadow-sm"
    >
      <div class="flex items-center justify-between mb-4 shrink-0">
        <h2 class="text-2xl font-semibold text-ink-900">Import from Social</h2>
        <button
          on:click={handleClose}
          class="group flex items-center justify-center rounded-full size-7 bg-parchment-50 border border-ink-300"
          aria-label="close"
        >
          <CloseIcon
            class="size-5 text-ink-400 group-hover:text-ink-500 transition-colors ease-out duration-200"
          />
        </button>
      </div>

      <div class="flex-1 flex flex-col">
        {#if status === 'idle'}
          <div class="flex-1 flex flex-col justify-end">
            <p class="text-ink-700 text-base mb-6 leading-relaxed text-center text-balance">
              Paste a link from
              <span class="inline-block" aria-hidden="true">
                <XLogoMark size={12} color={'black'} />
              </span>
              <span class="font-medium text-ink-900">Twitter</span>
              or
              <span class="inline-block -mb-0.5" aria-hidden="true">
                <PeerlistLogoMark size={16} />
              </span> <span class="font-medium text-ink-900">Peerlist</span> to automatically extract
              the Quotes from the post.
            </p>
            <div class="flex flex-col gap-4">
              <div class="relative w-full h-10 group">
                <input
                  bind:this={inputRef}
                  type="url"
                  bind:value={url}
                  class="w-full h-full px-4 py-2 rounded-lg shadow-custom bg-parchment-50 text-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-500/20 transition-all"
                  on:keydown={(e) => e.key === 'Enter' && handleImport()}
                  on:paste={handlePaste}
                  on:focus={() => (isFocused = true)}
                  on:blur={() => (isFocused = false)}
                />
                {#if !url && !isFocused}
                  <div
                    class="absolute inset-0 px-4 flex items-center pointer-events-none overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
                  >
                    {#key currentPlaceholderIndex}
                      <p
                        in:fly={{ y: 15, duration: 600, easing: cubicOut }}
                        out:fly={{ y: -15, duration: 600, easing: cubicOut }}
                        class="text-ink-300 text-sm absolute whitespace-nowrap"
                      >
                        {placeholderMessages[currentPlaceholderIndex]}
                      </p>
                    {/key}
                  </div>
                {/if}
              </div>
              <button
                on:click={handleImport}
                disabled={!url}
                class="w-full py-2 px-4 bg-ink-950 text-parchment-50 border-shadow rounded-lg font-medium hover:bg-ink-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Import Quote
              </button>
            </div>
          </div>
        {:else}
          <div class="flex-1 flex flex-col">
            <div class="h-24 flex items-center justify-center mt-8">
              <div
                class={[
                  'px-3.5 py-2 flex gap-1.5 items-center rounded-full transition-all duration-500 ease-in-out',
                  status === 'success' && 'bg-green-200/70',
                  status === 'loading' && 'bg-sky-200/50',
                  status === 'error' && 'bg-red-200/50'
                ]}
              >
                {#if status === 'success'}
                  <span in:fly={{ x: -10, duration: 300 }}>
                    <Checkmark class="size-6 text-green-500" />
                  </span>
                {:else if status === 'loading'}
                  <span in:fly={{ x: -10, duration: 300 }} class="flex items-center">
                    <Spinner class="size-6 text-sky-400" />
                  </span>
                {:else if status === 'error'}
                  <span in:fly={{ x: -10, duration: 300 }} class="flex items-center">
                    <span class="flex items-center animate-shake">
                      <Alert class="size-6 text-red-500" />
                    </span>
                  </span>
                {/if}

                {#key status}
                  <span
                    in:fly={{ x: status === 'loading' ? -20 : 25, duration: 300 }}
                    class={[
                      'text-lg font-medium',
                      status === 'success' && 'text-green-500',
                      status === 'loading' && 'text-sky-500',
                      status === 'error' && 'text-red-500'
                    ]}
                  >
                    {status === 'loading'
                      ? 'Fetching post content...'
                      : status === 'success'
                        ? 'Success!'
                        : 'Import Failed'}
                  </span>
                {/key}
              </div>
            </div>

            <div class="flex-1 flex flex-col items-center text-center px-4">
              {#if status === 'loading'}
                <div
                  class="h-6 overflow-hidden relative w-full flex justify-center mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
                >
                  {#key currentMessageIndex}
                    <p
                      in:fly={{ y: 20, duration: 800, easing: cubicOut }}
                      out:fly={{ y: -20, duration: 800, easing: cubicOut }}
                      class="text-ink-500 text-base absolute whitespace-nowrap"
                    >
                      {loadingMessages[currentMessageIndex]}
                    </p>
                  {/key}
                </div>
              {/if}

              {#if status === 'success'}
                <p class="text-ink-600 text-base">Quote imported and applied successully!.</p>
                {#if isLong}
                  <div
                    class="mt-2 p-3 shadow-custom bg-yellow-100/50 rounded-xl text-yellow-500 text-xs"
                  >
                    <strong>Tip:</strong> This quote is a bit long. Quotes under
                    <strong>120 characters</strong> usually look the most beautiful in our frames!
                  </div>
                {/if}
              {/if}

              {#if status === 'error'}
                <p
                  class="p-3 bg-red-200/50 shadow-custom rounded-xl text-red-400 text-sm line-clamp-2"
                >
                  {errorMessage}
                  <!-- This post contains media (images/video) which is not supported for quotes. -->
                </p>
                <button
                  on:click={handleTryAgain}
                  class="mt-4 text-xs underline text-ink-400 cursor-pointer hover:text-ink-500 transition-colors duration-150 ease-out"
                >
                  Try Another Link
                </button>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-4px);
    }
    75% {
      transform: translateX(4px);
    }
  }
  .animate-shake {
    animation: shake 0.15s ease-in-out 0s 3;
  }
</style>
