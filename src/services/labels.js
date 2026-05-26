import { api } from '../lib/axios'

export function getLabels() {
  return api.get('/labels').then((response) => response.data)
}

export function createLabel(payload) {
  return api.post('/labels', payload).then((response) => response.data)
}

export function updateLabel(labelId, payload) {
  return api.put(`/labels/${encodeURIComponent(labelId)}`, payload).then((response) => response.data)
}

export function deleteLabel(labelId) {
  return api.delete(`/labels/${encodeURIComponent(labelId)}`).then((response) => response.data)
}
