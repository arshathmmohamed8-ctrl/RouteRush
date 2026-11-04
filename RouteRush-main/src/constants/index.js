import {
  ALL_CITIES,
  TAMIL_NADU_CITIES,
  INTERCITY_DESTINATIONS,
  CITY_BOARDING_POINTS,
  CITY_DROPPING_POINTS,
} from '../data/routeData'

export {
  ALL_CITIES,
  TAMIL_NADU_CITIES,
  INTERCITY_DESTINATIONS,
  CITY_BOARDING_POINTS,
  CITY_DROPPING_POINTS,
}

// App Routes
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  SEARCH: '/search',
  BUS_DETAILS: '/bus/:id',
  SEAT_SELECTION: '/book/seats',
  PASSENGER_DETAILS: '/book/passengers',
  PAYMENT: '/book/payment',
  BOOKING_CONFIRMATION: '/book/confirmation',
  MY_BOOKINGS: '/my-bookings',
  PROFILE: '/profile',
  CONTACT: '/contact',
  OPERATOR_DASHBOARD: '/operator/dashboard',
  OPERATOR_BUSES: '/operator/buses',
  OPERATOR_TRIPS: '/operator/trips',
  OPERATOR_BOOKINGS: '/operator/bookings',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_OPERATORS: '/admin/operators',
  ADMIN_BUSES: '/admin/buses',
  ADMIN_ROUTES: '/admin/routes',
  ADMIN_TRIPS: '/admin/trips',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_OFFERS: '/admin/offers',
  ADMIN_REVIEWS: '/admin/reviews',
}

// Bus Types
export const BUS_TYPES = [
  { value: 'ac_seater', label: 'AC Seater', icon: 'AC' },
  { value: 'non_ac_seater', label: 'Non-AC Seater', icon: 'Standard' },
  { value: 'ac_sleeper', label: 'AC Sleeper', icon: 'Sleeper' },
  { value: 'non_ac_sleeper', label: 'Non-AC Sleeper', icon: 'Sleeper' },
  { value: 'ac_luxury', label: 'AC Luxury', icon: 'Luxury' },
  { value: 'volvo', label: 'Volvo', icon: 'Volvo' },
  { value: 'mini', label: 'Mini Bus', icon: 'Mini' },
]

// Amenities
export const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: 'Wifi' },
  { id: 'charging', label: 'Charging Point', icon: 'Zap' },
  { id: 'blanket', label: 'Blanket', icon: 'Wind' },
  { id: 'water', label: 'Water Bottle', icon: 'Droplets' },
  { id: 'snacks', label: 'Snacks', icon: 'Cookie' },
  { id: 'ac', label: 'Air Conditioning', icon: 'Thermometer' },
  { id: 'reading_light', label: 'Reading Light', icon: 'Lightbulb' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Monitor' },
  { id: 'gps', label: 'GPS Tracking', icon: 'MapPin' },
  { id: 'cctv', label: 'CCTV', icon: 'Camera' },
  { id: 'fire_extinguisher', label: 'Fire Extinguisher', icon: 'Flame' },
  { id: 'first_aid', label: 'First Aid', icon: 'HeartPulse' },
]

// Popular Cities
export const POPULAR_CITIES = ALL_CITIES.filter(c => c.popular)

// Popular Routes
export const POPULAR_ROUTES = [
  { from: 'Chennai', to: 'Madurai', distance: '460 km', avgTime: '7h 30m', avgFare: 550 },
  { from: 'Chennai', to: 'Coimbatore', distance: '500 km', avgTime: '8h 00m', avgFare: 580 },
  { from: 'Chennai', to: 'Bangalore', distance: '350 km', avgTime: '6h 30m', avgFare: 480 },
  { from: 'Madurai', to: 'Chennai', distance: '460 km', avgTime: '7h 30m', avgFare: 550 },
  { from: 'Coimbatore', to: 'Salem', distance: '165 km', avgTime: '3h 15m', avgFare: 260 },
  { from: 'Bangalore', to: 'Chennai', distance: '350 km', avgTime: '6h 30m', avgFare: 480 },
  { from: 'Chennai', to: 'Tiruchirappalli (Trichy)', distance: '330 km', avgTime: '5h 45m', avgFare: 420 },
  { from: 'Coimbatore', to: 'Bangalore', distance: '360 km', avgTime: '6h 45m', avgFare: 520 },
  { from: 'Bangalore', to: 'Hyderabad', distance: '570 km', avgTime: '9h 00m', avgFare: 650 },
  { from: 'Mumbai', to: 'Pune', distance: '150 km', avgTime: '3h 00m', avgFare: 250 },
]

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

