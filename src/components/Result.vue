<template>
  <v-overlay v-model="value" class="justify-center align-center" persistent>
    <v-card class="result-card" v-if="store.winner">
      <p>You won!</p>
    </v-card>
    <v-card class="result-card" v-else-if="store.loser">
      <p>You lost!</p>
      <v-btn @click="$emit('restart')">Restart Game</v-btn>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useStore } from "../store"
export default defineComponent({
  name: "Result",
  data() {
    return {
      store: useStore(),
    }
  },
  props: {
    modelValue: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(val: Boolean) {
        this.$emit("update:modelValue", val)
      },
    },
  },
  emits: ["update:modelValue", "restart"],
  methods: {
    closeModal() {
      this.$emit("update:modelValue", false)
    },
  },
})
</script>

<style scoped lang="scss">
.settings {
}
</style>
