import React from 'react'

export const SkeletonBox = ({ className = '' }) => (
  <div className={`skeleton rounded-xl ${className}`} />
)

export const BusCardSkeleton = () => (
  <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-5 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SkeletonBox className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBox className="w-32 h-4" />
          <SkeletonBox className="w-20 h-3" />
        </div>
      </div>
      <SkeletonBox className="w-16 h-6 rounded-full" />
    </div>
    <div className="flex gap-4">
      {[1,2,3,4,5].map(i => (
        <SkeletonBox key={i} className="w-16 h-8 rounded-lg" />
      ))}
    </div>
    <div className="flex items-center justify-between">
      <SkeletonBox className="w-24 h-5" />
      <SkeletonBox className="w-28 h-10 rounded-xl" />
    </div>
  </div>
)

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <SkeletonBox className="w-16 h-16 rounded-full" />
      <div className="space-y-2">
        <SkeletonBox className="w-32 h-5" />
        <SkeletonBox className="w-48 h-4" />
      </div>
    </div>
    {[1,2,3].map(i => <SkeletonBox key={i} className="h-14 w-full" />)}
  </div>
)

export default SkeletonBox
