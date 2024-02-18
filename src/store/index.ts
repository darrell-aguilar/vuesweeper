import { defineStore } from "pinia"
import { DifficultyLevel, DIFFICULTY, Status } from "../utils/constants"
import { defaultStore } from "../types/types"

export const useStore = defineStore("defaultStore", {
  state: (): defaultStore => ({
    game: DifficultyLevel.EASY,
    markedBombs: 0,
    boardData: [],
    status: Status.MENU,
    theme: window.localStorage.getItem("theme") || "light",
  }),
  getters: {
    gameConfig: (state) => DIFFICULTY[state.game],
    flagsLeft(): number {
      return (
        this.gameConfig.bombs -
        this.boardData.reduce((sum, arr) => {
          return (
            sum +
            arr.reduce((innerSum, innerArr) => {
              return innerArr.isFlagged ? innerSum + 1 : innerSum
            }, 0)
          )
        }, 0)
      )
    },
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
    mines: (state): Array<number[]> => {
      return state.boardData.reduce((mines, row, idx) => {
        return [
          ...mines,
          ...row.reduce((minesInner, col, idy) => {
            if (col.hasMine) {
              minesInner.push([idx, idy])
            }
            return minesInner
          }, [] as Array<number[]>),
        ]
      }, [] as Array<number[]>)
    },
  },
  actions: {
    setDifficulty(value: any) {
      this.game = value
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
  },
})
