<script>
import "the-new-css-reset"
import "$/scss/main.scss"

import { onMount, onDestroy } from "svelte"
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import EventTable from "$/components/EventTable.svelte"
import GlobalHeader from "$/components/GlobalHeader.svelte"
import HashRouter from "$/components/HashRouter.svelte"
import ProfileOverlay from "$/components/ProfileOverlay.svelte"
import SettingOverlay from "$/components/SettingOverlay.svelte"
import Title from "$/components/Title.svelte"

onMount(() => {
  blockStore.loadBlocks()
  nostrStore.setupRelay()
})

onDestroy(() => {
  nostrStore.disconnectAll()
})

let router = {
  hash: "",
  params: {},
}

const onChangeHash = event => {
  router = event.detail
}
</script>

<HashRouter on:change="{onChangeHash}" />

<div class="container">
  <GlobalHeader />
  <!-- TODO: Can you remove this div tag?-->
  <div class="event-table">
    <EventTable events="{$nostrStore.displayEvents}" />
  </div>
  <Title />
  <slot />
  {#if router.hash === "profile"}
  <ProfileOverlay
    relay="{router.params.relay}"
    pubkey="{router.params.pubkey}"
  />
  {/if}
  {#if router.hash === "setting"}
  <SettingOverlay />
  {/if}
</div>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.event-table {
  margin: auto;
  padding: 1rem 1rem 0;
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
