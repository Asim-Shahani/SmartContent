import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/layout/AppShell'
import Dashboard from '@/features/dashboard/Dashboard'
import Discover from '@/features/discover/Discover'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discover" element={<Discover />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}