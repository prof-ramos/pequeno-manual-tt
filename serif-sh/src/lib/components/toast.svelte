<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import Checkmark from '$lib/components/icons/checkmark.svelte'
  import Alert from '$lib/components/icons/alert.svelte'
  import Spinner from '$lib/components/icons/spinner.svelte'

  let {
    message = '',
    type = 'info',
    duration = 3000,
    onClose = () => {}
  }: {
    message?: string
    type?: 'success' | 'error' | 'info'
    duration?: number
    onClose?: () => void
  } = $props()

  // Reset dismiss timer when copy or duration changes (onMount alone left a stale timer).
  $effect(() => {
    // track dependencies explicitly
    const m = message;
    const d = duration;
    
    if (m) {
      const id = setTimeout(() => {
        onClose();
      }, d);
      return () => clearTimeout(id);
    }
  })
</script>

<div
  class="fixed bottom-4 right-4 z-50"
  in:fly={{ y: 20, duration: 200 }}
  out:fade={{ duration: 150 }}
>
  <div
    class="px-4 py-3 rounded-xl border-shadow flex items-center gap-2
      {type === 'success' ? 'bg-green-500 text-green-100' : ''}
      {type === 'error' ? 'bg-red-500 text-red-100' : ''}
      {type === 'info' ? 'bg-parchment-400 text-ink-900' : ''}"
  >
    {#if type === 'success'}
      <Checkmark class="size-5" />
    {:else if type === 'error'}
      <Alert class="size-5" />
    {:else}
      <Spinner class="size-5 animate-spin text-ink-900" />
    {/if}
    <span class="text-sm font-medium">{message}</span>
  </div>
</div>
