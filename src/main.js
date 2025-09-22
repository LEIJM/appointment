import { createApp } from 'vue'
import App from './App.vue'
import router, { pinia } from './router/index.js'

// Import Vant UI components
import Vant from 'vant'
import 'vant/lib/index.css'

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(router)
app.use(pinia)
app.use(Vant)

// Mount app
app.mount('#app')
