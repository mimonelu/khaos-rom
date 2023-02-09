import { writable } from "svelte/store"

function create () {
  const { subscribe, set, update } = writable(new Set())
  return {
    subscribe,

    loadBlocks () {
      const blocks = localStorage.getItem("blocks")
      if (blocks != null) {
        set(new Set(JSON.parse(blocks)))
      }
    },

    saveBlocks () {
      update(context => {
        const blocksArray = []
        context.forEach(block => blocksArray.push(block))
        localStorage.setItem("blocks", JSON.stringify(blocksArray))
        return context
      })
    },

    addBlock (event) {
      update(context => {
        context.add(event.pubkey)
        this.saveBlocks()
        return context
      })
    },
  }
}

export default create()
