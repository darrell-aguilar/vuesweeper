<template>
  <Menu v-if="showMenu" />
  <Board v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Board from "./components/Board.vue"
import Menu from "./components/Menu.vue"
import { disableContextMenu } from "./utils/helpers"
import { useStore } from "./store"
import { Status } from "./utils/constants"

export default defineComponent({
  name: "App",
  components: { Board, Menu },
  data() {
    return {
      store: useStore(),
    }
  },
  created() {
    disableContextMenu()
  },
  computed: {
    showMenu() {
      return this.store.status === Status.MENU
    },
  },
})
</script>

<style scoped lang="scss"></style>
