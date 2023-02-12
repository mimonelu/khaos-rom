<script>
// SEE: https://pictogrammers.com/library/mdi/
import block from "$/assets/svg/cancel.svg?raw"
import clock from "$/assets/svg/clock-outline.svg?raw"
import connect from "$/assets/svg/power-plug-outline.svg?raw"
import cursorDown from "$/assets/svg/menu-down.svg?raw"
import disconnect from "$/assets/svg/power-plug-off-outline.svg?raw"
import event from "$/assets/svg/message-fast-outline.svg?raw"
import menu from "$/assets/svg/menu.svg?raw"
import open from "$/assets/svg/open-in-new.svg?raw"
import question from "$/assets/svg/help.svg?raw"
import relay from "$/assets/svg/transit-connection.svg?raw"
import reply from "$/assets/svg/arrow-up-bold-outline.svg?raw"
import setting from "$/assets/svg/cog-outline.svg?raw"
import traffic from "$/assets/svg/cloud-download-outline.svg?raw"

export let name = ""

const icons = {
  block,
  clock,
  connect,
  cursorDown,
  disconnect,
  event,
  menu,
  open,
  question,
  relay,
  reply,
  setting,
  traffic,
}
</script>

{#if icons[name]}{@html icons[name]}{/if}

<style>
:global(svg) {
  min-width: 1em;
  height: 1em;
}
</style>
