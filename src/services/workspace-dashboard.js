import { api } from '../lib/axios'

function isUploadValue(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob
}

function hasUpload(payload) {
  return Object.values(payload || {}).some(isUploadValue)
}

function toFormData(payload) {
  const formData = new FormData()

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    formData.append(key, value)
  })

  return formData
}

function requestBody(payload) {
  return hasUpload(payload) ? toFormData(payload) : payload
}

export function getWorkspaces() {
  return api.get('/workspaces').then((response) => response.data)
}

export function createWorkspace(payload) {
  return api.post('/workspaces', requestBody(payload)).then((response) => response.data)
}

function workspacePath(workspace) {
  return encodeURIComponent(workspace)
}

export function getWorkspace(workspace) {
  return api.get(`/workspaces/${workspacePath(workspace)}`).then((response) => response.data)
}

export function updateWorkspace(workspace, payload) {
  if (hasUpload(payload)) {
    const formData = toFormData({ ...payload, _method: 'PUT' })
    return api.post(`/workspaces/${workspacePath(workspace)}`, formData).then((response) => response.data)
  }

  return api.put(`/workspaces/${workspacePath(workspace)}`, payload).then((response) => response.data)
}

export function deleteWorkspace(workspace) {
  return api.delete(`/workspaces/${workspacePath(workspace)}`).then((response) => response.data)
}

export function createBoard(workspace, payload) {
  return api.post(`/workspaces/${workspacePath(workspace)}/boards`, payload).then((response) => response.data)
}

export function updateBoard(workspace, boardId, payload) {
  return api.put(`/workspaces/${workspacePath(workspace)}/boards/${encodeURIComponent(boardId)}`, payload).then((response) => response.data)
}

export function reorderBoard(workspace, boardId, payload) {
  return api.patch(`/workspaces/${workspacePath(workspace)}/boards/${encodeURIComponent(boardId)}/reorder`, payload).then((response) => response.data)
}

export function toggleFavoriteBoard(workspace, boardId) {
  return api.patch(`/workspaces/${workspacePath(workspace)}/boards/${boardId}/toggle-favorite`).then((response) => response.data)
}

export function getBoards(workspace) {
  return api.get(`/workspaces/${workspacePath(workspace)}/boards`).then((response) => response.data)
}

function boardPath(boardId) {
  return encodeURIComponent(boardId)
}

function cardBasePath(workspace, boardId) {
  return `/workspaces/${workspacePath(workspace)}/boards/${boardPath(boardId)}/cards`
}

export function getBoardCards(workspace, boardId) {
  return api.get(cardBasePath(workspace, boardId)).then((response) => response.data)
}

export function createCard(workspace, boardId, payload) {
  return api.post(cardBasePath(workspace, boardId), payload).then((response) => response.data)
}

export function getCard(workspace, boardId, cardId) {
  return api.get(`${cardBasePath(workspace, boardId)}/${encodeURIComponent(cardId)}`).then((response) => response.data)
}

export function updateCard(workspace, boardId, cardId, payload) {
  return api.patch(`${cardBasePath(workspace, boardId)}/${encodeURIComponent(cardId)}`, payload).then((response) => response.data)
}

export function deleteCard(workspace, boardId, cardId) {
  return api.delete(`${cardBasePath(workspace, boardId)}/${encodeURIComponent(cardId)}`).then((response) => response.data)
}
