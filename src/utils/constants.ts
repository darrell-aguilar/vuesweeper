export const DIFFICULTY = {
  EASY: { height: 10, width: 6, bombs: 12 },
  MEDIUM: { height: 12, width: 8, bombs: 20 },
  HARD: { height: 14, width: 10, bombs: 28 },
}

export const Colors = {
  1: "text-blue",
  2: "text-green",
  3: "text-red",
  4: "text-dark-blue",
  5: "text-brown",
  6: "text-cyan",
  7: "text-black",
  8: "text-grey",
}

export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum Status {
  MENU,
  START,
}

export enum TimerStatus {
  START,
  PAUSE,
  RESUME,
}
