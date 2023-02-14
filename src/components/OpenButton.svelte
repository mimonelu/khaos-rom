<script>
import SVGIcon from "$/components/SVGIcon.svelte"

export let url = ""
export let external = true
</script>

<a
  class="button--outline"
  href="{url}"
  target="{external ? "_blank" : ""}"
  rel="{external ? "noreferrer" : ""}"
  on:click|stopPropagation
>
  <SVGIcon name="open" />
  <span>
    <slot />
  </span>
</a>

<style lang="scss">
.button--outline {
  font-size: 0.75rem;
  padding: 0.375rem 1rem;
}
</style>
