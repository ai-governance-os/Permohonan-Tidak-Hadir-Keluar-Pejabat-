import { useState } from 'react'
import { loginAdmin } from '../store'

export default function Login({ onLogin }) {
  const [mod, setMod] = useState(null)
  const [nama, setNama] = useState('')
  const [kataLaluan, setKataLaluan] = useState('')
  const [ralat, setRalat] = useState('')
  const [sedangLogMasuk, setSedangLogMasuk] = useState(false)

  async function handleAdmin(e) {
    e.preventDefault()
    setRalat('')
    setSedangLogMasuk(true)

    try {
      const sesiAdmin = await loginAdmin(kataLaluan)
      onLogin(sesiAdmin)
    } catch (error) {
      setRalat(error.message || 'Log masuk admin gagal.')
    } finally {
      setSedangLogMasuk(false)
    }
  }

  function handleGuru(e) {
    e.preventDefault()
    setRalat('')

    if (!nama.trim()) {
      setRalat('Sila masukkan nama anda.')
      return
    }

    onLogin({ peranan: 'guru', nama: nama.trim() })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 40%, #b45309 100%)' }}
    >
      <div
        className="fixed top-0 left-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #fbbf24, transparent)', transform: 'translate(-30%, -30%)' }}
      />
      <div
        className="fixed bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #fbbf24, transparent)', transform: 'translate(30%, 30%)' }}
      />

      <div className="w-full max-w-sm relative">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div
            className="px-8 pt-8 pb-6 text-center"
            style={{ background: 'linear-gradient(135deg, #7f1d1d, #b45309)' }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                <img src="/logo.jpg" alt="Logo Sekolah" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>

            <h1 className="text-white font-bold text-lg leading-tight">SJK(C) CHUNG HWA BELEMANG</h1>
            <p className="text-red-200 text-xs mt-1">Sistem dalaman permohonan tidak hadir dan keluar pejabat</p>
            <div className="mt-3 w-12 h-0.5 bg-yellow-400 mx-auto rounded-full" />
            <p className="text-yellow-200 text-xs mt-2 font-medium tracking-wide">SISTEM MAKLUMAN RELIEF</p>
          </div>

          <div className="px-8 py-6">
            {!mod && (
              <div className="space-y-3">
                <p className="text-slate-500 text-xs text-center mb-4">Sila pilih peranan anda</p>
                <button
                  onClick={() => {
                    setMod('guru')
                    setRalat('')
                  }}
                  className="w-full text-white font-semibold py-3 rounded-2xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Saya Guru
                </button>

                <button
                  onClick={() => {
                    setMod('admin')
                    setRalat('')
                  }}
                  className="w-full font-semibold py-3 rounded-2xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 border-2"
                  style={{ color: '#7f1d1d', borderColor: '#7f1d1d', background: 'transparent' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin
                </button>
              </div>
            )}

            {mod === 'guru' && (
              <form onSubmit={handleGuru} className="space-y-4">
                <p className="text-slate-600 text-sm font-medium text-center mb-2">Log Masuk sebagai Guru</p>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nama Penuh</label>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="cth: Cikgu Ahmad bin Ali"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {ralat && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">{ralat}</p>}

                <button
                  type="submit"
                  className="w-full text-white font-semibold py-3 rounded-2xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}
                >
                  Masuk
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMod(null)
                    setRalat('')
                  }}
                  className="w-full text-slate-400 text-xs hover:text-slate-600 transition py-1"
                >
                  {'<-'} Kembali
                </button>
              </form>
            )}

            {mod === 'admin' && (
              <form onSubmit={handleAdmin} className="space-y-4">
                <p className="text-slate-600 text-sm font-medium text-center mb-2">Log Masuk sebagai Admin</p>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Kata Laluan</label>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={kataLaluan}
                    onChange={(e) => setKataLaluan(e.target.value)}
                    placeholder="********"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ '--tw-ring-color': '#7f1d1d' }}
                    onFocus={(e) => { e.target.style.borderColor = '#7f1d1d' }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0' }}
                  />
                </div>

                {ralat && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">{ralat}</p>}

                <button
                  type="submit"
                  disabled={sedangLogMasuk}
                  className="w-full text-white font-semibold py-3 rounded-2xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #7f1d1d, #b45309)' }}
                >
                  {sedangLogMasuk ? 'Sedang semak...' : 'Log Masuk'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMod(null)
                    setRalat('')
                    setSedangLogMasuk(false)
                  }}
                  className="w-full text-slate-400 text-xs hover:text-slate-600 transition py-1"
                >
                  {'<-'} Kembali
                </button>
              </form>
            )}
          </div>

          <div className="px-8 pb-6 text-center">
            <p className="text-slate-300 text-xs">(c) 2026 SJK(C) Chung Hwa Belemang</p>
          </div>
        </div>
      </div>
    </div>
  )
}
