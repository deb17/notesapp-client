import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/PageIndex.vue'
import Home from '../views/PageHome.vue'
import Note from '../views/PageNote.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/:mode/:id',
    name: 'old-note',
    component: Note,
    props: true
  },
  {
    path: '/new',
    name: 'new-note',
    component: Note
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
