import { DifficultyLevel, Status } from "../utils/constants"

export interface IPlotData {
  hasMine: boolean
  neighboursWithMine: number
  isRevealed: boolean
  isFlagged: boolean
}

export interface defaultStore {
  game: DifficultyLevel
  markedBombs: number
  boardData: Array<IPlotData[] | []>
  mines: Array<number[]> | []
  status: Status
}
