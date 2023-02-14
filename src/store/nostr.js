import { format } from "date-fns"
import { writable } from "svelte/store"
import { nip19, relayInit } from "nostr-tools"
import {
  connectOnce,
  connectPermanent,
  sanitizeEvent,
  sortEventsByCreatedAt,
} from "$/composables/nostr-util.js"
import classifyText from "$/composables/classify-text.js"
import hexToRgb from "$/composables/hex-to-rgb.js"
import blockStore from "$/store/block.js"

const defaultRelayUrls = [
  "wss://relay.damus.io",
  "wss://eden.nostr.land",
  "wss://relay.snort.social",
  // - "wss://nostr.orangepill.dev",
  "wss://nos.lol",
  "wss://relay.current.fyi",
  // - "wss://brb.io",
  "wss://relay.nostr.wirednet.jp",
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://nostr.h3z.jp",
  "wss://nostr-relay.nokotaro.com",
]

const regexJP = /[\u3041-\u3096]|[\u30A1-\u30FA]/

function create () {
  const { set, subscribe, update } = writable({
    displayEvents: [],
    events: new Map(),
    relays: new Map(),
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

  // `status` will be changed in an asynchronous functions.
  const updateStatus = (relayUrl, status) => {
    proc(state => {
      const relay = state.relays.get(relayUrl)
      if (!relay) return
      relay.status = status
    })
  }

  const formatDate = date => format(new Date(date * 1000), "MM/dd HH:mm:ss")

  const addPost = (relay, rawEvent, event, eventString) => {
    if (event.kind !== 1) return
    proc(state => {
      if (state.events.has(event.id) || blockStore.hasBlock(event.pubkey)) return
      const noteId             = nip19.noteEncode(event.id)
      const colorHex           = event.pubkey.slice(0, 6)
      const colorRgb           = hexToRgb(colorHex)
      const classifiedContent  = classifyText(event.content)
      const created_at_string  = formatDate(event.created_at)
      const received_at        = Math.floor(Date.now() / 1000)
      const received_at_string = formatDate(received_at)
      state.events.set(event.id, {
        raw: rawEvent,
        ...event,
        eventString,
        noteId,
        colorHex,
        colorRgb,
        classifiedContent,
        created_at_string,
        received_at,
        received_at_string,
        relay: relay.url,
        replyId: null,
        replyStatus: 0,
        folded: true,
      })
    })
  }

  const addTraffic = (relay, eventString) => {
    const traffic = eventString.length
    relay.traffic += traffic
    proc(state => {
      state.totalTraffic += traffic
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
    set,
    subscribe,

    setupRelay () {
      proc(state => {
        defaultRelayUrls.forEach(defaultRelayUrl => {
          state.relays.set(defaultRelayUrl, {
            url: defaultRelayUrl,
            relay: null,
            status: "disconnected",
            totalNumberOfDisplayEvents: 0,
            traffic: 0,
          })
        })
      })
    },

    connectAll (queries) {
      proc(state => {
        state.relays.forEach(relay => {
          if (relay.status !== "disconnected") return
          relay.status = "connecting"
          relay.relay = connectPermanent(relay.url, queries, rawEvent => {
            const eventString = JSON.stringify(rawEvent, null, 2)
            const event = JSON.parse(eventString)
            sanitizeEvent(event)
            addPost(relay, rawEvent, event, eventString)
            addTraffic(relay, eventString)
            const events = sortEventsByCreatedAt([...state.events])
            state.events = new Map(events)
            this.updateDisplayEvents()
            updateReplys()
            updateTotalNumbers()
          }, () => {
            updateStatus(relay.url, "connected")
          }, () => {
            updateStatus(relay.url, "disconnected")
          }, () => {
            updateStatus(relay.url, "disconnected")
          })
        })
      })
    },

    disconnectAll () {
      proc(state => {
        state.relays.forEach(relay => {
          if (relay.relay && relay.status !== "connecting") relay.relay.close()
        })
      })
    },

    updateDisplayEvents () {
      proc(state => {
        state.displayEvents = Array.from(state.events.values())
          .filter(event => !blockStore.hasBlock(event.pubkey) && event.content.match(regexJP))
          .reverse()

        // TODO:
        state.relays.forEach(relay => { relay.totalNumberOfDisplayEvents = 0 })
        state.displayEvents.forEach(event => {
          const relay = state.relays.get(event.relay)
          relay.totalNumberOfDisplayEvents += 1
        })
      })
    },

    updateReplys,

    retrieveGlobalNotes () {
      this.connectAll([{
        kinds: [1],
        limit: 100,
      }])
    },

    retrieveProfile (relayUrl, pubkey, onSuccess) {
      const query = {
        kinds: [0],
        authors: [pubkey],
      }
      connectOnce(relayUrl, query, rawEvent => {
        const eventString = JSON.stringify(rawEvent)
        const event = JSON.parse(eventString)
        sanitizeEvent(event)
        onSuccess(JSON.parse(event.content ?? ""))
      })
    },
  }
}

export default create()
