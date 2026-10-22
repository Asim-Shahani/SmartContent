import { NavLink } from 'react-router-dom'
import WorkspaceSwitcher from './WorkspaceSwitcher'

const LINKS = [
  ['Dashboard', '/dashboard'],
  ['Discover', '/discover'],
  ['Channels', '/channels'],
  ['Ideas', '/ideas'],
  ['Hooks', '/hooks'],
  ['Collections', '/collections'],
  ['Scripts', '/scripts'],
  ['Projects', '/projects'],
  ['Settings', '/settings'],
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen overflow-auto border-r border-gray-200 bg-white p-3">
      <div className="px-2 pb-4 pt-1 text-lg font-bold tracking-tight">Smart Content</div>
      <WorkspaceSwitcher />
      <nav className="flex flex-col gap-1">
        {LINKS.map(([name, to]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${
                isActive ? 'bg-indigo-100 font-semibold text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}