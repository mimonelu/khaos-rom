import { writable } from "svelte/store"

function create () {
  const { subscribe, set, update } = writable(new Map())

  const proc = callback => {
    update(state => {
      callback(state)
      return state
    })
  }

  return {
    subscribe,

    loadProfiles () {
      const profileJson = localStorage.getItem("profiles")
      if (profileJson == null) return
      const profileArray = JSON.parse(profileJson)
      set(new Map(profileArray))
    },

    saveProfiles () {
      proc(state => {
        const profileArray = []
        for (const entry of state.entries()) {
          profileArray.push(entry)
        }
        const profileJson = JSON.stringify(profileArray)
        localStorage.setItem("profiles", profileJson)
      })
    },

    hasProfile (pubkey) {
      let result = false
      proc(state => {
        result = state.has(pubkey)
      })
      return result
    },

    getProfile (pubkey) {
      let result = null
      proc(state => {
        result = state.get(pubkey) ?? null
      })
      return result
    },

    addProfile (pubkey, data) {
      proc(state => {
        state.set(pubkey, data)

        if (state.size > 200) {
          set(new Map([...state].slice(- 200)))
        }

        this.saveProfiles()
      })
    },
  }
}

export default create()
