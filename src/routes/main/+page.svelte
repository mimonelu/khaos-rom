<script>
import { onMount, onDestroy } from "svelte"
import { toggle, connect, disconnect } from "$/composables/nostr.js"
import store from "$/store/store.js"
import EventTable from "$/components/EventTable.svelte"
import Icon from "$/components/Icon.svelte"

onMount(async () => {
  store.loadBlocks()
  await connect()
})

onDestroy(async () => {
  await disconnect()
})

let isConnected = false

async function toggleConnection () {
  isConnected = await toggle()
}
</script>

<div class="page">
  <div class="header">
    <h2>
      <a href="/">Easis</a>
    </h2>
    <figure>
      <Icon name="block" />
      <figcaption>{$store.blocks.size}</figcaption>
    </figure>
    <button
      class="button"
      on:click="{() => toggleConnection()}"
    >{isConnected ? "Disconnect" : "Connect"}</button>
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

  figure {
    display: flex;
    align-items: center;
    grid-gap: 0.5rem;
    margin-left: auto;

    :global(svg) {
      fill: rgb(var(--fg-color));
    }
  }
}
</style>
