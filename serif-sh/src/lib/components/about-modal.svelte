<script lang="ts">
  import TicketpingLogoMark from './icons/ticketping-logo-mark.svelte'
  import XLogoMark from './icons/x-logo-mark.svelte'
  import CloseIcon from '$lib/components/icons/close.svelte'

  export let open = false

  function close() {
    open = false
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) close()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
    on:click|self={handleBackdropClick}
  >
    <div
      class="modal relative w-full max-w-md p-6 bg-parchment-100 rounded-3xl border border-parchment-500 overflow-hidden transition-all duration-300 transform scale-100 shadow-sm"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold text-ink-900">About</h2>
        <button
          on:click={close}
          class="group flex items-center justify-center rounded-full size-7 bg-parchment-50 border border-ink-300"
          aria-label="close"
        >
          <CloseIcon
            class="size-5 text-ink-400 group-hover:text-ink-500 transition-colors ease-out duration-200"
          />
        </button>
      </div>

      <div class="space-y-3 text-sm leading-relaxed text-ink-700 mb-4">
        <p>serif.sh is a tool to create beautiful, shareable images of your favorite quotes.</p>
        <p>
          Pick a theme from a range of styles and backgrounds, customize the font, alignment, and
          padding.
        </p>
        <p>
          When you're ready, click export to save the image as a PNG, SVG or copy it to your
          clipboard.
        </p>
        <p>
          If you have any questions or feedback, write to us on <a
            href="https://x.com/ticketpingcom"
            target="_blank"
            rel="noopener noreferrer"
            class="underline text-ink-900">𝕏</a
          >
          or
          <a
            aria-label="mail"
            href="mailto:ravi@ticketping.com"
            target="_blank"
            rel="noopener noreferrer"
            class="underline font-medium text-ink-900"
          >
            email us</a
          >.
        </p>
      </div>

      <div class="my-1 -mx-4 h-px bg-black/20"></div>

      <div class="flex items-center justify-between mt-4">
        <a
          href="https://ticketping.com"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 hover:underline text-ink-900 transition"
        >
          <div class="flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
            <TicketpingLogoMark />
          </div>
          <span class="text-[13px] font-medium">Made by Ticketping</span>
        </a>

        <a
          href="https://x.com/ticketpingcom"
          target="_blank"
          rel="noopener noreferrer"
          class="text-ink-900 transition hover:text-ink-800"
          aria-label="Follow on X"
        >
          <XLogoMark size={14} color={"black"} />
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    animation: modal-in 0.2s ease-out;
  }

  @keyframes modal-in {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
