export const DIFFICULTY = {
  EASY: { height: 10, width: 8, bombs: 12 },
  MEDIUM: { height: 12, width: 10, bombs: 14 },
  HARD: { height: 14, width: 12, bombs: 20 },
}

export const Colors = {
  1: "blue",
  2: "green",
  3: "red",
  4: "dark-blue",
  5: "brown",
  6: "cyan",
  7: "black",
  8: "grey",
}

export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum Status {
  START = "START",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  GAME_OVER = "GAME_OVER",
}

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
