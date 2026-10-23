import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

const Ctx = createContext({ user: null, isLoading: true })

export function AuthProvider({ children }) {
  const { data: user = null, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: () => api.getSession(),
  })
  return <Ctx.Provider value={{ user, isLoading }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)