<script lang="ts">
  import { Select } from 'bits-ui'
  import VercelLogoMark from './icons/vercel-logo-mark.svelte'
  import PeerlistLogoMark from './icons/peerlist-logo-mark.svelte'
  import XLogoMark from './icons/x-logo-mark.svelte'
  import ChevronDown from '$lib/components/icons/chevron-down.svelte'

  type ThemeOption = {
    value: string
    label: string
    preview: string
    brand?: string
    disabled?: boolean
  }

  type Props = {
    value: string
    label?: string
    options: ThemeOption[]
    handleValueChange?: (value: string) => void
  }

  let { value, label = '', options, handleValueChange }: Props = $props()

  let open = $state(false)

  const selectedOption = $derived(options.find((item) => item.value === value))
  const brandOptions = $derived(options.filter((o) => o.brand))
  const themeOptions = $derived(options.filter((o) => !o.brand))

  function onValueChange(val: string | string[]) {
    if (typeof val === 'string' && handleValueChange) {
      handleValueChange(val)
    }
  }
</script>

{#snippet themeIcon(option: ThemeOption)}
  {#if option.brand === 'vercel' || option.value === 'vercel'}
    <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
      <VercelLogoMark size={16} />
    </span>
  {:else if option.brand === 'peerlist' || option.value === 'peerlist'}
    <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
      <PeerlistLogoMark size={16} />
    </span>
  {:else if option.brand === 'x' || option.value === 'x'}
    <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
      <XLogoMark size={12} />
    </span>
  {:else}
    <span
      class="flex items-center justify-center w-4 h-4 rounded-full border-shadow"
      style="background: {option.preview};"
    ></span>
  {/if}
{/snippet}

<div class="flex flex-col gap-1.5">
  {#if label}
    <span class="text-[10px] text-ink-700 font-medium uppercase tracking-wide">{label}</span>
  {/if}
  <Select.Root type="single" value={value as never} {onValueChange} bind:open>
    <Select.Trigger
      class="select-trigger border-shadow hover:border-shadow-hover transition-shadow duration-150"
      aria-label="Select theme"
    >
      {#if selectedOption}
        {@render themeIcon(selectedOption)}
      {/if}
      <ChevronDown
        class="size-4.5 text-ink-500 transition-transform duration-150 {open ? 'rotate-180' : ''}"
      />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        class="select-dropdown select-dropdown--start"
        sideOffset={4}
        side="top"
        align="start"
      >
        <Select.Viewport class="options-viewport">
          {#if brandOptions.length > 0}
            <Select.Group>
              <Select.GroupHeading class="select-group-heading">Brand</Select.GroupHeading>
              {#each brandOptions as option (option.value)}
                <Select.Item
                  class="select-option {option.value === value ? 'select-option-active' : ''}"
                  value={option.value}
                  label={option.label}
                  disabled={option.disabled ?? false}
                >
                  <div class="option-content">
                    {@render themeIcon(option)}
                    <span class="option-label">{option.label}</span>
                  </div>
                </Select.Item>
              {/each}
            </Select.Group>
          {/if}

          {#if brandOptions.length > 0 && themeOptions.length > 0}
            <div class="my-1 -mx-1.5 h-px bg-black/10"></div>
          {/if}

          {#if themeOptions.length > 0}
            <Select.Group>
              <Select.GroupHeading class="select-group-heading">Themes</Select.GroupHeading>
              {#each themeOptions as option (option.value)}
                <Select.Item
                  class="select-option {option.value === value ? 'select-option-active' : ''}"
                  value={option.value}
                  label={option.label}
                  disabled={option.disabled ?? false}
                >
                  <div class="option-content">
                    {@render themeIcon(option)}
                    <span class="option-label">{option.label}</span>
                  </div>
                </Select.Item>
              {/each}
            </Select.Group>
          {/if}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>
