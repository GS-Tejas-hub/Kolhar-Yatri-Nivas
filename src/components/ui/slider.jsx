import React from 'react'

export function Slider({ value = [0, 100], onValueChange, max = 100, step = 1, className = '' }) {
  const [min, maxVal] = value

  const handleMin = (e) => {
    const v = Math.min(Number(e.target.value), maxVal)
    onValueChange?.([v, maxVal])
  }
  const handleMax = (e) => {
    const v = Math.max(Number(e.target.value), min)
    onValueChange?.([min, v])
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input type="range" min={0} max={max} step={step} value={min} onChange={handleMin} className="w-full" />
      <input type="range" min={0} max={max} step={step} value={maxVal} onChange={handleMax} className="w-full" />
    </div>
  )
}

export default Slider


