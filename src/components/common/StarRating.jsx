import React from 'react'
import { FiStar } from 'react-icons/fi'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'

const StarRating = ({ rating, maxStars = 5, size = 16, showNumber = false, className = '' }) => {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0)

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <FaStar key={`full-${i}`} size={size} className="text-amber-400" />
      ))}
      {hasHalf && <FaStarHalfAlt size={size} className="text-amber-400" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <FiStar key={`empty-${i}`} size={size} className="text-gray-300" />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-semibold text-charcoal dark:text-white">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

export default StarRating
