import React from 'react'

export const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
  const cls = `w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${className}`
  return <input ref={ref} className={cls} {...props} />
})

export default Input


