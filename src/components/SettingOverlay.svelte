<script>
import nostrStore from "$/store/nostr.js"

let relays = []

$: relays = [...$nostrStore.relays.values()]
</script>

<div class="container">
  <div class="inner">
    <a
      class="button--outline close-button"
      href="#home"
    >Close</a>
    <div class="body">
      <div class="relays">
      {#each relays as relay}
        <div class="url">{relay.status}</div>
        <div class="url">{relay.url}</div>
        <div class="total">{relay.totalNumberOfDisplayEvents.toLocaleString()} notes</div>
        <div class="traffic">{relay.traffic.toLocaleString()} byte</div>
      {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
@import "../scss/variables";

.container {
  background-color: rgba(var(--bg-color), 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  user-select: text;
}

.inner {
  background-color: rgb(var(--bg-sub-color));
  border: 1px solid rgba(var(--fg-color), 0.125);
  border-radius: 1px;
  margin-top: 2rem;
  overflow-y: auto;
  position: relative;
  max-width: $max-width;
  min-height: calc(100vh - 4rem);
  max-height: calc(100vh - 4rem);
  @media all and (max-width: $max-width) {
    min-width: calc(100vw - 4rem);
    max-width: calc(100vw - 4rem);
  }
  @media all and (min-width: $max-width) {
    min-width: $max-width;
  }
  @include scroll-bar();
}

.close-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 1;
}

.body {
  border-radius: 1px;
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
  padding: 5rem 2rem 2rem;
  position: relative;
}

.relays {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
}

.url,
.total,
.traffic {
  border-bottom: 1px solid rgba(var(--fg-color), 0.125);
  padding: 0.5rem;
}

.url {
  word-break: break-all;
}

.total {
  text-align: right;
  white-space: nowrap;
}

.traffic {
  text-align: right;
  white-space: nowrap;
}
</style>
