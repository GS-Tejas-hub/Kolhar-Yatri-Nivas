import React from 'react'

export function Card({ className = '', children }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }) {
  return <div className={`p-4 border-b border-gray-200 rounded-t-2xl ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
}

export function CardContent({ className = '', children }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export default Card


