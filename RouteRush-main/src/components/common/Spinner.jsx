import React from 'react'

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
  xl: 'w-14 h-14 border-4',
}

const Spinner = ({ size = 'md', color = 'brand', className = '' }) => {
  const colorClass = color === 'brand' 
    ? 'border-brand-primary border-t-transparent' 
    : 'border-white border-t-transparent'
  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeMap[size]} ${colorClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner
