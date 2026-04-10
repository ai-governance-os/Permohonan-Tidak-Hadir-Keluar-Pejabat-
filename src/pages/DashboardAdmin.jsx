import { useEffect, useState } from 'react'
import { getPermohonan, kemaskiniPermohonan } from '../store'
import Navbar from '../components/Navbar'
import BadgeStatus from '../components/BadgeStatus'

export default function DashboardAdmin({ sesi, onLogout }) {
  const [senarai, setSenarai] = useState([])
  const [filterTarikh, setFilterTarikh] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [catatanEdit, setCatatanEdit] = useState({})
  const [bukaTindakan, setBukaTindakan] = useState(null)

  useEffect(() => { muatSemua() }, [])

  async function muatSemua() {
    setSenarai(await getPermohonan())
  }

  function senaraiTertapis() {
    return senarai.filter(item => {
      if (filterStatus && item.status !== filterStatus) return false
      if (filterTarikh) {
        if (item.tarikh_mula > filterTarikh || item.tarikh_tamat < filterTarikh) return false
      }
      return true
    })
  }

  async function kemaskiniStatus(id, status) {
    const catatan = catatanEdit[id] || ''
    await kemaskiniPermohonan(id, { status, catatan_admin: catatan })
    setBukaTindakan(null)
    await muatSemua()
  }

  function formatTarikh(tarikh) {
    if (!tarikh) return '-'
    return new Date(tarikh + 'T00:00:00').toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const papar = senaraiTertapis()

  const stats = {
    jumlah: senarai.length,
    menunggu: senarai.filter(s => s.status === 'menunggu').length,
    diluluskan: senarai.filter(s => s.status === 'diluluskan').length,
    ditolak: senarai.filter(s => s.status === 'ditolak').length,
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar sesi={sesi} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-800">Panel Admin</h2>
          <p className="text-slate-500 text-sm mt-0.5">Semua permohonan tidak hadir guru</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Jumlah', nilai: stats.jumlah, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', bg: 'from-slate-700 to-slate-800' },
            { label: 'Menunggu', nilai: stats.menunggu, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'from-amber-500 to-orange-500' },
            { label: 'Diluluskan', nilai: stats.diluluskan, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'from-emerald-500 to-green-600' },
            { label: 'Ditolak', nilai: stats.ditolak, icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'from-red-500 to-red-700' },
          ].map(s => (
            <div key={s.label}
              className={`bg-gradient-to-br ${s.bg} rounded-2xl p-4 text-white shadow-md`}>
              <svg className="w-5 h-5 opacity-80 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
              </svg>
              <p className="text-2xl font-bold">{s.nilai}</p>
              <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Tapis Permohonan</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <p className="text-xs text-slate-500 mb-1">Tarikh</p>
              <input type="date" value={filterTarikh} onChange={e => setFilterTarikh(e.target.value)}
                className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 transition-colors bg-slate-50" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 transition-colors bg-slate-50">
                <option value="">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="diluluskan">Diluluskan</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
            {(filterTarikh || filterStatus) && (
              <button onClick={() => { setFilterTarikh(''); setFilterStatus('') }}
                className="text-slate-500 hover:text-slate-700 text-sm px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Senarai */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            {papar.length} Permohonan
          </p>

          {papar.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-slate-400 text-sm">Tiada permohonan ditemui.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {papar.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100"
                    style={{ background: 'linear-gradient(135deg, #fef2f2, #fffbeb)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7f1d1d, #b45309)' }}>
                        {item.guru_nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{item.guru_nama}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(item.created_at).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <BadgeStatus status={item.status} />
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-3">
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-xs text-slate-400 mb-0.5">Tarikh</p>
                        <p className="text-xs font-semibold text-slate-700">
                          {formatTarikh(item.tarikh_mula)}
                          {item.tarikh_tamat !== item.tarikh_mula && <><br />{formatTarikh(item.tarikh_tamat)}</>}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-xs text-slate-400 mb-0.5">Masa Ganti</p>
                        <p className="text-xs font-semibold text-slate-700">{item.masa_mula}<br />{item.masa_tamat}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-xs text-slate-400 mb-0.5">Kelas</p>
                        <p className="text-xs font-semibold text-slate-700">{item.kelas}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2">{item.sebab}</p>

                    {item.catatan_admin && item.status !== 'menunggu' && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-2">
                        <span className="font-semibold">Catatan:</span> {item.catatan_admin}
                      </p>
                    )}
                  </div>

                  {/* Tindakan */}
                  {item.status === 'menunggu' && (
                    <div className="px-5 pb-4">
                      {bukaTindakan === item.id ? (
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          <textarea rows={2} placeholder="Catatan (pilihan)..."
                            value={catatanEdit[item.id] || ''}
                            onChange={e => setCatatanEdit(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 resize-none bg-slate-50" />
                          <div className="flex gap-2">
                            <button onClick={() => kemaskiniStatus(item.id, 'diluluskan')}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs px-4 py-2 rounded-xl transition-all font-medium shadow-sm">
                              Luluskan
                            </button>
                            <button onClick={() => kemaskiniStatus(item.id, 'ditolak')}
                              className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-xs px-4 py-2 rounded-xl transition-all font-medium shadow-sm">
                              Tolak
                            </button>
                            <button onClick={() => setBukaTindakan(null)}
                              className="text-slate-400 hover:text-slate-600 text-xs px-3 py-2 rounded-xl border border-slate-200 transition-colors">
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setBukaTindakan(item.id)}
                          className="w-full border-2 text-sm font-medium py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                          style={{ borderColor: '#7f1d1d', color: '#7f1d1d' }}>
                          Ambil Tindakan
                        </button>
                      )}
                    </div>
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
