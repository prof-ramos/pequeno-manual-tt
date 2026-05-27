<script lang="ts">
  import { alignment } from '$lib/stores';
  import type { Alignment } from '$lib/themes';
  import AlignLeft from '$lib/components/icons/align-left.svelte'
  import AlignCenter from '$lib/components/icons/align-center.svelte'
  import AlignRight from '$lib/components/icons/align-right.svelte'

  const alignments: { id: Alignment; label: string }[] = [
    { id: 'left', label: 'Align left' },
    { id: 'center', label: 'Align center' },
    { id: 'right', label: 'Align right' },
  ];
</script>

<div class="flex flex-col gap-1.5">
  <span class="text-[10px] text-ink-700 font-medium uppercase tracking-wide">Align</span>
  <div class="flex items-center bg-parchment-50 gap-0.5 h-8 p-1 border-shadow hover:border-shadow-hover transition-shadow duration-150 rounded-lg">
    {#each alignments as align}
      <button
        class="flex items-center justify-center py-1 px-1.5 border-none rounded-sm cursor-pointer transition-colors duration-150 ease-out text-ink-700 [&.active]:text-ink-900 hover:bg-parchment-200 [&.active]:bg-parchment-300 [&>svg]:w-4 [&>svg]:h-4"
        class:active={$alignment === align.id}
        on:click={() => alignment.set(align.id)}
        title={align.label}
        aria-label={align.label}
      >
        {#if align.id === 'left'}
          <AlignLeft />
        {:else if align.id === 'center'}
          <AlignCenter />
        {:else}
          <AlignRight />
        {/if}
      </button>
    {/each}
  </div>
</div>
