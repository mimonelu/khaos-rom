<script>
import { onMount } from "svelte"
import { page } from "$app/stores"
import nostrStore from "$/store/nostr.js"

const relayUrl = $page.url.searchParams.get("relay")
const pubkey = $page.url.searchParams.get("pubkey")
let about = ""
let banner = ""
let displayName = ""
let lud06 = ""
let name = ""
let picture = ""
let website = ""

onMount(() => {
  nostrStore.retrieveProfile(relayUrl, pubkey, profile => {
    about = profile.about ?? ""
    banner = profile.banner ?? ""
    displayName = profile.display_name ?? ""
    lud06 = profile.lud06 ?? ""
    name = profile.name ?? ""
    picture = profile.picture ?? ""
    website = profile.website ?? ""
  })
})
</script>

<div class="container">
  <div class="inner">
    <a
      class="button close-button"
      href="/"
    >Close</a>
    <div
      class="banner"
      style="{`background-image: url(${banner});`}"
    />
    <div class="pubkey">{pubkey}</div>
    <div
      class="thumbnail"
      style="{`background-image: url(${picture});`}"
    />
    <div class="fullname">
      <div class="displayName">{displayName}</div>
      <div class="name">{name}</div>
    </div>
    <a
      class="website"
      href="{website}"
      rel="external"
      taregt="_blank"
    >{website}</a>
    <div class="lud06">{lud06}</div>
    <div class="about">{about}</div>
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

.close-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.banner {
  background-color: rgb(var(--bg-color));
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 0.5;
  position: absolute;
  z-index: - 1;
  width: 100%;
  height: 18rem;
}

.thumbnail {
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid rgb(var(--fg-color));
  grid-area: t;
  width: 9rem;
  height: 9rem;
}

.fullname {
  display: flex;
  align-items: flex-end;
  grid-gap: 1rem;
  grid-area: f;
  font-size: 1.5rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
}

.displayName {
  color: rgb(var(--accent-color));
}

.name {
  color: rgb(var(--fg-color));
}

.website {
  color: rgb(var(--access-color));
  grid-area: w;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pubkey {
  color: rgb(var(--fg-color));
  font-size: 0.75rem;
  grid-area: p;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lud06 {
  color: rgb(var(--accent-color));
  font-size: 0.75rem;
  grid-area: l;
  overflow: hidden;
  text-overflow: ellipsis;
}

.about {
  grid-area: a;
  padding-top: 1rem;
  white-space: pre-line;
}
</style>
