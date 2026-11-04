import { supabase } from '../lib/supabase'
import { ALL_CITIES, generateTripsForRoute, normalizeCity } from '../data/routeData'
import { POPULAR_ROUTES } from '../constants'

// Search trips by route and date
export const searchTrips = async ({ fromCity, toCity, date, passengers = 1 }) => {
  const normFrom = normalizeCity(fromCity)
  const normTo = normalizeCity(toCity)

  // Invalid search parameters or identical source and destination
  if (!normFrom || !normTo || normFrom === normTo) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        bus:buses(
          *,
          operator:operators(*)
        ),
        route:routes(
          *,
          from_city:cities!routes_from_city_id_fkey(*),
          to_city:cities!routes_to_city_id_fkey(*)
        )
      `)
      .gte('available_seats', passengers)
      .eq('status', 'scheduled')
      .order('departure_time', { ascending: true })

    if (!error && Array.isArray(data) && data.length > 0) {
      // Filter strictly by requested fromCity and toCity
      const filtered = data.filter(trip => {
        const tripFrom = trip.route?.from_city?.name
        const tripTo = trip.route?.to_city?.name
        return normalizeCity(tripFrom) === normFrom && normalizeCity(tripTo) === normTo
      })

      if (filtered.length > 0) {
        return filtered
      }
    }
  } catch (err) {
    console.warn('Supabase trips query unavailable, using route generator:', err.message)
  }

  // Generate dynamic, realistic trips specifically for the requested route and date
  return generateTripsForRoute(normFrom, normTo, date, passengers)
}

// Get trip details with seats
export const getTripDetails = async (tripId) => {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      bus:buses(
        *,
        operator:operators(*)
      ),
      route:routes(
        *,
        from_city:cities!routes_from_city_id_fkey(*),
        to_city:cities!routes_to_city_id_fkey(*)
      ),
      seats(*)
    `)
    .eq('id', tripId)
    .single()

  if (error) throw error
  return data
}

// Get bus details with reviews
export const getBusDetails = async (busId) => {
  const { data, error } = await supabase
    .from('buses')
    .select(`
      *,
      operator:operators(*),
      reviews(*,
        user:profiles(full_name, avatar_url)
      ),
      trips(
        id, departure_time, arrival_time, fare, available_seats, status
      )
    `)
    .eq('id', busId)
    .single()

  if (error) throw error
  return data
}

// Get all cities
export const getCities = async (search = '') => {
  try {
    let query = supabase.from('cities').select('*').order('name')
    if (search) query = query.ilike('name', `%${search}%`)
    const { data, error } = await query
    if (!error && Array.isArray(data) && data.length > 0) return data
  } catch (err) {
    // fallback
  }

  const q = search.toLowerCase().trim()
  if (!q) return ALL_CITIES

  return ALL_CITIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.state.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    (c.aliases && c.aliases.some(a => a.toLowerCase().includes(q)))
  )
}

// Get all operators
export const getOperators = async () => {
  try {
    const { data, error } = await supabase
      .from('operators')
      .select('*, buses(count)')
      .eq('verified', true)
      .order('rating', { ascending: false })
    if (!error && Array.isArray(data) && data.length > 0) return data
  } catch (err) {
    // fallback
  }

  return [
    { id: 'op1', company_name: 'Orange Travels', rating: 4.8, total_reviews: 3240, verified: true },
    { id: 'op2', company_name: 'KPN Travels', rating: 4.6, total_reviews: 2890, verified: true },
    { id: 'op3', company_name: 'Parveen Travels', rating: 4.5, total_reviews: 1980, verified: true },
    { id: 'op4', company_name: 'SRS Travels', rating: 4.4, total_reviews: 2150, verified: true },
    { id: 'op5', company_name: 'IntrCity SmartBus', rating: 4.7, total_reviews: 4120, verified: true },
    { id: 'op6', company_name: 'VRL Travels', rating: 4.5, total_reviews: 2780, verified: true },
  ]
}

// Get popular routes (most booked)
export const getPopularRoutes = async () => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select(`
        *,
        from_city:cities!routes_from_city_id_fkey(*),
        to_city:cities!routes_to_city_id_fkey(*)
      `)
      .limit(6)
    if (!error && Array.isArray(data) && data.length > 0) return data
  } catch (err) {
    // fallback
  }

  return POPULAR_ROUTES
}

// Get active offers
export const getOffers = async () => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .gte('valid_until', new Date().toISOString())
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// Validate coupon
export const validateCoupon = async (code, amount) => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .gte('valid_until', new Date().toISOString())
    .single()
  
  if (error) return null
  if (!data) return null
  if (data.min_amount && amount < data.min_amount) return null
  
  return data
}

// Add review
export const addReview = async ({ busId, userId, rating, comment }) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({ bus_id: busId, user_id: userId, rating, comment })
    .select()
    .single()
  if (error) throw error
  return data
}

// Get seats for a trip
export const getTripSeats = async (tripId) => {
  const { data, error } = await supabase
    .from('seats')
    .select('*')
    .eq('trip_id', tripId)
    .order('seat_number')
  if (error) throw error
  return data || []
}
