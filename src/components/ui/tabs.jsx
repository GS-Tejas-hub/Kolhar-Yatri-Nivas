import React, { createContext, useContext } from 'react'

const TabsContext = createContext({ value: '', setValue: () => {} })

export function Tabs({ value, onValueChange, children }) {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className = '', children }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 ${className}`}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }) {
  const ctx = useContext(TabsContext)
  const isActive = ctx.value === value
  return (
    <button
      type="button"
      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
        isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={() => ctx.setValue?.(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }) {
  const ctx = useContext(TabsContext)
  if (ctx.value !== value) return null
  return <div>{children}</div>
}

export default { Tabs, TabsContent, TabsList, TabsTrigger }


