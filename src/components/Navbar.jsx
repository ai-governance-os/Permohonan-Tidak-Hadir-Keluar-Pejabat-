export default function Navbar({ sesi, onLogout }) {
  return (
    <nav className="text-white px-6 py-3 flex items-center justify-between shadow-lg"
      style={{ background: 'linear-gradient(135deg, #7f1d1d, #b45309)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex-shrink-0">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">SJK(C) CHUNG HWA BELEMANG</p>
          <p className="text-red-200 text-xs">
            {sesi?.nama}
            <span className="mx-1.5">·</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
              {sesi?.peranan === 'admin' ? 'Admin' : 'Guru'}
            </span>
          </p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="text-xs bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200 font-medium flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Log Keluar
      </button>
    </nav>
  )
}
