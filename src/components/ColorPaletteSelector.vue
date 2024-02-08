<template>
  <div class="color-palette">
    <v-radio-group v-model="color">
      <v-radio v-for="theme in themes" :value="theme" :label="theme"></v-radio>
    </v-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useStore } from "../store"

export default defineComponent({
  name: "ColorPaletteSelector",
  props: {
    modelValue: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      store: useStore(),
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
    color: {
      get() {
        return this.store.theme
      },
      set(newTheme: string) {
        this.store.setTheme(newTheme)
      },
    },
    themes() {
      return Object.keys(this.$vuetify.theme.themes)
    },
  },
  emits: ["update:modelValue"],
})
</script>

<style scoped lang="scss">
.color-palette {
  padding: 2rem 4rem;

  @include sm {
    padding: 2rem;
  }
}
</style>
