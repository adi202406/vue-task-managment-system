import { api } from '../lib/axios'

export function getChecklists() {
  return api.get('/checklists').then((response) => response.data)
}

export function createChecklist(payload) {
  return api.post('/checklists', payload).then((response) => response.data)
}

export function getChecklist(checklistId) {
  return api.get(`/checklists/${encodeURIComponent(checklistId)}`).then((response) => response.data)
}

export function updateChecklist(checklistId, payload) {
  return api.put(`/checklists/${encodeURIComponent(checklistId)}`, payload).then((response) => response.data)
}

export function deleteChecklist(checklistId) {
  return api.delete(`/checklists/${encodeURIComponent(checklistId)}`).then((response) => response.data)
}

export function updateChecklistPosition(checklistId, position) {
  return api.put(`/checklists/${encodeURIComponent(checklistId)}/position/${encodeURIComponent(position)}`).then((response) => response.data)
}
