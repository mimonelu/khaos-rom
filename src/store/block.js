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
      const blocksJson = localStorage.getItem("blocks")
      if (blocksJson == null) return
      const blocksArray = JSON.parse(blocksJson)
      set(new Set(blocksArray))
    },

    saveBlocks () {
      proc(state => {
        const blocksArray = []
        state.forEach(block => {
          blocksArray.push(block)
        })
        const blocksJson = JSON.stringify(blocksArray)
        localStorage.setItem("blocks", blocksJson)
      })
    },

    hasBlock (pubkey) {
      let result = false
      proc(state => {
        result = state.has(pubkey)
      })
      return result
    },

    addBlock (pubkey) {
      proc(state => {
        state.add(pubkey)
        this.saveBlocks()
      })
    },
  }
}

export default create()
