export function useCardLabels() {
  function cardLabelList(card) {
    const labels = Array.isArray(card?.labels) ? card.labels : []
    return labels.map((label) => ({
      id: label?.id ?? label?.name,
      name: label?.name || label?.title || 'Label',
      color: label?.color || '#3b82f6',
      description: label?.description || '',
    }))
  }

  return { cardLabelList }
}
