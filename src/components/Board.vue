<template>
  <div class="board">
    <div class="board-menu my-5">
      <Settings v-model="showSettings" @click="showSettingsModal" />
    </div>
    <!-- <Confetti /> -->
    <Timer :timer-status="timerState" />
    <Result v-model="showResult" @restart="restart" />
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
import { TimerStatus } from "../utils/constants"
import { IPlotData } from "../types/types"
import { navigateNeighbours } from "../utils/helpers"
import Settings from "./Settings.vue"
import Timer from "./Timer.vue"
import Result from "./Result.vue"
import Confetti from "./Confetti.vue"

export default defineComponent({
  name: "Board",
  components: { Plot, Settings, Timer, Result, Confetti },
  data() {
    return {
      store: useStore(),
      showSettings: false,
      showResult: false,
      timerState: TimerStatus.START,
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
    lost() {
      return this.store.loser
    },
    won() {
      return this.store.winner
    },
    difficulty() {
      return this.store.game
    },
    allBombsVisible() {
      return this.store.allBombsVisible
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
    lost: {
      handler(lost) {
        if (lost) {
          this.timerState = TimerStatus.PAUSE
        }
      },
    },
    allBombsVisible: {
      handler(visible) {
        if (visible) {
          this.showResult = true
        }
      },
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
      if (this.lost || this.store.winner) return

      let box = this.boardData[x][y]

      box.isFlagged = false

      if (box.hasMine) {
        this.showMines(x, y)
        return
      }

      navigateNeighbours(x, y, this.store.gameConfig, this.store.boardData)
    },
    flag(x: number, y: number) {
      if (this.lost || this.boardData[x][y].isRevealed) return

      this.boardData[x][y].isFlagged = !this.boardData[x][y].isFlagged
    },
    showMines(x: number, y: number) {
      this.store.boardData[x][y].isFlagged = false
      this.store.boardData[x][y].isRevealed = true

      this.store.mines.forEach(([row, col], i) => {
        setTimeout(() => {
          this.store.boardData[row][col].isFlagged = false
          this.store.boardData[row][col].isRevealed = true
        }, (i + 1) * 200)
      })
    },
    showSettingsModal() {
      if (this.lost) return
      this.showSettings = true
    },
    restart() {
      this.setupGame()
      this.showResult = false
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
