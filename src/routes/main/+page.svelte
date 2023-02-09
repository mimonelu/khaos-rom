<script>
import { onMount, onDestroy } from "svelte"
import blockStore from "$/store/block.js"
import nostraStore from "$/store/nostra.js"
import EventTable from "$/components/EventTable.svelte"
import SVGIcon from "$/components/SVGIcon.svelte"

onMount(async () => {
  blockStore.loadBlocks()
  await nostraStore.connectAll()
})

onDestroy(async () => {
  await nostraStore.disconnectAll()
})
</script>

<div class="page">
  <div class="header">
    <div class="header__inner">
      <div class="header__top">
        <h1>
          <a href="/">Khaos ROM</a>
        </h1>
        <div class="relay-statuses">
        {#each $nostraStore.relayStatuses as status}
          <div data-status="{status}"/>
        {/each}
        </div>
        <button
          class="button"
          on:click="{() => nostraStore.connectAll()}"
        >
          <SVGIcon name="connect" />
        </button>
        <button
          class="button"
          on:click="{() => nostraStore.disconnectAll()}"
        >
          <SVGIcon name="disconnect" />
        </button>
      </div>
      <div class="header__bottom">
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
  <div class="body">
    <EventTable />
  </div>
</div>

<style lang="scss">
.header {
  background-color: rgba(var(--bg-color), 0.5);
  backdrop-filter: blur(4px);
  font-weight: bold;
  position: sticky;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;

  &__inner {
    display: flex;
    flex-direction: column;
    grid-gap: 1rem;
    margin: auto;
    padding: 1rem;
    max-width: 768px;
  }
  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    grid-gap: 1rem;

    h1 {
      border: 0.125rem solid rgb(var(--accent-color));
      color: rgb(var(--accent-color));
      font-weight: bold;
      padding: 0.25rem 1rem;
      white-space: nowrap;
    }
    h1 + * {
      margin-left: auto;
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
  }
  &__bottom {
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
}

.body {
  padding: 0 1rem 1rem;
  margin: auto;
  max-width: 768px;
}
</style>
