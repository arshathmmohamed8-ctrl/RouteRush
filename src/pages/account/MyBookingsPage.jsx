import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  XCircle,
  CheckCircle,
  AlertCircle,
  Ticket,
  Printer
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAuth } from '../../context/AuthContext';

// Mock Data
const MOCK_BOOKINGS = [
  {
    id: 'RR3498DF',
    status: 'upcoming',
    operator: 'Orange Travels',
    busType: 'Volvo Multi-Axle A/C Semi Sleeper (2+2)',
    journeyDate: '2026-08-15',
    departureTime: '21:30',
    arrivalTime: '05:00',
    duration: '7h 30m',
    source: 'Chennai',
    destination: 'Bangalore',
    distance: '345 km',
    amount: 1450,
    passengers: [
      { id: 1, name: 'Rahul Sharma', age: 28, seat: '12A' },
      { id: 2, name: 'Pooja Sharma', age: 26, seat: '12B' }
    ]
  },
  {
    id: 'RR9283XY',
    status: 'completed',
    operator: 'KPN Travels',
    busType: 'Scania AC Sleeper (2+1)',
    journeyDate: '2026-06-10',
    departureTime: '22:00',
    arrivalTime: '07:30',
    duration: '9h 30m',
    source: 'Bangalore',
    destination: 'Hyderabad',
    distance: '570 km',
    amount: 2200,
    passengers: [
      { id: 1, name: 'Rahul Sharma', age: 28, seat: 'U4' }
    ]
  },
  {
    id: 'RR1122ZZ',
    status: 'cancelled',
    operator: 'VRL Travels',
    busType: 'Non-A/C Seater (2+2)',
    journeyDate: '2026-05-20',
    departureTime: '10:00',
    arrivalTime: '15:00',
    duration: '5h 00m',
    source: 'Mumbai',
    destination: 'Pune',
    distance: '150 km',
    amount: 450,
    passengers: [
      { id: 1, name: 'Rahul Sharma', age: 28, seat: '4C' }
    ]
  }
];

