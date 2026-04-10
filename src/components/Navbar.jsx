export default function Navbar({ sesi, onLogout }) {
  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <div>
        <p className="font-semibold text-sm">Sistem Tidak Hadir</p>
        <p className="text-xs text-blue-200">
          {sesi?.nama} · {sesi?.peranan === 'admin' ? 'Admin' : 'Guru'}
        </p>
      </div>
      <button
        onClick={onLogout}
        className="text-xs bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded-lg transition"
      >
        Log Keluar
      </button>
    </nav>
  )
}
