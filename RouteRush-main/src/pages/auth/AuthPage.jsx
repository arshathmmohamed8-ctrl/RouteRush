import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)
  const { signInWithEmail, signUpWithEmail, resetPassword, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const loginForm = useForm({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm({ resolver: zodResolver(registerSchema) })

  const handleLogin = async (data) => {
    try {
      setLoading(true)
      setServerError(null)
      // Trim inputs to avoid accidental whitespace issues
      const email = (data.email || '').trim()
      const password = (data.password || '')
      await signInWithEmail(email, password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      // Show inline error instead of only a toast so users notice it
      const msg = err?.message || err?.error || 'Invalid login credentials'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data) => {
    try {
      setLoading(true)
      await signUpWithEmail(data.email, data.password, data.fullName)
      toast.success('Account created! Please check your email to verify.')
      setTab('login')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (data) => {
    try {
      setLoading(true)
      await resetPassword(data.email)
      toast.success('Reset link sent! Check your email.')
      setForgotMode(false)
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { value: '50K+', label: 'Happy Travelers' },
    { value: '100+', label: 'Bus Operators' },
    { value: '500+', label: 'Routes Covered' },
    { value: '4.8 / 5', label: 'Average Rating' },
  ]

  const features = [
    'Instant seat confirmation',
    'Multiple payment options',
    'Real-time bus tracking',
    '24/7 customer support',
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-hero-gradient flex-col justify-between p-12">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-brand-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <img
            src="/bus-logo.jpg"
            alt="RouteRush Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-md ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-200"
          />
          <span className="text-3xl font-black font-display tracking-tight">
            <span className="text-brand-primary">Route</span>
            <span className="text-white">Rush</span>
          </span>
        </Link>

        {/* Center content */}
        <div className="relative z-10">
          {/* Real bus visual card */}
          <div className="text-center mb-8">
            <div className="relative mb-6 rounded-2xl overflow-hidden shadow-2xl border border-white/20 max-w-sm mx-auto group">
              <img
                src="/real-bus.png"
                alt="RouteRush Luxury Bus Fleet"
                className="w-full h-44 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-semibold text-white/90">Premium Verified Fleet</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-black text-white mb-3 leading-tight">
              Travel Smarter,<br />
              <span className="text-brand-primary">Book Faster</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
              Join thousands of travelers who trust RouteRush for comfortable, safe, and affordable intercity journeys.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-2xl font-black text-brand-primary">{stat.value}</p>
                <p className="text-gray-300 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <FiCheck size={12} className="text-success" />
                </div>
                <span className="text-gray-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="text-gray-500 text-xs relative z-10">
          © {new Date().getFullYear()} RouteRush. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface dark:bg-surface-dark">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/bus-logo.jpg"
                alt="RouteRush Logo"
                className="w-8 h-8 rounded-xl object-cover shadow-sm ring-1 ring-black/10 dark:ring-white/10"
              />
              <span className="text-xl font-black font-display tracking-tight">
                <span className="text-brand-primary">Route</span>
                <span className="text-charcoal dark:text-white">Rush</span>
              </span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {forgotMode ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setForgotMode(false)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-6 transition-colors"
                >
                  <FiArrowLeft size={16} /> Back to Login
                </button>
                <h1 className="text-2xl font-black text-charcoal dark:text-white mb-2">Forgot Password?</h1>
                <p className="text-gray-500 text-sm mb-8">Enter your email and we'll send you a reset link.</p>
                <form onSubmit={loginForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal dark:text-gray-200 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        {...loginForm.register('email')}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full py-2.5 pl-10 pr-4 text-sm font-medium bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <Button type="submit" fullWidth loading={loading} size="lg">Send Reset Link</Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-2xl font-black text-charcoal dark:text-white mb-1">
                  {tab === 'login' ? 'Welcome back!' : 'Create account'}
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                  {tab === 'login'
                    ? 'Sign in to continue your journey'
                    : 'Join RouteRush and start traveling smarter'
                  }
                </p>

                {/* Tabs */}
                <div className="flex gap-1 bg-surface-muted dark:bg-surface-muted-dark rounded-xl p-1 mb-6">
                  {['login', 'register'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        tab === t
                          ? 'bg-white dark:bg-surface-card-dark text-charcoal dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-charcoal dark:hover:text-white'
                      }`}
                    >
                      {t === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>



                {/* Login Form */}
                {tab === 'login' && (
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      icon={<FiMail size={16} />}
                      type="email"
                      placeholder="you@example.com"
                      label="Email Address"
                      error={loginForm.formState.errors.email?.message}
                      {...loginForm.register('email')}
                    />
                    <div>
                      <FormField
                        icon={<FiLock size={16} />}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        label="Password"
                        error={loginForm.formState.errors.password?.message}
                        rightIcon={
                          <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        }
                        {...loginForm.register('password')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-primary" />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotMode(true)}
                        className="text-sm text-brand-primary font-semibold hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Button type="submit" fullWidth loading={loading} size="lg">Sign In</Button>
                    {serverError && (
                      <div className="mt-2 text-sm text-red-600 font-medium bg-red-50 border border-red-100 p-2 rounded">
                        {serverError}
                      </div>
                    )}
                  </form>
                )}

                {/* Register Form */}
                {tab === 'register' && (
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      icon={<FiUser size={16} />}
                      type="text"
                      placeholder="John Doe"
                      label="Full Name"
                      error={registerForm.formState.errors.fullName?.message}
                      {...registerForm.register('fullName')}
                    />
                    <FormField
                      icon={<FiMail size={16} />}
                      type="email"
                      placeholder="you@example.com"
                      label="Email Address"
                      error={registerForm.formState.errors.email?.message}
                      {...registerForm.register('email')}
                    />
                    <FormField
                      icon={<FiLock size={16} />}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      label="Password"
                      error={registerForm.formState.errors.password?.message}
                      rightIcon={
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      }
                      {...registerForm.register('password')}
                    />
                    <FormField
                      icon={<FiLock size={16} />}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat password"
                      label="Confirm Password"
                      error={registerForm.formState.errors.confirmPassword?.message}
                      rightIcon={
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      }
                      {...registerForm.register('confirmPassword')}
                    />
                    <p className="text-xs text-gray-400">
                      By signing up, you agree to our{' '}
                      <Link to="/contact" className="text-brand-primary hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/contact" className="text-brand-primary hover:underline">Privacy Policy</Link>.
                    </p>
                    <Button type="submit" fullWidth loading={loading} size="lg">Create Account</Button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const FormField = React.forwardRef(({ icon, label, error, rightIcon, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">{label} *</label>}
    <div className="relative">
      {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</div>}
      <input
        ref={ref}
        className={`w-full py-2.5 ${icon ? 'pl-10' : 'pl-4'} ${rightIcon ? 'pr-10' : 'pr-4'} text-sm font-medium bg-surface-muted dark:bg-surface-muted-dark border ${error ? 'border-red-400' : 'border-border dark:border-border-dark'} rounded-xl text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all`}
        {...props}
      />
      {rightIcon && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div>}
    </div>
    {error && (
      <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
        <FiAlertCircle size={13} className="flex-shrink-0" />
        <span>{error}</span>
      </p>
    )}
  </div>
))
FormField.displayName = 'FormField'

export default AuthPage
