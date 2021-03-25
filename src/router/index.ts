import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import CryptoPunks from '../views/CryptoPunks.vue'
import MoonCats from '../views/MoonCats.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/moon-cats',
    name: 'Moon Cats',
    component: MoonCats,
  },
  {
    path: '/crypto-punks',
    name: 'CryptoPunks',
    component: CryptoPunks,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
