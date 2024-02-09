<template>
  <div
    class="plot-container"
    :class="{ 'plot-revealed': data.isRevealed }"
    @click="clickPlot"
    @contextmenu="$emit('mark', data.isFlagged)"
  >
    <v-icon
      class="plot-icon"
      v-if="data.isFlagged && !data.isRevealed"
      color="red"
      icon="mdi-flag"
    ></v-icon>
    <Transition name="bomb">
      <v-icon
        class="plot-icon"
        v-if="data.hasMine && !data.isFlagged && data.isRevealed"
        :color="bombColor"
        :icon="bomb"
      ></v-icon>
    </Transition>
    <p
      class="plot-neighbour"
      :class="color"
      v-if="data.neighboursWithMine && data.isRevealed"
    >
      {{ data.neighboursWithMine }}
    </p>
    <div class="plot-default" v-else></div>
  </div>
</template>

<script lang="ts">
import { useStore } from "../store/index"
import { defineComponent, PropType } from "vue"
import { Status, Colors } from "../utils/constants"
import { IPlotData } from "../types/types"
import bombAudio from "../assets/bomb-explode.wav"

export default defineComponent({
  name: "Plot",
  emits: ["clicked", "mark"],
  data() {
    return {
      store: useStore(),
      audioFile: new Audio(bombAudio),
      bomb: "mdi-bomb",
    }
  },
  props: {
    data: {
      type: Object as PropType<IPlotData>,
      required: true,
    },
  },
  computed: {
    gameOver() {
      return this.store.status === Status.GAME_OVER
    },
    color() {
      if (!this.data.neighboursWithMine) return
      return Colors[this.data.neighboursWithMine as keyof typeof Colors]
    },
    bombColor() {
      return this.$vuetify.theme.current.colors.error
    },
  },
  watch: {
    data: {
      handler(newData) {
        if (newData.isRevealed && newData.hasMine) {
          setTimeout(() => {
            this.audioFile.play()
            this.bomb = "mdi-bomb-off"
          }, 600)
        }
      },
      deep: true,
    },
  },
  methods: {
    clickPlot() {
      if (this.store.status !== Status.GAME_OVER) {
        this.$emit("clicked")
      }
    },
  },
})
</script>

<style scoped lang="scss">
.plot {
  &-container {
    width: 2rem;
    height: 2rem;
    border: rgb(23, 23, 23) solid 2px;
    border-radius: 0.5rem;
    background-color: rgb(var(--v-theme-surface-variant));
    cursor: pointer;
    text-align: center;

    @include sm {
      width: 2.5rem;
      height: 2.5rem;
    }

    &:hover {
      background-color: rgb(var(--v-theme-surface-light));
    }
  }

  &-revealed {
    background-color: rgb(var(--v-theme-on-background));

    &:hover {
      background-color: rgb(var(--v-theme-on-background));
    }
  }

  &-icon {
    vertical-align: bottom;
    margin-top: 0.125rem;

    @include sm {
      margin-top: 0.25rem;
    }
  }

  &-neighbour {
    font-size: 1rem;
    font-weight: 800;
    margin-top: 0.125rem;

    @include sm {
      font-size: 1.5rem;
      margin-top: 0.125rem;
    }
  }
}

.bomb-enter-active {
  animation: bomb-animation 1s ease-out;
}
</style>
