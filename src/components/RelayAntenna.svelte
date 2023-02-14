<script>
import nostrStore from "$/store/nostr.js"

let relays = []

$: relays = [...$nostrStore.relays.values()]
</script>

<div class="container">
{#each relays as relay}
  <div data-status="{relay.status}"/>
{/each}
</div>

<style lang="scss">
.container {
  display: flex;
  grid-gap: 2px;
  & > div {
    border-radius: 0.25rem;
    width: 0.25rem;
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
