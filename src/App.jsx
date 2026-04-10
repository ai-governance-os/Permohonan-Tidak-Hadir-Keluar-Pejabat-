import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './pages/Login'
import DashboardGuru from './pages/DashboardGuru'
import DashboardAdmin from './pages/DashboardAdmin'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [profil, setProfil] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setProfil(null); return }
    supabase
      .from('profil')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setProfil(data))
  }, [session])

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Memuatkan...</p>
      </div>
    )
  }

  if (!session) return <Login />

  if (!profil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Memuatkan profil...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={
        profil.peranan === 'admin'
          ? <Navigate to="/admin" replace />
          : <Navigate to="/guru" replace />
      } />
      <Route path="/guru" element={
        profil.peranan === 'guru'
          ? <DashboardGuru profil={profil} />
          : <Navigate to="/admin" replace />
      } />
      <Route path="/admin" element={
        profil.peranan === 'admin'
          ? <DashboardAdmin profil={profil} />
          : <Navigate to="/guru" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
