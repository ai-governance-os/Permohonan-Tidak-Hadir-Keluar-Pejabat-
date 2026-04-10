function binaUrl(path, params = {}) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  })

  const query = search.toString()
  return query ? `${path}?${query}` : path
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(payload?.error || 'Permintaan gagal diproses.')
    error.status = response.status
    throw error
  }

  return payload
}

export async function loginAdmin(kataLaluan) {
  const payload = await request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ password: kataLaluan }),
  })

  return payload.data
}

export async function getPermohonan({ guruNama, token } = {}) {
  const payload = await request(
    binaUrl('/api/permohonan', { guru_nama: guruNama }),
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  )

  return payload.data || []
}

export async function tambahPermohonan(item) {
  const payload = await request('/api/permohonan', {
    method: 'POST',
    body: JSON.stringify(item),
  })

  return { success: true, data: payload.data }
}

export async function kemaskiniPermohonan(id, kemaskini, token) {
  const payload = await request(
    binaUrl('/api/permohonan', { id }),
    {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(kemaskini),
    },
  )

  return { success: true, data: payload.data }
}
