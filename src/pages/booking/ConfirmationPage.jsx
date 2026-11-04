import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CheckCircle, 
  Printer, 
  Home, 
  Calendar, 
  Bus, 
  User, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import Button from '../../components/common/Button';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (bookingData?.status === 'CONFIRMED' || bookingData?.referenceNumber || bookingData?.confirmedBooking?.referenceNumber) {
      setBooking(bookingData);
    } else {
      navigate('/');
    }
  }, [bookingData, navigate]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex items-center justify-center px-4">
        <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl shadow-card p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-charcoal dark:text-white">Booking Not Found</h2>
          <p className="text-charcoal-lighter dark:text-gray-400 mt-2 text-sm">
            We could not find an active confirmed reservation. Please search buses again.
          </p>
          <Button onClick={() => navigate('/')} variant="primary" size="md" className="mt-6 w-full">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const { passengers, referenceNumber, amountPaid, totalFare, trip, route, boardingPoint, droppingPoint } = booking;
  const fromCity = route?.from_city?.name || route?.fromCity || trip?.from || 'Origin';
  const toCity = route?.to_city?.name || route?.toCity || trip?.to || 'Destination';
  const date = trip?.departure_time || booking?.date;
  const refCode = referenceNumber || booking?.booking_ref || 'RR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const paidAmount = amountPaid || totalFare || booking?.totalAmount || 890;

  const qrData = JSON.stringify({
    ref: refCode,
    from: fromCity,
    to: toCity,
    date,
    seats: booking?.selectedSeats?.map(s => typeof s === 'string' ? s : (s.seatNumber || s.id)),
  });

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Icon & Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-5 shadow-sm"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl font-black text-charcoal dark:text-white font-display tracking-tight"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-2 text-sm sm:text-base text-charcoal-lighter dark:text-gray-400"
          >
            Your e-ticket & journey updates have been sent via SMS to your primary mobile.
          </motion.p>
        </div>

        {/* Digital Ticket Card */}
        <motion.div 
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-surface-card-dark rounded-3xl shadow-card-hover overflow-hidden border border-border dark:border-border-dark relative"
        >
          {/* Top colored accent ribbon */}
          <div className="h-2.5 bg-gradient-to-r from-brand-primary via-[#F48C74] to-brand-hover w-full" />
          
          <div className="p-6 sm:p-8">
            {/* Ticket Header & QR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-border dark:border-border-dark pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-400 mb-1">
                  PNR Reference Number
                </p>
                <p className="text-2xl sm:text-3xl font-black tracking-wider text-charcoal dark:text-white font-mono">
                  {refCode}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Paid ₹{paidAmount}
                  </span>
                  <span className="text-xs text-charcoal-lighter dark:text-gray-400">• Confirmed</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hidden sm:block">
                <QRCodeSVG value={qrData} size={90} level="M" />
              </div>
            </div>

            {/* Journey Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Left Column: Trip & Operator */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-400 flex items-center gap-2 mb-2">
                    <Bus className="w-4 h-4 text-brand-primary" />
                    Coach Information
                  </h3>
                  <p className="font-bold text-base text-charcoal dark:text-white">
                    {booking?.operator?.company_name || booking?.bus?.name || 'RouteRush Express'}
                  </p>
                  <p className="text-xs text-charcoal-lighter dark:text-gray-400 mt-0.5">
                    {booking?.trip?.bus?.bus_type ? booking.trip.bus.bus_type.replace('_', ' ').toUpperCase() : 'A/C MULTI-AXLE SLEEPER'}
                  </p>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-4 bg-surface dark:bg-surface-muted-dark/50 p-4 rounded-2xl border border-border dark:border-border-dark">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 bg-brand-primary rounded-full" />
                    <div className="w-0.5 h-10 bg-border dark:bg-border-dark" />
                    <div className="w-2.5 h-2.5 border-2 border-emerald-500 rounded-full" />
                  </div>
                  <div className="space-y-4 flex-1 text-xs">
                    <div>
                      <p className="font-black text-sm text-charcoal dark:text-white">
                        {trip?.departure_time ? new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:30 AM'}
                      </p>
                      <p className="text-charcoal-lighter dark:text-gray-400 font-medium">{fromCity} {boardingPoint ? `(${boardingPoint})` : ''}</p>
                    </div>
                    <div>
                      <p className="font-black text-sm text-charcoal dark:text-white">
                        {trip?.arrival_time ? new Date(trip.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '01:30 PM'}
                      </p>
                      <p className="text-charcoal-lighter dark:text-gray-400 font-medium">{toCity} {droppingPoint ? `(${droppingPoint})` : ''}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-charcoal-lighter dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-primary" />
                    <span>{date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Passengers */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-400 flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  Traveler Details ({passengers?.length || 1})
                </h3>
                <div className="bg-surface dark:bg-surface-muted-dark/50 rounded-2xl p-4 border border-border dark:border-border-dark">
                  <ul className="space-y-3">
                    {passengers && passengers.length > 0 ? (
                      passengers.map((p, idx) => (
                        <li key={idx} className="flex justify-between items-center pb-2.5 border-b border-border dark:border-border-dark last:border-0 last:pb-0">
                          <div>
                            <p className="font-bold text-sm text-charcoal dark:text-white">
                              {p.fullName || p.name || `Passenger ${idx + 1}`}
                            </p>
                            <p className="text-xs text-charcoal-lighter dark:text-gray-400">
                              {p.age ? `Age: ${p.age} Yrs` : 'Adult'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-light dark:bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                              Seat {p.seatNumber || p.seat_number || 'Confirmed'}
                            </span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="flex justify-between items-center">
                        <p className="font-bold text-sm text-charcoal dark:text-white">Confirmed Passenger</p>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-light text-brand-primary">Seat Confirmed</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Mobile QR */}
                <div className="mt-4 flex justify-center sm:hidden">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                    <QRCodeSVG value={qrData} size={110} level="M" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ticket Footer Action Bar */}
          <div className="bg-surface dark:bg-surface-muted-dark/60 px-6 py-4 border-t border-border dark:border-border-dark flex flex-wrap justify-between items-center gap-4">
            <p className="text-xs text-charcoal-lighter dark:text-gray-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Government issued photo ID required at boarding.</span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-xl text-xs font-bold text-charcoal dark:text-white hover:bg-surface dark:hover:bg-surface-muted-dark shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Ticket
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Navigation Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-3.5"
        >
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            size="md"
            leftIcon={<Home size={16} />}
            className="shadow-brand-lg"
          >
            Book Another Journey
          </Button>
          <Button
            onClick={() => navigate('/my-bookings')}
            variant="secondary"
            size="md"
            rightIcon={<ArrowRight size={16} />}
          >
            View My Bookings
          </Button>
        </motion.div>

      </div>
    </div>
  );
};

export default ConfirmationPage;
