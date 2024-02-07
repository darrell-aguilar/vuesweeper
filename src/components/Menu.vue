<template>
  <div class="menu">
    <h3 class="menu-title">Vuesweeper!</h3>
    <v-btn @click="startGame">Start Game</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useStore } from "../store"
import { Status } from "../utils/constants"

export default defineComponent({
  name: "Menu",
  data() {
    return {
      store: useStore(),
    }
  },
  methods: {
    startGame() {
      this.store.updateGameStatus(Status.START)
    },
  },
})
</script>

<style scoped lang="scss">
.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;

  &-title {
    margin: 2rem;
  }
}
</style>
