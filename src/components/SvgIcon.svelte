<script lang="ts">
  export let color: string = '#696969'
  export let name: string = ''
  export let width: number = 20
  export let height: number = 20

  import selectorSvg from '../assets/icons/selector.svg?raw'
  import checkSvg from '../assets/icons/check.svg?raw'
  import sunSvg from '../assets/icons/sun.svg?raw'
  import moonSvg from '../assets/icons/moon.svg?raw'

  const iconMap: Record<string, string> = {
    selector: selectorSvg,
    check: checkSvg,
    sun: sunSvg,
    moon: moonSvg,
  }

  $: svgContent = iconMap[name] || ''
</script>

{#if svgContent}
  <span 
    class="svg-icon inline-block align-middle"
    style="--icon-width: {width}px; --icon-height: {height}px; color: {color};"
  >
    {@html svgContent}
  </span>
{/if}

<style>
  .svg-icon :global(svg) {
    width: var(--icon-width);
    height: var(--icon-height);
    display: block;
  }
</style>
