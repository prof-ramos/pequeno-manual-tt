<script lang="ts">
  let { class: className = '' }: { class?: string } = $props()
</script>

<svg
  class={className}
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 100 100"
  fill="none"
>
  <g clip-path="url(#a)">
    <path
      fill="#020202"
      d="M100 50A50 50 0 0 1 50 100A50 50 0 0 1 0 50A50 50 0 0 1 100 50z"
    />
    <path d="M43.693 35.645h20.626l-2.697 12.693h-17.929z" fill="#fff" />
    <path d="M43.004 25.014h13.292l-11.706 50.115h-13.364z" fill="#fff" />
    <path
      fill="#4CB782"
      fill-opacity=".9"
      d="M75 65.482A10.353 10.353 0 0 1 64.647 75.835A10.353 10.353 0 0 1 54.294 65.482A10.353 10.353 0 0 1 75 65.482z"
    />
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h100v100H0z" />
    </clipPath>
  </defs>
</svg>
