<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import confetti from "canvas-confetti"

export default defineComponent({
  name: "Confetti",
  props: {
    show: {
      type: Boolean,
    },
  },
  watch: {
    show: {
      handler(value) {
        if (value) this.spread()
      },
    },
  },
  methods: {
    spread() {
      confetti({
        particleCount: 200,
        spread: 90,
      })
    },
  },
})
</script>

<style scoped></style>
