import React from 'react'

const Card = ({ children, className = '', hover = false, onClick, padding = 'p-6' }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-surface-card-dark
        border border-border dark:border-border-dark
        rounded-2xl
        ${padding}
        ${hover ? 'cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5' : 'shadow-card'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-charcoal dark:text-white ${className}`}>{children}</h3>
)

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

export default Card
