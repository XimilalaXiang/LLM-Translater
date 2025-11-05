import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/models',
      name: 'models',
      component: () => import('@/views/ModelsPage.vue')
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('@/views/KnowledgePage.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryPage.vue')
    }
  ]
});

export default router;
