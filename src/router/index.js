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
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/home',
    redirect: '/home'
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
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router