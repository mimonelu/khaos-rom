<script>
import "the-new-css-reset"
import "$/scss/main.scss"

import { onMount, onDestroy } from "svelte"
import blockStore from "$/store/block.js"
import nostraStore from "$/store/nostra.js"
import EventTable from "$/components/EventTable.svelte"
import GlobalHeader from "$/components/GlobalHeader.svelte"
import Title from "$/components/Title.svelte"

onMount(async () => {
  blockStore.loadBlocks()
  // await nostraStore.connectAll()
})

onDestroy(async () => {
  await nostraStore.disconnectAll()
})
</script>

<div class="container">
  <GlobalHeader />
  <div class="body">
    <EventTable />
  </div>
  <Title />
  <slot />
</div>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.body {
  margin: auto;
  width: var(--max-width);
  max-width: var(--max-width);
}
</style>
