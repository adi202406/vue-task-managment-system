import { api } from '../lib/axios'

/**
 * Ambil data profile user yang sedang login.
 */
export function getProfile() {
  return api.get('/auth/profile').then((r) => r.data)
}

/**
 * Update data profile (name, email, avatar).
 * Menggunakan FormData karena ada file upload (avatar).
 * Laravel method spoofing via _method=PUT.
 */
export function updateProfile(payload) {
  const form = new FormData()
  form.append('_method', 'PUT')
  if (payload.name !== undefined) form.append('name', payload.name)
  if (payload.email !== undefined) form.append('email', payload.email)
  if (payload.avatar instanceof File) form.append('avatar', payload.avatar)

  // POST dengan _method spoofing agar Laravel membacanya sebagai PUT
  return api.post('/auth/profile', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

/**
 * Update password user (hanya untuk user non-OAuth).
 */
export function updatePassword(payload) {
  return api.put('/auth/profile/password', payload).then((r) => r.data)
}
