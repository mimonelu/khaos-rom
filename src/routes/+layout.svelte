<script>
import "the-new-css-reset"
import "$/scss/main.scss"

import { onMount, onDestroy } from "svelte"
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import EventTable from "$/components/EventTable.svelte"
import GlobalHeader from "$/components/GlobalHeader.svelte"
import ProfileOverlay from "$/components/ProfileOverlay.svelte"
import SettingOverlay from "$/components/SettingOverlay.svelte"
import Title from "$/components/Title.svelte"

onMount(() => {
  blockStore.loadBlocks()
  nostrStore.setupRelay()
  routeByHash()
})

onDestroy(() => {
  nostrStore.disconnectPostAll()
})

let hash = ""
let params = {}

const mapToObject = map => [...map].reduce((l,[k,v]) => Object.assign(l, {[k]:v}), {})

const routeByHash = () => {
  const items = location.hash.match(/^#(\w+)\??(.*)$/) ?? []
  hash = items[1] ?? ""
  params = mapToObject(new Map(items[2] ? items[2].split("&").map(block => block.split("=")) : null))
}
</script>

<svelte:window on:hashchange="{routeByHash}" />

<div class="container">
  <GlobalHeader />
  <!-- TODO: Can you remove this div tag?-->
  <div class="event-table">
    <EventTable />
  </div>
  <Title />
  <slot />
  {#if hash === "profile"}
  <ProfileOverlay relay="{params.relay}" pubkey="{params.pubkey}" />
  {/if}
  {#if hash === "setting"}
  <SettingOverlay />
  {/if}
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
    max-width: 100vw;
  }
  @media all and (min-width: $max-width) {
    min-width: $max-width;
  }
}
</style>
