import { writable } from "svelte/store"

function create () {
  const { subscribe, set, update } = writable(new Set())

  const proc = callback => {
    update(state => {
      callback(state)
      return state
    })
  }

  return {
    subscribe,

    loadBlocks () {
      const blocks = localStorage.getItem("blocks")
      if (blocks != null) {
        set(new Set(JSON.parse(blocks)))
      }
    },

    saveBlocks () {
      proc(state => {
        const blocksArray = []
        state.forEach(block => blocksArray.push(block))
        localStorage.setItem("blocks", JSON.stringify(blocksArray))
      })
    },

    hasBlock (id) {
      let result = false
      proc(state => {
        result = state.has(id)
      })
      return result
    },

    addBlock (event) {
      proc(state => {
        state.add(event.pubkey)
        this.saveBlocks()
      })
    },
  }
}

export default create()
