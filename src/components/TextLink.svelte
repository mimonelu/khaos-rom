<script>
export let url = ""
export let external = true
</script>

<a
  class="text-link"
  href="{url}"
  target="{external ? "_blank" : ""}"
  rel="{external ? "noreferrer" : ""}"
  on:click|stopPropagation
>
  <slot />
</a>
