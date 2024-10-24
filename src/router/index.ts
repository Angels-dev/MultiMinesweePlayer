import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
      children: [
        {
          path: 'solo',
          name: 'solo',
          component: () => import('@/views/Game/SoloView.vue')
        },
        {
          path: 'party',
          name: 'party',
          component: () => import('@/views/Game/PartyView.vue')
        }
      ]
    }
  ]
})

export default router
