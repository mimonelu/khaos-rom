<script>
import { onMount } from "svelte"
import blockStore from "$/store/block.js"
import nostrStore from "$/store/nostr.js"
import OpenButton from "$/components/OpenButton.svelte"
import SVGIcon from "$/components/SVGIcon.svelte"

export let relay = null
export let pubkey = null

let about = ""
let banner = ""
let displayName = ""
let lud06 = ""
let name = ""
let picture = ""
let website = ""

onMount(() => {
  nostrStore.retrieveProfile(relay, pubkey, profile => {
    about = profile.about ?? ""
    banner = profile.banner ?? ""
    displayName = profile.display_name ?? ""
    lud06 = profile.lud06 ?? ""
    name = profile.name ?? ""
    picture = profile.picture ?? ""
    // Because some person doesn't write a protocol.
    website = !profile.website
      ? ""
      : /^http/.test(profile.website)
        ? profile.website
        : `https://${profile.website}`
  })
})

const blockUser = () => {
  blockStore.addBlock(pubkey)
  nostrStore.updateDisplayEvents()
  location.href = "#home"
}
</script>

<div class="container">
  <div class="inner">
    <div
      class="banner"
      style="{`background-image: url(${banner});`}"
    />
    <a
      class="button--plane close-button"
      href="#home"
    >Close</a>
    <div class="body">
      <div class="top">
        <div
          class="thumbnail"
          style="{`background-image: url(${picture});`}"
        />
        <div class="right">
          <div class="displayName">{displayName}</div>
          <div class="name">{name}</div>
        </div>
      </div>
      <div class="menu">
        <OpenButton url="{`https://iris.to/profile/${pubkey}`}">iris</OpenButton>
        <OpenButton url="{`https://snort.social/p/${pubkey}`}">snort</OpenButton>
        <button
          class="button--red"
          on:click="{() => blockUser()}"
        >
          <SVGIcon name="block" />
          <span>Block</span>
        </button>
      </div>
      <a
        class="website"
        href="{website}"
        rel="noreferrer"
        target="_blank"
      >{website}</a>
      <div class="pubkey">{pubkey}</div>
      <div class="lud06">{lud06}</div>
      <div class="about">{about}</div>
    </div>
  </div>
</div>

<style lang="scss">
@import "../scss/variables";

.container {
  background-color: rgba(var(--bg-color), 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  user-select: text;
}

.inner {
  background-color: rgba(var(--bg-color), 0.75);
  border-radius: 1px;
  margin-top: 2rem;
  overflow-y: auto;
  position: relative;
  max-width: $max-width;
  min-height: calc(100vh - 4rem);
  max-height: calc(100vh - 4rem);
  @media all and (max-width: $max-width) {
    min-width: calc(100vw - 4rem);
    max-width: calc(100vw - 4rem);
  }
  @media all and (min-width: $max-width) {
    min-width: $max-width;
  }
  @include scroll-bar();
}

.close-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 1;
}

.banner {
  background-color: rgb(var(--accent-color));
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  border-radius: 1px 1px 0 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 16rem;
}

.body {
  border-radius: 1px;
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
  padding: 12rem 2rem 2rem;
  position: relative;
}

.top {
  display: flex;
  grid-gap: 1rem;
  min-height: 8rem;
  max-height: 8rem;
}

.thumbnail {
  background-color: rgb(var(--bg-color));
  background-repeat: no-repeat;
  background-size: cover;
  border: 2px solid rgb(var(--bg-color));
  border-radius: 1px;
  min-width: 8rem;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.displayName {
  color: rgb(var(--accent-color));
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.375;
  overflow: hidden;
  text-overflow: ellipsis;
  &:empty {
    display: contents;
  }
}

.name {
  color: rgb(var(--fg-color));
  font-weight: bold;
  line-height: 1.375;
  overflow: hidden;
  text-overflow: ellipsis;
  &:empty {
    display: contents;
  }
}

.menu {
  display: flex;
  grid-gap: 0.5rem;
  & > .button--red {
    font-size: 0.75rem;
    margin-left: auto;
    padding: 0.375rem 1rem;
  }
}

.website {
  color: rgb(var(--access-color));
  overflow: hidden;
  text-overflow: ellipsis;
  &:empty {
    display: contents;
  }
}

.pubkey {
  color: rgb(var(--fg-color));
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lud06 {
  color: rgb(var(--accent-color));
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  &:empty {
    display: contents;
  }
}

.about {
  line-height: 1.375;
  white-space: pre-line;
  word-break: break-all;
  &:empty {
    display: contents;
  }
}
</style>
