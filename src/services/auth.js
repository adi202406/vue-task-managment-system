import { api, API_BASE_URL } from '../lib/axios'
import { extractApiMessage } from './api-error'

function pickFirstDefined(values) {
  return values.find((value) => value !== undefined && value !== null && value !== '')
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/auth/google`
}

function parseUserCandidate(value) {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }

  return value
}

export function extractToken(payload) {
  return pickFirstDefined([
    payload?.token,
    payload?.access_token,
    payload?.data?.token,
    payload?.data?.access_token,
    payload?.data?.data?.token,
    payload?.data?.data?.access_token,
  ])
}

export function extractUser(payload) {
  return pickFirstDefined([
    parseUserCandidate(payload?.user),
    parseUserCandidate(payload?.auth_user),
    parseUserCandidate(payload?.data?.user),
    parseUserCandidate(payload?.data?.auth_user),
    parseUserCandidate(payload?.data?.data?.user),
  ])
}

export function extractMessage(payload) {
  return extractApiMessage(payload)
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
