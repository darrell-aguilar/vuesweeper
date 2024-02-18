import { shallowMount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import { createTestingPinia } from "@pinia/testing"
import Board from "../components/Board.vue"
import { useStore } from "../store"
import { createVuetify } from "vuetify"
import { DifficultyLevel } from "../utils/constants"
import { flushPromises } from "@vue/test-utils"

describe("Board", () => {
  const pinia = createTestingPinia()
  const vuetify = createVuetify()
  const store = useStore()

  function wrapperFactory() {
    return shallowMount(Board, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          VIcon: {
            template: '<div class="v-icon"></div>',
          },
        },
      },
    })
  }

  it("sets up the board", async () => {
    const wrapper = wrapperFactory()
    store.game = DifficultyLevel.MEDIUM
    const setupSpy = vi.spyOn(wrapper.vm, "setupGame")
    const createMatrixSpy = vi.spyOn(wrapper.vm, "createMatrix")
    const plotBombsSpy = vi.spyOn(wrapper.vm, "plotBombs")

    await flushPromises()

    expect(setupSpy).toHaveBeenCalledTimes(1)
    expect(createMatrixSpy).toHaveBeenCalledTimes(1)
    expect(plotBombsSpy).toHaveBeenCalledTimes(1)
    expect(store.setBoardData).toHaveBeenCalled()
  })
})
