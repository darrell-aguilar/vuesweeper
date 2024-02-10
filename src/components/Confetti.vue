<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import confetti from "canvas-confetti"

export default defineComponent({
  name: "Confetti",
  mounted() {
    this.spread()
  },
  methods: {
    spread() {
      confetti()
    },
  },
})
</script>

<style scoped></style>
