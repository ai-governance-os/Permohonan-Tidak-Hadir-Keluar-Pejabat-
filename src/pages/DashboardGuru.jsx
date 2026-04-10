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

function InputLabel({ children }) {
  return <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{children}</label>
}

function InputField({ type = 'text', ...props }) {
  return (
    <input
      type={type}
      {...props}
      className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
    />
  )
}

export default function DashboardGuru({ sesi, onLogout }) {
  const [senarai, setSenarai] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [ralat, setRalat] = useState('')
  const [berjaya, setBerjaya] = useState(false)
  const [muatSenarai, setMuatSenarai] = useState(false)
  const [tabAktif, setTabAktif] = useState('borang')

  useEffect(() => { fetchSenarai() }, [])

  async function fetchSenarai() {
    setMuatSenarai(true)
    const { data } = await supabase
      .from('permohonan')
      .select('*')
      .eq('guru_nama', sesi.nama)
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
      guru_nama: sesi.nama,
      ...form,
      status: 'menunggu',
    })

    if (error) {
      setRalat('Gagal hantar permohonan. Pastikan Supabase telah dikonfigurasi.')
    } else {
      setBerjaya(true)
      setForm(defaultForm)
      fetchSenarai()
      setTimeout(() => { setTabAktif('senarai') }, 1500)
    }
    setLoading(false)
  }

  function formatTarikh(tarikh) {
    if (!tarikh) return '-'
    return new Date(tarikh + 'T00:00:00').toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const statusCount = {
    menunggu: senarai.filter(s => s.status === 'menunggu').length,
    diluluskan: senarai.filter(s => s.status === 'diluluskan').length,
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar sesi={sesi} onLogout={onLogout} />

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Greeting */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">Selamat datang, {sesi.nama}</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {statusCount.menunggu > 0
              ? `${statusCount.menunggu} permohonan sedang menunggu kelulusan`
              : 'Tiada permohonan menunggu'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1 rounded-2xl shadow-sm mb-5">
          {[
            { key: 'borang', label: 'Borang Baru', icon: 'M12 4v16m8-8H4' },
            { key: 'senarai', label: `Permohonan Saya (${senarai.length})`, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setTabAktif(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tabAktif === tab.key
                  ? 'text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              style={tabAktif === tab.key ? { background: 'linear-gradient(135deg, #7f1d1d, #b45309)' } : {}}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Borang */}
        {tabAktif === 'borang' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100"
              style={{ background: 'linear-gradient(135deg, #fef2f2, #fffbeb)' }}>
              <h3 className="font-semibold text-slate-800">Borang Permohonan Tidak Hadir</h3>
              <p className="text-xs text-slate-500 mt-0.5">Isi maklumat dengan lengkap dan tepat</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <InputLabel>Tempoh Tidak Hadir</InputLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Tarikh Mula</p>
                      <InputField type="date" name="tarikh_mula" required value={form.tarikh_mula} onChange={handleChange} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Tarikh Tamat</p>
                      <InputField type="date" name="tarikh_tamat" required value={form.tarikh_tamat} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div>
                  <InputLabel>Masa Perlu Cari Ganti</InputLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Masa Mula</p>
                      <InputField type="time" name="masa_mula" required value={form.masa_mula} onChange={handleChange} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Masa Tamat</p>
                      <InputField type="time" name="masa_tamat" required value={form.masa_tamat} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div>
                  <InputLabel>Kelas yang Terjejas</InputLabel>
                  <InputField type="text" name="kelas" required value={form.kelas} onChange={handleChange}
                    placeholder="cth: 4 Amanah, 5 Bestari" />
                </div>

                <div>
                  <InputLabel>Sebab Ketidakhadiran</InputLabel>
                  <textarea name="sebab" required value={form.sebab} onChange={handleChange} rows={3}
                    placeholder="Nyatakan sebab dengan jelas..."
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white resize-none" />
                </div>

                {ralat && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-600 text-sm">{ralat}</p>
                  </div>
                )}
                {berjaya && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700 text-sm font-medium">Permohonan berjaya dihantar!</p>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #7f1d1d, #b45309)' }}>
                  {loading ? 'Menghantar...' : 'Hantar Permohonan'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Senarai */}
        {tabAktif === 'senarai' && (
          <div className="space-y-3">
            {muatSenarai ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <p className="text-slate-400 text-sm">Memuatkan...</p>
              </div>
            ) : senarai.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-slate-400 text-sm">Tiada permohonan lagi.</p>
              </div>
            ) : (
              senarai.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100"
                    style={{ background: 'linear-gradient(135deg, #fef2f2, #fffbeb)' }}>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-semibold text-slate-700">
                        {formatTarikh(item.tarikh_mula)}
                        {item.tarikh_tamat !== item.tarikh_mula && ` – ${formatTarikh(item.tarikh_tamat)}`}
                      </p>
                    </div>
                    <BadgeStatus status={item.status} />
                  </div>
                  <div className="px-5 py-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.masa_mula} – {item.masa_tamat}
                      <span className="mx-1 text-slate-300">|</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {item.kelas}
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{item.sebab}</p>
                    {item.catatan_admin && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <span className="font-semibold">Catatan Admin:</span> {item.catatan_admin}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
