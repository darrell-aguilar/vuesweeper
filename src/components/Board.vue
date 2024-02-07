<template>
  <div class="board" @keydown="pauseGame">
    <div class="board-menu my-5">
      <Settings v-model="showSettings" @click="showSettings = true" />
    </div>
    <template v-if="boardData.length">
      <div class="board-flag">
        <v-icon icon="mdi-flag" color="red"></v-icon> {{ store.flagsLeft }}
      </div>
      <div class="board-container">
        <div class="board-row" v-for="(xAxis, idx) in boardData" :key="idx">
          <Plot
            v-for="(yAxis, idy) in xAxis"
            :key="idy"
            :data="yAxis"
            @click="clickEventHandler(idx, idy)"
            @mark="flag(idx, idy)"
          ></Plot>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Plot from "./Plot.vue"
import { defineComponent } from "vue"
import { useStore } from "../store/index"
import { Status } from "../utils/constants"
import { IPlotData } from "../types/types"
import { navigateNeighbours } from "../utils/helpers"
import Settings from "./Settings.vue"

export default defineComponent({
  name: "Board",
  components: { Plot, Settings },
  data() {
    return {
      store: useStore(),
      showSettings: false,
    }
  },
  computed: {
    boardData: {
      set(value: any) {
        this.store.setBoardData(value)
      },
      get() {
        return this.store.boardData
      },
    },
    config() {
      return this.store.gameConfig
    },
    totalBoxes() {
      return this.config.height * this.config.width
    },
    paused() {
      return this.store.status === Status.PAUSED
    },
    difficulty() {
      return this.store.game
    },
  },
  watch: {
    config: {
      handler() {
        this.setupGame()
      },
      immediate: true,
    },
    difficulty() {
      this.setupGame()
    },
  },
  methods: {
    setupGame() {
      const matrix = this.createMatrix()
      const matrixWithBombs = this.plotBombs(matrix)
      this.boardData = matrixWithBombs
    },
    createMatrix() {
      let data: Array<Array<IPlotData>> = []

      for (let i = 0; i < this.config.width; i++) {
        data.push([])
        for (let j = 0; j < this.config.height; j++) {
          data[i][j] = {
            hasMine: false,
            neighboursWithMine: 0,
            isRevealed: false,
            isFlagged: false,
          }
        }
      }
      return data
    },
    plotBombs(matrix: Array<Array<IPlotData>>) {
      let bombsSet = 0
      let minesLocation = []
      while (bombsSet < this.config.bombs) {
        let xAxis = Math.floor(Math.random() * this.config.width)
        let yAxis = Math.floor(Math.random() * this.config.height)

        if (!matrix[xAxis][yAxis].hasMine) {
          matrix[xAxis][yAxis].hasMine = true
          minesLocation.push([xAxis, yAxis])
          bombsSet++
        }
      }
      this.store.mines = minesLocation
      return matrix
    },
    clickEventHandler(x: number, y: number) {
      if (this.store.status === Status.GAME_OVER || this.store.winner) return

      let box = this.boardData[x][y]

      box.isFlagged = false

      if (box.hasMine) {
        this.showMines(x, y)
        this.store.updateGameStatus(Status.GAME_OVER)
        return
      }

      navigateNeighbours(x, y, this.store.gameConfig, this.store.boardData)
    },
    flag(x: number, y: number) {
      if (
        this.store.status === Status.GAME_OVER ||
        this.boardData[x][y].isRevealed
      )
        return

      this.boardData[x][y].isFlagged = !this.boardData[x][y].isFlagged
    },
    showMines(x: number, y: number) {
      this.store.boardData[x][y].isFlagged = false
      this.store.boardData[x][y].isRevealed = true

      this.store.mines.forEach(([x, y], i) => {
        setTimeout(() => {
          this.store.boardData[x][y].isFlagged = false
          this.store.boardData[x][y].isRevealed = true
        }, (i + 1) * 200)
      })
    },
    pauseGame(e: KeyboardEvent) {
      console.log(e)
      if (this.store.status === Status.GAME_OVER) return
      if (this.store.status === Status.PAUSED) {
        this.store.updateGameStatus(Status.IN_PROGRESS)
      } else this.store.updateGameStatus(Status.PAUSED)
    },
  },
})
</script>

<style scoped lang="scss">
.board {
  text-align: center;

  &-flag {
    display: block;
    font-size: 1.25rem;
    margin: 2rem 0;
  }
  &-container {
    display: flex;
    flex-direction: row;
    gap: 0.125rem;
    justify-content: center;

    @include sm {
      gap: 0.5rem;
    }
  }

  &-row {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    justify-content: center;

    @include sm {
      gap: 0.5rem;
    }
  }
}
</style>
