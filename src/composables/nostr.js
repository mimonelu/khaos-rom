import store from "$/store/store.js"

import {
  nip19,
  relayInit,
} from "nostr-tools"

let relay = null

export async function toggle () {
  if (relay != null) {
    await disconnect()
  } else {
    await connect()
  }
  return relay != null
}

export async function connect () {
  relay = relayInit("wss://nos.lol")
  relay.on("connect", () => {
    console.log(`connected to ${relay.url}`)
  })
  relay.on("error", () => {
    console.log(`failed to connect to ${relay.url}`)
  })
  let sub = relay.sub([
    {
      // https://github.com/nostr-protocol/nips
      kinds: [1],
      // authors: [publicKey],
      limit: 100,
    }
  ])
  sub.on("event", store.addEvent)
  await relay.connect()
}

export async function disconnect () {
  if (relay == null) return
  await relay.close()
  relay = null
}
