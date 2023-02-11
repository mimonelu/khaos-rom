<script>
import nostrStore from "$/store/nostr.js"
import SVGIcon from "$/components/SVGIcon.svelte"
</script>

<div class="container">
  <h1 class="logo">Khaos ROM</h1>
  <p>Khaos ROM is nostr global viewer.</p>
  <button
    class="button"
    on:click="{() => nostrStore.connectPostAll()}"
  >
    <SVGIcon name="connect" />
    <span>Connect to start</span>
  </button>
  <p>&copy; 2023 mimonelu</p>
</div>

<style lang="scss">
.container {
  background-image: linear-gradient(to bottom, transparent, rgba(var(--accent-color), 0.25));
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  grid-gap: 2rem;
  padding: 4rem 2rem;
}

.logo {
  font-size: 4rem;
  line-height: 1;
}
</style>
