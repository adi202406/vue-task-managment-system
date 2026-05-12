import axios from 'axios'

import { api, APP_BASE_URL } from '../lib/axios'

export function getApiBaseUrl() {
  return APP_BASE_URL
}

export function getGoogleAuthUrl() {
  return `${APP_BASE_URL}/api/auth/google`
}

export function login(payload) {
  return api.post('/auth/login', payload).then((response) => response.data)
}

export function register(payload) {
  return api.post('/auth/register', payload).then((response) => response.data)
}

export function getWorkspaces() {
  return api.get('/workspaces').then((response) => response.data)
}

export function logout() {
  return api.post('/auth/logout').then((response) => response.data)
}

export function fetchUser() {
  return api.get('/user').then((response) => response.data)
}

export function fetchCsrfCookie() {
  return axios.get(`${APP_BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })
}
