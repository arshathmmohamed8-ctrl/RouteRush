import React from 'react'
import Spinner from './Spinner'

const variants = {
  primary: 'bg-brand-primary hover:bg-brand-hover text-white shadow-brand hover:shadow-brand-lg',
  secondary: 'bg-surface-muted dark:bg-surface-muted-dark text-charcoal dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-muted-dark',
  outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
  ghost: 'text-charcoal dark:text-gray-200 hover:bg-surface-muted dark:hover:bg-surface-muted-dark',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-success hover:bg-success-dark text-white',
  white: 'bg-white text-charcoal hover:bg-gray-50 shadow-soft',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" color={variant === 'outline' || variant === 'ghost' ? 'brand' : 'white'} />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !loading && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  )
}

export default Button
