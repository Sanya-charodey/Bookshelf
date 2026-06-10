import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/book/:id',
    name: 'Book',
    component: () => import('../views/BookView.vue'),
  },
  {
    path: '/shelf',
    name: 'Shelf',
    component: () => import('../views/ShelfView.vue'),
    beforeEnter: () => {
      const auth = useAuthStore()
      if (!auth.isAuthenticated) return { name: 'Home' }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
