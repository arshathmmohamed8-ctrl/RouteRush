import React from 'react'
import { motion } from 'framer-motion'

const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-surface-muted dark:bg-surface-muted-dark flex items-center justify-center mb-6">
          <Icon size={36} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-xl font-bold text-charcoal dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  )
}

export default EmptyState
