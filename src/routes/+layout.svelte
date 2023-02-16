<script>
import "the-new-css-reset"
import "$/scss/main.scss"

import { onMount, onDestroy } from "svelte"
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import profileStore from "$/store/profile.js"
import EventTable from "$/components/EventTable.svelte"
import GlobalHeader from "$/components/GlobalHeader.svelte"
import HashRouter from "$/components/HashRouter.svelte"
import ProfileList from "$/components/ProfileList.svelte"
import ProfileOverlay from "$/components/ProfileOverlay.svelte"
import RelayList from "$/components/RelayList.svelte"
import SettingOverlay from "$/components/SettingOverlay.svelte"
import Title from "$/components/Title.svelte"

onMount(() => {
  blockStore.loadBlocks()
  profileStore.loadProfiles()
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
  <div class="bottom">
    <div class="panel relay-list">
      <h2 class="panel-header">Relays</h2>
      <div class="panel-inner">
        <RelayList />
      </div>
    </div>
    <div class="panel global-events">
      <h2 class="panel-header">Global notes</h2>
      <div class="panel-inner">
        <EventTable events="{$nostrStore.displayEvents}" />
        <Title />
      </div>
    </div>
    <div class="panel profile-list">
      <h2 class="panel-header">Users</h2>
      <div class="panel-inner">
        <ProfileList />
      </div>
    </div>
  </div>
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
  max-height: 100vh;
}

.bottom {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}

.panel {
  display: flex;
  flex-direction: column;
}

.panel-header {
  border-bottom: 1px solid rgba(var(--fg-color), 0.125);
  padding: 0.5rem 1rem;
  .panel:not(:last-child) & {
    border-right: 1px solid rgba(var(--fg-color), 0.125);
  }
}

.panel-inner {
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  @include scroll-bar;
}

.relay-list {
  min-width: 25%;
  max-width: 25%;
  & > .panel-inner {
    padding: 1rem;
  }
}

.global-events {
  min-width: 50%;
  max-width: 50%;
  & > .panel-inner {
    padding: 0 1rem;
  }
  /*
  max-width: $max-width;
  @media all and (max-width: $max-width) {
    min-width: 100vw;
    max-width: 100vw;
  }
  @media all and (min-width: $max-width) {
    min-width: $max-width;
  }
  */

  :global(.event-table:not(:empty)) {
    padding-top: 1rem;
  }
  :global(.title) {
    height: 100%;
  }
}

.profile-list {
  min-width: 25%;
  max-width: 25%;
  & > .panel-inner {
    padding: 1rem;
  }
}
</style>
