<script lang="ts">
  export let color: string = '#696969'
  export let name: string = ''
  export let width: number = 20
  export let height: number = 20

  $: symbolId = `#icon-${name}`
</script>

{#if name}
  <svg
    aria-hidden="true"
    style="color: {color};"
    fill={color}
    width={width + 'px'}
    height={height + 'px'}>
    <use xlink:href={symbolId} />
  </svg>
{/if}
