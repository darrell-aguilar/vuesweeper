import { shallowMount } from "@vue/test-utils"
import { describe, it, expect, vi, afterEach } from "vitest"
import { createTestingPinia } from "@pinia/testing"
import Board from "../components/Board.vue"
import { useStore } from "../store"
import { createVuetify } from "vuetify"
import { DifficultyModes } from "../utils/constants"
import { flushPromises } from "@vue/test-utils"

vi.mock("../utils/helpers")

describe("Board", () => {
  const pinia = createTestingPinia({ stubActions: false })
  const vuetify = createVuetify()

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

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  it("sets up the board", async () => {
    const store = useStore()
    const wrapper = wrapperFactory()
    store.difficulty = DifficultyModes.MEDIUM
    const setupSpy = vi.spyOn(wrapper.vm, "setupGame")
    const createMatrixSpy = vi.spyOn(wrapper.vm, "createMatrix")

    await flushPromises()

    expect(setupSpy).toHaveBeenCalled()
    expect(createMatrixSpy).toHaveBeenCalled()
    expect(store.setBoardData).toHaveBeenCalled()

    expect(store.boardData.length).toBe(8)
    expect(store.boardData[0].length).toBe(12)
  })

  it("only applies the bombs after the first click has happened", async () => {
    const wrapper = wrapperFactory()
    const allocateBombsSpy = vi.spyOn(wrapper.vm, "allocateBombAxis")
    const showMinesSpy = vi.spyOn(wrapper.vm, "showMines")
    const plotBombsSpy = vi.spyOn(wrapper.vm, "plotBombs")

    expect(wrapper.vm.isFirstClick).toBe(true)
    expect(plotBombsSpy).not.toHaveBeenCalled()

    wrapper.vm.clickEventHandler(0, 0)
    await flushPromises()

    expect(wrapper.vm.isFirstClick).toBe(false)
    expect(showMinesSpy).not.toHaveBeenCalled()
    expect(allocateBombsSpy).toHaveBeenCalled()
    expect(plotBombsSpy).toHaveBeenCalled()
  })
})
