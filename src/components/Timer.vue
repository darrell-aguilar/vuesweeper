<template>
  <div>{{ formattedTime }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "Timer",
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
  mounted() {
    this.runTimer()
  },
  methods: {
    runTimer() {
      this.time = 0
      this.timer = setInterval(() => this.time++, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
    },
    restartTimer() {
      this.clearTimer()
      this.runTimer()
    },
  },
})
</script>

<style scoped></style>
