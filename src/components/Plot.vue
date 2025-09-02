<template>
  <div
    class="plot-container"
    :class="{ 'plot-revealed': data.isRevealed }"
    @click="clickPlot"
    @contextmenu="$emit('mark', data.isFlagged)"
    :style="bombStyle"
  >
    <v-icon
      class="plot-icon"
      v-if="data.isFlagged && !data.isRevealed"
      color="red"
      icon="mdi-flag"
      ref="flag"
    ></v-icon>
    <p v-if="data.hasMine && !data.isFlagged && data.isRevealed">
      <v-icon
        class="plot-icon"
        :class="{ 'plot-bombed': animateBomb }"
        :icon="bomb"
        color="black"
      ></v-icon>
    </p>
    <p
      class="plot-neighbour"
      :class="color"
      v-else-if="data.adjacentMines && data.isRevealed"
      ref="count"
    >
      {{ data.adjacentMines }}
    </p>
    <div v-else class="plot-default" ref="default"></div>
  </div>
</template>

<script lang="ts">
import { useStore } from "../store/index"
import { defineComponent, PropType } from "vue"
import { Colors } from "../utils/constants"
import { IPlotData } from "../types/types"

export default defineComponent({
  name: "Plot",
  emits: ["clicked", "mark"],
  data() {
    return {
      store: useStore(),
      bomb: "mdi-bomb",
      bombStyle: {},
      animateBomb: false,
    }
  },
  props: {
    data: {
      type: Object as PropType<IPlotData>,
      required: true,
    },
  },
  computed: {
    color() {
      if (!this.data.adjacentMines) return
      return Colors[this.data.adjacentMines as keyof typeof Colors]
    },
    lost() {
      return this.store.loser
    },
  },
  watch: {
    data: {
      handler(newData) {
        if (newData.isRevealed && newData.hasMine) {
          this.animateBomb = true
          setTimeout(() => (this.bombStyle = { backgroundColor: "red" }), 300)
        } else this.bombStyle = {}
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    clickPlot() {
      if (!this.lost) {
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
    background-color: white;
  }

  &-bombed {
    animation: popBomb 0.8s ease-out forwards;
  }

  @keyframes popBomb {
    0% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    30% {
      transform: scale(1.3) rotate(-15deg);
    }
    60% {
      transform: scale(0.8) rotate(15deg);
    }
    100% {
      transform: scale(2) rotate(0deg);
      opacity: 0;
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
</style>
