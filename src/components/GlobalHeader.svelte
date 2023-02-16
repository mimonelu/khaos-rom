<script>
import nostrStore from "$/store/nostr.js"
import RelayAntenna from "$/components/RelayAntenna.svelte"
import SVGIcon from "$/components/SVGIcon.svelte"
</script>

<div class="global-header">
  <h1 class="logo">
    <SVGIcon name="logo" />
  </h1>
  <div class="relay-antenna">
    <RelayAntenna />
  </div>
  <button
    class="button--red"
    on:click="{() => nostrStore.disconnectAll()}"
  >
    <SVGIcon name="disconnect" />
    <span>Disconnect</span>
  </button>
  <button
    class="button--plane"
    on:click="{() => nostrStore.retrieveGlobalNotes()}"
  >
    <SVGIcon name="connect" />
    <span>Connect</span>
  </button>
  <a
    class="button--outline"
    href="#setting"
  >
    <SVGIcon name="setting" />
  </a>
</div>

<style lang="scss">
.global-header {
  border-bottom: 1px solid rgba(var(--fg-color), 0.125);
  display: flex;
  grid-gap: 0.5rem;
  padding: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  padding: 0 0.75rem;
  :global(svg) {
    fill: rgb(var(--fg-color));
  }
}

.relay-antenna {
  display: flex;
  margin-left: auto;
}
</style>
