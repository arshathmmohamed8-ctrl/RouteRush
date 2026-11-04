import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiLock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await updatePassword(data.password)
      toast.success('Password updated successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg border border-border dark:border-border-dark ring-4 ring-brand-primary/20">
              <img
                src="/security-shield.jpg"
                alt="Security Shield"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-2xl font-black text-charcoal dark:text-white mb-2">Set New Password</h1>
          <p className="text-gray-500 text-sm">Enter your new password below.</p>
        </div>
        <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">New Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register('password')} type="password" placeholder="Min 8 characters"
                  className="w-full py-2.5 pl-10 pr-4 text-sm font-medium bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">Confirm Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register('confirmPassword')} type="password" placeholder="Repeat password"
                  className="w-full py-2.5 pl-10 pr-4 text-sm font-medium bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" fullWidth loading={loading} size="lg">Update Password</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
