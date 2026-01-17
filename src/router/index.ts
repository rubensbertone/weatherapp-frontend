import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history:  createWebHistory(import.meta. env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/weather/: city',
      name: 'weather',
      component: () => import('@/views/WeatherDetailView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path:  '/favoriteLocations',
      name: 'favoriteLocations',
      component: () => import('@/views/FavoriteLocationsView.vue')
    }
  ]
})

export default router
