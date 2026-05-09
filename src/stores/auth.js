import { defineStore } from 'pinia'

import {
  extractToken,
  extractUser,
  getWorkspaces,
  login as loginRequest,
  register as registerRequest,
} from '../services/auth'
import { clearAuthSession, getStoredToken, getStoredUser, persistAuthSession } from '../services/auth-storage'

function parseRememberPreference(value, fallback = true) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return !['false', '0', 'no'].includes(value.toLowerCase())
  }

  return fallback
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getStoredToken(),
    user: getStoredUser(),
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    hydrate() {
      this.token = getStoredToken()
      this.user = getStoredUser()
      this.initialized = true
    },

    applySession({ token, user }, remember = true) {
      persistAuthSession({ token, user }, remember)
      this.token = token || null
      this.user = user || null
      this.initialized = true
    },

    captureTokenLogin(payload, remember = true) {
      const token = extractToken(payload)

      if (!token) {
        throw new Error('Token login tidak ditemukan.')
      }

      this.applySession(
        {
          token,
          user: extractUser(payload),
        },
        parseRememberPreference(remember)
      )
    },

    async login(credentials) {
      const payload = await loginRequest(credentials)
      this.captureTokenLogin(payload, credentials?.remember ?? true)
      return payload
    },

    async register(payload, remember = true) {
      const response = await registerRequest(payload)

      if (extractToken(response)) {
        this.captureTokenLogin(response, remember)
      }

      return response
    },

    async loadWorkspaces() {
      return getWorkspaces()
    },

    logout() {
      clearAuthSession()
      this.token = null
      this.user = null
      this.initialized = true
    },
  },
})
