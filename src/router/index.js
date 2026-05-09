import { createRouter, createWebHistory } from 'vue-router'

import { pinia } from '../stores'
import { useAuthStore } from '../stores/auth'
import AuthCallbackPage from '../views/AuthCallbackPage.vue'
import HomePage from '../views/HomePage.vue'
import WorkspacePage from '../views/WorkspacePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

const routes = [
  {
    path: '/',
    component: HomePage,
    meta: { guestOnly: true },
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    component: RegisterPage,
    meta: { guestOnly: true },
  },
  {
    path: '/auth/callback',
    component: AuthCallbackPage,
  },
  {
    path: '/workspaces',
    component: WorkspacePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    redirect: '/workspaces',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia)

  if (!authStore.initialized) {
    authStore.hydrate()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/workspaces'
  }
})

export default router
