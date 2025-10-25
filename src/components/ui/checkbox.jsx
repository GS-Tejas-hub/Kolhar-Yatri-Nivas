import React from 'react'

export function Checkbox({ className = '', checked, onCheckedChange, id }) {
  return (
    <input
      id={id}
      type="checkbox"
      className={`h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-400 ${className}`}
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  )
}

export default Checkbox


