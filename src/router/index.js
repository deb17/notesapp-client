import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/PageIndex.vue'
import Home from '../views/PageHome.vue'
import Err from '../views/PageError.vue'
import NotFound from '../views/PageNotFound.vue'
import { isSignedIn } from '@/asyncActions'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/:mode/:id',
    name: 'old-note',
    component: () =>
      import(/*webpackChunkName: "pagenote"*/ '../views/PageNote'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/new',
    name: 'new-note',
    component: () =>
      import(/*webpackChunkName: "pagenote"*/ '../views/PageNote'),
    meta: { requiresAuth: true }
  },
  {
    path: '/error',
    name: 'error',
    component: Err,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  isSignedIn().then(data => {
    if (to.meta.requiresAuth) {
      if (data) {
        next()
      } else {
        next({ name: 'index' })
      }
    } else if (to.meta.requiresAuth === false) {
      if (data) {
        next({ name: 'home' })
      } else {
        next()
      }
    } else {
      next()
    }
  })
})

export default router
