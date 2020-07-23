import 'v-markdown-editor/dist/v-markdown-editor.css'
import Vue from 'vue'
import Editor from 'v-markdown-editor'
import {
  ModalPlugin,
  BButton,
  BAlert,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { LoaderPlugin } from 'vue-google-login'
import { CLIENT_ID } from './asyncActions'
import Vuelidate from 'vuelidate'

axios.defaults.baseURL = 'https://storenotes.pythonanywhere.com/api'

Vue.use(Editor)
Vue.use(ModalPlugin)
Vue.use(LoaderPlugin, {
  client_id: CLIENT_ID
})
Vue.use(Vuelidate)

Vue.config.productionTip = false

Vue.component('b-button', BButton)
Vue.component('b-alert', BAlert)
Vue.component('b-form', BForm)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-form-input', BFormInput)
Vue.component('b-form-invalid-feedback', BFormInvalidFeedback)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
