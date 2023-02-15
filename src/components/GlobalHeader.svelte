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
      <a
        class="button--outline"
        href="#setting"
      >
        <SVGIcon name="setting" />
      </a>
      <div class="relay-antenna">
        <RelayAntenna />
      </div>
      <button
        class="button--red"
        on:click="{() => nostrStore.disconnectAll()}"
      >
        <SVGIcon name="disconnect" />
      </button>
      <button
        class="button--plane"
        on:click="{() => nostrStore.retrieveGlobalNotes()}"
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
  .button--outline {
    padding: 0.75rem;
  }
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-gap: 1rem;
  font-size: 0.75rem;
}

.logo {
  color: rgb(var(--accent-color));
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 0 0.75rem;
  white-space: nowrap;
}

.relay-antenna {
  display: flex;
  margin-left: auto;
}
</style>
