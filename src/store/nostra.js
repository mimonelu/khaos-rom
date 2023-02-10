import { format } from "date-fns"
import { writable } from "svelte/store"
import { relayInit } from "nostr-tools"
import blockStore from "$/store/block.js"

function create () {
  const { subscribe, update } = writable({
    totalNumberOfReceivedEvents: 0,
    relayStatuses: [],
    events: new Map(),
    displayEvents: [],
  })

  const relays = [
    { url: "relay.damus.io", relay: null, status: "disconnected" },
    { url: "eden.nostr.land", relay: null, status: "disconnected" },
    { url: "relay.snort.social", relay: null, status: "disconnected" },
    { url: "nostr.orangepill.dev", relay: null, status: "disconnected" },
    { url: "nos.lol", relay: null, status: "disconnected" },
    { url: "relay.current.fyi", relay: null, status: "disconnected" },
    { url: "brb.io", relay: null, status: "disconnected" },
  ]

  let blocks = []
  blockStore.subscribe(context => {
    blocks = context
  })

  return {
    subscribe,

    updateRelayStatuses () {
      update(context => {
        context.relayStatuses = relays.map(relay => relay.status)
        return context
      })
    },

    inquireProfile (relayUrl, pubkey, onSuccess, onError) {
      const relay = relayInit(`wss://${relayUrl}`)
      relay.on("connect", () => {
        console.log(`connected to ${relay.url}`)
        const sub = relay.sub([{
          kinds: [0],
          authors: [pubkey],
        }])
        sub.on("event", event => {
          const profile = JSON.parse(event.content ?? "")
          onSuccess(profile)
          sub.on("eose", () => {
            console.log("eose")
            sub.unsub()
          })
        })
      })
      relay.on("disconnect", () => {
        console.log(`disconnected to ${relay.url}`)
      })
      relay.on("error", () => {
        console.log(`failed to connect to ${relay.url}`)
        onError()
      })
      relay.connect()
    },

    async connectAll () {
      const targetRelays = relays.filter(relay => {
        if (relay.status !== "disconnected") return false
        relay.status = "connecting"
        this.updateRelayStatuses()
        relay.relay = relayInit(`wss://${relay.url}`)
        relay.relay.on("connect", () => {
          console.log(`connected to ${relay.url}`)
          relay.status = "connected"
          this.updateRelayStatuses()
        })
        relay.relay.on("disconnect", () => {
          console.log(`disconnected to ${relay.url}`)
          relay.status = "disconnected"
          this.updateRelayStatuses()
        })
        relay.relay.on("error", () => {
          console.log(`failed to connect to ${relay.url}`)
        })
        let sub = relay.relay.sub([{
          kinds: [1],
          limit: 100,
        }])
        sub.on("event", event => {
          if (event.kind !== 1) return

          event.content ??= ""
          event.created_at ??= 0
          event.id ??= ""
          event.kind ??= - 1
          event.pubkey ??= ""
          event.sig ??= ""
          event.tags ??= []

          update(context => {
            if (!context.events.has(event.id)) {
              event.received_at = Math.floor(Date.now() / 1000)
              context.events.set(event.id, {
                src: event,
                relay: relay.url,
                created_at: format(new Date(event.created_at * 1000), "MM/dd HH:mm:ss"),
                received_at: format(new Date(event.received_at * 1000), "MM/dd HH:mm:ss"),
                color: event.pubkey.slice(0, 3),
              })

              // 不要？
              context.events = new Map([...context.events].sort((a, b) => {
                return a[1].src.created_at < b[1].src.created_at
                  ? - 1
                  : a[1].src.created_at > b[1].src.created_at
                    ? 1
                    : 0
              }))

              const regexJP = /[\u3041-\u3096]|[\u30A1-\u30FA]/
              context.displayEvents = Array.from(context.events.values())
                .reverse()
                .filter(event => !blocks.has(event.src.pubkey) && event.src.content.match(regexJP))
            }
            context.totalNumberOfReceivedEvents += 1
            return context
          })
        })
        return true
      })
      await Promise.all(targetRelays.map(relay => relay.relay.connect()))
    },

    async disconnectAll () {
      await Promise.all(relays.map(relay => relay.relay?.close()))
    },

    /*
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
    */
  }
}

export default create()
