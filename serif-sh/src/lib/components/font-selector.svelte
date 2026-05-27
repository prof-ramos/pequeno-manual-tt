<script lang="ts">
  import { FONTS, type FontFamily } from '$lib/themes';
  import { selectedFontId, selectedTheme } from '$lib/stores';
  import FontSelect from './font-select.svelte';

  const fonts = Object.entries(FONTS) as [FontFamily, typeof FONTS[FontFamily]][];

  const fontOptions = fonts.map(([fontId, font]) => ({
    value: fontId,
    label: font.name,
    fontFamily: font.css,
  }));

  // Get the effective font (either user selected or theme default)
  $: effectiveFont = $selectedFontId || $selectedTheme?.font || 'playfair';

  function handleChange(value: string) {
    selectedFontId.set(value as FontFamily);
  }
</script>

<FontSelect
  value={effectiveFont}
  options={fontOptions}
  label="Font"
  handleValueChange={handleChange}
/>
