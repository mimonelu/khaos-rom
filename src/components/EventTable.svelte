<script>
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import OpenButton from "$/components/OpenButton.svelte"
import SVGIcon from "$/components/SVGIcon.svelte"
import TextLink from "$/components/TextLink.svelte"

const openPost = event => {
  event.folded = !event.folded
  $nostrStore.displayEvents = $nostrStore.displayEvents
}

const blockUser = pubkey => {
  blockStore.addBlock(pubkey)
  nostrStore.updateDisplayEvents()
  nostrStore.updateReplys()
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
            <TextLink url="{content.data}">{content.data}</TextLink>
            {:else if content.type === "tag"}
            <TextLink url="https://nostrview.com/search?q={encodeURIComponent(content.data)}">{content.data}</TextLink>
            {:else if content.type === "npub"}
            <TextLink url="https://snort.social/p/{content.data}">{content.data}</TextLink>
            {:else if content.type === "note"}
            <TextLink url="https://snort.social/e/{content.data}">{content.data}</TextLink>
            {/if}
          {/each}
          </div>
        </div>
        <div class="menu">
          <OpenButton url="{`nostr:${event.noteId}`}">App</OpenButton>
          <OpenButton url="{`https://iris.to/post/${event.id}`}">iris</OpenButton>
          <OpenButton url="{`https://snort.social/e/${event.noteId}`}">snort</OpenButton>
          <button
            class="button--red"
            on:click|stopPropagation="{() => blockUser(event.pubkey)}"
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
        <code
          class="raw"
          on:click|stopPropagation
        >{event.eventString}</code>
      </div>
      <div class="bottom">
        <div
          class="pubkey"
          style="{`color: rgb(${event.colorRgb});`}"
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
    fill: rgb(var(--fg-color));
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
    fill: rgb(var(--fg-color));
  }
}

.thumbnail {
  border: 1px solid transparent;
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
    line-height: 1.5rem;
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
    line-height: 1.5rem;
    white-space: pre-line;
  }
}

.content-text,
:global(.text-link) {
  word-break: break-all;
}

.menu {
  display: flex;
  grid-gap: 0.5rem;
  [data-folded="true"] & {
    display: none;
  }
  & > .button--red {
    font-size: 0.75rem;
    margin-left: auto;
    padding: 0.375rem 1rem;
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
    border: 1px solid rgb(var(--access-color));
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
  line-height: 1.5;
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
  color: rgba(var(--fg-color), 0.5);
  margin-left: auto;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
