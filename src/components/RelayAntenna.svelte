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
  grid-gap: 4px;
  & > div {
    border: 1px solid rgba(var(--fg-color), 0.25);
    border-radius: 0.375rem;
    width: 0.375rem;
  }
  [data-status="connecting"] {
    background-color: rgb(var(--notice-color));
  }
  [data-status="connected"] {
    background-color: rgb(var(--fg-color));
  }
}
</style>
