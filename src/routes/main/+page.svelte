<script>
import { onMount, onDestroy } from "svelte"
import blockStore from "$/store/block.js"
import nostraStore from "$/store/nostra.js"
import EventTable from "$/components/EventTable.svelte"
import Icon from "$/components/Icon.svelte"

onMount(async () => {
  blockStore.loadBlocks()
  await nostraStore.connectAll()
})

onDestroy(async () => {
  await nostraStore.disconnectAll()
})

const toggleConnection = async () => {
  await nostraStore.toggle()
}
</script>

<div class="page">
  <div class="header">
    <h2>
      <a href="/">Easis</a>
    </h2>
    <div>Unique events: {$nostraStore.events.size}</div>
    <div>Events: {$nostraStore.receivedNumberOfEvent}</div>
    <figure>
      <Icon name="block" />
      <figcaption>{$blockStore.size}</figcaption>
    </figure>
    <button
      class="button"
      on:click="{() => toggleConnection()}"
    >{$nostraStore.status}</button>
  </div>
  <EventTable />
</div>

<style lang="scss">
.page {
  padding: 0 1rem 1rem;
}

.header {
  background-color: rgb(var(--bg-color));
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1rem 0;
  position: sticky;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;

  h2 + * {
    margin-left: auto;
  }

  figure {
    display: flex;
    align-items: center;
    grid-gap: 0.5rem;

    :global(svg) {
      fill: rgb(var(--fg-color));
    }
  }
}
</style>
