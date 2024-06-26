<template>
  <div class="board">
    <div class="board-menu my-5">
      <Settings v-model="showSettings" @click="showSettingsModal" />
    </div>
    <Confetti :show="won" />
    <Result v-model="showResult" @restart="restart">
      <template #winner-content>
        <h2>Total time: {{ timer }}</h2>
      </template>
    </Result>
    <template v-if="boardData.length">
      <div class="board-flag">
        <span
          ><v-icon icon="mdi-flag" color="red"></v-icon>{{ flagsLeft }}</span
        >
        <Timer :timer-status="timerState" />
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
import { mapState, mapActions } from "pinia"

export default defineComponent({
  name: "Board",
  components: { Plot, Settings, Timer, Result, Confetti },
  data() {
    return {
      showSettings: false,
      showResult: false,
      timerState: TimerStatus.START,
      firstPlotClicked: false,
    }
  },
  computed: {
    totalBoxes() {
      return this.config.height * this.config.width
    },
    ...mapState(useStore, {
      boardData: "boardData",
      config: "gameConfig",
      lost: "loser",
      won: "winner",
      difficulty: "game",
      allBombsVisible: "allBombsVisible",
      mines: "mines",
      flagsLeft: "flagsLeft",
      timer: "timer",
    }),
  },
  watch: {
    config: {
      handler() {
        this.setupGame()
      },
      immediate: true,
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
    won: {
      handler(result) {
        if (result) {
          this.timerState = TimerStatus.PAUSE
          setTimeout(() => (this.showResult = true), 500)
        }
      },
    },
    async difficulty() {
      this.timerState = TimerStatus.PAUSE
      await this.$nextTick()
      this.restart()
    },
    showSettings: {
      async handler(value) {
        if (value) {
          this.timerState = TimerStatus.PAUSE
          return
        }
        this.timerState = TimerStatus.RESUME
      },
    },
  },
  methods: {
    ...mapActions(useStore, {
      setBoardData: "setBoardData",
    }),
    setupGame() {
      this.firstPlotClicked = false
      const matrix = this.createMatrix()
      const matrixWithBombs = this.plotBombs(matrix)
      this.setBoardData(matrixWithBombs)
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
    bombChecker(matrix: Array<Array<IPlotData>>) {
      while (true) {
        const xAxis = Math.floor(Math.random() * this.config.width)
        const yAxis = Math.floor(Math.random() * this.config.height)
        if (!matrix[xAxis][yAxis].hasMine) {
          return [xAxis, yAxis]
        }
      }
    },
    plotBombs(matrix: Array<Array<IPlotData>>) {
      let bombsSet = 0
      while (bombsSet < this.config.bombs) {
        const [x, y] = this.bombChecker(matrix)
        matrix[x][y].hasMine = true
        bombsSet++
      }
      return matrix
    },
    clickEventHandler(x: number, y: number) {
      if (this.lost || this.won) return

      if (!this.firstPlotClicked) {
        const firstHasMine = this.mines.find(
          (mine) => mine[0] === x && mine[1] === y
        )
        if (firstHasMine) {
          const [bombX, bombY] = this.bombChecker(this.boardData)
          this.boardData[x][y].hasMine = false
          this.boardData[bombX][bombY].hasMine = true
        }
        this.firstPlotClicked = true
      }

      let box = this.boardData[x][y]

      box.isFlagged = false

      if (box.hasMine) {
        this.showMines(x, y)
        return
      }

      navigateNeighbours(x, y, this.config, this.boardData)
    },
    flag(x: number, y: number) {
      if (this.lost || this.boardData[x][y].isRevealed) return

      this.boardData[x][y].isFlagged = !this.boardData[x][y].isFlagged
    },
    showMines(x: number, y: number) {
      this.boardData[x][y].isFlagged = false
      this.boardData[x][y].isRevealed = true

      this.mines.forEach(([row, col], i) => {
        setTimeout(() => {
          this.boardData[row][col].isFlagged = false
          this.boardData[row][col].isRevealed = true
        }, (i + 1) * 80)
      })
    },
    showSettingsModal() {
      if (this.lost) return
      this.showSettings = true
    },
    restart() {
      this.setupGame()
      this.showResult = false
      this.timerState = TimerStatus.START
    },
  },
})
</script>

<style scoped lang="scss">
.board {
  text-align: center;

  &-flag {
    max-width: 300px;
    display: flex;
    font-size: 1.25rem;
    margin: 2rem auto;
    justify-content: space-around;
    align-items: center;
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