// Seat Types
export const SEAT_TYPES = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked',
  LADIES: 'ladies',
  PREMIUM: 'premium',
}

// User Roles
export const USER_ROLES = {
  TRAVELER: 'traveler',
  OPERATOR: 'operator',
  ADMIN: 'admin',
}

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', description: 'All major banks' },
  { id: 'wallet', label: 'Wallets', description: 'Paytm, Amazon Pay' },
]

// Tax rates
export const TAX_RATES = {
  GST: 0.05, // 5% GST on transport
  SERVICE_FEE: 40, // Fixed service fee in INR
}

// Sort options for bus listings
export const SORT_OPTIONS = [
  { value: 'departure_asc', label: 'Departure: Earliest First' },
  { value: 'departure_desc', label: 'Departure: Latest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'duration_asc', label: 'Duration: Shortest First' },
  { value: 'rating_desc', label: 'Rating: Highest First' },
]

// FAQ Data
export const FAQ_DATA = [
  {
    question: 'How do I book a bus ticket on RouteRush?',
    answer: 'Search for your route using the search form, select your preferred bus and timing, choose your seats, fill in passenger details, and proceed to payment. Your ticket will be confirmed immediately after the booking is completed.',
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking from the My Bookings section. Cancellations made 24 hours before departure are eligible for a full refund minus the service fee.',
  },
  {
    question: 'How do I get my ticket?',
    answer: 'After successful booking, your e-ticket is available in My Bookings. You can download or print it. Just show the QR code at boarding.',
  },
  {
    question: 'Is it safe to pay on RouteRush?',
    answer: 'Absolutely. We use industry-standard SSL encryption for all transactions. We support UPI, cards, net banking, and wallets for a secure payment experience.',
  },
  {
    question: 'What is the boarding point?',
    answer: 'Each bus has multiple boarding and dropping points. You can select your preferred boarding point during the booking process based on your convenience.',
  },
  {
    question: 'Can I modify my booking?',
    answer: 'Currently, modifications are not supported directly. Please cancel the existing booking and make a new one. We are working on a modification feature.',
  },
]

// Testimonials
export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Chennai',
    rating: 5,
    comment: 'RouteRush made my Chennai to Bangalore trip so smooth! The seat selection feature is amazing and the bus was super comfortable.',
    avatar: 'PS',
    route: 'Chennai → Bangalore',
  },
  {
    name: 'Rahul Krishnan',
    location: 'Bangalore',
    rating: 5,
    comment: 'Best bus booking experience I\'ve had. Clean UI, easy to navigate, and the multiple timing options per bus is a game-changer!',
    avatar: 'RK',
    route: 'Bangalore → Hyderabad',
  },
  {
    name: 'Ananya Nair',
    location: 'Kochi',
    rating: 4,
    comment: 'The app is beautiful and works perfectly. Found a great deal on a sleeper bus. Will definitely use RouteRush again!',
    avatar: 'AN',
    route: 'Kochi → Bangalore',
  },
  {
    name: 'Vikram Mehta',
    location: 'Mumbai',
    rating: 5,
    comment: 'Excellent platform! The real-time seat availability and fare updates when switching timings is incredibly useful.',
    avatar: 'VM',
    route: 'Mumbai → Pune',
  },
]

// Why Choose Us features
export const WHY_CHOOSE_US = [
  {
    icon: 'Shield',
    title: 'Safe & Secure',
    description: 'Industry-grade encryption for all your transactions and personal data.',
  },
  {
    icon: 'Zap',
    title: 'Instant Confirmation',
    description: 'Get your e-ticket instantly after booking. No waiting, no hassle.',
  },
  {
    icon: 'MapPin',
    title: 'Live Tracking',
    description: 'Track your bus in real-time and get notified about delays.',
  },
  {
    icon: 'Star',
    title: 'Verified Operators',
    description: 'All operators on RouteRush are verified and rated by real travelers.',
  },
  {
    icon: 'RefreshCw',
    title: 'Easy Cancellation',
    description: 'Cancel up to 2 hours before departure and get a hassle-free refund.',
  },
  {
    icon: 'Headphones',
    title: '24/7 Support',
    description: 'Our support team is always ready to help you with any issues.',
  },
]
