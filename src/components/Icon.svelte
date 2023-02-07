<script>
// SEE: https://pictogrammers.com/library/mdi/
import block from "$/svg/cancel.svg?raw"

export let name = ""

const icons = {
  block,
}
</script>

{#if icons[name]}{@html icons[name]}{/if}

<style>
:global(svg) {
  width: 1em;
  height: 1em;
}
</style>
