import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiMapPin, FiCalendar, FiUsers, FiArrowRight, FiSearch,
  FiChevronRight, FiStar, FiShield, FiZap, FiHeadphones,
  FiRefreshCw, FiRepeat, FiAlertTriangle
} from 'react-icons/fi'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/common/Button'
import StarRating from '../../components/common/StarRating'
import Badge from '../../components/common/Badge'
import { POPULAR_CITIES, POPULAR_ROUTES, TESTIMONIALS, WHY_CHOOSE_US } from '../../constants'
import { ALL_CITIES, normalizeCity } from '../../data/routeData'
import { getOffers, getOperators } from '../../services/busService'

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const HomePage = () => {
  const navigate = useNavigate()
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [passengers, setPassengers] = useState(1)
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [showFromSugg, setShowFromSugg] = useState(false)
  const [showToSugg, setShowToSugg] = useState(false)
  const [offers, setOffers] = useState([])
  const [operators, setOperators] = useState([])
  const fromRef = useRef(null)
  const toRef = useRef(null)

  useEffect(() => {
    getOffers().then(setOffers).catch(() => {})
    getOperators().then(setOperators).catch(() => {})
  }, [])

  const [searchError, setSearchError] = useState('')

  const filterCities = (query) => {
    if (!query) return ALL_CITIES.filter(c => c.popular).slice(0, 8)
    const q = query.toLowerCase().trim()
    return ALL_CITIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.aliases && c.aliases.some(a => a.toLowerCase().includes(q)))
    ).slice(0, 8)
  }

  const handleFromInput = (val) => {
    setFromCity(val)
    setFromSuggestions(filterCities(val))
    setShowFromSugg(true)
    if (searchError) setSearchError('')
  }

  const handleToInput = (val) => {
    setToCity(val)
    setToSuggestions(filterCities(val))
    setShowToSugg(true)
    if (searchError) setSearchError('')
  }

  const swapCities = () => {
    const temp = fromCity
    setFromCity(toCity)
    setToCity(temp)
    if (searchError) setSearchError('')
  }

  const handleSearch = () => {
    const normFrom = normalizeCity(fromCity)
    const normTo = normalizeCity(toCity)

    if (!normFrom || !normTo) {
      setSearchError('Please specify both departure and destination cities.')
      return
    }

    if (normFrom === normTo) {
      setSearchError('Departure and destination cannot be the same city.')
      return
    }

    setSearchError('')
    navigate(`/search?from=${encodeURIComponent(normFrom)}&to=${encodeURIComponent(normTo)}&date=${date}&passengers=${passengers}`)
  }

  const todayMin = new Date().toISOString().split('T')[0]

  const iconMap = {
    Shield: FiShield, Zap: FiZap, MapPin: FiMapPin, Star: FiStar,
    RefreshCw: FiRefreshCw, Headphones: FiHeadphones,
  }

  return (
    <PageWrapper title="Home">
      {/* 
        HERO SECTION:
        Preserves dark navy/midnight concept, RouteRush branding, and existing headings.
        Enhanced with refined 3D depth, ambient lighting, layered glassmorphism,
        and subtle perspective shadows without heavy libraries.
      */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-hero-gradient pt-24 pb-20">
        
        {/* Layer 1: Ambient 3D Depth Lighting & Radial Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top subtle coral ambient light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-primary/15 rounded-full blur-[120px]" />
          
          {/* Deep Navy/Cyan secondary light spheres */}
          <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 -right-32 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[150px]" />
          
          {/* Subtle 3D Perspective Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold text-white/90 mb-6 shadow-sm transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span>RouteRush Intercity Bus Booking Platform</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 leading-[1.1] font-display tracking-tight"
          >
            Travel smarter,
            <br />
            <span className="bg-gradient-to-r from-brand-primary via-[#F48C74] to-brand-hover bg-clip-text text-transparent drop-shadow-sm">
              book faster
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          >
            Search routes, compare verified operators, and reserve your next intercity journey with a modern, effortless booking experience.
          </motion.p>

          {/* 
            Search Card:
            Enhanced with subtle 3D layered glassmorphism, multi-stop borders,
            tactile inputs, and refined dropdown menus
          */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="relative rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto backdrop-blur-xl bg-[#0F1B33]/80 border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all"
          >
            {/* Ambient edge highlight */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-left">
              {/* Departure Input */}
              <div className="relative" ref={fromRef}>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-2">
                  From City
                </label>
                <div className="relative group">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary transition-transform group-focus-within:scale-110" size={17} />
                  <input
                    value={fromCity}
                    onChange={e => handleFromInput(e.target.value)}
                    onFocus={() => setShowFromSugg(true)}
                    onBlur={() => setTimeout(() => setShowFromSugg(false), 200)}
                    placeholder="e.g. Chennai"
                    className="w-full pl-10 pr-3 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-brand-primary rounded-xl text-white placeholder-white/40 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                {showFromSugg && fromSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-card-dark rounded-xl shadow-2xl border border-border dark:border-border-dark z-50 overflow-hidden text-left">
                    {fromSuggestions.map(c => (
                      <button
                        key={c.id}
                        onMouseDown={() => { setFromCity(c.name); setShowFromSugg(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal dark:text-white hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
                      >
                        <FiMapPin size={14} className="text-brand-primary flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-xs sm:text-sm">{c.name}</p>
                          <p className="text-[11px] text-gray-400">{c.state}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div className="relative" ref={toRef}>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-2">
                  To City
                </label>
                <div className="relative group">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary transition-transform group-focus-within:scale-110" size={17} />
                  <input
                    value={toCity}
                    onChange={e => handleToInput(e.target.value)}
                    onFocus={() => setShowToSugg(true)}
                    onBlur={() => setTimeout(() => setShowToSugg(false), 200)}
                    placeholder="e.g. Bangalore"
                    className="w-full pl-10 pr-3 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-brand-primary rounded-xl text-white placeholder-white/40 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                {showToSugg && toSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-card-dark rounded-xl shadow-2xl border border-border dark:border-border-dark z-50 overflow-hidden text-left">
                    {toSuggestions.map(c => (
                      <button
                        key={c.id}
                        onMouseDown={() => { setToCity(c.name); setShowToSugg(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal dark:text-white hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
                      >
                        <FiMapPin size={14} className="text-brand-primary flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-xs sm:text-sm">{c.name}</p>
                          <p className="text-[11px] text-gray-400">{c.state}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Journey Date
                </label>
                <div className="relative group">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary" size={17} />
                  <input
                    type="date"
                    value={date}
                    min={todayMin}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-brand-primary rounded-xl text-white text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
              </div>

              {/* Passengers Stepper */}
              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Passengers
                </label>
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl py-2 px-3">
                  <FiUsers className="text-brand-primary flex-shrink-0" size={17} />
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-brand-primary text-white flex items-center justify-center font-bold text-sm transition-colors active:scale-95"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-white font-bold text-sm">{passengers}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(10, passengers + 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-brand-primary text-white flex items-center justify-center font-bold text-sm transition-colors active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Inline Search Validation Alert */}
            {searchError && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-left">
                <FiAlertTriangle size={15} className="flex-shrink-0 text-rose-400" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={swapCities}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all active:scale-95"
              >
                <FiRepeat size={14} className="text-brand-primary" /> Swap Cities
              </button>

              <Button
                variant="primary"
                size="lg"
                className="flex-1 sm:flex-initial sm:min-w-[200px] shadow-brand-lg"
                leftIcon={<FiSearch size={18} />}
                onClick={handleSearch}
              >
                Search Buses
              </Button>
            </div>

            {/* Popular Quick-Pick Routes */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-left">
              <span className="text-white/60 text-xs font-medium">Quick Routes:</span>
              {POPULAR_ROUTES.slice(0, 4).map(r => (
                <button
                  key={`${r.from}-${r.to}`}
                  type="button"
                  onClick={() => {
                    setFromCity(r.from)
                    setToCity(r.to)
                    setSearchError('')
                  }}
                  className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-white/80 hover:text-white hover:border-brand-primary transition-all active:scale-95"
                >
                  {r.from} → {r.to}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 
            CRITICAL REQUIREMENT: PRESERVE REAL BUS FLEET IMAGE (/real-bus.png).
            Enhanced with subtle 3D depth framing & ambient highlight
          */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative group text-left transition-transform duration-300 hover:shadow-brand"
          >
            <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-900">
              <img
                src="/real-bus.png"
                alt="RouteRush Premium Intercity Bus Fleet"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Next-Gen Luxury Coaches
                  </span>
                </div>
                <h3 className="text-white text-lg sm:text-2xl font-black">
                  Premium Multi-Axle Fleets Across India
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
                  Air suspension, deep reclining berths, live GPS tracking & certified sanitized coaches on 500+ routes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-14 mt-12"
          >
            {[
              { value: '50,000+', label: 'Happy Travelers' },
              { value: '100+', label: 'Bus Operators' },
              { value: '500+', label: 'Verified Routes' },
              { value: '4.8 / 5', label: 'Average Rating' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-brand-primary">{stat.value}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 
          Hero Bottom Curve Divider:
          Smooth transition matching the theme surface background (#F5F7FA in light mode, #0B1120 in dark mode)
          without any hardcoded black/yellow cuts
        */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 sm:h-12 preserve-3d">
            <path
              d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 60 0 30V60Z"
              className="fill-surface dark:fill-surface-dark transition-colors duration-300"
            />
          </svg>
        </div>
      </section>

      {/* Special Offers Section */}
      {offers.length > 0 && (
        <section className="py-16 bg-surface dark:bg-surface-dark transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-charcoal dark:text-white font-display">Special Offers</h2>
                <p className="text-charcoal-lighter dark:text-gray-400 text-sm mt-1">Exclusive discounts on your favorite intercity routes.</p>
              </div>
            </motion.div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {offers.map(offer => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-shrink-0 w-72 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${offer.banner_color || '#F26B4F'}, ${offer.banner_color ? offer.banner_color + 'cc' : '#E05335'})` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-white/20 border border-white/30 rounded-xl px-3 py-1 text-sm font-black">{offer.code}</span>
                    <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-md">Offer</span>
                  </div>
                  <h3 className="text-lg font-black mb-1">{offer.title}</h3>
                  <p className="text-sm text-white/90 mb-3">{offer.description}</p>
                  <div className="flex items-center justify-between border-t border-white/20 pt-3">
                    <span className="text-xl font-black">
                      {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                    </span>
                    <span className="text-xs text-white/80">
                      Min ₹{offer.min_amount}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Routes Section */}
      <section className="py-16 bg-surface-muted dark:bg-surface-muted-dark transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-charcoal dark:text-white font-display mb-3">
              Popular Routes
            </h2>
            <p className="text-charcoal-lighter dark:text-gray-400 text-sm max-w-lg mx-auto">
              Most frequented travel corridors connecting key economic and cultural hubs.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {POPULAR_ROUTES.map((route) => (
              <motion.div
                key={`${route.from}-${route.to}`}
                variants={fadeInUp}
                onClick={() => {
                  setFromCity(route.from)
                  setToCity(route.to)
                  navigate(`/search?from=${route.from}&to=${route.to}&date=${date}&passengers=1`)
                }}
                className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-5 cursor-pointer group transition-all duration-200 hover:shadow-card-hover hover:border-brand-primary/40 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-light dark:bg-brand-primary/10 flex items-center justify-center">
                      <FiMapPin className="text-brand-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400 font-medium">{route.distance}</p>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400">{route.avgTime}</p>
                    </div>
                  </div>
                  <Badge variant="primary">From ₹{route.avgFare}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-base font-black text-charcoal dark:text-white">{route.from}</p>
                    <p className="text-xs text-charcoal-lighter dark:text-gray-400">Boarding</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-brand-primary" />
                    <div className="flex-1 w-16 h-0.5 bg-gradient-to-r from-brand-primary to-emerald-500" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-base font-black text-charcoal dark:text-white">{route.to}</p>
                    <p className="text-xs text-charcoal-lighter dark:text-gray-400">Dropping</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border dark:border-border-dark flex items-center justify-between">
                  <span className="text-xs text-charcoal-lighter dark:text-gray-400">Multiple departures daily</span>
                  <FiArrowRight className="text-brand-primary group-hover:translate-x-1 transition-transform" size={16} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Operators Section */}
      <section className="py-16 bg-surface dark:bg-surface-dark transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-black text-charcoal dark:text-white font-display">Top Bus Operators</h2>
              <p className="text-charcoal-lighter dark:text-gray-400 text-sm mt-1">Verified partner fleets offering verified safety & punctuality.</p>
            </div>
            <Button variant="outline" size="sm" rightIcon={<FiChevronRight />} onClick={() => navigate('/search')}>
              View All
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(operators.length > 0 ? operators : [
              { id: 1, company_name: 'Orange Travels', rating: 4.7, total_reviews: 2340 },
              { id: 2, company_name: 'KPN Travels', rating: 4.5, total_reviews: 1890 },
              { id: 3, company_name: 'SRS Travels', rating: 4.3, total_reviews: 1560 },
              { id: 4, company_name: 'VRL Travels', rating: 4.4, total_reviews: 2100 },
              { id: 5, company_name: 'Parveen Travels', rating: 4.2, total_reviews: 980 },
              { id: 6, company_name: 'IntrCity SmartBus', rating: 4.6, total_reviews: 3200 },
              { id: 7, company_name: 'Kallada Tours', rating: 4.5, total_reviews: 1450 },
              { id: 8, company_name: 'TNSTC', rating: 4.0, total_reviews: 5600 },
            ]).slice(0, 8).map((op, i) => (
              <motion.div
                key={op.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-5 text-center hover:shadow-card-hover hover:border-brand-primary/30 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-light dark:bg-brand-primary/10 flex items-center justify-center mx-auto mb-3 text-2xl font-black text-brand-primary">
                  {op.company_name.charAt(0)}
                </div>
                <h3 className="text-sm font-bold text-charcoal dark:text-white mb-1 truncate">{op.company_name}</h3>
                <StarRating rating={op.rating} size={12} />
                <p className="text-xs text-charcoal-lighter dark:text-gray-400 mt-1">{op.total_reviews?.toLocaleString()} reviews</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-surface-muted dark:bg-surface-muted-dark transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-charcoal dark:text-white font-display mb-3">
              Why Travelers Choose RouteRush
            </h2>
            <p className="text-charcoal-lighter dark:text-gray-400 text-sm max-w-lg mx-auto">
              Transparent seat layouts, zero hidden charges, and dedicated customer assistance.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((feature, i) => {
              const Icon = iconMap[feature.icon] || FiZap
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-6 hover:shadow-card-hover hover:border-brand-primary/30 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-light dark:bg-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-charcoal dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-charcoal-lighter dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-surface dark:bg-surface-dark transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-charcoal dark:text-white font-display mb-3">
              What Travelers Say
            </h2>
            <p className="text-charcoal-lighter dark:text-gray-400 text-sm">Verified feedback from real passengers across India.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-5 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-charcoal dark:text-white">{t.name}</p>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400">{t.location}</p>
                    </div>
                  </div>
                  <StarRating rating={t.rating} size={13} className="mb-3" />
                  <p className="text-sm text-charcoal dark:text-gray-300 leading-relaxed mb-3">"{t.comment}"</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-charcoal-lighter dark:text-gray-400 border-t border-border dark:border-border-dark pt-3 mt-2">
                  <FiMapPin size={12} className="text-brand-primary" />
                  <span>{t.route}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Footer Call to Action */}
      <section className="py-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display mb-4 tracking-tight">
              Ready to Book Your Next Journey?
            </h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto text-sm sm:text-base font-medium">
              Join thousands of travelers who choose RouteRush for comfortable, reliable intercity travel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="xl" leftIcon={<FiSearch />} onClick={() => navigate('/search')} className="shadow-brand-lg">
                Search Buses Now
              </Button>
              <Button variant="white" size="xl" onClick={() => navigate('/auth?tab=register')}>
                Create Free Account
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}

export default HomePage
