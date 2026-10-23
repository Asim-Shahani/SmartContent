import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { useAuth } from '@/context/AuthContext'
import { useCredits } from '@/hooks/useCredits'
import Button from '@/components/Button'

export default function TopBar() {
  const { credits } = useCredits()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const logout = async () => {
    await api.logOut()
    queryClient.setQueryData(['session'], null)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
      <input
        type="search"
        aria-label="Search"
        placeholder="Search videos, hooks, collections"
        className="w-full max-w-md rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
      />
      <span className="ml-auto whitespace-nowrap rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700">
        {credits} credits left
      </span>
      {user && <span className="hidden text-sm text-gray-500 md:inline">{user.email}</span>}
      <Button variant="secondary" onClick={logout}>Log out</Button>
    </header>
  )
}