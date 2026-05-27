<script lang="ts">
  import type { Writable } from 'svelte/store'

  export let store: Writable<boolean>
  export let label: string
</script>

<div class="flex flex-col gap-1.5">
  <span class="text-[10px] text-ink-700 font-medium uppercase tracking-wide whitespace-nowrap"
    >{label}</span
  >
  <div class="flex items-center h-8">
    <button
      class="group relative w-10 h-[22px] p-0.5 rounded-full cursor-pointer transition-colors duration-200 border-shadow hover:border-shadow-hover focus-visible:outline-none {$store
        ? 'bg-parchment-300'
        : 'bg-parchment-100 hover:bg-parchment-200'}"
      on:click={() => store.update((v) => !v)}
      role="switch"
      aria-checked={$store}
      aria-label="Toggle {label}"
    >
      <span
        class="block size-[18px] rounded-full bg-parchment-50 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_1px_4px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90 {$store
          ? 'translate-x-[18px]'
          : 'translate-x-0'}"
      ></span>
    </button>
  </div>
</div>
