<script>
import "the-new-css-reset"
import "$/scss/main.scss"

import { onMount, onDestroy } from "svelte"
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import EventTable from "$/components/EventTable.svelte"
import GlobalHeader from "$/components/GlobalHeader.svelte"
import Title from "$/components/Title.svelte"

onMount(() => {
  blockStore.loadBlocks()
  nostrStore.setupRelay()
})

onDestroy(() => {
  nostrStore.disconnectPostAll()
})
</script>

<div class="container">
  <GlobalHeader />
  <!-- TODO: この div を取り除きたい -->
  <div class="event-table">
    <EventTable />
  </div>
  <Title />
  <slot />
</div>

<style lang="scss">
@import "../scss/variables";

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.event-table {
  margin: auto;
  padding-top: 1rem;
  max-width: $max-width;
  @media all and (max-width: $max-width) {
    min-width: 100vw;
  }
  @media all and (min-width: $max-width) {
    min-width: $max-width;
  }
}
</style>
