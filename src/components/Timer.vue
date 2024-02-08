<template>
  <div>{{ formattedTime }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { TimerStatus } from "../utils/constants"

export default defineComponent({
  name: "Timer",
  props: {
    timerStatus: {
      default: TimerStatus.START,
    },
  },
  data() {
    return {
      time: 0,
      timer: 0,
    }
  },
  computed: {
    formattedTime(): string {
      let secondsString
      let minutesString
      let seconds = this.time % 60
      let minutes = Math.floor(this.time / 60)
      seconds < 10
        ? (secondsString = "0" + seconds.toString())
        : (secondsString = seconds.toString())
      minutes < 10
        ? (minutesString = "0" + minutes.toString())
        : (minutesString = minutes.toString())
      return `${minutesString}:${secondsString}`
    },
  },
  watch: {
    timerStatus: {
      handler(newVal) {
        switch (newVal) {
          case TimerStatus.START:
            clearInterval(this.timer)
            this.time = 0
            this.timer = setInterval(() => this.time++, 1000)
            break
          case TimerStatus.PAUSE:
            clearInterval(this.timer)
            break
          case TimerStatus.RESUME:
            this.timer = setInterval(() => this.time++, 1000)
        }
      },
      immediate: true,
    },
  },
})
</script>

<style scoped></style>
