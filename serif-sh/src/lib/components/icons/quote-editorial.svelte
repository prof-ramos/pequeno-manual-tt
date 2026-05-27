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
  height={(size * 29) / 40}
  viewBox="0 0 40 29"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
  {...rest}
>
  <path
    d="M15.0225 15.7243C12.3947 13.2525 8.31954 12.7186 5.69977 15.0925C6.79979 11.2247 9.74602 7.28017 12.6746 4.45565C15.0949 2.12093 11.4298 -1.59014 9.01429 0.739687C3.12182 6.41975 -3.58761 17.1562 2.24374 25.1187C4.89567 28.7384 10.2253 30.371 14.0833 27.6184C17.8996 24.8951 18.514 19.0093 15.0225 15.7243ZM37.6982 15.7243C35.0704 13.2525 30.9952 12.7186 28.3755 15.0925C29.4755 11.2247 32.4217 7.28017 35.3503 4.45565C37.7706 2.12093 34.1055 -1.59014 31.69 0.739687C25.7975 6.42138 19.0881 17.1578 24.921 25.1187C27.573 28.7384 32.9026 30.371 36.7607 27.6184C40.5753 24.8951 41.1897 19.0093 37.6982 15.7243Z"
    fill={color}
  />
</svg>
