import { useState } from 'react'

const KATA_LALUAN_ADMIN = import.meta.env.VITE_ADMIN_PASSWORD || 'CHB9008'

export default function Login({ onLogin }) {
  const [mod, setMod] = useState(null) // 'admin' | 'guru'
  const [nama, setNama] = useState('')
  const [kataLaluan, setKataLaluan] = useState('')
  const [ralat, setRalat] = useState('')

  function handleAdmin(e) {
    e.preventDefault()
    setRalat('')
    if (kataLaluan === KATA_LALUAN_ADMIN) {
      onLogin({ peranan: 'admin', nama: 'Admin' })
    } else {
      setRalat('Kata laluan tidak betul.')
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Sistem Tidak Hadir</h1>
          <p className="text-slate-500 text-sm mt-1">Permohonan Keluar / Tidak Hadir</p>
        </div>

        {!mod && (
          <div className="space-y-3">
            <button
              onClick={() => { setMod('guru'); setRalat('') }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition"
            >
              Saya Guru
            </button>
            <button
              onClick={() => { setMod('admin'); setRalat('') }}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 rounded-xl text-sm transition"
            >
              Admin
            </button>
          </div>
        )}

        {mod === 'guru' && (
          <form onSubmit={handleGuru} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Penuh</label>
              <input
                type="text"
                autoFocus
                required
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="cth: Cikgu Ahmad"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {ralat && <p className="text-red-500 text-sm">{ralat}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition"
            >
              Masuk
            </button>
            <button type="button" onClick={() => { setMod(null); setRalat('') }}
              className="w-full text-slate-400 text-xs hover:text-slate-600 transition">
              Kembali
            </button>
          </form>
        )}

        {mod === 'admin' && (
          <form onSubmit={handleAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kata Laluan Admin</label>
              <input
                type="password"
                autoFocus
                required
                value={kataLaluan}
                onChange={e => setKataLaluan(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {ralat && <p className="text-red-500 text-sm">{ralat}</p>}
            <button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-sm transition"
            >
              Log Masuk
            </button>
            <button type="button" onClick={() => { setMod(null); setRalat('') }}
              className="w-full text-slate-400 text-xs hover:text-slate-600 transition">
              Kembali
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
