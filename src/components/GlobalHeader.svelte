<script>
import blockStore from "$/store/block.js"
import nostraStore from "$/store/nostra.js"
import SVGIcon from "$/components/SVGIcon.svelte"
</script>

<div class="container">
  <div class="inner">
    <div class="top">
      <h1 class="logo">Khaos ROM</h1>
      <div class="relay-statuses">
      {#each $nostraStore.relayStatuses as status}
        <div data-status="{status}"/>
      {/each}
      </div>
      <button
        class="button"
        on:click="{() => nostraStore.disconnectAll()}"
      >
        <SVGIcon name="disconnect" />
      </button>
      <button
        class="button"
        on:click="{() => nostraStore.connectAll()}"
      >
        <SVGIcon name="connect" />
      </button>
    </div>
    <div class="bottom">
      <figure>
        <SVGIcon name="event" />
        <figcaption>{$nostraStore.displayEvents.length} / {$nostraStore.events.size} / {$nostraStore.totalNumberOfReceivedEvents}</figcaption>
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
  grid-gap: 1rem;
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
  justify-content: space-between;
  grid-gap: 1rem;

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
  padding: 0.25rem 1rem;
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
