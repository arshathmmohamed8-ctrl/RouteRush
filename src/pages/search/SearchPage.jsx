import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
  FiMapPin, FiCalendar, FiUsers, FiFilter,
  FiArrowRight, FiSliders, FiWifi, FiDroplet, FiCheck,
  FiRepeat, FiX, FiSearch, FiAlertTriangle
} from 'react-icons/fi'
import { MdElectricBolt, MdAcUnit } from 'react-icons/md'
import { GiNightSleep } from 'react-icons/gi'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import StarRating from '../../components/common/StarRating'
import { BusCardSkeleton } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import { useBooking } from '../../context/BookingContext'
import { BUS_TYPES, AMENITIES, SORT_OPTIONS, POPULAR_ROUTES } from '../../constants'
import { ALL_CITIES, TAMIL_NADU_CITIES, INTERCITY_DESTINATIONS, normalizeCity, generateTripsForRoute } from '../../data/routeData'
import { searchTrips } from '../../services/busService'

const amenityIconMap = {
  wifi: <FiWifi size={13} />,
  charging: <MdElectricBolt size={13} />,
  ac: <MdAcUnit size={13} />,
  water: <FiDroplet size={13} />,
  blanket: <GiNightSleep size={13} />,
}

const busTypeLabel = {
  ac_luxury: 'AC Luxury',
  ac_seater: 'AC Seater',
  non_ac_seater: 'Non-AC Seater',
  ac_sleeper: 'AC Sleeper',
  non_ac_sleeper: 'Non-AC Sleeper',
  volvo: 'Volvo',
  mini: 'Mini Bus',
}

const formatTime = (iso) => {
  if (!iso) return '--'
  try { return format(new Date(iso), 'hh:mm a') } catch { return '--' }
}

