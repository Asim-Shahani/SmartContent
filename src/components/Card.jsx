export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}