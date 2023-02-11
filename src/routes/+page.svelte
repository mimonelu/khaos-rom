<script>
import { onMount } from "svelte"
import { disableScrollHandling } from "$app/navigation"

onMount(() => {
  disableScrollHandling()
})
</script>
