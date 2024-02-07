import { defineStore } from "pinia"
import { DifficultyLevel, DIFFICULTY, Status } from "../utils/constants"
import { defaultStore } from "../types/types"

export const useStore = defineStore("defaultStore", {
  state: (): defaultStore => ({
    game: DifficultyLevel.EASY,
    markedBombs: 0,
    boardData: [],
    mines: [],
    status: Status.START,
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
    winner: (state): boolean => {
      return state.boardData.every((arr) =>
        arr.every(
          (innerArr) =>
            (innerArr.hasMine && !innerArr.isRevealed) ||
            (!innerArr.hasMine && innerArr.isRevealed)
        )
      )
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
    setMines(value: any) {
      this.mines = value
    },
  },
})
