<script>
import OpenButton from "$/components/OpenButton.svelte"
import SVGIcon from "$/components/SVGIcon.svelte"
import { toNote, toNpub } from "$/composables/nostr-util.js"
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"

export let type = null
export let pubkey = null
export let eventId = null

const blockUser = pubkey => {
  blockStore.addBlock(pubkey)
  nostrStore.updateDisplayEvents()
  nostrStore.updateReplys()
}
</script>

<div class="action-menu">
  <div class="action-menu__inner">
  {#if type === "profile" && pubkey}
    <OpenButton url="{`nostr:${toNpub(pubkey)}`}">App</OpenButton>
    <OpenButton url="{`https://iris.to/profile/${pubkey}`}">iris</OpenButton>
    <OpenButton url="{`https://snort.social/p/${pubkey}`}">snort</OpenButton>
  {/if}
  {#if type === "note" && eventId}
    <OpenButton url="{`nostr:${toNote(eventId)}`}">App</OpenButton>
    <OpenButton url="{`https://iris.to/post/${eventId}`}">iris</OpenButton>
    <OpenButton url="{`https://snort.social/e/${toNote(eventId)}`}">snort</OpenButton>
  {/if}
  {#if pubkey}
    <button
      class="button--red"
      on:click|stopPropagation="{() => blockUser(pubkey)}"
    >
      <SVGIcon name="block" />
      <span>Block</span>
    </button>
  {/if}
  </div>
</div>

<style lang="scss">
.action-menu__inner {
  display: flex;
  grid-gap: 0.5rem;
  & > .button--red {
    font-size: 0.75rem;
    margin-left: auto;
    padding: 0.375rem 1rem;
  }
}
</style>
