export async function api(path, token, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...options,
  })
  if (options.method === 'DELETE') return null
  if (res.status === 401) throw new Error('unauthorized')
  return res.json()
}
