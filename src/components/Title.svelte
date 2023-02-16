<script>
import nostrStore from "$/store/nostr.js"
import SVGIcon from "$/components/SVGIcon.svelte"
</script>

<div class="title">
  <h1 class="logo">
    <SVGIcon name="logo" />
  </h1>
  <p>Khaos ROM is Nostr global viewer.</p>
  <button
    class="button--plane"
    on:click="{() => nostrStore.retrieveGlobalNotes()}"
  >
    <SVGIcon name="connect" />
    <span>Connect to start</span>
  </button>
  <p>&copy; 2023 mimonelu</p>
</div>

<style lang="scss">
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-gap: 2rem;
  // padding: 8rem 2rem;
}

.logo {
  :global(svg) {
    fill: rgb(var(--fg-color));
    font-size: 4rem;
    line-height: 1;
  }
}
</style>
