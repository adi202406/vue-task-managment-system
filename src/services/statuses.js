import { api } from '../lib/axios'

function statusBasePath(workspaceSlug, boardId) {
  return `/workspaces/${encodeURIComponent(workspaceSlug)}/boards/${encodeURIComponent(boardId)}/statuses`
}

export function getStatuses(workspaceSlug, boardId) {
  return api.get(statusBasePath(workspaceSlug, boardId)).then((response) => response.data)
}

export function createStatus(workspaceSlug, boardId, payload) {
  return api.post(statusBasePath(workspaceSlug, boardId), payload).then((response) => response.data)
}

export function getStatus(workspaceSlug, boardId, statusId) {
  return api.get(`${statusBasePath(workspaceSlug, boardId)}/${encodeURIComponent(statusId)}`).then((response) => response.data)
}

export function updateStatus(workspaceSlug, boardId, statusId, payload) {
  return api.put(`${statusBasePath(workspaceSlug, boardId)}/${encodeURIComponent(statusId)}`, payload).then((response) => response.data)
}

export function deleteStatus(workspaceSlug, boardId, statusId) {
  return api.delete(`${statusBasePath(workspaceSlug, boardId)}/${encodeURIComponent(statusId)}`).then((response) => response.data)
}
