import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RequireAuth({ children, needOnboarded = false }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <p className="p-6 text-gray-500">Loading…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (needOnboarded && !user.onboarded) return <Navigate to="/onboarding" replace />
  return children
}