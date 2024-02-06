import { IPlotData } from "../types/types"

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

//  navigates all neighbours recursively
export const navigateNeighbours = (
  x: number,
  y: number,
  config: any,
  matrix: Array<IPlotData[]>
) => {
  const neighbours = findNeighbours(x, y, config, matrix)
  const mines: number = countMines(neighbours, matrix)

  matrix[x][y].isRevealed = true

  if (mines > 0) {
    matrix[x][y].neighboursWithMine = mines
  } else {
    for (let [idx, idy] of neighbours) {
      navigateNeighbours(idx, idy, config, matrix)
    }
  }
}

// finds all neigbours of plot

const findNeighbours = (
  x: number,
  y: number,
  config: any,
  matrix: Array<IPlotData[]>
) => {
  let neighbours = []

  let height = config.height
  let width = config.width

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let xOffset = i + x
      let yOffset = j + y

      if (
        xOffset >= 0 &&
        xOffset < width &&
        yOffset >= 0 &&
        yOffset < height &&
        (xOffset !== x || yOffset !== y) &&
        (!matrix[xOffset][yOffset].isRevealed ||
          matrix[xOffset][yOffset].hasMine)
      ) {
        neighbours.push([xOffset, yOffset])
      }
    }
  }
  return neighbours
}

// counts all mines

const countMines = (
  neighbours: Array<number[]>,
  matrix: Array<IPlotData[]>
) => {
  let minesCount = 0
  for (let [idx, idy] of neighbours) {
    if (matrix[idx][idy].hasMine) minesCount++
  }
  return minesCount
}