const BookingCard = ({ booking, onCancel }) => {
  const [showPassengers, setShowPassengers] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
            <CheckCircle className="w-3.5 h-3.5" /> Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 capitalize">
            <CheckCircle className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 capitalize">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-surface-muted dark:bg-surface-muted-dark text-charcoal-lighter capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark overflow-hidden mb-6 transition-all hover:shadow-card-hover">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-5 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark/40">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 bg-brand-light dark:bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-charcoal dark:text-white">{booking.operator}</h3>
            <p className="text-xs text-charcoal-lighter dark:text-gray-400">
              PNR: <span className="font-mono font-bold text-charcoal dark:text-gray-200">{booking.id}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center mt-3 sm:mt-0 space-x-4">
          {getStatusBadge(booking.status)}
          <div className="text-right">
            <p className="text-lg font-black text-brand-primary">₹{booking.amount}</p>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-400 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-primary" /> Journey Date
            </span>
            <span className="font-bold text-sm text-charcoal dark:text-white">
              {new Date(booking.journeyDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-xs text-charcoal-lighter dark:text-gray-400 mt-0.5">{booking.busType}</span>
          </div>

          <div className="flex items-center justify-between md:col-span-2">
            <div className="text-center md:text-left flex-1">
              <p className="text-xl font-black text-charcoal dark:text-white">{booking.departureTime}</p>
              <p className="font-semibold text-xs text-charcoal-lighter dark:text-gray-300">{booking.source}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center px-4">
              <span className="text-[11px] font-bold text-charcoal-lighter dark:text-gray-400 mb-1">{booking.duration}</span>
              <div className="w-full flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-brand-primary" />
                <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-primary to-emerald-500" />
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] text-charcoal-lighter dark:text-gray-400 mt-1">{booking.distance}</span>
            </div>

            <div className="text-center md:text-right flex-1">
              <p className="text-xl font-black text-charcoal dark:text-white">{booking.arrivalTime}</p>
              <p className="font-semibold text-xs text-charcoal-lighter dark:text-gray-300">{booking.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Passengers Accordion */}
      <div className="border-t border-border dark:border-border-dark">
        <button 
          type="button"
          onClick={() => setShowPassengers(!showPassengers)}
          className="w-full px-5 sm:px-6 py-3 flex items-center justify-between text-xs font-bold text-charcoal-lighter dark:text-gray-300 hover:bg-surface dark:hover:bg-surface-muted-dark/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-brand-primary" />
            Passenger & Seat Details ({booking.passengers.length})
          </span>
          {showPassengers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showPassengers && (
          <div className="px-5 sm:px-6 pb-4 pt-2 bg-surface dark:bg-surface-muted-dark/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {booking.passengers.map((p, idx) => (
                <div key={idx} className="bg-white dark:bg-surface-card-dark p-3.5 rounded-xl border border-border dark:border-border-dark shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-charcoal dark:text-white">{p.name}</p>
                    <p className="text-xs text-charcoal-lighter dark:text-gray-400">{p.age ? `Age: ${p.age} Yrs` : 'Confirmed'}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-light dark:bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                      Seat {p.seat}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border dark:border-border-dark flex justify-between items-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-lighter dark:text-gray-300 hover:text-brand-primary transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Ticket
              </button>
              {booking.status === 'upcoming' && (
                <button
                  type="button"
                  onClick={() => onCancel(booking.id)}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyStateBookings = ({ tab }) => (
  <div className="text-center py-16 bg-white dark:bg-surface-card-dark rounded-2xl border border-border dark:border-border-dark p-8">
    <div className="w-16 h-16 rounded-2xl bg-brand-light dark:bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
      <Ticket className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-bold text-charcoal dark:text-white capitalize">No {tab} Bookings</h3>
    <p className="text-sm text-charcoal-lighter dark:text-gray-400 mt-1 max-w-sm mx-auto">
      You don't have any {tab} trips right now. Plan your next journey with RouteRush.
    </p>
  </div>
);

const MyBookingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setBookings(MOCK_BOOKINGS);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching bookings", error);
        setBookings(MOCK_BOOKINGS);
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  const initiateCancel = (bookingId) => {
    setSelectedBookingToCancel(bookingId);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    setBookings(prev => prev.map(b => b.id === selectedBookingToCancel ? { ...b, status: 'cancelled' } : b));
    setCancelModalOpen(false);
    setSelectedBookingToCancel(null);
  };

  return (
    <PageWrapper title="My Bookings">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-charcoal dark:text-white font-display tracking-tight">
            My Bookings
          </h1>
          <p className="text-sm text-charcoal-lighter dark:text-gray-400 mt-1">
            View, download, and manage your bus journey tickets and PNR reservations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border dark:border-border-dark mb-8 overflow-x-auto scrollbar-hide">
          {['upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3.5 px-6 text-sm font-bold whitespace-nowrap transition-colors relative capitalize ${
                activeTab === tab 
                  ? 'text-brand-primary' 
                  : 'text-charcoal-lighter dark:text-gray-400 hover:text-charcoal dark:hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onCancel={initiateCancel} 
                />
              ))
            ) : (
              <EmptyStateBookings tab={activeTab} />
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-2xl max-w-md w-full p-6 border border-border dark:border-border-dark animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-charcoal dark:text-white mb-2">
              Cancel Booking?
            </h3>
            <p className="text-center text-xs text-charcoal-lighter dark:text-gray-400 mb-6">
              Are you sure you want to cancel this ticket? The standard cancellation refund policy applies and funds will be returned within 5-7 business days.
            </p>
            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-surface dark:bg-surface-muted-dark border border-border dark:border-border-dark text-charcoal dark:text-white text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Keep Booking
              </button>
              <button 
                type="button"
                onClick={confirmCancel}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors shadow-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default MyBookingsPage;
