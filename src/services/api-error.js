function pickFirstDefined(values) {
  return values.find((value) => value !== undefined && value !== null && value !== '')
}

export function extractApiMessage(payload) {
  return pickFirstDefined([
    payload?.message,
    payload?.data?.message,
    payload?.error,
    payload?.errors && Object.values(payload.errors).flat().join(' '),
  ])
}

export function normalizeApiError(error) {
  const payload = error?.response?.data
  const message =
    typeof payload === 'string'
      ? payload
      : extractApiMessage(payload) || error?.message || 'Request gagal. Silakan coba lagi.'

  const normalizedError = new Error(message)
  normalizedError.status = error?.response?.status
  normalizedError.payload = payload

  return normalizedError
}
