import { shallowMount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import { createTestingPinia } from "@pinia/testing"
import { createVuetify } from "vuetify"
import Plot from "../components/Plot.vue"
import { IPlotData } from "../types/types"

describe("Plot", () => {
  const pinia = createTestingPinia({ stubActions: false })
  const vuetify = createVuetify()

  function wrapperFactory(props: any) {
    return shallowMount(Plot, {
      props: {
        ...props,
      },
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

  const defaultProps = {
    data: <IPlotData>{
      hasMine: false,
      neighboursWithMine: 1,
      isRevealed: false,
      isFlagged: false,
    },
  }
  it("Shows the default plot", () => {
    const wrapper = wrapperFactory({
      ...defaultProps,
    })

    expect(wrapper.findComponent({ ref: "default" }).exists()).toBe(false)
  })

  it("Shows the flag icon if plot is flagged", () => {
    const wrapper = wrapperFactory({
      ...defaultProps,
      data: { ...defaultProps.data, isFlagged: true },
    })

    expect(wrapper.findComponent({ ref: "default" }).exists()).toBe(false)
    expect(wrapper.findComponent({ ref: "flag" }).exists()).toBe(true)
  })

  it("Shows the bomb if it was flagged and then revealed", () => {
    const wrapper = wrapperFactory({
      ...defaultProps,
      data: { ...defaultProps.data, isFlagged: true, isRevealed: true },
    })

    expect(wrapper.findComponent({ ref: "flag" }).exists()).toBe(false)
    expect(wrapper.findComponent({ ref: "bomb" }).exists()).toBe(false)
  })

  it("Shows the number if plot has a neighbour", () => {
    const wrapper = wrapperFactory({
      ...defaultProps,
      data: {
        ...defaultProps.data,
        isRevealed: true,
      },
    })

    expect(wrapper.find({ ref: "count" }).exists()).toBe(true)
    expect(wrapper.find({ ref: "count" }).text()).toBe("1")
  })
})
