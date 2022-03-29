import Vue from 'vue'
import VueRouter from 'vue-router'

import RoadMap from "../components/document/RoadMap"
import Guidefor from "../components/document/Guidefor"
import GuideforMarket from "@/components/document/GuideforMarket"
import GuideforWallet from "@/components/document/GuideforWallet"
import GuideforBridge from "@/components/document/GuideforBridge"
import Introduction from "@/components/document/Introduction"

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
    component: () => import('../views/Doc'),
    children: [{
        path: '/Introduction',
        component: Introduction,
        name: "Introduction"
      },
      {
        path: '/RoadMap',
        component: RoadMap,
        name: "RoadMap"
      },
      {
        path: '/Guidefor',
        component: Guidefor,
        name: "Guidefor"
      },
      {
        path: '/GuideforMarket',
        component: GuideforMarket,
        name: "GuideforMarket"
      },
      {
        path: '/GuideforBridge',
        component: GuideforBridge,
        name: "GuideforBridge"
      },
      {
        path: '/GuideforWallet',
        component: GuideforWallet,
        name: "GuideforWallet"
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router