<template>
  <v-overlay v-model="value" class="align-center justify-center">
    <div class="difficulty-modal rounded">
      <h3 class="difficulty-title">DIFFICULTY</h3>
      <h3 class="difficulty-header">Select a difficulty</h3>
      <v-radio-group v-model="selectDifficulty" class="justify-center">
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
        <v-btn class="px-4" color="grey" @click="value = false">Cancel</v-btn>
        <v-btn class="px-4" color="blue" @click="updateDifficulty">Save</v-btn>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { DifficultyLevel } from "../utils/constants"

export default defineComponent({
  name: "DifficultySelector",
  props: {
    modelValue: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      Difficulty: DifficultyLevel,
      difficultyColors: ["green-darken-2", "yellow-darken-2", "red-darken-2"],
      selectDifficulty: null,
    }
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value: Boolean) {
        this.$emit("update:modelValue", value)
      },
    },
  },
  emits: ["update:modelValue", "update-difficulty"],
  methods: {
    updateDifficulty() {
      this.$emit("update-difficulty", this.selectDifficulty)
      this.$emit("update:modelValue", false)
    },
  },
})
</script>

<style scoped lang="scss">
.difficulty {
  &-modal {
    background-color: rgb(255, 255, 255);
    min-width: 500px;
    min-height: 500px;
    padding: 2rem;
  }

  &-title {
    text-align: center;
  }

  &-header {
    text-align: center;
    margin: 2rem 0;
  }

  &-selection {
    margin: auto;
  }

  &-buttons {
    margin: 2rem;
    display: flex;
    justify-content: space-around;
  }
}
</style>
