export function getPocketBaseErrorMessage(error, fallback) {
  const firstMessage = Object.values(error?.response?.data ?? {}).find(
    (value) => typeof value?.message === 'string',
  )

  if (typeof firstMessage?.message === 'string') {
    return firstMessage.message
  }

  return error?.response?.message ?? error?.message ?? fallback
}
