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
  height={(size * 27) / 34}
  viewBox="0 0 34 27"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
  {...rest}
>
  <path
    d="M10.1084 0L0 13.4787V26.9574H13.4774V13.4787H6.73806L13.9587 3.85161L10.1084 0ZM33.6594 3.85161L29.809 0L19.7006 13.4787V26.9574H33.1781V13.4787H26.4387L33.6594 3.85161Z"
    fill={color}
  />
</svg>
