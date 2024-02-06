<script lang="ts">
import { defineComponent } from "vue"
import Board from "./components/Board.vue"
import { disableContextMenu } from "./helpers/helpers"

export default defineComponent({
  name: "App",
  components: { Board },
  created() {
    disableContextMenu()
  },
})
</script>

<template>
  <Board />
</template>

<style scoped></style>
