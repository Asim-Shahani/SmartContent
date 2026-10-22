import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null)

  const show = useCallback((text) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 2500)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)