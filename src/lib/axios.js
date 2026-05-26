import axios from 'axios'

import { normalizeApiError } from '../services/api-error'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const APP_BASE_URL = API_BASE_URL.replace(/\/api$/, '')
const CSRF_METHODS = new Set(['post', 'put', 'patch', 'delete'])

let csrfRequest = null

export function fetchCsrfCookie() {
  csrfRequest ??= axios
    .get(`${APP_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
      withXSRFToken: true,
      headers: {
        Accept: 'application/json',
      },
    })
    .finally(() => {
      csrfRequest = null
    })

  return csrfRequest
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase()

  if (CSRF_METHODS.has(method)) {
    try {
      await fetchCsrfCookie()
    } catch {
      // CSRF cookie gagal, lanjutkan request
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(normalizeApiError(error))
  }
)

export { API_BASE_URL, APP_BASE_URL }
