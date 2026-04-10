import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DashboardGuru from './pages/DashboardGuru'
import DashboardAdmin from './pages/DashboardAdmin'

function bacaSesiAwal() {
  try {
    const saved = localStorage.getItem('sesi_tidak_hadir')
    const parsed = saved ? JSON.parse(saved) : null

    if (!parsed) return null

    if (parsed.peranan === 'admin' && !parsed.token) {
      localStorage.removeItem('sesi_tidak_hadir')
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export default function App() {
  const [sesi, setSesi] = useState(bacaSesiAwal)

  function login(data) {
    localStorage.setItem('sesi_tidak_hadir', JSON.stringify(data))
    setSesi(data)
  }

  function logout() {
    localStorage.removeItem('sesi_tidak_hadir')
    setSesi(null)
  }

  if (!sesi) return <Login onLogin={login} />

  return (
    <Routes>
      <Route
        path="/"
        element={
          sesi.peranan === 'admin'
            ? <Navigate to="/admin" replace />
            : <Navigate to="/guru" replace />
        }
      />
      <Route
        path="/guru"
        element={
          sesi.peranan === 'guru'
            ? <DashboardGuru sesi={sesi} onLogout={logout} />
            : <Navigate to="/admin" replace />
        }
      />
      <Route
        path="/admin"
        element={
          sesi.peranan === 'admin'
            ? <DashboardAdmin sesi={sesi} onLogout={logout} />
            : <Navigate to="/guru" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
