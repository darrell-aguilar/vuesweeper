import { IPlotData } from "../types/types"
import { useStore } from "../store"

export const disableContextMenu = () =>
  window.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault()
    },
    false
  )

//  navigates all neighbours recursively
export const navigateNeighbours = (
  x: number,
  y: number,
  config: any,
  matrix: Array<IPlotData[]>
) => {
  const store = useStore()

  const neighbours = findNeighbours(x, y, config, matrix)
  const mines: number = countMines(neighbours, matrix)

  const box = matrix[x][y]
  box.isRevealed = true
  if (box.isFlagged) {
    store.updateFlagCount(1)
    box.isFlagged = false
  }

  if (mines > 0) {
    matrix[x][y].adjacentMines = mines
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

export const themeNameFormatter = (themeName: string) => {
  return themeName.charAt(0).toUpperCase().concat(themeName.slice(1))
}
