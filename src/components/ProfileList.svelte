<script>
import { backgroundImage } from "$/composables/css-util.js"
import profileStore from "$/store/profile.js"

let profiles = []

$: {
  profiles = []
  $profileStore.forEach((value, key) => {
    profiles.push({
      ...value,
      pubkey: key,
    })
  })
}
</script>

<div class="profile-list">
{#each profiles as profile}
  <div class="profile">
    <a
      class="thumbnail"
      href="{`#profile?relay=${profile.relay}&pubkey=${profile.pubkey}`}"
      style="{`${backgroundImage(profile.picture)} border-color: #${profile.pubkey.slice(0, 6)};`}"
    />
    <div class="right">
      <div class="full-name">
        <div class="display-name">{profile.display_name}</div>
        <div class="name">{profile.name}</div>
      </div>
      <div class="relay">{profile.relay}</div>
    </div>
  </div>
{/each}
</div>

<style lang="scss">
.profile-list {
  display: flex;
  flex-direction: column;
  grid-gap: 0.5rem;
}

.profile {
  display: flex;
  grid-gap: 0.5rem;
}

.thumbnail {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid transparent;
  border-radius: 1px;
  overflow: hidden;
  min-width: 2.75rem;
  height: 2.75rem;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.full-name {
  display: flex;
  align-items: flex-end;
  grid-gap: 0.5rem;
}

.display-name {
  font-weight: bold;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name {
  color: rgba(var(--fg-color), 0.75);
  font-size: 0.875rem;
  line-height: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.relay {
  color: rgba(var(--fg-color), 0.5);
  font-size: 0.75rem;
  line-height: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
