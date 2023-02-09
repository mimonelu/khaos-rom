<script>
import blockStore from "$/store/block.js"
import nostraStore from "$/store/nostra.js"
import SVGIcon from "$/components/SVGIcon.svelte"

function openPost (event) {
  window.open(`https://iris.to/#/post/${event.src.id}`)
}

function openProfile (event) {
  window.open(`https://iris.to/#/profile/${event.src.pubkey}`)
}
</script>

<div class="event-table">
{#each $nostraStore.displayEvents as event}
  <div class="event">
    <div class="event__thumbnail" data-hash="{event.src.pubkey[0]}">
      <i />
    </div>
    <div class="event__header">
      <div class="event__item received_at" title="{event.src.received_at}">{event.received_at}</div>
      <div class="event__item created_at" title="{event.src.created_at}">
        <SVGIcon name="clock" />
        <span>{event.created_at}</span>
      </div>
      <div class="event__item pubkey" title="{event.src.pubkey}">{event.src.pubkey}</div>
      <div class="event__item relay" title="{event.relay}">
        <SVGIcon name="relay" />
        <span>{event.relay}</span>
      </div>
    </div>
    <div class="event__detail">
      <div class="event__item id" title="{event.src.id}">{event.src.id}</div>
      <div class="event__item kind" title="{event.src.kind}">{event.src.kind}</div>
      <div class="event__item tags" title="{event.src.tags}">{event.src.tags}</div>
      <div class="event__item sig" title="{event.src.sig}">{event.src.sig}</div>
    </div>
    <div class="event__body">
    {#if event.src.tags.length !== 0}
      <div class="event__item reply">
        <SVGIcon name="reply" />
      </div>
    {/if}
      <div class="event__item content" title="{event.src.content}">{event.src.content}</div>
      <div class="event__item menu">
      {#if event.src.kind === 1}
        <button class="button" on:click="{() => openPost(event)}">Post</button>
        <button class="button" on:click="{() => openProfile(event)}">Profile</button>
        <button class="button" on:click="{() => blockStore.addBlock(event)}">
          <SVGIcon name="block" />
        </button>
      {/if}
      </div>
    </div>
  </div>
{/each}
</div>

<style lang="scss">
.event-table {
  display: flex;
  flex-direction: column;
  grid-gap: 0.5rem;
  line-height: 1;

  .event {
    border-top: 1px solid rgba(var(--fg-color), 0.0625);
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      "t h"
      "t b";
    grid-gap: 0.5rem;
    padding-top: 0.5rem;

    &__thumbnail {
      border: 1px solid rgba(var(--fg-color), 0.125);
      display: flex;
      align-items: center;
      justify-content: center;
      grid-area: t;
      width: 2.25rem;
      & > i {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.5rem;
        width: 1rem;
        height: 1rem;
      }
      &[data-hash="0"] > i { background-color: rgb(240, 0, 0); }
      &[data-hash="1"] > i { background-color: rgb(0, 240, 0); }
      &[data-hash="2"] > i { background-color: rgb(0, 0, 240); }
      &[data-hash="3"] > i { background-color: rgb(240, 240, 0); }
      &[data-hash="4"] > i { background-color: rgb(240, 0, 240); }
      &[data-hash="5"] > i { background-color: rgb(0, 240, 240); }
      &[data-hash="6"] > i { background-color: rgb(240, 128, 0); }
      &[data-hash="7"] > i { background-color: rgb(128, 240, 0); }
      &[data-hash="8"] > i { background-color: rgb(0, 240, 128); }
      &[data-hash="9"] > i { background-color: rgb(0, 128, 240); }
      &[data-hash="a"] > i { background-color: rgb(128, 0, 240); }
      &[data-hash="b"] > i { background-color: rgb(240, 0, 128); }
      &[data-hash="c"] > i { background-color: rgb(240, 192, 128); }
      &[data-hash="d"] > i { background-color: rgb(128, 240, 192); }
      &[data-hash="e"] > i { background-color: rgb(192, 128, 240); }
      &[data-hash="f"] > i { background-color: rgb(240, 128, 192); }
    }
    &__header {
      display: flex;
      grid-area: h;
      grid-gap: 0.5rem;
      font-size: 0.75rem;
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
      white-space: nowrap;
      &.id {
        color: rgba(var(--fg-color), 0.375);
      }
      &.pubkey {
        color: rgba(var(--fg-color), 0.375);
        overflow: hidden;
        text-overflow: ellipsis;
        width: 8rem;
      }
      &.received_at {
        display: none;
      }
      &.created_at {
        color: rgba(var(--fg-color), 0.5);
        display: flex;
        align-items: center;
        grid-gap: 0.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        :global(svg) {
          fill: rgba(var(--fg-color), 0.5);
        }
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
