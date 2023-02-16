<script>
import SVGIcon from "$/components/SVGIcon.svelte"
import nostrStore from "$/store/nostr.js"

let relays = []

$: {
  relays = []
  $nostrStore.relays.forEach(value => {
    relays.push(value)
  })
}
</script>

<div class="relay-list">
  <div class="total">
    <figure class="icon-text">
      <SVGIcon name="event" />
      <figcaption>{$nostrStore.totalNumberOfDisplayEvents.toLocaleString()} / {$nostrStore.totalNumberOfUniqueEvents.toLocaleString()} / {$nostrStore.totalNumberOfReceivedEvents.toLocaleString()}</figcaption>
    </figure>
    <figure class="icon-text">
      <SVGIcon name="traffic" />
      <figcaption>{($nostrStore.totalTraffic / 1024 / 1024).toFixed(2).toLocaleString()} MB</figcaption>
    </figure>
  </div>
{#each relays as relay}
  <div class="relay">
    <div class="status" data-status="{relay.status}" />
    <div class="right">
      <div class="url">{relay.url}</div>
      <div class="total">
        <figure class="icon-text">
          <SVGIcon name="event" />
          <div>Display</div>
          <figcaption>{relay.totalNumberOfDisplayEvents.toLocaleString()}</figcaption>
        </figure>
        <figure class="icon-text">
          <SVGIcon name="traffic" />
          <div>Traffic</div>
          <figcaption>{(relay.traffic / 1024 / 1024).toFixed(2).toLocaleString()} MB</figcaption>
        </figure>
      </div>
    </div>
  </div>
{/each}
</div>

<style lang="scss">
.relay-list {
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
}

.relay {
  display: flex;
  align-items: center;
  grid-gap: 0.5rem;
}

.status {
  border: 1px solid rgba(var(--fg-color), 0.25);
  border-radius: 1rem;
  min-width: 1rem;
  height: 1rem;
  &[data-status="connecting"] {
    background-color: rgb(var(--notice-color));
  }
  &[data-status="connected"] {
    background-color: rgb(var(--fg-color));
  }
}

.right {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  grid-gap: 0.25rem;
}

.url {
  border: 1px solid rgba(var(--access-color), 0.25);
  border-radius: 1px;
  color: rgb(var(--access-color));
  padding: 0.25rem 0.5rem;
  line-height: normal;
}

.total {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.25rem;
  font-size: 0.75rem;
  figcaption {
    flex-grow: 1;
  }
}

.icon-text {
  border: 1px solid rgba(var(--fg-color), 0.125);
  border-radius: 1px;
  padding: 0.5rem;
  figcaption {
    text-align: right;
  }
}
</style>
