<script lang="ts">
  import { Select } from 'bits-ui'
  import ChevronDown from '$lib/components/icons/chevron-down.svelte'

  type FontOption = {
    value: string
    label: string
    fontFamily: string
    disabled?: boolean
  }

  type Props = {
    value: string
    label?: string
    options: FontOption[]
    handleValueChange?: (value: string) => void
  }

  let { value, label = '', options, handleValueChange }: Props = $props()

  let open = $state(false)

  const selectedOption = $derived(options.find((item) => item.value === value))
  const selectedFontFamily = $derived(selectedOption?.fontFamily || '')

  function onValueChange(val: string | string[]) {
    if (typeof val === 'string' && handleValueChange) {
      handleValueChange(val)
    }
  }
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <span class="text-[10px] text-ink-700 font-medium uppercase tracking-wide">{label}</span>
  {/if}
  <Select.Root type="single" value={value as never} {onValueChange} bind:open>
    <Select.Trigger
      class="select-trigger border-shadow hover:border-shadow-hover transition-shadow duration-150"
      aria-label="Select font"
    >
      <span class="text-base font-medium w-6 text-center" style="font-family: {selectedFontFamily}"
        >Aa</span
      >
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
          {#each options as option (option.value)}
            <Select.Item
              class="select-option {option.value === value ? 'select-option-active' : ''}"
              value={option.value}
              label={option.label}
              disabled={option.disabled ?? false}
            >
              <div class="option-content">
                <span class="option-label">{option.label}</span>
              </div>
            </Select.Item>
          {/each}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>
