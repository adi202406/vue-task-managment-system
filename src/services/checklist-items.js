import { api } from '../lib/axios'

export function getChecklistItems(checklistId) {
  return api.get(`/checklists/${encodeURIComponent(checklistId)}/items`).then((response) => response.data)
}

export function createChecklistItem(checklistId, payload) {
  return api.post(`/checklists/${encodeURIComponent(checklistId)}/items`, payload).then((response) => response.data)
}

export function getChecklistItem(checklistId, itemId) {
  return api.get(`/checklists/${encodeURIComponent(checklistId)}/items/${encodeURIComponent(itemId)}`).then((response) => response.data)
}

export function updateChecklistItem(checklistId, itemId, payload) {
  return api.put(`/checklists/${encodeURIComponent(checklistId)}/items/${encodeURIComponent(itemId)}`, payload).then((response) => response.data)
}

export function deleteChecklistItem(checklistId, itemId) {
  return api.delete(`/checklists/${encodeURIComponent(checklistId)}/items/${encodeURIComponent(itemId)}`).then((response) => response.data)
}

export function bulkUpdateChecklistItems(checklistId, items) {
  return api.put(`/checklists/${encodeURIComponent(checklistId)}/items`, { items }).then((response) => response.data)
}
