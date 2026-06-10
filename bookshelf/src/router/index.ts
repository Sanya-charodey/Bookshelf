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
    meta: { requiresAuth: true },
    component: () => import('../views/ShelfView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return { name: 'Home' }
  }
})

export default router
