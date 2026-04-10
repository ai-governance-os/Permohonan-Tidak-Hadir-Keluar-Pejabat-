import { supabase } from '../supabaseClient'

export default function Navbar({ profil }) {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <div>
        <p className="font-semibold text-sm">Sistem Tidak Hadir</p>
        <p className="text-xs text-blue-200">{profil?.nama} · {profil?.peranan === 'admin' ? 'Admin' : 'Guru'}</p>
      </div>
      <button
        onClick={handleLogout}
        className="text-xs bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded-lg transition"
      >
        Log Keluar
      </button>
    </nav>
  )
}
