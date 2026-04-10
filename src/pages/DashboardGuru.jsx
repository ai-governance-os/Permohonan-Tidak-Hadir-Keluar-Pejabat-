import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'
import BadgeStatus from '../components/BadgeStatus'

const defaultForm = {
  tarikh_mula: '',
  tarikh_tamat: '',
  masa_mula: '',
  masa_tamat: '',
  kelas: '',
  sebab: '',
}

export default function DashboardGuru({ profil }) {
  const [senarai, setSenarai] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [ralat, setRalat] = useState('')
  const [berjaya, setBerjaya] = useState(false)
  const [muatSenarai, setMuatSenarai] = useState(false)

  useEffect(() => {
    fetchSenarai()
  }, [])

  async function fetchSenarai() {
    setMuatSenarai(true)
    const { data } = await supabase
      .from('permohonan')
      .select('*')
      .eq('guru_id', profil.id)
      .order('created_at', { ascending: false })
    setSenarai(data || [])
    setMuatSenarai(false)
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setRalat('')
    setBerjaya(false)

    if (form.tarikh_tamat < form.tarikh_mula) {
      setRalat('Tarikh tamat tidak boleh lebih awal daripada tarikh mula.')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('permohonan').insert({
      guru_id: profil.id,
      guru_nama: profil.nama,
      ...form,
      status: 'menunggu',
    })

    if (error) {
      setRalat('Gagal hantar permohonan. Sila cuba lagi.')
    } else {
      setBerjaya(true)
      setForm(defaultForm)
      fetchSenarai()
    }
    setLoading(false)
  }

  function formatTarikh(tarikh) {
    if (!tarikh) return '-'
    const d = new Date(tarikh)
    return d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar profil={profil} />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Borang */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 text-lg mb-4">Borang Permohonan Tidak Hadir</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarikh Mula</label>
                <input
                  type="date"
                  name="tarikh_mula"
                  required
                  value={form.tarikh_mula}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarikh Tamat</label>
                <input
                  type="date"
                  name="tarikh_tamat"
                  required
                  value={form.tarikh_tamat}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Masa Mula (Waktu Ganti)</label>
                <input
                  type="time"
                  name="masa_mula"
                  required
                  value={form.masa_mula}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Masa Tamat (Waktu Ganti)</label>
                <input
                  type="time"
                  name="masa_tamat"
                  required
                  value={form.masa_tamat}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kelas yang Terjejas</label>
              <input
                type="text"
                name="kelas"
                required
                value={form.kelas}
                onChange={handleChange}
                placeholder="cth: 4 Amanah, 5 Bestari"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sebab Ketidakhadiran</label>
              <textarea
                name="sebab"
                required
                value={form.sebab}
                onChange={handleChange}
                rows={3}
                placeholder="Nyatakan sebab dengan jelas..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {ralat && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{ralat}</p>
            )}
            {berjaya && (
              <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                Permohonan berjaya dihantar!
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 rounded-lg text-sm transition"
            >
              {loading ? 'Menghantar...' : 'Hantar Permohonan'}
            </button>
          </form>
        </div>

        {/* Senarai Permohonan */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 text-lg mb-4">Permohonan Saya</h2>

          {muatSenarai ? (
            <p className="text-slate-400 text-sm text-center py-4">Memuatkan...</p>
          ) : senarai.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Tiada permohonan lagi.</p>
          ) : (
            <div className="space-y-3">
              {senarai.map(item => (
                <div key={item.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {formatTarikh(item.tarikh_mula)}
                        {item.tarikh_tamat !== item.tarikh_mula && ` – ${formatTarikh(item.tarikh_tamat)}`}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.masa_mula} – {item.masa_tamat} · {item.kelas}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{item.sebab}</p>
                    </div>
                    <BadgeStatus status={item.status} />
                  </div>
                  {item.catatan_admin && (
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mt-2">
                      <span className="font-medium">Catatan Admin:</span> {item.catatan_admin}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
