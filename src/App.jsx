import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WorkspaceProvider } from '@/context/WorkspaceContext'
import AppShell from '@/layout/AppShell'
import PagePlaceholder from '@/components/PagePlaceholder'
import Dashboard from '@/features/dashboard/Dashboard'
import Discover from '@/features/discover/Discover'

const queryClient = new QueryClient()
const later = ['Channels', 'Ideas', 'Hooks', 'Collections', 'Scripts', 'Projects', 'Settings']

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/discover" element={<Discover />} />
              {later.map((name) => (
                <Route key={name} path={`/${name.toLowerCase()}`} element={<PagePlaceholder title={name} />} />
              ))}
            </Route>
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </QueryClientProvider>
  )
}