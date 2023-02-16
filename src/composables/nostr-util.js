import { nip19, relayInit } from "nostr-tools"

export const toNote = hex => nip19.noteEncode(hex)

export const toNpub = hex => nip19.npubEncode(hex)

export const connectOnce = async (url, query, onEvent, onSuccess, onDisconnect, onError) => {
  const relay = relayInit(url)
  await relay.connect()
  relay.on("connect", () => {
    console.info(`[O] Connect (once): ${url}`)
  })
  relay.on("disconnect", () => {
    console.info(`[O] Disconnect (once): ${url}`)
    if (onDisconnect) onDisconnect()
  })
  relay.on("error", () => {
    console.info(`[O] Error (once): ${url}`)
    if (onError) onError()
  })
  const sub = relay.sub([query])
  sub.on("event", event => {
    if (onEvent) onEvent(event)
  })
  sub.on("eose", () => {
    console.info(`[O] EOSE (once): ${url}`)
    sub.unsub()
    if (onSuccess) onSuccess()
  })
  return relay
}

export const connectPermanent = async (url, queries, onEvent, onConnected, onDisconnected, onError) => {
  const relay = relayInit(url)
  await relay.connect()
  relay.on("connect", () => {
    console.info(`[O] Connect (permanent): ${url}`)
    if (onConnected) onConnected()
  })
  relay.on("disconnect", () => {
    console.info(`[O] Disconnect (permanent): ${url}`)
    if (onDisconnected) onDisconnected()
  })
  relay.on("error", () => {
    console.info(`[O] Error (permanent): ${url}`)
    if (onError) onError()
  })
  const sub = relay.sub(queries)
  sub.on("event", event => {
    if (onEvent) onEvent(event)
  })
  return relay
}

export const sanitizeEvent = event => {
  event.content ??= ""
  event.created_at ??= 0
  event.id ??= ""
  event.kind ??= - 1
  event.pubkey ??= ""
  event.sig ??= ""
  event.tags ??= []
}

export const sortEventsByCreatedAt = events =>
  events.sort((a, b) =>
    a.created_at < b.created_at
      ? - 1
      : a.created_at > b.created_at
        ? 1
        : 0
  )

export const createEmptyProfile = () => ({
  about: "",
  banner: "",
  display_name: "",
  lud06: "",
  name: "",
  picture: "",
  website: "",
})

export const sanitizeProfile = profile => {
  profile.about ??= ""
  profile.banner ??= ""
  profile.display_name ??= ""
  profile.lud06 ??= ""
  profile.name ??= ""
  profile.picture ??= ""
  // Because some person doesn't write a protocol.
  profile.website = !profile.website
    ? ""
    : /^http/.test(profile.website)
      ? profile.website
      : `https://${profile.website}`
}
