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
    bombsLeft(state): number {
      return this.gameConfig.bombs - state.markedBombs
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
    updateMarkedBombs(method: any) {
      method === "ADD" ? this.markedBombs-- : this.markedBombs++
    },
    setMines(value: any) {
      this.mines = value
    },
  },
})
