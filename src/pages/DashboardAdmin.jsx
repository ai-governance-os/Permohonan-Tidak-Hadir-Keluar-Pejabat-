import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'
import BadgeStatus from '../components/BadgeStatus'

export default function DashboardAdmin({ profil }) {
  const [senarai, setSenarai] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterTarikh, setFilterTarikh] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [catatanEdit, setCatatanEdit] = useState({})

  useEffect(() => {
    fetchSemua()
  }, [])

  async function fetchSemua() {
    setLoading(true)
    let query = supabase
      .from('permohonan')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterTarikh) {
      query = query.lte('tarikh_mula', filterTarikh).gte('tarikh_tamat', filterTarikh)
    }
    if (filterStatus) {
      query = query.eq('status', filterStatus)
    }

    const { data } = await query
    setSenarai(data || [])
    setLoading(false)
  }

  async function kemaskiniStatus(id, status) {
    const catatan = catatanEdit[id] || ''
    await supabase
      .from('permohonan')
      .update({ status, catatan_admin: catatan })
      .eq('id', id)
    fetchSemua()
  }

  function formatTarikh(tarikh) {
    if (!tarikh) return '-'
    return new Date(tarikh).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const stats = {
    jumlah: senarai.length,
    menunggu: senarai.filter(s => s.status === 'menunggu').length,
    diluluskan: senarai.filter(s => s.status === 'diluluskan').length,
    ditolak: senarai.filter(s => s.status === 'ditolak').length,
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar profil={profil} />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Statistik */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Jumlah', nilai: stats.jumlah, warna: 'text-slate-700' },
            { label: 'Menunggu', nilai: stats.menunggu, warna: 'text-yellow-600' },
            { label: 'Diluluskan', nilai: stats.diluluskan, warna: 'text-green-600' },
            { label: 'Ditolak', nilai: stats.ditolak, warna: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${s.warna}`}>{s.nilai}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tapis Tarikh</label>
            <input
              type="date"
              value={filterTarikh}
              onChange={e => setFilterTarikh(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tapis Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              <option value="menunggu">Menunggu</option>
              <option value="diluluskan">Diluluskan</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
          <button
            onClick={fetchSemua}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
          >
            Cari
          </button>
          {(filterTarikh || filterStatus) && (
            <button
              onClick={() => { setFilterTarikh(''); setFilterStatus(''); }}
              className="text-slate-500 hover:text-slate-700 text-sm px-3 py-1.5 rounded-lg border border-slate-300 transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Senarai */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 text-lg mb-4">Semua Permohonan</h2>

          {loading ? (
            <p className="text-slate-400 text-sm text-center py-6">Memuatkan...</p>
          ) : senarai.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">Tiada permohonan ditemui.</p>
          ) : (
            <div className="space-y-4">
              {senarai.map(item => (
                <div key={item.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-slate-800">{item.guru_nama}</p>
                        <BadgeStatus status={item.status} />
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {formatTarikh(item.tarikh_mula)}
                        {item.tarikh_tamat !== item.tarikh_mula && ` – ${formatTarikh(item.tarikh_tamat)}`}
                        {' '}&middot; {item.masa_mula} – {item.masa_tamat}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Kelas: {item.kelas}</p>
                      <p className="text-xs text-slate-600 mt-1 bg-slate-50 rounded px-2 py-1">{item.sebab}</p>
                    </div>
                  </div>

                  {/* Tindakan Admin */}
                  {item.status === 'menunggu' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Catatan admin (pilihan)..."
                        value={catatanEdit[item.id] || ''}
                        onChange={e => setCatatanEdit(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => kemaskiniStatus(item.id, 'diluluskan')}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1.5 rounded-lg transition"
                        >
                          Luluskan
                        </button>
                        <button
                          onClick={() => kemaskiniStatus(item.id, 'ditolak')}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-lg transition"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  )}

                  {item.catatan_admin && item.status !== 'menunggu' && (
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mt-2">
                      <span className="font-medium">Catatan:</span> {item.catatan_admin}
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
