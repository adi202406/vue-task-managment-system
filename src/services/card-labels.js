import { api } from '../lib/axios'

export function attachLabelToCard(cardId, labelId) {
  return api.post('/cards/attach-label', { card_id: cardId, label_id: labelId }).then((response) => response.data)
}

export function detachLabelFromCard(cardId, labelId) {
  return api.post('/cards/detach-label', { card_id: cardId, label_id: labelId }).then((response) => response.data)
}

export function getCardLabels(cardId) {
  return api.get(`/cards/${encodeURIComponent(cardId)}/labels`).then((response) => response.data)
}
