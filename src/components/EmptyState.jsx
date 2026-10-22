export default function EmptyState({ title, hint }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
      <p className="font-semibold">{title}</p>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  )
}