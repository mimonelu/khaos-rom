<script>
import blockStore from "$/store/block.js"
import nostraStore from "$/store/nostra.js"
import Icon from "$/components/Icon.svelte"

const regexJP = /[\u3041-\u3096]|[\u30A1-\u30FA]/

let events = []
$: events = Array.from($nostraStore.events.values()).reverse().filter(event => !$blockStore.has(event.pubkey) && event.content.match(regexJP))

function openPost (event) {
  window.open(`https://iris.to/#/post/${event.id}`)
}

function openProfile (event) {
  window.open(`https://iris.to/#/profile/${event.pubkey}`)
}
</script>

<div class="event-table">
  <header>id</header>
  <header>pubkey</header>
  <header>created_at</header>
  <header>kind</header>
  <header>tags</header>
  <header>content</header>
  <header>sig</header>
  <header />
{#each events as event}
  <div
    class="id"
    title="{event.id}"
  >{event.id}</div>
  <div
    class="pubkey"
    title="{event.pubkey}"
  >{event.pubkey}</div>
  <div
    class="created_at"
    title="{event.created_at}"
  >{event.created_at}</div>
  <div
    class="kind"
    title="{event.kind}"
  >{event.kind}</div>
  <div
    class="tags"
    title="{event.tags}"
  >{event.tags}</div>
  <div
    class="content"
    title="{event.content}"
  >{event.content}</div>
  <div
    class="sig"
    title="{event.sig}"
  >{event.sig}</div>
  <div class="menu">
  {#if event.kind === 1}
    <button
      class="button"
      on:click="{() => openPost(event)}"
    >Post</button>
    <button
      class="button"
      on:click="{() => openProfile(event)}"
    >Profile</button>
    <button
      class="button"
      on:click="{() => blockStore.addBlock(event)}"
    >
      <Icon name="block" />
    </button>
  {/if}
  </div>
{/each}
</div>

<style lang="scss">
.event-table {
  display: grid;
  align-items: center;
  grid-gap: 0.25rem 0.5rem;
  grid-template-columns: 1fr 1fr auto auto 1fr 8fr 1fr auto;
  position: relative;
  overflow: hidden;
  & > header {
    font-size: 0.75rem;
    font-weight: bold;
  }
  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.id {
      color: rgb(var(--middle-color));
    }
    &.pubkey {
      color: rgb(var(--middle-color));
    }
    &.created_at {}
    &.kind {
      text-align: center;
    }
    &.tags {
      color: rgb(var(--middle-color));
    }
    &.content {}
    &.sig {
      color: rgb(var(--middle-color));
    }
    &.menu {
      display: flex;
      grid-gap: 0.25rem;
      font-size: 0.5rem;
    }
  }
}
</style>
