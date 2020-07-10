import 'v-markdown-editor/dist/v-markdown-editor.css'
import Vue from 'vue'
import Editor from 'v-markdown-editor'
import { BVModalPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'https://storenotes.pythonanywhere.com/api'

Vue.use(Editor)
Vue.use(BVModalPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
