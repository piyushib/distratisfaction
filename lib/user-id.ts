// Generates and persists an anonymous user ID in localStorage
// Used to let users see their own submissions without a login system

export function getUserId(): string {
  if (typeof window === 'undefined') return 'server'
  const key = 'dopa-user-id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}
