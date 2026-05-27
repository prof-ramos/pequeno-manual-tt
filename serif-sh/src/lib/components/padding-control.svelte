<script lang="ts">
  import { padding } from '$lib/stores';
  import { PADDING_PRESETS } from '$lib/themes';
</script>

<div class="flex flex-col gap-1.5">
  <span class="text-[10px] text-ink-700 font-medium uppercase tracking-wide">Padding</span>
  <div class="flex items-center bg-parchment-50 gap-0.5 h-8 p-1 border-shadow hover:border-shadow-hover transition-shadow duration-150 rounded-lg">
    {#each PADDING_PRESETS as preset}
      <button
        class="py-1 px-1.5 text-[11px] font-medium border-none rounded-sm cursor-pointer transition-colors duration-150 ease-out text-ink-700 [&.active]:text-ink-900 hover:bg-parchment-200 [&.active]:bg-parchment-300"
        class:active={$padding === preset}
        on:click={() => padding.set(preset)}
      >
        {preset}
      </button>
    {/each}
  </div>
</div>
