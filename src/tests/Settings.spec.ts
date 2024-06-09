import { mount } from "@vue/test-utils"
import { it, describe, expect } from "vitest"
import Settings from "../components/Settings.vue"
import { createTestingPinia } from "@pinia/testing"
import { createVuetify } from "vuetify"

describe("Settings", () => {
  const pinia = createTestingPinia({ stubActions: false })
  const vuetify = createVuetify()

  function wrapperFactory(props: any) {
    return mount(Settings, {
      props: {
        ...props,
      },
      global: {
        plugins: [pinia, vuetify],
      },
    })
  }
})
