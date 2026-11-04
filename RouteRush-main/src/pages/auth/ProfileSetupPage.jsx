import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiUser, FiPhone, FiCalendar } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const ProfileSetupPage = () => {
  const [loading, setLoading] = useState(false)
  const { updateProfile, user } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await updateProfile({ ...data, email: user.email })
      toast.success('Profile set up successfully!')
      navigate('/')
    } catch (err) {
      toast.error('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="relative w-20 h-20 rounded-full ring-4 ring-brand-primary/30 overflow-hidden shadow-lg">
              <img
                src="/traveler-avatar.jpg"
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-2xl font-black text-charcoal dark:text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-500 text-sm">Just a few more details to get you started!</p>
        </div>
        <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">Full Name *</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register('full_name', { required: true })} type="text" placeholder="Your full name"
                  className="w-full py-2.5 pl-10 pr-4 text-sm font-medium bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register('phone')} type="tel" placeholder="+91 98765 43210"
                  className="w-full py-2.5 pl-10 pr-4 text-sm font-medium bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">Date of Birth</label>
              <div className="relative">
                <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register('date_of_birth')} type="date"
                  className="w-full py-2.5 pl-10 pr-4 text-sm font-medium bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-charcoal dark:text-gray-200">Gender</label>
              <select {...register('gender')} className="w-full py-2.5 pl-4 pr-4 text-sm font-medium bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => navigate('/')} type="button">Skip for Now</Button>
              <Button type="submit" fullWidth loading={loading}>Save Profile</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetupPage
