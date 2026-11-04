import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'

const PageWrapper = ({ children, title, showFooter = true, className = '' }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} – RouteRush`
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.name = 'description'
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = `Book bus tickets for ${title} on RouteRush - India's Smartest Bus Booking Platform.`
    }
    window.scrollTo(0, 0)
  }, [title])

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`flex-1 ${className}`}
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  )
}

export default PageWrapper
