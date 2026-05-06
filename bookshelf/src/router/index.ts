import { createRouter, createWebHistory } from 'vue-router'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
