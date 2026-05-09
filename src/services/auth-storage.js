const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

function parseStoredUser(value) {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function getSessionStorage(remember = true) {
  return remember ? localStorage : sessionStorage
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredUser() {
  return parseStoredUser(localStorage.getItem(AUTH_USER_KEY))
    || parseStoredUser(sessionStorage.getItem(AUTH_USER_KEY))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
}

export function persistAuthSession({ token, user }, remember = true) {
  clearAuthSession()

  const storage = getSessionStorage(remember)

  if (token) {
    storage.setItem(AUTH_TOKEN_KEY, token)
  }

  if (user) {
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  }
}
