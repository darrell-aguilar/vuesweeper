<template>
  <div class="difficulty">
    <h2 class="difficulty-title">DIFFICULTY</h2>
    <h3 class="difficulty-header">Select a difficulty</h3>
    <v-radio-group v-model="difficulty">
      <v-radio
        class="difficulty-selection"
        v-for="(difficulty, value, idx) in Difficulty"
        :key="difficulty"
        :value="value"
        :label="value"
        :color="difficultyColors[idx]"
      ></v-radio>
    </v-radio-group>
    <div class="difficulty-buttons">
      <v-btn class="px-4" color="primary" @click="updateDifficulty">Save</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { DifficultyModes } from "../utils/constants"
import { useStore } from "../store"

export default defineComponent({
  name: "DifficultySelector",
  data() {
    return {
      store: useStore(),
      Difficulty: DifficultyModes,
      difficultyColors: ["green-darken-2", "yellow-darken-2", "red-darken-2"],
      difficulty: null as null | DifficultyModes,
    }
  },
  mounted() {
    this.difficulty = this.store.difficulty
  },
  methods: {
    updateDifficulty() {
      if (this.difficulty) {
        this.store.setDifficulty(this.difficulty)
        this.closeModal()
      }
    },
    closeModal() {
      this.$emit("close")
    },
  },
  emits: ["close"],
})
</script>

<style scoped lang="scss">
.difficulty {
  padding: 2rem 4rem;

  @include sm {
    padding: 2rem;
  }

  &-header {
    margin: 2rem 0;
  }

  &-buttons {
    margin: 2rem 0;
  }
}
</style>
