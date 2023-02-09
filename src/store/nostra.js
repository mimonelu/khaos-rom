import { writable } from "svelte/store"
import { relayInit } from "nostr-tools"

function create () {
  const { subscribe, update } = writable({
    status: "diconnected",
    receivedNumberOfEvent: 0,
    events: new Map(),
  })

  let relay = null

  const relays = [
    { url: "wss://relay.damus.io", relay: null, status: "disconnected" },
    { url: "wss://eden.nostr.land", relay: null, status: "disconnected" },
    { url: "wss://relay.snort.social", relay: null, status: "disconnected" },
    { url: "wss://nostr.orangepill.dev", relay: null, status: "disconnected" },
    { url: "wss://nos.lol", relay: null, status: "disconnected" },
    { url: "wss://relay.current.fyi", relay: null, status: "disconnected" },
    { url: "wss://brb.io", relay: null, status: "disconnected" },
  ]

  return {
    subscribe,

    async toggle () {
      if (relay != null) {
        await this.disconnect()
        return false
      } 
      await this.connect()
      return true
    },

    async connectAll () {
      relays.forEach(relay => {
        relay.status = "connecting"
        relay.relay = relayInit(relay.url)
        relay.relay.on("connect", () => {
          console.log(`connected to ${relay.url}`)
          relay.status = "connected"
        })
        relay.relay.on("disconnect", () => {
          console.log(`disconnected to ${relay.url}`)
          relay.status = "disconnected"
        })
        relay.relay.on("error", () => {
          console.log(`failed to connect to ${relay.url}`)
        })
        let sub = relay.relay.sub([{
          kinds: [1],
          // authors: [publicKey],
          limit: 100,
        }])
        sub.on("event", event => {
          update(context => {
            if (!context.events.has(event.id)) {
              context.events.set(event.id, event)

              // 不要？
              context.events = new Map([...context.events].sort((a, b) => {
                return a[1].created_at < b[1].created_at
                  ? - 1
                  : a[1].created_at > b[1].created_at
                    ? 1
                    : 0
              }))
            }
            context.receivedNumberOfEvent += 1
            return context
          })
        })
      })
      await Promise.all(relays.map(relay => relay.relay.connect()))
    },

    async disconnectAll () {
      await Promise.all(relays.map(relay => relay.relay?.close()))
    },

    async connect () {
      if (relay != null) return
      update(context => {
        context.status = "connecting"
        return context
      })
      relay = relayInit("wss://nos.lol")
      relay.on("connect", () => {
        console.log(`connected to ${relay.url}`)
        update(context => {
          context.status = "connected"
          return context
        })
      })
      relay.on("disconnect", () => {
        console.log(`disconnected to ${relay.url}`)
        update(context => {
          context.status = "disconnected"
          return context
        })
      })
      relay.on("error", () => {
        console.log(`failed to connect to ${relay.url}`)
      })
      let sub = relay.sub([{
        kinds: [1],
        // authors: [publicKey],
        limit: 100,
      }])
      sub.on("event", event => {
        update(context => {
          context.events.set(event.id, event)
          return context
        })
      })
      await relay.connect()
    },

    async disconnect () {
      if (relay == null || relay.status !== 1) return
      await relay.close()
      relay = null
    },
  }
}

export default create()
