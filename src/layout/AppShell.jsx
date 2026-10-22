import { NavLink, Outlet } from 'react-router-dom'

const links = [['Dashboard', '/dashboard'], ['Discover', '/discover']]

export default function AppShell() {
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="border-r p-4">
        <div className="mb-4 text-lg font-bold">Smart Content</div>
        <nav className="flex flex-col gap-1">
          {links.map(([name, to]) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `rounded px-3 py-2 ${isActive ? 'bg-indigo-100 font-semibold' : 'hover:bg-gray-100'}`}>
              {name}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="p-6"><Outlet /></main>
    </div>
  )
}