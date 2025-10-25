import React from 'react'

const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  default: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-300',
  outline: 'border border-gray-300 text-gray-900 hover:bg-gray-100',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
}

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-6',
  icon: 'h-10 w-10',
}

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'default', size = 'default', ...props },
  ref
) {
  const cls = `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`
  return <button ref={ref} className={cls} {...props} />
})

export default Button


