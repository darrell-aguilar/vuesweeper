import { shallowMount } from "@vue/test-utils"
import { describe, it, expect, vi, afterEach } from "vitest"
import { createTestingPinia } from "@pinia/testing"
import Board from "../components/Board.vue"
import { useStore } from "../store"
import { createVuetify } from "vuetify"
import { DifficultyLevel } from "../utils/constants"
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
    store.game = DifficultyLevel.MEDIUM
    const setupSpy = vi.spyOn(wrapper.vm, "setupGame")
    const createMatrixSpy = vi.spyOn(wrapper.vm, "createMatrix")
    const plotBombsSpy = vi.spyOn(wrapper.vm, "plotBombs")

    await flushPromises()

    expect(setupSpy).toHaveBeenCalled()
    expect(createMatrixSpy).toHaveBeenCalled()
    expect(plotBombsSpy).toHaveBeenCalled()
    expect(store.setBoardData).toHaveBeenCalled()

    expect(store.boardData.length).toBe(8)
    expect(store.boardData[0].length).toBe(12)
    expect(store.mines.length).toBe(20)
  })

  it("does not trigger show all mines if first click has a mine", async () => {
    const store = useStore()
    const wrapper = wrapperFactory()
    const bombCheckerSpy = vi.spyOn(wrapper.vm, "bombChecker")
    const showMinesSpy = vi.spyOn(wrapper.vm, "showMines")
    store.boardData[0][0].hasMine = true

    expect(wrapper.vm.firstPlotClicked).toBe(false)

    wrapper.vm.clickEventHandler(0, 0)
    await flushPromises()

    expect(wrapper.vm.firstPlotClicked).toBe(true)
    expect(showMinesSpy).not.toHaveBeenCalled()
    expect(bombCheckerSpy).toHaveBeenCalled()
  })
})
