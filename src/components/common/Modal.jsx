import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const Modal = ({ isOpen, onClose, title, children, size = 'md', hideClose = false }) => {
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${sizeMap[size]} bg-white dark:bg-surface-card-dark rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto z-10`}
          >
            {(title || !hideClose) && (
              <div className="flex items-center justify-between p-6 border-b border-border dark:border-border-dark">
                {title && <h2 className="text-lg font-bold text-charcoal dark:text-white">{title}</h2>}
                {!hideClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors text-gray-400 hover:text-charcoal dark:hover:text-white ml-auto"
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal
