import { supabase } from '../lib/supabase'

// Create a booking
export const createBooking = async ({ userId, tripId, seats, passengers, boardingPoint, droppingPoint, totalAmount, paymentMethod }) => {
  // Generate booking reference
  const bookingRef = 'RR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase()
  
  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      trip_id: tripId,
      total_amount: totalAmount,
      status: 'confirmed',
      booking_ref: bookingRef,
      boarding_point: boardingPoint,
      dropping_point: droppingPoint,
      payment_method: paymentMethod,
    })
    .select()
    .single()
  
  if (bookingError) throw bookingError
  
  // Create booking passengers
  const passengerData = passengers.map((p, idx) => ({
    booking_id: booking.id,
    name: p.fullName || p.name || `Passenger ${idx + 1}`,
    age: parseInt(p.age) || 25,
    gender: p.gender || 'Not Specified',
    seat_id: seats[idx]?.id,
    seat_number: seats[idx]?.seat_number || seats[idx]?.seatNumber || seats[idx]?.id || p.seatNumber,
  }))
  
  const { error: passengersError } = await supabase
    .from('booking_passengers')
    .insert(passengerData)
  
  if (passengersError) throw passengersError
  
  // Update seat status to booked
  const seatIds = seats.map(s => s.id)
  await supabase
    .from('seats')
    .update({ status: 'booked' })
    .in('id', seatIds)
  
  // Update trip available seats
  await supabase.rpc('decrement_seats', { trip_id: tripId, count: seats.length })
  
  return { ...booking, passengers: passengerData }
}

// Get user bookings
export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      trip:trips(
        *,
        bus:buses(*, operator:operators(*)),
        route:routes(
          *,
          from_city:cities!routes_from_city_id_fkey(*),
          to_city:cities!routes_to_city_id_fkey(*)
        )
      ),
      booking_passengers(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Cancel booking
export const cancelBooking = async (bookingId, userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get booking details
export const getBookingDetails = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      trip:trips(
        *,
        bus:buses(*, operator:operators(*)),
        route:routes(
          *,
          from_city:cities!routes_from_city_id_fkey(*),
          to_city:cities!routes_to_city_id_fkey(*)
        )
      ),
      booking_passengers(*)
    `)
    .eq('id', bookingId)
    .single()
  
  if (error) throw error
  return data
}

// Toggle favorite route
export const toggleFavoriteRoute = async (userId, routeId) => {
  const { data: existing } = await supabase
    .from('favorite_routes')
    .select('id')
    .eq('user_id', userId)
    .eq('route_id', routeId)
    .single()
  
  if (existing) {
    await supabase.from('favorite_routes').delete().eq('id', existing.id)
    return false
  } else {
    await supabase.from('favorite_routes').insert({ user_id: userId, route_id: routeId })
    return true
  }
}

// Get user favorite routes
export const getFavoriteRoutes = async (userId) => {
  const { data, error } = await supabase
    .from('favorite_routes')
    .select(`
      *,
      route:routes(
        *,
        from_city:cities!routes_from_city_id_fkey(*),
        to_city:cities!routes_to_city_id_fkey(*)
      )
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  return data || []
}
