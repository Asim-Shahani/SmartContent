import { createContext, useContext, useState, useCallback } from 'react'
import { PLANS, DEFAULT_PLAN } from '@/lib/constants'

const Ctx = createContext(null)

const WORKSPACES = [
  { id: 'w1', name: 'My first workspace' },
  { id: 'w2', name: 'Client: Fitness brand' },
  { id: 'w3', name: 'Client: Finance channel' },
]

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace] = useState(WORKSPACES[0])
  const [plan] = useState(DEFAULT_PLAN)
  const [credits, setCredits] = useState(PLANS[DEFAULT_PLAN].credits)

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
      value={{ workspaces: WORKSPACES, workspace, setWorkspace, plan, limits: PLANS[plan], credits, spend }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)