export default function Field({ label, error, ...props }) {
  const id = props.id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">{label}</label>
      <input
        id={id}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        {...props}
      />
      {error && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}