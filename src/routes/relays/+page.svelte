<script>
import { onMount } from "svelte"
import { disableScrollHandling } from "$app/navigation"
import nostrStore from "$/store/nostr.js"

onMount(() => {
  disableScrollHandling()
})
</script>

<div class="container">
  <div class="inner">
    relay
  </div>
</div>

<style lang="scss">
.container {
  background-color: rgba(var(--bg-color), 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: scroll;
  padding: 2rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  user-select: text;
}

.inner {
  display: grid;
  grid-template-columns: 9rem 1fr;
  grid-template-areas:
    "t f"
    "t w"
    "t p"
    "t l"
    "a a";
  grid-gap: 1rem;
  padding: 8rem 1rem 1rem;
  position: relative;
  // min-width: var(--max-width);
  max-width: var(--max-width);
}
</style>
