import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { BookingProvider } from './context/BookingContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import OperatorRoute from './routes/OperatorRoute'

// Pages
import HomePage from './pages/home/HomePage'
import AuthPage from './pages/auth/AuthPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import ProfileSetupPage from './pages/auth/ProfileSetupPage'
import SearchPage from './pages/search/SearchPage'
import BusDetailsPage from './pages/bus/BusDetailsPage'
import SeatSelectionPage from './pages/booking/SeatSelectionPage'
import PassengerDetailsPage from './pages/booking/PassengerDetailsPage'
import PaymentPage from './pages/booking/PaymentPage'
import ConfirmationPage from './pages/booking/ConfirmationPage'
import MyBookingsPage from './pages/account/MyBookingsPage'
import ProfilePage from './pages/account/ProfilePage'
import ContactPage from './pages/contact/ContactPage'
// Operator
import OperatorDashboard from './pages/operator/OperatorDashboard'
import OperatorBuses from './pages/operator/OperatorBuses'
import OperatorTrips from './pages/operator/OperatorTrips'
import OperatorBookings from './pages/operator/OperatorBookings'
// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOperators from './pages/admin/AdminOperators'
import AdminBuses from './pages/admin/AdminBuses'
import AdminRoutes from './pages/admin/AdminRoutes'
import AdminTrips from './pages/admin/AdminTrips'
import AdminBookings from './pages/admin/AdminBookings'
import AdminOffers from './pages/admin/AdminOffers'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bus/:id" element={<BusDetailsPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Profile Setup */}
              <Route path="/profile-setup" element={
                <ProtectedRoute>
                  <ProfileSetupPage />
                </ProtectedRoute>
              } />

              {/* Protected - Booking Flow */}
              <Route path="/book/seats" element={
                <ProtectedRoute>
                  <SeatSelectionPage />
                </ProtectedRoute>
              } />
              <Route path="/book/passengers" element={
                <ProtectedRoute>
                  <PassengerDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/book/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/book/confirmation" element={
                <ProtectedRoute>
                  <ConfirmationPage />
                </ProtectedRoute>
              } />

              {/* Protected - Account */}
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Operator Routes */}
              <Route path="/operator/dashboard" element={
                <OperatorRoute>
                  <OperatorDashboard />
                </OperatorRoute>
              } />
              <Route path="/operator/buses" element={
                <OperatorRoute>
                  <OperatorBuses />
                </OperatorRoute>
              } />
              <Route path="/operator/trips" element={
                <OperatorRoute>
                  <OperatorTrips />
                </OperatorRoute>
              } />
              <Route path="/operator/bookings" element={
                <OperatorRoute>
                  <OperatorBookings />
                </OperatorRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />
              <Route path="/admin/operators" element={
                <AdminRoute>
                  <AdminOperators />
                </AdminRoute>
              } />
              <Route path="/admin/buses" element={
                <AdminRoute>
                  <AdminBuses />
                </AdminRoute>
              } />
              <Route path="/admin/routes" element={
                <AdminRoute>
                  <AdminRoutes />
                </AdminRoute>
              } />
              <Route path="/admin/trips" element={
                <AdminRoute>
                  <AdminTrips />
                </AdminRoute>
              } />
              <Route path="/admin/bookings" element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              } />
              <Route path="/admin/offers" element={
                <AdminRoute>
                  <AdminOffers />
                </AdminRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  style: {
                    background: '#2A9D8F',
                    color: '#fff',
                  },
                  iconTheme: { primary: '#fff', secondary: '#2A9D8F' },
                },
                error: {
                  style: {
                    background: '#EF4444',
                    color: '#fff',
                  },
                  iconTheme: { primary: '#fff', secondary: '#EF4444' },
                },
              }}
            />
          </div>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
