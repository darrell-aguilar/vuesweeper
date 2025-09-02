import { DifficultyModes, Status } from "../utils/constants"

export interface IPlotData {
  hasMine: boolean
  adjacentMines: number
  isRevealed: boolean
  isFlagged: boolean
}

export interface DefaultStore {
  difficulty: DifficultyModes
  boardData: Array<IPlotData[]>
  status: Status
  flags: number
  theme: string
  timer: string | null
}

export interface DifficultyLevel {
  height: number
  width: number
  bombs: number
}

export type DifficultyModeNames = keyof typeof DifficultyModes
