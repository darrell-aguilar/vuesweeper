import { defineStore } from "pinia"
import { DifficultyModes, DIFFICULTY, Status } from "../utils/constants"
import { DefaultStore, DifficultyLevel } from "../types/types"

export const useStore = defineStore("defaultStore", {
  state: (): DefaultStore => ({
    difficulty: DifficultyModes.EASY,
    boardData: [],
    status: Status.MENU,
    flags: 0,
    theme: window.localStorage.getItem("theme") || "light",
    timer: null,
  }),
  getters: {
    gameConfig: (state): DifficultyLevel => DIFFICULTY[state.difficulty],
    allBombsVisible(): boolean {
      return (
        this.gameConfig.bombs ===
        this.boardData.reduce((sum, arr) => {
          return (
            sum +
            arr.reduce((innerSum, innerArr) => {
              return innerArr.hasMine && innerArr.isRevealed
                ? innerSum + 1
                : innerSum
            }, 0)
          )
        }, 0)
      )
    },
    winner: (state): boolean => {
      return state.boardData.every((arr) =>
        arr.every(
          (innerArr) =>
            (innerArr.hasMine && !innerArr.isRevealed) ||
            (!innerArr.hasMine && innerArr.isRevealed)
        )
      )
    },
    loser: (state): boolean => {
      return state.boardData.some((arr) =>
        arr.some((innerArr) => innerArr.hasMine && innerArr.isRevealed)
      )
    },
  },
  actions: {
    setDifficulty(value: DifficultyModes) {
      this.difficulty = value
    },
    setBoardData(value: any) {
      this.boardData = value
    },
    updateGameStatus(value: any) {
      this.status = value
    },
    setTheme(newTheme: string) {
      this.theme = newTheme
      window.localStorage.setItem("theme", newTheme)
    },
    updateTimer(val: string) {
      this.timer = val
    },
    setFlagCount(flagCount: number) {
      this.flags = flagCount
    },
    updateFlagCount(value: number) {
      this.flags += value
    },
  },
})
