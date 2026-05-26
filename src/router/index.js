import { createRouter, createWebHistory } from 'vue-router'

import { pinia } from '../stores'
import { useAuthStore } from '../stores/auth'
import AcceptInvitationPage from '../views/AcceptInvitationPage.vue'
import AuthCallbackPage from '../views/AuthCallbackPage.vue'
import HomePage from '../views/HomePage.vue'
import NotFoundPage from '../components/NotFoundPage.vue'
import WorkspacePage from '../views/WorkspacePage.vue'
import WorkspaceShowPage from '../views/workspaceshowpage/WorkspaceShowPage.vue'
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
    path: '/invitations/accept',
    name: 'accept-invitation',
    component: AcceptInvitationPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/workspaces',
    name: 'workspaces.index',
    component: WorkspacePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/workspaces/:slug/boards/:boardId',
    name: 'workspace.board.show',
    component: WorkspaceShowPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/workspaces/:slug',
    name: 'workspace.show',
    component: WorkspaceShowPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: WorkspacePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore(pinia)

  if (!authStore.initialized) {
    await authStore.hydrate()
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
