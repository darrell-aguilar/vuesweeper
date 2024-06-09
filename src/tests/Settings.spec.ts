import { mount } from "@vue/test-utils"
import { it, describe, expect, vi } from "vitest"
import Settings from "../components/Settings.vue"
import { createTestingPinia } from "@pinia/testing"
import { createVuetify } from "vuetify"

describe("Settings", () => {
  const pinia = createTestingPinia({ stubActions: false })
  const vuetify = createVuetify()

  function wrapperFactory({ props }: any = {}) {
    return mount(Settings, {
      props: {
        ...props,
      },
      global: {
        plugins: [pinia, vuetify],
      },
    })
  }

  it("emits modelValue to false when closeModal event is triggered", async () => {
    const wrapper = wrapperFactory()
    const spyCloseModal = vi.spyOn(wrapper.vm, "closeModal")

    await wrapper.vm.closeModal()
    expect(spyCloseModal).toHaveBeenCalled()
    expect(wrapper.emitted("update:modelValue")).toBeTruthy()
  })
})
