import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut,
  FiBookmark, FiSettings, FiChevronDown, FiShield,
  FiTruck, FiBell
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, profile, signOut, isAdmin, isOperator } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/')
    } catch (err) {
      toast.error('Failed to sign out')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Search Buses' },
    { to: '/my-bookings', label: 'My Bookings', protected: true },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (path) => location.pathname === path

  const getAvatarInitials = () => {
    const name = profile?.full_name || user?.email || ''
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-40 transition-all duration-300
      ${
        isScrolled
          ? 'bg-white/90 dark:bg-surface-card-dark/90 backdrop-blur-md shadow-soft border-b border-border dark:border-border-dark'
          : 'bg-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <img
              src="/bus-logo.jpg"
              alt="RouteRush Logo"
              className="w-8 h-8 rounded-xl object-cover shadow-sm ring-1 ring-black/10 dark:ring-white/15 group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-xl font-black font-display tracking-tight">
              <span className="text-brand-primary">Route</span>
              <span className="text-charcoal dark:text-white">Rush</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              (!link.protected || user) && (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${
                      isActive(link.to)
                        ? 'text-brand-primary bg-brand-primary/10'
                        : 'text-charcoal dark:text-gray-200 hover:text-brand-primary hover:bg-brand-primary/10'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-charcoal dark:text-gray-200 hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {user ? (
              // User Menu
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-bold">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      getAvatarInitials()
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-charcoal dark:text-white max-w-[100px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                  <FiChevronDown size={16} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl shadow-card-hover overflow-hidden"
                    >
                      <div className="p-3 border-b border-border dark:border-border-dark">
                        <p className="text-sm font-bold text-charcoal dark:text-white truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <MenuLink to="/profile" icon={<FiUser size={16} />} label="Profile" />
                        <MenuLink to="/my-bookings" icon={<FiBookmark size={16} />} label="My Bookings" />
                        {isOperator && (
                          <MenuLink to="/operator/dashboard" icon={<FiTruck size={16} />} label="Operator Dashboard" />
                        )}
                        {isAdmin && (
                          <MenuLink to="/admin/dashboard" icon={<FiShield size={16} />} label="Admin Dashboard" />
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FiLogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Sign In</Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/auth?tab=register')}>Get Started</Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl text-charcoal dark:text-gray-200 hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-surface-card-dark border-t border-border dark:border-border-dark"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                (!link.protected || user) && (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      block px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                      ${
                        isActive(link.to)
                          ? 'text-brand-primary bg-brand-primary/10'
                          : 'text-charcoal dark:text-gray-200 hover:bg-surface-muted dark:hover:bg-surface-muted-dark'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              {!user && (
                <div className="pt-2 flex gap-2">
                  <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/auth')}>Sign In</Button>
                  <Button variant="primary" size="sm" fullWidth onClick={() => navigate('/auth?tab=register')}>Register</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const MenuLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-charcoal dark:text-gray-200 hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
  >
    {icon}
    {label}
  </Link>
)

export default Navbar
