import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const BookingContext = createContext({})
const STORAGE_KEY = 'routerush-booking-state'

const initialBookingState = {
  trip: null,
  bus: null,
  route: null,
  operator: null,
  selectedSeats: [],
  passengers: [],
  boardingPoint: null,
  droppingPoint: null,
  couponCode: null,
  couponDiscount: 0,
  paymentMethod: null,
  totalFare: 0,
  taxes: 0,
  serviceFee: 40,
  finalAmount: 0,
}

const normalizeSeat = (seat) => {
  if (typeof seat === 'string') {
    return { id: seat, seatNumber: seat, price: 0 }
  }

  if (!seat) return null

  return {
    id: seat.id || seat.seatNumber || seat.seat_number || 'unknown',
    seatNumber: seat.seatNumber || seat.seat_number || seat.id || 'unknown',
    price: Number(seat.price || seat.amount || 0),
    type: seat.type || seat.seatType || 'regular',
  }
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within BookingProvider')
  return context
}

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState(() => {
    if (typeof window === 'undefined') return initialBookingState

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) return initialBookingState

      const parsed = JSON.parse(stored)
      return {
        ...initialBookingState,
        ...parsed,
        selectedSeats: Array.isArray(parsed.selectedSeats) ? parsed.selectedSeats : [],
        passengers: Array.isArray(parsed.passengers) ? parsed.passengers : [],
      }
    } catch (error) {
      console.warn('Failed to restore booking state', error)
      return initialBookingState
    }
  })
  const [bookingStep, setBookingStep] = useState(0) // 0: seats, 1: passengers, 2: payment, 3: confirmation
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...bookingData, confirmedBooking }))
    }
  }, [bookingData, confirmedBooking])

  const updateBookingData = useCallback((updates) => {
    setBookingData(prev => ({ ...prev, ...updates }))
  }, [])

  const setTrip = useCallback((trip, bus, route, operator) => {
    setBookingData(prev => ({
      ...prev,
      trip,
      bus: bus || trip?.bus,
      route: route || trip?.route,
      operator: operator || trip?.bus?.operator,
      selectedSeats: [],
      passengers: [],
      boardingPoint: trip?.boarding_points?.[0] || null,
      droppingPoint: trip?.dropping_points?.[0] || null,
      couponCode: null,
      couponDiscount: 0,
    }))
  }, [])

  const toggleSeat = useCallback((seat) => {
    setBookingData(prev => {
      const normalizedSeat = normalizeSeat(seat)
      if (!normalizedSeat) return prev

      const existingSeats = Array.isArray(prev.selectedSeats) ? prev.selectedSeats : []
      const isSelected = existingSeats.some(s => normalizeSeat(s)?.id === normalizedSeat.id)
      const newSeats = isSelected
        ? existingSeats.filter(s => normalizeSeat(s)?.id !== normalizedSeat.id)
        : [...existingSeats, normalizedSeat]

      const baseFare = newSeats.reduce((sum, s) => sum + Number(normalizeSeat(s)?.price || prev.trip?.fare || prev.totalFare || 0), 0)
      const taxes = Math.round(baseFare * 0.05)
      const serviceFee = prev.serviceFee ?? 40
      const finalAmount = baseFare + taxes + serviceFee - (prev.couponDiscount || 0)

      return {
        ...prev,
        selectedSeats: newSeats,
        totalFare: baseFare,
        taxes,
        finalAmount,
      }
    })
  }, [])

  const setPassengers = useCallback((passengers) => {
    setBookingData(prev => ({ ...prev, passengers }))
  }, [])

  const setBoardingPoint = useCallback((point) => {
    setBookingData(prev => ({ ...prev, boardingPoint: point }))
  }, [])

  const setDroppingPoint = useCallback((point) => {
    setBookingData(prev => ({ ...prev, droppingPoint: point }))
  }, [])

  const applyCoupon = useCallback((code, discount) => {
    setBookingData(prev => {
      const finalAmount = (prev.totalFare || 0) + (prev.taxes || 0) + (prev.serviceFee || 40) - (discount || 0)
      return { ...prev, couponCode: code, couponDiscount: discount || 0, finalAmount }
    })
  }, [])

  const setPaymentMethod = useCallback((method) => {
    setBookingData(prev => ({ ...prev, paymentMethod: method }))
  }, [])

  const getFareBreakdown = useCallback(() => {
    const selectedSeats = Array.isArray(bookingData?.selectedSeats) ? bookingData.selectedSeats : []
    const baseFare = selectedSeats.reduce((sum, seat) => sum + Number(normalizeSeat(seat)?.price || bookingData?.trip?.fare || bookingData?.fare || 0), 0)
    const taxes = Math.round(baseFare * 0.05)
    const serviceFee = bookingData?.serviceFee ?? 40
    const total = baseFare + taxes + serviceFee - (bookingData?.couponDiscount || 0)

    return {
      baseFare,
      taxes,
      serviceFee,
      total,
      couponDiscount: bookingData?.couponDiscount || 0,
      finalAmount: total,
    }
  }, [bookingData])

  const resetBooking = useCallback(() => {
    setBookingData(initialBookingState)
    setBookingStep(0)
    setConfirmedBooking(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const confirmBooking = useCallback((booking) => {
    setConfirmedBooking(booking)
    setBookingData(prev => ({ ...prev, status: 'CONFIRMED', referenceNumber: booking?.referenceNumber || booking?.booking_ref || null }))
    setBookingStep(3)
  }, [])

  return (
    <BookingContext.Provider value={{
      bookingData,
      bookingStep,
      confirmedBooking,
      setTrip,
      toggleSeat,
      setPassengers,
      setBoardingPoint,
      setDroppingPoint,
      applyCoupon,
      setPaymentMethod,
      resetBooking,
      confirmBooking,
      setBookingStep,
      updateBookingData,
      getFareBreakdown,
    }}>
      {children}
    </BookingContext.Provider>
  )
}
