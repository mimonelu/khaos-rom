<script>
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import SVGIcon from "$/components/SVGIcon.svelte"
</script>

<div class="container">
  <div class="inner">
    <div class="top">
      <h1 class="logo">O</h1>
      <div class="relay-statuses">
      {#each $nostrStore.relays as relay}
        <div data-status="{relay.status}"/>
      {/each}
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
      <figure>
        <SVGIcon name="event" />
        <figcaption>{$nostrStore.totalNumberOfDisplayEvents.toLocaleString()} / {$nostrStore.totalNumberOfUniqueEvents.toLocaleString()} / {$nostrStore.totalNumberOfReceivedEvents.toLocaleString()}</figcaption>
      </figure>
      <figure>
        <SVGIcon name="block" />
        <figcaption>{($nostrStore.totalTraffic / 1024 / 1024).toFixed(2).toLocaleString()} MB</figcaption>
      </figure>
      <figure>
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
  max-width: var(--max-width);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 1rem;

  h1 + * {
    margin-left: auto;
  }
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-gap: 1rem;
  font-size: 0.75rem;

  figure {
    display: flex;
    align-items: center;
    grid-gap: 0.5rem;

    :global(svg) {
      fill: rgb(var(--fg-color));
    }
  }
}

.logo {
  box-shadow: 0 0 0 0.125rem rgb(var(--accent-color)) inset;
  color: rgb(var(--accent-color));
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  white-space: nowrap;
}

.relay-statuses {
  display: flex;
  grid-gap: 0.25rem;
  & > * {
    width: 0.25rem;
    height: 1.875rem;
  }
  [data-status="disconnected"] {
    background-color: rgba(var(--fg-color), 0.25);
  }
  [data-status="connecting"] {
    background-color: rgb(var(--fg-color));
  }
  [data-status="connected"] {
    background-color: rgb(var(--accent-color));
  }
}
</style>
