import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WorkspaceProvider } from '@/context/WorkspaceContext'
import { ToastProvider } from '@/components/Toast'
import AppShell from '@/layout/AppShell'
import Dashboard from '@/features/dashboard/Dashboard'
import Discover from '@/features/discover/Discover'
import Channels from '@/features/channels/Channels'
import Ideas from '@/features/ideas/Ideas'
import Scripts from '@/features/scripts/Scripts'
import Hooks from '@/features/hooks/Hooks'
import Collections from '@/features/collections/Collections'
import CollectionDetail from '@/features/collections/CollectionDetail'
import Projects from '@/features/projects/Projects'
import ProjectDetail from '@/features/projects/ProjectDetail'
import Settings from '@/features/settings/Settings'

const queryClient = new QueryClient()

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
                <Route path="/channels" element={<Channels />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/scripts" element={<Scripts />} />
                <Route path="/hooks" element={<Hooks />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:id" element={<CollectionDetail />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </WorkspaceProvider>
    </QueryClientProvider>
  )
}