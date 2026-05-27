<script lang="ts">
  import { THEMES } from '$lib/themes'
  import { selectedThemeId } from '$lib/stores'
  import ThemeSelect from './theme-select.svelte'

  const themes = Object.values(THEMES)

  function getThemePreviewBg(theme: (typeof THEMES)[string]): string {
    if (theme?.backgroundImage) {
      return theme.backgroundImage
    }
    return theme?.background || '#fdfcf9'
  }

  //Group the brand themes
  const groupedOptions: any[] = []
  const brandSeen = new Set()

  themes.forEach((theme) => {
    if (theme.brand) {
      if (!brandSeen.has(theme.brand)) {
        brandSeen.add(theme.brand)
        groupedOptions.push({
          value: theme.brand,
          label: theme.brand.charAt(0).toUpperCase() + theme.brand.slice(1),
          preview: getThemePreviewBg(theme),
          brand: theme.brand
        })
      }
    } else {
      groupedOptions.push({
        value: theme.id,
        label: theme.name,
        preview: getThemePreviewBg(theme)
      })
    }
  })

  $: currentValue = THEMES[$selectedThemeId]?.brand || $selectedThemeId

  function handleChange(value: string) {
    if (value === 'vercel') {
      selectedThemeId.set('vercel-dark')
    } else if (value === 'peerlist') {
      selectedThemeId.set('peerlist-dark')
    } else if (value === 'x') {
      selectedThemeId.set('x-dark')
    } else {
      selectedThemeId.set(value)
    }
  }
</script>

<ThemeSelect
  value={currentValue}
  options={groupedOptions}
  label="Theme"
  handleValueChange={handleChange}
/>
