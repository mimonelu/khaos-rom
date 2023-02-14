<script>
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import SVGIcon from "$/components/SVGIcon.svelte"

const openPost = event => {
  event.folded = !event.folded
  $nostrStore.displayEvents = $nostrStore.displayEvents
}

const blockUser = pubkey => {
  blockStore.addBlock(pubkey)
  nostrStore.updateDisplayEvents()
}
</script>

<div class="container">
{#each $nostrStore.displayEvents as event}
  <div
    class="event"
    data-folded="{event.folded}"
  >
    <div class="left">
    {#if event.replyStatus === 1}
      <div class="reply">
        <SVGIcon name="reply" />
      </div>
    {:else if event.replyStatus === 2}
      <div class="reply-noroot">
        <SVGIcon name="question" />
      </div>
    {/if}
      <a
        class="thumbnail"
        href="{`#profile?relay=${event.relay}&pubkey=${event.pubkey}`}"
        style="{`border-color: #${event.colorHex};`}"
      />
    </div>
    <div
      class="right"
      on:click="{() => openPost(event)}"
    >
      <div class="top">
        <div class="content-wrapper">
          <div class="content">{event.content}</div>
          <div class="content-html">
          {#each event.classifiedContent as content}
            {#if content.type === "text"}
            <span class="content-text">{content.data}</span>
            {:else if content.type === "url" || content.type === "image"}
            <a
              class="text-link"
              href="{content.data}"
              target="_blank"
              rel="noreferrer"
            >{content.data}</a>
            {:else if content.type === "tag"}
            <a
              class="text-link"
              href="https://nostrview.com/search?q={encodeURIComponent(content.data)}"
              target="_blank"
              rel="noreferrer"
            >{content.data}</a>
            {:else if content.type === "npub"}
            <a
              class="text-link"
              href="https://snort.social/p/{content.data}"
              target="_blank"
              rel="noreferrer"
            >{content.data}</a>
            {:else if content.type === "note"}
            <a
              class="text-link"
              href="https://snort.social/e/{content.data}"
              target="_blank"
              rel="noreferrer"
            >{content.data}</a>
            {/if}
          {/each}
          </div>
        </div>
        <div class="menu">
          <a
            class="button--outline"
            href="{`nostr:${event.noteId}`}"
            target="_blank"
            rel="noreferrer"
          >
            <SVGIcon name="open" />
            <span>App</span>
          </a>
          <a
            class="button--outline"
            href="{`https://iris.to/post/${event.id}`}"
            target="_blank"
            rel="noreferrer"
          >
            <SVGIcon name="open" />
            <span>iris</span>
          </a>
          <a
            class="button--outline"
            href="{`https://snort.social/e/${event.noteId}`}"
            target="_blank"
            rel="noreferrer"
          >
            <SVGIcon name="open" />
            <span>snort</span>
          </a>
          <button
            class="button--red"
            on:click="{() => blockUser(event.pubkey)}"
          >
            <SVGIcon name="block" />
            <span>Block</span>
          </button>
        </div>
        <div class="image-link">
        {#each event.classifiedContent as content}
          {#if content.type === "image"}
          <a
            href="{content.data}"
            target="_blank"
            rel="noreferrer"
            style="{`background-image: url(${content.data});`}"
          />
          {/if}
        {/each}
        </div>
        <code class="raw">{event.eventString}</code>
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
  </div>
{/each}
</div>

<style lang="scss">
@import "../scss/variables";

.container {
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
  line-height: 1;
  padding: 0 1rem;
}

.event {
  display: flex;
  grid-gap: 0.5rem;
}

.left {
  display: flex;
  align-items: flex-start;
  grid-gap: 0.5rem;
}

.reply {
  display: flex;
  align-items: center;
  min-width: 1rem;
  :global(svg) {
    fill: rgba(var(--fg-color), 0.5);
  }
}

.reply-noroot {
  background-color: rgb(var(--bg-color));
  border-radius: 1px;
  display: flex;
  padding: 0.25rem;
  pointer-events: none;
  position: absolute;
  :global(svg) {
    fill: rgba(var(--fg-color), 0.5);
  }
}

.thumbnail {
  border: 1px solid rgba(var(--fg-color), 0.125);
  border-radius: 1px;
  overflow: hidden;
  min-width: 2.75rem;
  height: 2.75rem;
}

.right {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  grid-gap: 0.5rem;
  overflow: hidden;
}

.top {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  grid-gap: 0.5rem;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  align-items: center;
  grid-gap: 0.25rem;
  overflow: hidden;
}

.content {
  [data-folded="true"] & {
    line-height: 1.375rem;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
  [data-folded="false"] & {
    display: none;
  }
}

.content-html {
  [data-folded="true"] & {
    display: none;
  }
  [data-folded="false"] & {
    line-height: 1.375rem;
    white-space: pre-line;
  }
}

.content-text,
.text-link {
  word-break: break-all;
}

.menu {
  display: flex;
  grid-gap: 0.5rem;
  [data-folded="true"] & {
    display: none;
  }
  & > .button--red,
  & > .button--outline {
    font-size: 0.75rem;
    padding: 0.375rem 1rem;
  }
  & > .button--red {
    margin-left: auto;
  }
}

.image-link {
  aspect-ratio: 1.91 / 1;
  display: grid;
  grid-gap: 0.5rem;
  [data-folded="true"] & {
    display: none;
  }
  & > a {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    border: 1px solid rgba(var(--access-color), 0.25);
    border-radius: 1px;
    display: block;
  }
  &:empty {
    display: contents;
  }
  &:has(:nth-child(2)) {
    grid-template-areas: "a b";
    & > a:nth-child(1) { grid-area: a; }
    & > a:nth-child(2) { grid-area: b; }
  }
  &:has(:nth-child(3)) {
    grid-template-areas: "a b" "a c";
    & > a:nth-child(1) { grid-area: a; }
    & > a:nth-child(2) { grid-area: b; }
    & > a:nth-child(3) { grid-area: c; }
  }
  &:has(:nth-child(4)) {
    grid-template-areas: "a b" "c d";
    & > a:nth-child(1) { grid-area: a; }
    & > a:nth-child(2) { grid-area: b; }
    & > a:nth-child(3) { grid-area: c; }
    & > a:nth-child(4) { grid-area: d; }
  }
}

.raw {
  background-color: black;
  border-radius: 1px;
  color: greenyellow;
  font-size: 0.75rem;
  line-height: 1.375;
  overflow-x: auto;
  padding: 1rem;
  user-select: all;
  white-space: pre;
  word-break: break-all;
  [data-folded="true"] & {
    display: none;
  }
  @include scroll-bar();
}

.bottom {
  display: flex;
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

.relay {
  color: rgba(var(--fg-color), 0.375);
  margin-left: auto;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