const getDuration = (dep, arr) => {
  if (!dep || !arr) return '--'
  const diff = (new Date(arr) - new Date(dep)) / 60000
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return `${h}h ${m}m`
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setTrip, setBoardingPoint, setDroppingPoint, setBookingStep } = useBooking()

  const fromParam = searchParams.get('from') || 'Chennai'
  const toParam = searchParams.get('to') || 'Madurai'
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const passengersParam = parseInt(searchParams.get('passengers') || '1')

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [modifyOpen, setModifyOpen] = useState(false)
  const [sortBy, setSortBy] = useState('departure_asc')
  const [filters, setFilters] = useState({
    acOnly: false,
    busTypes: [],
    maxPrice: 2000,
    minRating: 0,
    departureSlots: [],
  })

  // Modify search form state
  const [modFrom, setModFrom] = useState(fromParam)
  const [modTo, setModTo] = useState(toParam)
  const [modDate, setModDate] = useState(dateParam)
  const [modPassengers, setModPassengers] = useState(passengersParam)
  const [searchError, setSearchError] = useState('')

  // Sync state whenever URL parameters change
  useEffect(() => {
    setModFrom(fromParam)
    setModTo(toParam)
    setModDate(dateParam)
    setModPassengers(passengersParam)
    setSearchError('')
  }, [fromParam, toParam, dateParam, passengersParam])

  // Fetch real/dynamic route-accurate trips whenever search params change
  useEffect(() => {
    let isCancelled = false
    setLoading(true)

    const fetchTrips = async () => {
      try {
        const results = await searchTrips({
          fromCity: fromParam,
          toCity: toParam,
          date: dateParam,
          passengers: passengersParam,
        })
        if (!isCancelled) {
          setTrips(results || [])
          setLoading(false)
        }
      } catch (err) {
        console.warn('Search query error, attempting local generator fallback:', err)
        if (!isCancelled) {
          const fallback = generateTripsForRoute(fromParam, toParam, dateParam, passengersParam)
          setTrips(fallback || [])
          setLoading(false)
        }
      }
    }

    fetchTrips()

    return () => {
      isCancelled = true
    }
  }, [fromParam, toParam, dateParam, passengersParam])

  // Handle Modify Search submission
  const handleModifySubmit = (e) => {
    if (e) e.preventDefault()
    const normFrom = normalizeCity(modFrom)
    const normTo = normalizeCity(modTo)

    if (!normFrom || !normTo) {
      setSearchError('Please select both departure and destination cities.')
      return
    }

    if (normFrom === normTo) {
      setSearchError('Departure and destination cannot be the same city.')
      return
    }

    setSearchError('')
    setModifyOpen(false)
    setSearchParams({
      from: normFrom,
      to: normTo,
      date: modDate,
      passengers: modPassengers.toString(),
    })
  }

  const handleSwapModCities = () => {
    const temp = modFrom
    setModFrom(modTo)
    setModTo(temp)
    setSearchError('')
  }

  const handleQuickRoutePick = (from, to) => {
    setModFrom(from)
    setModTo(to)
    setSearchParams({
      from,
      to,
      date: dateParam,
      passengers: passengersParam.toString(),
    })
  }

  const sortedFiltered = useMemo(() => {
    let result = [...trips]

    if (filters.acOnly) result = result.filter(t => t.bus.bus_type.includes('ac'))
    if (filters.busTypes.length > 0) result = result.filter(t => filters.busTypes.includes(t.bus.bus_type))
    result = result.filter(t => t.fare <= filters.maxPrice)
    if (filters.minRating > 0) result = result.filter(t => (t.bus.operator?.rating || 0) >= filters.minRating)
    if (filters.departureSlots.length > 0) {
      result = result.filter(t => {
        const h = new Date(t.departure_time).getHours()
        return filters.departureSlots.some(slot => {
          if (slot === 'morning') return h >= 6 && h < 12
          if (slot === 'afternoon') return h >= 12 && h < 18
          if (slot === 'evening') return h >= 18 && h < 24
          if (slot === 'night') return h >= 0 && h < 6
          return true
        })
      })
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.fare - b.fare
        case 'price_desc': return b.fare - a.fare
        case 'rating_desc': return (b.bus.operator?.rating || 0) - (a.bus.operator?.rating || 0)
        case 'departure_asc': return new Date(a.departure_time) - new Date(b.departure_time)
        case 'departure_desc': return new Date(b.departure_time) - new Date(a.departure_time)
        case 'duration_asc': return (new Date(a.arrival_time) - new Date(a.departure_time)) - (new Date(b.arrival_time) - new Date(b.departure_time))
        default: return 0
      }
    })
    return result
  }, [trips, filters, sortBy])

  const cheapest = sortedFiltered.length ? Math.min(...sortedFiltered.map(t => t.fare)) : 0
  const fastest = sortedFiltered.length ? Math.min(...sortedFiltered.map(t => new Date(t.arrival_time) - new Date(t.departure_time))) : 0
  const topRated = sortedFiltered.length ? Math.max(...sortedFiltered.map(t => t.bus.operator?.rating || 0)) : 0

  const getSmartBadge = (trip) => {
    const duration = new Date(trip.arrival_time) - new Date(trip.departure_time)
    if (trip.fare === cheapest) return { label: 'Best value', variant: 'success' }
    if (duration === fastest) return { label: 'Fastest', variant: 'info' }
    if (trip.bus.operator?.rating === topRated) return { label: 'Top rated', variant: 'primary' }
    return null
  }

  const toggleFilter = (key, val) => {
    setFilters(prev => {
      const arr = prev[key]
      return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  const resetFilters = () => {
    setFilters({
      acOnly: false,
      busTypes: [],
      maxPrice: 2000,
      minRating: 0,
      departureSlots: [],
    })
  }

  const handleBookNow = (trip, bPoint, dPoint) => {
    setTrip(trip, trip.bus, trip.route, trip.bus.operator)
    if (bPoint) setBoardingPoint(bPoint)
    if (dPoint) setDroppingPoint(dPoint)
    setBookingStep(0)
    navigate('/book/seats')
  }

  return (
    <PageWrapper title={`Buses from ${fromParam} to ${toParam}`}>
      {/* Top Search Banner */}
      <div className="bg-charcoal dark:bg-gray-950 pt-16 pb-6 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
                <FiMapPin className="text-brand-primary flex-shrink-0" size={15} />
                <span className="text-white text-sm font-semibold">{fromParam}</span>
                <FiArrowRight className="text-gray-400" size={14} />
                <span className="text-white text-sm font-semibold">{toParam}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
                <FiCalendar className="text-brand-primary flex-shrink-0" size={15} />
                <span className="text-white text-sm font-semibold">
                  {format(new Date(dateParam), 'EEE, dd MMM yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
                <FiUsers className="text-brand-primary flex-shrink-0" size={15} />
                <span className="text-white text-sm font-semibold">
                  {passengersParam} {passengersParam === 1 ? 'Passenger' : 'Passengers'}
                </span>
              </div>
            </div>

            <Button
              variant={modifyOpen ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setModifyOpen(!modifyOpen)}
              leftIcon={modifyOpen ? <FiX size={14} /> : <FiFilter size={14} />}
            >
              {modifyOpen ? 'Close' : 'Modify Search'}
            </Button>
          </div>

          {/* Collapsible Modify Search Drawer */}
          <AnimatePresence>
            {modifyOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-5 pt-5 border-t border-white/10"
              >
                <form onSubmit={handleModifySubmit} className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                    {/* Origin */}
                    <div className="lg:col-span-3">
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        From
                      </label>
                      <select
                        value={modFrom}
                        onChange={(e) => setModFrom(e.target.value)}
                        className="w-full bg-slate-900/90 text-white text-sm font-semibold py-2.5 px-3 rounded-xl border border-white/20 focus:border-brand-primary focus:outline-none"
                      >
                        <optgroup label="Tamil Nadu Destinations">
                          {TAMIL_NADU_CITIES.map((c) => (
                            <option key={`from-tn-${c.id}`} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Intercity Destinations">
                          {INTERCITY_DESTINATIONS.map((c) => (
                            <option key={`from-ic-${c.id}`} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Swap Button */}
                    <div className="lg:col-span-1 flex justify-center pt-5 sm:pt-4">
                      <button
                        type="button"
                        onClick={handleSwapModCities}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:scale-95"
                        title="Swap Origin and Destination"
                      >
                        <FiRepeat size={14} />
                      </button>
                    </div>

                    {/* Destination */}
                    <div className="lg:col-span-3">
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        To
                      </label>
                      <select
                        value={modTo}
                        onChange={(e) => setModTo(e.target.value)}
                        className="w-full bg-slate-900/90 text-white text-sm font-semibold py-2.5 px-3 rounded-xl border border-white/20 focus:border-brand-primary focus:outline-none"
                      >
                        <optgroup label="Tamil Nadu Destinations">
                          {TAMIL_NADU_CITIES.map((c) => (
                            <option key={`to-tn-${c.id}`} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Intercity Destinations">
                          {INTERCITY_DESTINATIONS.map((c) => (
                            <option key={`to-ic-${c.id}`} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={modDate}
                        onChange={(e) => setModDate(e.target.value)}
                        className="w-full bg-slate-900/90 text-white text-sm font-semibold py-2.5 px-3 rounded-xl border border-white/20 focus:border-brand-primary focus:outline-none"
                      />
                    </div>

                    {/* Passengers */}
                    <div className="lg:col-span-1">
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Travelers
                      </label>
                      <select
                        value={modPassengers}
                        onChange={(e) => setModPassengers(parseInt(e.target.value))}
                        className="w-full bg-slate-900/90 text-white text-sm font-semibold py-2.5 px-3 rounded-xl border border-white/20 focus:border-brand-primary focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Submit CTA */}
                    <div className="lg:col-span-2 pt-5 sm:pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        leftIcon={<FiSearch size={15} />}
                      >
                        Update
                      </Button>
                    </div>
                  </div>

                  {searchError && (
                    <div className="mt-3 flex items-center gap-2 text-rose-400 text-xs font-semibold">
                      <FiAlertTriangle size={14} />
                      <span>{searchError}</span>
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Left Sidebar: Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-5 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-charcoal dark:text-white">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-brand-primary font-semibold hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Bus Type */}
              <div className="mb-5">
                <p className="text-sm font-bold text-charcoal dark:text-white mb-3">Bus type</p>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.acOnly}
                    onChange={e => setFilters(p => ({ ...p, acOnly: e.target.checked }))}
                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm text-charcoal dark:text-gray-200">AC only</span>
                </label>
                {['ac_luxury', 'ac_sleeper', 'ac_seater', 'non_ac_seater', 'non_ac_sleeper'].map(type => (
                  <label key={type} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.busTypes.includes(type)}
                      onChange={() => toggleFilter('busTypes', type)}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm text-charcoal dark:text-gray-200">{busTypeLabel[type]}</span>
                  </label>
                ))}
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <p className="text-sm font-bold text-charcoal dark:text-white mb-3">Max price: ₹{filters.maxPrice}</p>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={filters.maxPrice}
                  onChange={e => setFilters(p => ({ ...p, maxPrice: parseInt(e.target.value) }))}
                  className="w-full accent-brand-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹200</span>
                  <span>₹2000</span>
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="mb-5">
                <p className="text-sm font-bold text-charcoal dark:text-white mb-3">Minimum rating</p>
                {[4.5, 4.0, 3.5, 0].map(r => (
                  <label key={r} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === r}
                      onChange={() => setFilters(p => ({ ...p, minRating: r }))}
                      className="text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm text-charcoal dark:text-gray-200">{r === 0 ? 'Any rating' : `${r}★ & above`}</span>
                  </label>
                ))}
              </div>

              {/* Departure Time Slots */}
              <div>
                <p className="text-sm font-bold text-charcoal dark:text-white mb-3">Departure time</p>
                {[
                  { id: 'morning', label: 'Morning (6AM - 12PM)' },
                  { id: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
                  { id: 'evening', label: 'Evening (6PM - 12AM)' },
                  { id: 'night', label: 'Night (12AM - 6AM)' },
                ].map(slot => (
                  <label key={slot.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.departureSlots.includes(slot.id)}
                      onChange={() => toggleFilter('departureSlots', slot.id)}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm text-charcoal dark:text-gray-200">{slot.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results Main Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-charcoal dark:text-white">
                {loading
                  ? 'Searching available buses...'
                  : `${sortedFiltered.length} ${sortedFiltered.length === 1 ? 'bus' : 'buses'} available for ${fromParam} → ${toParam}`}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-xl text-sm font-semibold text-charcoal dark:text-white"
                >
                  <FiSliders size={14} /> Filters
                </button>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-xl text-sm font-semibold text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <BusCardSkeleton key={i} />)}
              </div>
            ) : trips.length === 0 ? (
              /* No scheduled trips found for this route */
              <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-3xl p-8 sm:p-12 text-center shadow-card">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-5">
                  <FiMapPin size={32} />
                </div>
                <h3 className="text-xl font-bold text-charcoal dark:text-white mb-2">
                  No direct buses found for {fromParam} → {toParam}
                </h3>
                <p className="text-sm text-charcoal-lighter dark:text-gray-400 max-w-lg mx-auto mb-6">
                  We currently do not have direct scheduled bus operators between {fromParam} and {toParam} on{' '}
                  {format(new Date(dateParam), 'dd MMM yyyy')}. You can modify your search or check one of our popular intercity routes below.
                </p>

                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-400 mb-3">
                    Popular Routes Available:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                    {POPULAR_ROUTES.slice(0, 6).map(r => (
                      <button
                        key={`${r.from}-${r.to}`}
                        onClick={() => handleQuickRoutePick(r.from, r.to)}
                        className="text-xs px-3.5 py-1.5 rounded-full bg-surface-muted dark:bg-surface-muted-dark hover:bg-brand-primary/10 hover:text-brand-primary border border-border dark:border-border-dark transition-all font-semibold text-charcoal dark:text-gray-200"
                      >
                        {r.from} → {r.to}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={() => setModifyOpen(true)}
                    variant="primary"
                    size="md"
                    leftIcon={<FiFilter size={15} />}
                  >
                    Modify Route / Date
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    size="md"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            ) : sortedFiltered.length === 0 ? (
              /* Trips exist for route, but filters excluded all of them */
              <EmptyState
                icon={FiSliders}
                title="No buses match your filters"
                description="Try loosening your price range, departure time, or bus type filters to see more results."
                action={
                  <Button onClick={resetFilters} variant="primary" size="md">
                    Reset All Filters
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {sortedFiltered.map((trip, idx) => {
                  const smartBadge = getSmartBadge(trip)
                  return (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <BusCard
                        trip={trip}
                        smartBadge={smartBadge}
                        onBook={handleBookNow}
                        onDetails={() => navigate(`/bus/${trip.bus.id}`)}
                      />
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative ml-auto w-full max-w-xs bg-white dark:bg-surface-card-dark h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border dark:border-border-dark mb-5">
                  <h3 className="font-bold text-lg text-charcoal dark:text-white">Filter Buses</h3>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="p-1 rounded-lg text-charcoal dark:text-gray-300 hover:bg-surface-muted dark:hover:bg-surface-muted-dark"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Filter controls */}
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-bold text-charcoal dark:text-white mb-2">Bus Type</p>
                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.acOnly}
                        onChange={e => setFilters(p => ({ ...p, acOnly: e.target.checked }))}
                        className="rounded border-gray-300 text-brand-primary"
                      />
                      <span className="text-sm text-charcoal dark:text-gray-200">AC only</span>
                    </label>
                    {['ac_luxury', 'ac_sleeper', 'ac_seater', 'non_ac_seater', 'non_ac_sleeper'].map(type => (
                      <label key={type} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.busTypes.includes(type)}
                          onChange={() => toggleFilter('busTypes', type)}
                          className="rounded border-gray-300 text-brand-primary"
                        />
                        <span className="text-sm text-charcoal dark:text-gray-200">{busTypeLabel[type]}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-charcoal dark:text-white mb-2">Max Price: ₹{filters.maxPrice}</p>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="50"
                      value={filters.maxPrice}
                      onChange={e => setFilters(p => ({ ...p, maxPrice: parseInt(e.target.value) }))}
                      className="w-full accent-brand-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border dark:border-border-dark flex gap-3">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  size="md"
                  fullWidth
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setFilterOpen(false)}
                  variant="primary"
                  size="md"
                  fullWidth
                >
                  Apply
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}

// Route-accurate BusCard Component
const BusCard = ({ trip, smartBadge, onBook, onDetails }) => {
  const { bus, route, fare, available_seats, departure_time, arrival_time, boarding_points, dropping_points } = trip
  const [selectedBoarding, setSelectedBoarding] = useState(boarding_points?.[0] || '')
  const [selectedDropping, setSelectedDropping] = useState(dropping_points?.[0] || '')

  useEffect(() => {
    if (boarding_points?.length) setSelectedBoarding(boarding_points[0])
    if (dropping_points?.length) setSelectedDropping(dropping_points[0])
  }, [boarding_points, dropping_points])

  const seatsLeft = available_seats
  const seatsColor = seatsLeft <= 5 ? 'text-red-500' : seatsLeft <= 15 ? 'text-amber-600 dark:text-amber-400' : 'text-success'

  const operatorName = bus?.operator?.company_name || 'RouteRush Travels'
  const busName = bus?.name || 'Multi-Axle Coach'
  const fromCityName = route?.from_city?.name || 'Origin'
  const toCityName = route?.to_city?.name || 'Destination'

  return (
    <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-200 hover:border-brand-primary/30">
      {smartBadge && (
        <div className={`px-5 py-1.5 text-xs font-bold ${
          smartBadge.variant === 'success' ? 'bg-success text-white' :
          smartBadge.variant === 'info' ? 'bg-blue-500 text-white' :
          'bg-brand-primary text-white'
        }`}>
          {smartBadge.label}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Real Bus Operator Brand Logo (Strictly Preserved) */}
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-brand-primary/20">
              <img src="/bus-logo.jpg" alt={operatorName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-charcoal dark:text-white text-base">{operatorName}</h3>
                <Badge variant={bus?.bus_type?.includes('luxury') || bus?.bus_type?.includes('volvo') ? 'primary' : 'muted'} className="text-xs">
                  {busTypeLabel[bus?.bus_type] || 'Standard Coach'}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{busName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating rating={bus?.operator?.rating || 4.5} size={12} />
                <span className="text-xs text-gray-400">({(bus?.operator?.total_reviews || 1200).toLocaleString()})</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-charcoal dark:text-white">₹{fare}</p>
            <p className="text-xs text-gray-400">per seat</p>
          </div>
        </div>

        {/* Dynamic Route Schedule and Distance Bar */}
        <div className="flex items-center justify-between mb-4 bg-surface-muted dark:bg-surface-muted-dark rounded-xl p-4">
          <div className="text-center min-w-[90px]">
            <p className="text-xl font-black text-charcoal dark:text-white">{formatTime(departure_time)}</p>
            <p className="text-xs font-semibold text-charcoal-lighter dark:text-gray-300 mt-1">{fromCityName}</p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 mx-4">
            <p className="text-xs text-gray-400 font-semibold">{getDuration(departure_time, arrival_time)}</p>
            <div className="w-full flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-primary flex-shrink-0" />
              <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-primary to-emerald-500 relative" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            </div>
            <p className="text-xs text-brand-primary font-bold">{route?.distance_km} km</p>
          </div>
          <div className="text-center min-w-[90px]">
            <p className="text-xl font-black text-charcoal dark:text-white">{formatTime(arrival_time)}</p>
            <p className="text-xs font-semibold text-charcoal-lighter dark:text-gray-300 mt-1">{toCityName}</p>
          </div>
        </div>

        {/* Bus Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(bus?.amenities || ['wifi', 'charging', 'ac']).slice(0, 5).map(a => (
            <span key={a} className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-muted dark:bg-surface-muted-dark rounded-lg text-xs text-charcoal dark:text-gray-300 font-medium">
              {amenityIconMap[a] || <FiCheck size={12} className="text-brand-primary" />} {a.replace('_', ' ')}
            </span>
          ))}
          {(bus?.amenities?.length || 0) > 5 && (
            <span className="px-2.5 py-1 bg-surface-muted dark:bg-surface-muted-dark rounded-lg text-xs text-gray-400">
              +{bus.amenities.length - 5} more
            </span>
          )}
        </div>

        {/* Route Boarding & Dropping Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Boarding ({fromCityName})</p>
            <select
              value={selectedBoarding}
              onChange={e => setSelectedBoarding(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              {(boarding_points || []).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Dropping ({toCityName})</p>
            <select
              value={selectedDropping}
              onChange={e => setSelectedDropping(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              {(dropping_points || []).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border-dark">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-bold ${seatsColor}`}>
              {seatsLeft <= 5 ? `Only ${seatsLeft}` : seatsLeft} seats left
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onDetails}>Details</Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBook(trip, selectedBoarding, selectedDropping)}
              rightIcon={<FiArrowRight size={14} />}
            >
              Book now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
