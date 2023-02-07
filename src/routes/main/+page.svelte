<script>
import { onMount } from "svelte"
import { counter } from "$/store/test.js"

onMount(() => {
  counter.add()
  console.log($counter.counter)
})
</script>

<h2>TEST</h2>
<a href="/">home</a>
