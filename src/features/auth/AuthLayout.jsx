import Card from '@/components/Card'

export default function AuthLayout({ title, subtitle, children, footer, wide = false }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-gray-900">
      <div className={`w-full ${wide ? 'max-w-lg' : 'max-w-sm'}`}>
        <div className="mb-6 text-center text-xl font-bold tracking-tight">Smart Content</div>
        <Card className="p-6">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="mb-4 mt-1 text-sm text-gray-500">{subtitle}</p>}
          {children}
        </Card>
        {footer && <p className="mt-4 text-center text-sm text-gray-500">{footer}</p>}
      </div>
    </div>
  )
}