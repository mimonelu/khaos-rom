<script>
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import RelayAntenna from "$/components/RelayAntenna.svelte"
import SVGIcon from "$/components/SVGIcon.svelte"
</script>

<div class="container">
  <div class="inner">
    <div class="top">
      <h1 class="logo">Khaos ROM</h1>
      <div class="relay-antenna">
        <RelayAntenna />
      </div>
      <a
        class="button"
        href="/relays"
      >
        <SVGIcon name="relay" />
      </a>
      <button
        class="button"
        on:click="{() => nostrStore.disconnectPostAll()}"
      >
        <SVGIcon name="disconnect" />
      </button>
      <button
        class="button"
        on:click="{() => nostrStore.connectPostAll()}"
      >
        <SVGIcon name="connect" />
      </button>
    </div>
    <div class="bottom">
      <figure class="icon-text">
        <SVGIcon name="event" />
        <figcaption>{$nostrStore.totalNumberOfDisplayEvents.toLocaleString()} / {$nostrStore.totalNumberOfUniqueEvents.toLocaleString()} / {$nostrStore.totalNumberOfReceivedEvents.toLocaleString()}</figcaption>
      </figure>
      <figure class="icon-text">
        <SVGIcon name="traffic" />
        <figcaption>{($nostrStore.totalTraffic / 1024 / 1024).toFixed(2).toLocaleString()} MB</figcaption>
      </figure>
      <figure class="icon-text">
        <SVGIcon name="block" />
        <figcaption>{$blockStore.size}</figcaption>
      </figure>
    </div>
  </div>
</div>

<style lang="scss">
@import "../scss/variables";

.container {
  background-color: rgba(var(--bg-color), 0.5);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid rgba(var(--fg-color), 0.125);
  font-weight: bold;
  position: sticky;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
}

.inner {
  display: flex;
  flex-direction: column;
  grid-gap: 0.5rem;
  margin: auto;
  padding: 1rem;
  max-width: $max-width;
}

.top {
  display: flex;
  grid-gap: 0.5rem;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-gap: 1rem;
  font-size: 0.75rem;
}

.logo {
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(var(--accent-color), 0.125) inset;
  color: rgb(var(--accent-color));
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 0 0.75rem;
  text-shadow: 0 0 4px rgb(var(--accent-color));
  white-space: nowrap;
}

.relay-antenna {
  display: flex;
  margin-left: auto;
}
</style>
