<script>
// SEE: https://pictogrammers.com/library/mdi/
import block from "$/svg/cancel.svg?raw"
import connect from "$/svg/power-plug-outline.svg?raw"
import disconnect from "$/svg/power-plug-off-outline.svg?raw"
import event from "$/svg/message-fast-outline.svg?raw"
import logo from "$/svg/logo.svg?raw"
import open from "$/svg/open-in-new.svg?raw"
import question from "$/svg/help.svg?raw"
import reply from "$/svg/arrow-up-bold-outline.svg?raw"
import setting from "$/svg/cog-outline.svg?raw"
import traffic from "$/svg/cloud-download-outline.svg?raw"

export let name = ""

const icons = {
  block,
  connect,
  disconnect,
  event,
  logo,
  open,
  question,
  reply,
  setting,
  traffic,
}
</script>

<div class="svg-icon">
{#if icons[name]}{@html icons[name]}{/if}
</div>

<style>
.svg-icon {
  display: contents;
}

:global(svg) {
  min-width: 1em;
  height: 1em;
}
</style>
