<script>
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import SVGIcon from "$/components/SVGIcon.svelte"

function openPost (event) {
  window.open(`https://iris.to/#/post/${event.id}`)
}

function openProfile (event) {
  window.open(`https://iris.to/#/profile/${event.pubkey}`)
}
</script>

<div class="container">
{#each $nostrStore.displayEvents as event}
  <a
    class="event"
    data-reply="{event.replyStatus === 1}"
    href="{`/post?relay=${event.relay}&pubkey=${event.pubkey}`}"
  >
    <div class="event__thumbnail" style="{`border-color: #${event.color};`}" />
    <div class="event__header">
      <div class="event__item pubkey" title="{event.pubkey}">{event.color}</div>
      <div class="event__item received_at" title="{event.received_at}">{event.received_at_string}</div>
      <div class="event__item created_at" title="{event.created_at}">{event.created_at_string}</div>
      <div class="event__item relay" title="{event.relay}">
        <SVGIcon name="relay" />
        <span>{event.relay}</span>
      </div>
    </div>
    <div class="event__detail">
      <div class="event__item id" title="{event.id}">{event.id}</div>
      <div class="event__item kind" title="{event.kind}">{event.kind}</div>
      <div class="event__item tags" title="{event.tags}">{event.tags}</div>
      <div class="event__item sig" title="{event.sig}">{event.sig}</div>
    </div>
    <div class="event__body">
    {#if event.replyStatus === 1}
      <div class="event__item reply">
        <SVGIcon name="reply" />
      </div>
    {:else if event.replyStatus === 2}
      <div class="event__item reply">
        <SVGIcon name="block" />
      </div>
    {/if}
      <div class="event__item content" title="{event.content}">{event.content}</div>
      <div class="event__item menu">
      {#if event.kind === 1}
        <button class="button" on:click="{() => openPost(event)}">Post</button>
        <button class="button" on:click="{() => openProfile(event)}">Profile</button>
        <button class="button" on:click="{() => blockStore.addBlock(event)}">
          <SVGIcon name="block" />
        </button>
      {/if}
      </div>
    </div>
  </a>
{/each}
</div>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  grid-gap: 0.5rem;
  line-height: 1;
  padding: 0 1rem;

  .event {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "t b"
      "t h";
    grid-gap: 0.5rem;
    padding-top: 0.5rem;
    &[data-reply="true"] {
      padding-left: 1.125rem;
    }

    &__thumbnail {
      border: 1px solid rgba(var(--fg-color), 0.125);
      grid-area: t;
      min-width: 2.25rem;
      height: 2.25rem;
    }
    &__header {
      display: flex;
      grid-area: h;
      grid-gap: 0.5rem;
      font-size: 0.75rem;
      overflow: hidden;
    }
    &__detail {
      display: none;
      grid-area: d;
      grid-gap: 0.5rem;
      font-size: 0.75rem;
    }
    &__body {
      display: flex;
      align-items: center;
      grid-area: b;
      grid-gap: 0.25rem;
      overflow: hidden;
    }
    &__item {
      overflow: hidden;
      white-space: nowrap;
      &.id {
        color: rgba(var(--fg-color), 0.375);
      }
      &.pubkey {
        color: rgba(var(--fg-color), 0.375);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.received_at {
        display: none;
      }
      &.created_at {
        color: rgba(var(--fg-color), 0.5);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.kind {
        // text-align: center;
      }
      &.tags {
        color: rgba(var(--fg-color), 0.375);
      }
      &.content {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.sig {
        color: rgba(var(--fg-color), 0.375);
      }
      &.relay {
        color: rgba(var(--fg-color), 0.375);
        display: flex;
        align-items: center;
        grid-gap: 0.25rem;
        margin-left: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        :global(svg) {
          fill: rgba(var(--fg-color), 0.375);
        }
      }
      &.reply {
        display: flex;
        align-items: center;
        min-width: 1rem;
        :global(svg) {
          fill: rgba(var(--fg-color), 0.25);
        }
      }
      &.menu {
        display: none;
        grid-gap: 0.25rem;
        font-size: 0.5rem;
      }
    }
  }
}
</style>
