import React, { forwardRef } from 'react'
import { FiChevronDown, FiAlertCircle } from 'react-icons/fi'

const Select = forwardRef(({ label, error, options = [], placeholder, className = '', containerClassName = '', required, ...props }, ref) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">
          {label} {required && <span className="text-brand-primary">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full py-2.5 pl-4 pr-10 text-sm font-medium appearance-none
            bg-surface-muted dark:bg-surface-muted-dark
            border rounded-xl
            text-charcoal dark:text-white
            transition-all duration-200
            focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
            ${error ? 'border-red-400' : 'border-border dark:border-border-dark'}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
          <FiAlertCircle size={13} className="flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
