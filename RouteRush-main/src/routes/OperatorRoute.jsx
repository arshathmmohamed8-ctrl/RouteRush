import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'

const OperatorRoute = ({ children }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || !['operator', 'admin'].includes(profile?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default OperatorRoute
