import React from 'react'

const variants = {
  primary: 'bg-brand-primary/10 text-brand-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20',
  danger: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  muted: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
}

const Badge = ({ children, variant = 'muted', dot = false, pulse = false, className = '' }) => {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full
      ${variants[variant]} ${className}
    `}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current ${pulse ? 'animate-pulse' : ''}`} />
      )}
      {children}
    </span>
  )
}

export default Badge
