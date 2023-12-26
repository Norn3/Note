import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import { createPinia } from 'pinia'
import $ from 'jquery'
import DevUI from 'vue-devui';
import 'vue-devui/style.css';
import '@devui-design/icons/icomoon/devui-icon.css';
import { ThemeServiceInit, infinityTheme } from 'devui-theme';

ThemeServiceInit({ infinityTheme }, 'infinityTheme');

const pinia = createPinia()

createApp(App).use(router).use(pinia).use($).use(DevUI).mount('#app')
