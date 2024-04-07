import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from "./router"
import { createPinia } from 'pinia'
import $ from 'jquery'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const pinia = createPinia()

createApp(App).use(router).use(pinia).use($).use(ElementPlus, { size: 'default'}).mount('#app')