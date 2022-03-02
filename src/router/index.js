import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
// const Home = () => import('views/home/Home')

Vue.use(VueRouter)

const routes = [{
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home'),
  },
  {
    path: '/home',
    redirect: '/',
    component: () => import('../views/Home'),

  },
  {
    path: '/bridge',
    name: 'Bridge',
    component: () => import('../views/Bridge')
  },
  {
    path: '/market',
    name: 'Market',
    component: () => import('../views/Market')
  },
  {
    path: '/doc',
    name: 'Doc',
    component: () => import('../views/Doc')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router