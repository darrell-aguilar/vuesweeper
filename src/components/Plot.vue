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
    <Transition
      v-else-if="data.hasMine && !data.isFlagged && data.isRevealed"
      name="bomb"
      ref="bomb"
    >
      <v-icon
        class="plot-icon"
        v-if="data.hasMine && !data.isFlagged && data.isRevealed"
        :icon="bomb"
        color="black"
      ></v-icon>
    </Transition>
    <p
      class="plot-neighbour"
      :class="color"
      v-else-if="data.neighboursWithMine && data.isRevealed"
      ref="count"
    >
      {{ data.neighboursWithMine }}
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
      if (!this.data.neighboursWithMine) return
      return Colors[this.data.neighboursWithMine as keyof typeof Colors]
    },
    lost() {
      return this.store.loser
    },
  },
  watch: {
    data: {
      handler(newData) {
        if (newData.isRevealed && newData.hasMine) {
          setTimeout(() => {
            this.bomb = "mdi-bomb-off"
            this.bombStyle = {
              backgroundColor: "red",
            }
          }, 600)
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
