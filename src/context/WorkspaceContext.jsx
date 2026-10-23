import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { PLANS } from '@/lib/constants'
import { billing } from '@/billing'
import { useAuth } from '@/context/AuthContext'

const Ctx = createContext(null)

const BASE_WORKSPACES = [
  { id: 'w1', name: 'My first workspace' },
  { id: 'w2', name: 'Client: Fitness brand' },
  { id: 'w3', name: 'Client: Finance channel' },
]

export function WorkspaceProvider({ children }) {
  const { user } = useAuth()
  const [workspaceId, setWorkspaceId] = useState('w1')
  const [plan] = useState(billing.getPlanId())
  const [credits, setCredits] = useState(PLANS[plan].credits)

  const firstName = user?.workspaceName
  const workspaces = useMemo(
    () => BASE_WORKSPACES.map((w) => (w.id === 'w1' && firstName ? { ...w, name: firstName } : w)),
    [firstName]
  )
  const workspace = workspaces.find((w) => w.id === workspaceId)
  const setWorkspace = (w) => setWorkspaceId(w.id)

  // Returns false if the user can't afford it
  const spend = useCallback(
    (amount = 1) => {
      if (credits < amount) return false
      setCredits((c) => c - amount)
      return true
    },
    [credits]
  )

  return (
    <Ctx.Provider
      value={{ workspaces, workspace, setWorkspace, plan, limits: PLANS[plan], credits, spend }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)