import { writable } from "svelte/store"

function create () {
  const { subscribe, set, update } = writable({
    counter: 0,
  })

  function add () {
    update(data => {
      data.counter ++
      return data
    })
  }

  return {
    subscribe,
    set,
    add,
  }
}

export const counter = create()
