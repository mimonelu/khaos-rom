<script>
import { onMount } from "svelte"
import ActionMenu from "$/components/ActionMenu.svelte"
import EventTable from "$/components/EventTable.svelte"
import TextLink from "$/components/TextLink.svelte"
import { createEmptyProfile } from "$/composables/nostr-util.js"
import { backgroundImage } from "$/composables/css-util.js"
import nostrStore from "$/store/nostr.js"

export let relay = null
export let pubkey = null

let profile = createEmptyProfile()
let notes = []

onMount(async () => {
  await nostrStore.retrieveProfile(relay, pubkey, newProfile => {
    profile = newProfile
    nostrStore.updateDisplayEvents()
  })
  await nostrStore.retrieveOnesNotes(relay, pubkey, events => {
    notes = events
  })
})
</script>

<div class="container">
  <div class="inner">
    <div
      class="banner"
      style="{backgroundImage(profile.banner)}"
    />
    <a
      class="button--plane close-button"
      href="#home"
    >Close</a>
    <div class="body">
      <div class="top">
        <div
          class="thumbnail"
          style="{backgroundImage(profile.picture)}"
        />
        <div class="right">
          <div class="display-name">{profile.display_name}</div>
          <div class="name">{profile.name}</div>
        </div>
      </div>
      <ActionMenu
        type="profile"
        pubkey="{pubkey}"
      />
      <TextLink url="{profile.website}">{profile.website}</TextLink>
      <div class="pubkey">{pubkey}</div>
      <div class="lud06">{profile.lud06}</div>
      <div class="about">{profile.about}</div>
      <EventTable events="{notes}" />
    </div>
  </div>
</div>

<style lang="scss">
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
  background-color: rgb(var(--bg-sub-color));
  border: 1px solid rgba(var(--fg-color), 0.25);
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
  border: 1px solid rgb(var(--bg-sub-color));
  border-radius: 1px;
  min-width: 8rem;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.display-name {
  color: rgb(var(--accent-color));
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  &:empty {
    display: contents;
  }
}

.name {
  color: rgb(var(--fg-color));
  font-weight: bold;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  &:empty {
    display: contents;
  }
}

:global(.text-link) {
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
  line-height: 1.5;
  white-space: pre-line;
  word-break: break-all;
  &:empty {
    display: contents;
  }
}
</style>
