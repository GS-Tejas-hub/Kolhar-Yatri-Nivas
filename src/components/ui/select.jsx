import React, { useState, createContext, useContext } from 'react'

const SelectContext = createContext({ value: undefined, onValueChange: () => {}, open: false, setOpen: () => {} })

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false)
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className = '', children, ...props }) {
  const ctx = useContext(SelectContext)
  return (
    <button
      type="button"
      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-left ${className}`}
      onClick={() => ctx.setOpen(!ctx.open)}
      {...props}
    >
      {children}
    </button>
  )
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectContext)
  return <span className="text-gray-700">{ctx.value ?? placeholder}</span>
}

export function SelectContent({ children }) {
  const ctx = useContext(SelectContext)
  if (!ctx.open) return null
  return (
    <div className="absolute left-0 right-0 z-20 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-md">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {})
      )}
    </div>
  )
}

export function SelectItem({ value: itemValue, children }) {
  const ctx = useContext(SelectContext)
  const isActive = ctx.value === itemValue
  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}
      onClick={() => {
        ctx.onValueChange?.(itemValue)
        ctx.setOpen(false)
      }}
    >
      {children}
    </button>
  )
}

export default { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }


