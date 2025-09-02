<template>
  <v-btn color="primary" prepend-icon="mdi-cog" @click="$emit('click')"
    >Settings</v-btn
  >
  <v-overlay v-model="value" class="justify-center align-center" persistent>
    <v-card class="settings-card">
      <v-toolbar color="primary">
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="closeModal"></v-btn>
      </v-toolbar>
      <div class="d-flex flex-sm-row flex-column">
        <v-tabs direction="vertical" v-model="tab">
          <v-tab value="difficulty">
            <p>Difficulty</p>
          </v-tab>
          <v-tab value="color">
            <p>Theme</p>
          </v-tab>
        </v-tabs>
        <v-window class="settings-window" v-model="tab">
          <v-window-item class="settings-window-item" value="difficulty">
            <DifficultySelector @close="closeModal" />
          </v-window-item>
          <v-window-item class="settings-window-item" value="color">
            <ThemeSelector />
          </v-window-item>
        </v-window>
      </div>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import DifficultySelector from "./DifficultySelector.vue"
import ThemeSelector from "./ThemeSelector.vue"

export default defineComponent({
  name: "Settings",
  components: {
    DifficultySelector,
    ThemeSelector,
  },
  props: {
    modelValue: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      tab: null,
    }
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
  emits: ["update:modelValue", "click"],
  methods: {
    closeModal() {
      this.$emit("update:modelValue", false)
    },
  },
})
</script>

<style scoped lang="scss">
.settings {
  &-card {
    margin: auto;
    min-width: 250px;

    @include sm {
      max-width: 80%;
    }
  }

  &-window {
    min-height: 60vh;
    border-top: solid 1px #cfcfcf;

    @include sm {
      border-left: solid 1px #cfcfcf;
      border-top: none;
    }
  }

  &-window-item {
    min-width: 80vw;

    @include sm {
      min-width: 50vw;
    }
  }
}
</style>
