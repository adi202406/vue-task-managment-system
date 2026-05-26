import { api } from '../lib/axios'

export function getCardAssignees(cardId) {
  return api.get(`/cards/${encodeURIComponent(cardId)}/assignees`).then((response) => response.data)
}

export function assignUserToCard(cardId, userId) {
  return api.post(`/cards/${encodeURIComponent(cardId)}/assignees`, { user_id: userId }).then((response) => response.data)
}

export function removeAssigneeFromCard(cardId, userId) {
  return api.delete(`/cards/${encodeURIComponent(cardId)}/assignees/${encodeURIComponent(userId)}`).then((response) => response.data)
}
