import { defineStore } from 'pinia'

import {
  fetchCsrfCookie,
  fetchUser as fetchUserApi,
  getWorkspaces,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/auth'
import { useWorkspaceDashboardStore } from './workspaceDashboard'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },

  actions: {
    async hydrate() {
      try {
        const data = await fetchUserApi()
        this.user = data?.user ?? data
      } catch {
        this.user = null
      } finally {
        this.initialized = true
      }
    },

    async login(credentials) {
      await fetchCsrfCookie()
      await loginRequest(credentials)
      await this.fetchUser()
    },

    async register(payload) {
      const response = await registerRequest(payload)
      await this.fetchUser()
      return response
    },

    async fetchUser() {
      try {
        const data = await fetchUserApi()
        this.user = data?.user ?? data
      } catch {
        this.user = null
      }
    },

    async logout() {
      try {
        await logoutRequest()
      } catch {
        // ignore
      }

      this.user = null
      this.initialized = true

      useWorkspaceDashboardStore().reset()
    },

    updateUser(user) {
      this.user = user
    },

    async loadWorkspaces() {
      return getWorkspaces()
    },
  },
})
