<template>
  <div class="menu">
    <h1 class="menu-title">{{ title }}!</h1>
    <Transition name="bomb">
      <v-icon
        v-bind="bombConfig"
        v-if="bombConfig.showBomb"
        class="menu-bomb"
        :color="bombColor"
      ></v-icon>
    </Transition>
    <v-btn @click="startGame" color="primary">Start Game</v-btn>
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
      title: "Vuesweeper",
      bombConfig: {
        showBomb: false,
        icon: "mdi-bomb",
        style: {
          left: "",
          top: "",
          zIndex: 1000,
        },
      },
    }
  },
  mounted() {
    this.animateBomb()
  },
  computed: {
    bombColor() {
      return this.$vuetify.theme.current.colors.error
    },
  },
  methods: {
    startGame() {
      this.store.updateGameStatus(Status.START)
    },
    animateBomb() {
      this.bombConfig.icon = "mdi-bomb"

      const maxHeight = window.innerHeight * 0.9
      const maxWidth = window.innerWidth * 0.9

      this.bombConfig.style.left = `${Math.random() * maxWidth}px`
      this.bombConfig.style.top = `${Math.random() * maxHeight}px`

      this.bombConfig.showBomb = true

      setTimeout(() => {
        this.bombConfig.icon = "mdi-bomb-off"
        setTimeout(() => {
          this.bombConfig.showBomb = false
          setTimeout(() => {
            this.animateBomb()
          }, 300)
        }, 300)
      }, 1000)
    },
  },
})
</script>

<style scoped lang="scss">
.menu {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;

  &-title {
    margin: 2rem;
  }

  &-bomb {
    position: absolute;
    font-size: 3rem;
  }
}

.bomb-enter-active {
  animation: bomb-scale 1s ease-out;
}

@keyframes bomb-scale {
  0% {
    transform: scale(0.5);
  }

  30% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1.2);
  }
}
</style>
