import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell() {
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr] bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="min-w-0">
        <TopBar />
        <main className="mx-auto max-w-6xl p-6"><Outlet /></main>
      </div>
    </div>
  )
}