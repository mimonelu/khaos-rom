<script>
import { createEventDispatcher, onMount } from "svelte"

const regex = new RegExp("^#(\\w+)\\??(.*)$")

const dispatch = createEventDispatcher()

const route = () => {
  const items = location.hash.match(regex) ?? []
  const hash = items[1] ?? ""
  const params = (items[2] ?? "")
    .split("&")
    .map(block => block.split("="))
    .reduce((params, [key, value]) => {
      params[key] = value
      return params
    }, {})
  dispatch("change", { hash, params })
}

onMount(route)
</script>

<svelte:window on:hashchange="{route}" />
