<script>
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import SVGIcon from "$/components/SVGIcon.svelte"
</script>

<div class="container">
{#each $nostrStore.displayEvents as event}
  <div
    class="event"
    data-reply="{event.replyStatus === 1 || event.replyStatus === 2}"
  >
    <a
      class="thumbnail"
      href="{`/post?relay=${event.relay}&pubkey=${event.pubkey}`}"
      style="{`border-color: #${event.colorHex};`}"
    >Thumbnail</a>
    <div class="top">
    {#if event.replyStatus === 1}
      <div class="reply">
        <SVGIcon name="reply" />
      </div>
    {:else if event.replyStatus === 2}
      <div class="reply">
        <SVGIcon name="block" />
      </div>
    {/if}
      <div class="content">{event.content}</div>
      <button class="button menu-button">
        <SVGIcon name="cursorDown" />
      </button>
      <div class="menu">
        <a
          class="button"
          href="{`/post?relay=${event.relay}&pubkey=${event.pubkey}`}"
        >Post</a>
        <a
          class="button"
          href="{`/profile?relay=${event.relay}&pubkey=${event.pubkey}`}"
        >Profile</a>
        <button
          class="button"
          on:click="{() => blockStore.addBlock(event)}"
        >
          <SVGIcon name="block" />
        </button>
      </div>
    </div>
    <div class="bottom">
      <div
        class="pubkey"
        style="{`background-color: rgba(${event.colorRgb}, 0.25);`}"
      >{event.colorHex}</div>
      <div class="received_at">{event.received_at_string}</div>
      <div class="created_at">{event.created_at_string}</div>
      <div class="relay">{event.relay}</div>
    </div>
  </div>
{/each}
</div>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
  line-height: 1;
  padding: 0 1rem;
}

.event {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "i t"
    "i b";
  grid-gap: 0.375rem 0.5rem;
  &[data-reply="true"] {
    padding-left: 1.125rem;
  }
}

.thumbnail {
  border: 1px solid rgba(var(--fg-color), 0.125);
  border-radius: 1px;
  font-size: 0;
  grid-area: i;
  overflow: hidden;
  min-width: 2.625rem;
  height: 2.625rem;
  text-indent: 100%;
}

.top {
  display: flex;
  align-items: center;
  grid-area: t;
  grid-gap: 0.25rem;
  overflow: hidden;
}

.bottom {
  display: flex;
  grid-area: b;
  grid-gap: 0.5rem;
  font-size: 0.75rem;
  overflow: hidden;
}

.pubkey {
  color: rgba(var(--fg-color), 0.5);
  border-radius: 1px;
  padding: 0 0.25rem;
  white-space: nowrap;
}

.received_at {
  color: rgba(var(--fg-color), 0.5);
  display: none;
  white-space: nowrap;
}

.created_at {
  color: rgba(var(--fg-color), 0.5);
  white-space: nowrap;
}

.reply {
  display: flex;
  align-items: center;
  min-width: 1rem;
  :global(svg) {
    fill: rgba(var(--fg-color), 0.25);
  }
}

.content {
  line-height: 1.375rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.relay {
  color: rgba(var(--fg-color), 0.375);
  margin-left: auto;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-button {
  background-color: transparent;
  font-size: 0.5rem;
  margin-left: auto;
  padding: 0 0.5rem;
  height: 100%;
  :global(svg) {
    fill: rgba(var(--access-color), 0.5);
  }
}

.menu {
  display: none;
  grid-gap: 0.25rem;
  font-size: 0.5rem;
}
</style>
