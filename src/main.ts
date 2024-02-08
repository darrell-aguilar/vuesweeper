import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import { createPinia } from "pinia"

import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import "@mdi/font/css/materialdesignicons.css"
import * as themes from "./styles/themes"

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      ...themes,
    },
  },
})

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.mount("#app")
