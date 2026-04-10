const STORAGE_KEY = 'tidak_hadir_permohonan'

function bacaPermohonan() {
  if (typeof window === 'undefined') return []

  try {
    const simpanan = window.localStorage.getItem(STORAGE_KEY)
    const data = simpanan ? JSON.parse(simpanan) : []
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Ralat membaca data tempatan:', err)
    return []
  }
}

function simpanPermohonan(senarai) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(senarai))
}

function susunIkutTerkini(senarai) {
  return [...senarai].sort((a, b) => {
    const masaA = new Date(a.created_at || 0).getTime()
    const masaB = new Date(b.created_at || 0).getTime()
    return masaB - masaA
  })
}

function janaId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `permohonan-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export async function getPermohonan() {
  try {
    return susunIkutTerkini(bacaPermohonan())
  } catch (err) {
    console.error('Ralat mengambil data tempatan:', err)
    return []
  }
}

export async function tambahPermohonan(item) {
  try {
    const capMasa = new Date().toISOString()
    const rekodBaru = {
      id: janaId(),
      created_at: capMasa,
      updated_at: capMasa,
      catatan_admin: '',
      ...item,
    }

    const terkini = [rekodBaru, ...bacaPermohonan()]
    simpanPermohonan(susunIkutTerkini(terkini))

    return { success: true, data: rekodBaru }
  } catch (err) {
    console.error('Ralat menyimpan data tempatan:', err)
    return { success: false, error: err }
  }
}

export async function kemaskiniPermohonan(id, kemaskini) {
  try {
    const capMasa = new Date().toISOString()
    let jumpa = false

    const dikemaskini = bacaPermohonan().map((item) => {
      if (item.id !== id) return item

      jumpa = true
      return {
        ...item,
        ...kemaskini,
        updated_at: capMasa,
      }
    })

    if (!jumpa) {
      return { success: false, error: new Error('Permohonan tidak ditemui.') }
    }

    simpanPermohonan(susunIkutTerkini(dikemaskini))
    return { success: true }
  } catch (err) {
    console.error('Ralat mengemaskini data tempatan:', err)
    return { success: false, error: err }
  }
}
