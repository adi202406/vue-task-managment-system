import { api } from '../lib/axios'

export function getLabels(workspaceSlug) {
  return api.get(`/workspaces/${encodeURIComponent(workspaceSlug)}/labels`).then((response) => response.data)
}

export function createLabel(workspaceSlug, payload) {
  return api.post(`/workspaces/${encodeURIComponent(workspaceSlug)}/labels`, payload).then((response) => response.data)
}

export function updateLabel(workspaceSlug, labelId, payload) {
  return api.put(`/workspaces/${encodeURIComponent(workspaceSlug)}/labels/${encodeURIComponent(labelId)}`, payload).then((response) => response.data)
}

export function deleteLabel(workspaceSlug, labelId) {
  return api.delete(`/workspaces/${encodeURIComponent(workspaceSlug)}/labels/${encodeURIComponent(labelId)}`).then((response) => response.data)
}
