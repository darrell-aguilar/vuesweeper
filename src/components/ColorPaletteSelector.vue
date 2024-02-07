<template>
  <div>This is the color palette selector</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "ColorPaletteSelector",
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
      set(value: Boolean) {
        this.$emit("update:modelValue", value)
      },
    },
  },
  emits: ["update:modelValue"],
})
</script>

<style scoped lang="scss"></style>
