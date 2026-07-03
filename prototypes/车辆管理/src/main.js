import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { installElementPlusPrototype } from './elementPlusPrototype.js'

const app = createApp(App)
installElementPlusPrototype(app)
app.mount('#app')
