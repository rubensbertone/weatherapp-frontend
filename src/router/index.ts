import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/favorite-locations',
      name: 'favorite-locations',
      component: () => import('../views/FavoriteLocationsView.vue'),
    },
  ],
})

export default router
