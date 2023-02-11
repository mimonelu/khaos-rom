import { arrayMoveMutable } from "array-move"
import { format } from "date-fns"
import { writable } from "svelte/store"
import { relayInit } from "nostr-tools"
import blockStore from "$/store/block.js"

const defaultRelayUrls = [
  "relay.damus.io",
  // - "eden.nostr.land",
  "relay.snort.social",
  // - "nostr.orangepill.dev",
  "nos.lol",
  "relay.current.fyi",
  // - "brb.io",
  "relay.nostr.wirednet.jp",
]

const regexJP = /[\u3041-\u3096]|[\u30A1-\u30FA]/

function create () {
  const { subscribe, update } = writable({
    displayEvents: [],
    events: new Map(),
    relays: [],
    totalNumberOfDisplayEvents: 0,
    totalNumberOfUniqueEvents: 0,
    totalNumberOfReceivedEvents: 0,
    totalTraffic: 0,
  })

  const proc = callback => {
    update(state => {
      callback(state)
      return state
    })
  }

  const connectPermanent = (relay, query, onSuccess) => {
    if (relay.status !== "disconnected") return false
    relay.status = "connecting"
    relay.relay = relayInit(`wss://${relay.url}`)
    const sub = relay.relay.sub([query])
    sub.on("event", event => {
      if (onSuccess) onSuccess(event)
    })
    relay.relay.on("connect", () => {
      console.info(`[O] Connect (permanent): ${relay.url}`)
      relay.status = "connected"
    })
    relay.relay.on("disconnect", () => {
      console.info(`[O] Disconnect (permanent): ${relay.url}`)
      relay.status = "disconnected"
    })
    relay.relay.on("error", () => {
      console.info(`[O] Error (permanent): ${relay.url}`)
      relay.status = "disconnected"
    })
    relay.relay.connect()
  }

  const connectOnce = (relayUrl, query, onSuccess) => {
    const relay = relayInit(`wss://${relayUrl}`)
    const sub = relay.sub([query])
    sub.on("event", event => {
      sub.on("eose", () => {
        console.info(`[O] EOSE (once): ${relayUrl}`)
        sub.unsub()
      })
      if (onSuccess) onSuccess(event)
    })
    relay.on("connect", () => {
      console.info(`[O] Connect (once): ${relayUrl}`)
    })
    relay.on("disconnect", () => {
      console.info(`[O] Disconnect (once): ${relayUrl}`)
    })
    relay.on("error", () => {
      console.info(`[O] Error (once): ${relayUrl}`)
    })
    relay.connect()
  }

  const sanitizeEvent = eventString => {
    const event = JSON.parse(eventString)
    event.content ??= ""
    event.created_at ??= 0
    event.id ??= ""
    event.kind ??= - 1
    event.pubkey ??= ""
    event.sig ??= ""
    event.tags ??= []
    return event
  }

  const formatDate = date => format(new Date(date * 1000), "MM/dd HH:mm:ss")

  const addPost = (relay, rawEvent, event) => {
    if (event.kind !== 1) return
    proc(state => {
      if (state.events.has(event.id) || blockStore.hasBlock(event.pubkey)) return
      const color = event.pubkey.slice(0, 3)
      const created_at_string = formatDate(event.created_at)
      const received_at = Math.floor(Date.now() / 1000)
      const received_at_string = formatDate(received_at)
      state.events.set(event.id, {
        raw: rawEvent,
        ...event,
        color,
        created_at_string,
        received_at,
        received_at_string,
        relay: relay.url,
        replyId: null,
        replyStatus: 0,
      })
    })
  }

  const addTrafic = (relay, eventString) => {
    const traffic = eventString.length
    relay.traffic += traffic
    proc(state => {
      state.totalTraffic += traffic
    })
  }

  const sortEvents = () => {
    proc(state => {
      const events = [...state.events].sort((a, b) => {
        return a[1].created_at < b[1].created_at
          ? - 1
          : a[1].created_at > b[1].created_at
            ? 1
            : 0
      })
      state.events = new Map(events)
    })
  }

  const updateDisplayEvents = () => {
    proc(state => {
      state.displayEvents = Array.from(state.events.values())
        .reverse()
        .filter(event => event.content.match(regexJP))
    })
  }

  // TODO:
  const updateReplys = () => {
    proc(state => {
      const replys = []
      const events = state.displayEvents.filter(src => {
        const replyId = (src.tags.find(tag => tag[0] === "e") ?? [])[1]
        if (!replyId) return true
        src.replyId = replyId
        src.replyStatus = 1
        if (state.displayEvents.some(dst => {
          if (src.id === dst.id) return false
          if (src.replyId === dst.id) {
            replys.push(src)
            return true
          }
        })) {
          return false
        }
        src.replyStatus = 2
        return true
      })
      replys.forEach(reply => {
        events.some((event, index) => {
          if (reply.replyId !== event.id) return false
          events.splice(index + 1, 0, reply)
          return true
        })
      })
      state.displayEvents = events
    })
  }

  const updateTotalNumbers = () => {
    proc(state => {
      state.totalNumberOfDisplayEvents = state.displayEvents.length
      state.totalNumberOfUniqueEvents = state.events.size
      state.totalNumberOfReceivedEvents += 1
    })
  }

  return {
    subscribe,

    setupRelay () {
      proc(state => {
        defaultRelayUrls.forEach(defaultRelayUrl => {
          state.relays.push({
            url: defaultRelayUrl,
            relay: null,
            status: "disconnected",
            totalNumberOfDisplayEvents: 0,
            traffic: 0
          })
        })
      })
    },

    connectPostAll () {
      const query = {
        kinds: [1],
        limit: 100,
      }
      proc(state => {
        state.relays.forEach(relay => {
          connectPermanent(relay, query, rawEvent => {
            const eventString = JSON.stringify(rawEvent)
            const event = sanitizeEvent(eventString)
            addPost(relay, event, rawEvent)
            addTrafic(relay, eventString)
            sortEvents()
            updateDisplayEvents()
            updateReplys()
            updateTotalNumbers()
          })
        })
      })
    },

    disconnectPostAll () {
      proc(state => {
        state.relays.forEach(relay => {
          if (relay.relay) relay.relay.close()
        })
      })
    },

    retrieveProfile (relayUrl, pubkey, onSuccess) {
      const query = {
        kinds: [0],
        authors: [pubkey],
      }
      connectOnce(relayUrl, query, rawEvent => {
        const eventString = JSON.stringify(rawEvent)
        const event = sanitizeEvent(eventString)
        onSuccess(JSON.parse(event.content ?? ""))
      })
    }
  }
}

export default create()
