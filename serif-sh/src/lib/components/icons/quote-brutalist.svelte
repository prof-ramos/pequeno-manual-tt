<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  interface Props extends SVGAttributes<SVGElement> {
    color?: string;
    size?: number;
  }

  let { color = 'currentColor', size = 40, class: className, ...rest }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 40 40"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
  {...rest}
>
  <path
    d="M9.11227 7.04386L2.58066 20.1084V33.1729H15.6452V20.1084H9.11227L15.6452 7.04386H9.11227ZM37.4194 6.82709H30.8878L24.3549 19.8916V32.9561H37.4194V19.8916H30.8878L37.4194 6.82709Z"
    fill={color}
  />
</svg>
