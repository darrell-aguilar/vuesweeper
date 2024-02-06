<template>
  <div
    class="plot-container"
    :class="{ 'plot-revealed': data.isRevealed }"
    @click="clickPlot"
    @contextmenu="$emit('mark', data.isFlagged)"
  >
    <v-icon
      class="mt-2"
      v-if="data.isFlagged"
      color="red"
      icon="mdi-flag"
    ></v-icon>
    <v-icon
      class="mt-2"
      v-if="data.hasMine && !data.isFlagged && data.isRevealed"
      icon="mdi-bomb"
    ></v-icon>
    <p
      class="mt-2 plot-neighbour"
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
import { IPlotData, Status, Colors } from "../types/constants"

export default defineComponent({
  name: "Plot",
  emits: ["clicked", "mark"],
  data() {
    return {
      store: useStore(),
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
      return `text-${
        Colors[this.data.neighboursWithMine as keyof typeof Colors]
      }`
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
    width: 3rem;
    height: 3rem;
    border: rgb(23, 23, 23) solid 2px;
    border-radius: 0.5rem;
    background-color: #d3d3d3;
    cursor: pointer;
    text-align: center;

    &:hover {
      background-color: #efefef;
    }
  }

  &-revealed {
    background-color: #ffffff;

    &:hover {
      background-color: #ffffff;
    }
  }

  &-icon {
    vertical-align: bottom;
  }

  &-neighbour {
    font-size: 1.25rem;
    font-weight: 800;
  }
}
</style>
