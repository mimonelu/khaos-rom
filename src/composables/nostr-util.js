import { relayInit } from "nostr-tools"

export const connectOnce = (url, query, onSuccess, onDisconnect, onError) => {
  const relay = relayInit(url)
  const sub = relay.sub([query])
  sub.on("event", event => {
    sub.on("eose", () => {
      console.info(`[O] EOSE (once): ${url}`)
      sub.unsub()
    })
    if (onSuccess) onSuccess(event)
  })
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
  relay.connect()
}

export const connectPermanent = (url, queries, onEvent, onConnected, onDisconnected, onError) => {
  const relay = relayInit(url)
  const sub = relay.sub(queries)
  sub.on("event", event => {
    if (onEvent) onEvent(event)
  })
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
  relay.connect()
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
    a[1].created_at < b[1].created_at
      ? - 1
      : a[1].created_at > b[1].created_at
        ? 1
        : 0
  )
