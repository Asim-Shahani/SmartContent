import { useCredits } from '@/hooks/useCredits'

export default function TopBar() {
  const { credits } = useCredits()
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
      <input
        type="search"
        aria-label="Search"
        placeholder="Search videos, hooks, collections"
        className="w-full max-w-md rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
      />
      <span className="ml-auto whitespace-nowrap rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700">
        {credits} credits left
      </span>
    </header>
  )
}