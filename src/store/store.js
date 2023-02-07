import { writable } from "svelte/store"

function create () {
  const { subscribe, set, update } = writable({
    events: [],
    blocks: new Set(),
  })

  function loadBlocks () {
    const blocks = localStorage.getItem("blocks")
    if (blocks != null) {
      update(context => {
        context.blocks = new Set(JSON.parse(blocks))
        return context
      })
    }
  }

  function saveBlocks () {
    update(context => {
      const blocksArray = []
      context.blocks.forEach(block => blocksArray.push(block))
      localStorage.setItem("blocks", JSON.stringify(blocksArray))
      return context
    })
  }

  function addEvent (event) {
    update(context => {
      context.events.unshift(event)
      return context
    })
  }

  function addBlock (event) {
    update(context => {
      context.blocks.add(event.pubkey)
      saveBlocks()
      return context
    })
  }

  return {
    subscribe,
    set,
    loadBlocks,
    saveBlocks,
    addEvent,
    addBlock,
  }
}

export default create()
