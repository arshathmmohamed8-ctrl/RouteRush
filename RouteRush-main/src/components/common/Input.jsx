import React, { forwardRef } from 'react'
import { FiAlertCircle } from 'react-icons/fi'

const Input = forwardRef(({ 
  label, 
  error, 
  hint,
  leftIcon, 
  rightIcon,
  className = '',
  containerClassName = '',
  required,
  ...props 
}, ref) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">
          {label} {required && <span className="text-brand-primary">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full py-2.5 text-sm font-medium
            bg-surface-muted dark:bg-surface-muted-dark
            border rounded-xl
            text-charcoal dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-200
            focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-border dark:border-border-dark'}
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${rightIcon ? 'pr-10' : 'pr-4'}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
          <FiAlertCircle size={13} className="flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
