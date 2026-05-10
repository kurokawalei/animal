import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Adopt from './pages/Adopt.vue'
import Story from './pages/Story.vue'
import Care from './pages/Care.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/adopt', component: Adopt },
  { path: '/story', component: Story },
  { path: '/care', component: Care },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
