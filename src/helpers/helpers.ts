import { DIFFICULTY, IPlotData } from "../types/constants"
export const disableContextMenu = () =>
  window.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault()
    },
    false
  )

export const includedInArray = <T>(
  shortArray: Array<T>,
  data: Array<Array<T>>
): boolean => {
  return data.some(
    (pair) => pair[0] === shortArray[0] && pair[1] === shortArray[1]
  )
}

export const checkNeighbours = (
  x: number,
  y: number,
  config: any,
  matrix: Array<IPlotData[]>
) => {
  let height = config.height
  let width = config.width
  let neighbours = 0

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let xOffset = i + x
      let yOffset = j + y
      if (xOffset > -1 && xOffset < width && yOffset > -1 && yOffset < height) {
        if (matrix[x + i][y + j].hasMine) neighbours++
      }
    }
  }
  return neighbours
}

export const floodFill = (
  x: number,
  y: number,
  config: any,
  matrix: Array<IPlotData[]>
) => {
  let height = config.height
  let width = config.width
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let xOffset = i + x
      let yOffset = j + y
      if (xOffset > -1 && xOffset < width && yOffset > -1 && yOffset < height) {
        if (
          !matrix[xOffset][yOffset].hasMine &&
          !matrix[xOffset][yOffset].isRevealed &&
          !matrix[xOffset][yOffset].isFlagged
        ) {
          matrix[xOffset][yOffset].isRevealed = true
          if (!matrix[xOffset][yOffset].neighboursWithMine) {
            floodFill(xOffset, yOffset, config, matrix)
          }
        }
      }
    }
  }
}
