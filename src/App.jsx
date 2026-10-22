import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WorkspaceProvider } from '@/context/WorkspaceContext'
import { ToastProvider } from '@/components/Toast'
import AppShell from '@/layout/AppShell'
import PagePlaceholder from '@/components/PagePlaceholder'
import Dashboard from '@/features/dashboard/Dashboard'
import Discover from '@/features/discover/Discover'
import Scripts from '@/features/scripts/Scripts'
import Hooks from '@/features/hooks/Hooks'
import Collections from '@/features/collections/Collections'
import CollectionDetail from '@/features/collections/CollectionDetail'
import Settings from '@/features/settings/Settings'

const queryClient = new QueryClient()
const later = ['Channels', 'Ideas', 'Projects']

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/scripts" element={<Scripts />} />
                <Route path="/hooks" element={<Hooks />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:id" element={<CollectionDetail />} />
                <Route path="/settings" element={<Settings />} />
                {later.map((name) => (
                  <Route key={name} path={`/${name.toLowerCase()}`} element={<PagePlaceholder title={name} />} />
                ))}
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </WorkspaceProvider>
    </QueryClientProvider>
  )
}