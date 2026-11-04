import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  X,
  Compass,
  Info
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import Button from '../../components/common/Button';

// Deterministic seedable seat generation or realistic layout
const generateSeats = () => {
  const rows = 10;
  const cols = ['A', 'B', 'C', 'D'];
  const seats = [];

  for (let r = 1; r <= rows; r++) {
    cols.forEach(c => {
      // Deterministic layout with a few booked and premium seats
      const seatKey = `${r}${c}`;
      let status = 'available';
      let type = 'regular';

      // Rows 1-2 have some premium seats with legroom
      if (r <= 2) {
        type = 'premium';
      }

      // Pre-set some booked seats for realistic look
      if (['1B', '2D', '4A', '4B', '6C', '7A', '9C', '10D'].includes(seatKey)) {
        status = 'booked';
      }

      seats.push({
        id: seatKey,
        seatNumber: seatKey,
        row: r,
        col: c,
        status,
        type,
        fareModifier: type === 'premium' ? 100 : 0,
      });
    });
  }
  return seats;
};

// SVG Steering Wheel Icon for Driver Area
const SteeringWheelIcon = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2a10 10 0 0 0-3 19.5" opacity="0.3" />
    <path d="M12 5v4" />
    <path d="M4.93 15.07l3.54-1.41" />
    <path d="M19.07 15.07l-3.54-1.41" />
  </svg>
);

// Individual Refined Seat Component with Subtle Dimensionality
const BusSeat = ({ seat, isSelected, onToggle }) => {
  const isBooked = seat.status === 'booked';
  const isPremium = seat.type === 'premium';

  // Base styling for the seat based on state
  let seatContainerClass = 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-primary/60 hover:bg-slate-200 dark:hover:bg-slate-700';
  let headrestClass = 'bg-slate-300 dark:bg-slate-700';

  if (isBooked) {
    seatContainerClass = 'bg-slate-200/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50 shadow-none';
    headrestClass = 'bg-slate-300/50 dark:bg-slate-800/50';
  } else if (isSelected) {
    seatContainerClass = 'bg-brand-primary text-white border-brand-hover shadow-brand ring-2 ring-brand-primary/30';
    headrestClass = 'bg-white/40';
  } else if (isPremium) {
    seatContainerClass = 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20';
    headrestClass = 'bg-amber-500/30';
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(seat)}
      disabled={isBooked}
      aria-label={`Seat ${seat.id}${isBooked ? ' booked' : isSelected ? ' selected' : ''}${isPremium ? ' premium' : ''}`}
      className={`
        relative group flex flex-col items-center justify-between
        w-11 sm:w-12 h-13 sm:h-14 p-1 rounded-t-xl rounded-b-lg border
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary
        ${!isBooked && !isSelected ? 'hover:-translate-y-0.5 active:translate-y-0' : ''}
        ${seatContainerClass}
      `}
    >
      {/* Headrest Notch */}
      <div className={`w-6 sm:w-7 h-1.5 rounded-full transition-colors ${headrestClass}`} />

      {/* Seat Number */}
      <div className="flex flex-col items-center justify-center my-0.5">
        <span className={`text-xs font-bold tracking-tight ${isSelected ? 'text-white' : ''}`}>
          {seat.id}
        </span>
        {isPremium && !isSelected && !isBooked && (
          <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 leading-none">★</span>
        )}
      </div>

      {/* Bottom Cushion Edge */}
      <div className={`w-8 sm:w-9 h-1 rounded-sm opacity-40 ${isSelected ? 'bg-white' : 'bg-current'}`} />
    </button>
  );
};

export default function SeatSelectionPage() {
  const navigate = useNavigate();
  const {
    bookingData,
    toggleSeat,
    setBoardingPoint,
    setDroppingPoint,
    setBookingStep
  } = useBooking();

  const trip = bookingData?.trip || {};
  const bus = bookingData?.bus || {};
  const operator = bookingData?.operator || {};

  const busName = bus.name || trip.busName || 'Premium Air-Suspension Coach';
  const operatorName = operator.company_name || trip.operator || 'RouteRush Express';
  const baseFarePerSeat = Number(trip?.fare || bookingData?.fare || 850);
  
  const departureTime = trip?.departure_time
    ? new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : trip?.dep || '06:30 AM';
  const arrivalTime = trip?.arrival_time
    ? new Date(trip.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : trip?.arr || '01:30 PM';

  const fromCity = bookingData?.route?.from_city?.name || trip?.from || 'Origin';
  const toCity = bookingData?.route?.to_city?.name || trip?.to || 'Destination';

  const boardingPoints = Array.isArray(trip?.boarding_points) && trip.boarding_points.length > 0
    ? trip.boarding_points
    : Array.isArray(bookingData?.boardingPoints) && bookingData.boardingPoints.length > 0
      ? bookingData.boardingPoints
      : ['Main Terminal (Platform 4)', 'City Central Bypass'];

  const droppingPoints = Array.isArray(trip?.dropping_points) && trip.dropping_points.length > 0
    ? trip.dropping_points
    : Array.isArray(bookingData?.droppingPoints) && bookingData.droppingPoints.length > 0
      ? bookingData.droppingPoints
      : ['Destination Bus Station', 'Airport Junction Exit'];

  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState(bookingData?.boardingPoint || '');
  const [selectedDropping, setSelectedDropping] = useState(bookingData?.droppingPoint || '');

  useEffect(() => {
    setSeats(generateSeats());
  }, []);

  useEffect(() => {
    if (boardingPoints.length > 0 && (!selectedBoarding || !boardingPoints.includes(selectedBoarding))) {
      setSelectedBoarding(bookingData?.boardingPoint && boardingPoints.includes(bookingData.boardingPoint) ? bookingData.boardingPoint : boardingPoints[0]);
    }
    if (droppingPoints.length > 0 && (!selectedDropping || !droppingPoints.includes(selectedDropping))) {
      setSelectedDropping(bookingData?.droppingPoint && droppingPoints.includes(bookingData.droppingPoint) ? bookingData.droppingPoint : droppingPoints[0]);
    }
  }, [boardingPoints, droppingPoints, selectedBoarding, selectedDropping, bookingData?.boardingPoint, bookingData?.droppingPoint]);

  useEffect(() => {
    if (Array.isArray(bookingData?.selectedSeats) && bookingData.selectedSeats.length > 0) {
      setSelectedSeatIds(
        bookingData.selectedSeats.map(s => (typeof s === 'string' ? s : (s.seatNumber || s.id)))
      );
    } else {
      setSelectedSeatIds([]);
    }
  }, [bookingData?.selectedSeats]);

  const handleToggleSeat = (seat) => {
    if (seat.status === 'booked') return;
    const isSelected = selectedSeatIds.includes(seat.id);
    if (isSelected) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
    } else {
      setSelectedSeatIds(prev => [...prev, seat.id]);
    }

    const seatPayload = {
      id: seat.id,
      seatNumber: seat.id,
      type: seat.type,
      price: baseFarePerSeat + (seat.fareModifier || 0),
    };

    toggleSeat(seatPayload);
  };

  const selectedSeatDetails = useMemo(() => {
    return seats.filter(s => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  const baseFare = selectedSeatDetails.reduce((sum, s) => sum + baseFarePerSeat, 0);
  const premiumFees = selectedSeatDetails.reduce((sum, s) => sum + (s.fareModifier || 0), 0);
  const taxes = Math.round((baseFare + premiumFees) * 0.05);
  const serviceFee = selectedSeatIds.length > 0 ? 40 : 0;
  const totalFare = baseFare + premiumFees + taxes + serviceFee;

  const handleProceed = () => {
    if (selectedSeatIds.length === 0) return;

    setBoardingPoint(selectedBoarding);
    setDroppingPoint(selectedDropping);
    setBookingStep(1);
    navigate('/book/passengers');
  };

  if (!trip?.fare && !bookingData?.fare && Object.keys(trip || {}).length === 0) {
    return (
      <div className="bg-surface dark:bg-surface-dark min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-charcoal dark:text-white mb-2">No Trip Selected</h2>
          <p className="text-charcoal-lighter dark:text-gray-400 text-sm mb-6">
            Please search for available bus routes and select an operator to view seat availability.
          </p>
          <Button
            onClick={() => navigate('/search')}
            variant="primary"
            size="md"
            fullWidth
          >
            Search Buses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-surface-dark min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Stepper Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {/* Step 1 - Active */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white shadow-brand flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <span className="text-xs font-bold text-brand-primary">
                  Seats
                </span>
              </div>
              <div className="w-10 sm:w-16 h-0.5 bg-border dark:bg-border-dark mx-2" />
            </div>

            {/* Step 2 - Upcoming */}
            <div className="flex items-center opacity-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark text-charcoal-lighter dark:text-gray-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <span className="hidden sm:inline text-xs font-medium text-charcoal-lighter dark:text-gray-400">
                  Passengers
                </span>
              </div>
              <div className="w-10 sm:w-16 h-0.5 bg-border dark:bg-border-dark mx-2" />
            </div>

            {/* Step 3 - Upcoming */}
            <div className="flex items-center opacity-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark text-charcoal-lighter dark:text-gray-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <span className="hidden sm:inline text-xs font-medium text-charcoal-lighter dark:text-gray-400">
                  Payment
                </span>
              </div>
              <div className="w-10 sm:w-16 h-0.5 bg-border dark:bg-border-dark mx-2" />
            </div>

            {/* Step 4 - Upcoming */}
            <div className="flex items-center opacity-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark text-charcoal-lighter dark:text-gray-400 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <span className="hidden sm:inline text-xs font-medium text-charcoal-lighter dark:text-gray-400">
                  Confirm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal dark:text-white font-display tracking-tight">
              Select Your Seats
            </h1>
            <p className="text-sm text-charcoal-lighter dark:text-gray-400 mt-1">
              Click on an available seat to select. Front row seats offer extra legroom.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-lighter dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Change Bus Operator
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Bus Interior & Seat Map */}
          <div className="flex-1 w-full bg-white dark:bg-surface-card-dark p-6 sm:p-8 rounded-2xl shadow-card border border-border dark:border-border-dark">
            
            {/* Status Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pb-6 mb-8 border-b border-border dark:border-border-dark text-xs font-medium text-charcoal-lighter dark:text-gray-300">
              {/* Available */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
                <span>Available</span>
              </div>

              {/* Selected */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-brand-primary border border-brand-hover shadow-sm" />
                <span className="font-bold text-charcoal dark:text-white">Selected</span>
              </div>

              {/* Premium */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">
                  ★
                </div>
                <span>Premium (+₹100)</span>
              </div>

              {/* Booked */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 opacity-50" />
                <span>Booked</span>
              </div>
            </div>

            {/* Realistic Bus Interior Frame */}
            <div className="max-w-md mx-auto relative">
              {/* Bus Exterior Shell */}
              <div className="rounded-[36px] border-2 border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-[#0E1726] p-5 sm:p-7 shadow-inner relative">
                
                {/* Front Windshield & Driver Cabin */}
                <div className="mb-6 pb-4 border-b-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Front / Entrance</span>
                  </div>

                  {/* Driver Console */}
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm" title="Driver Cabin">
                    <SteeringWheelIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-[11px] font-bold">Driver</span>
                  </div>
                </div>

                {/* Seat Matrix 2 + Aisle + 2 */}
                <div className="space-y-3 sm:space-y-3.5">
                  {Array.from({ length: 10 }).map((_, rIdx) => {
                    const row = rIdx + 1;
                    const rowSeats = seats.filter(s => s.row === row);
                    const leftSeats = rowSeats.slice(0, 2);
                    const rightSeats = rowSeats.slice(2, 4);

                    return (
                      <div key={row} className="flex items-center justify-between">
                        {/* Left Side (A, B) */}
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          {leftSeats.map(seat => (
                            <BusSeat
                              key={seat.id}
                              seat={seat}
                              isSelected={selectedSeatIds.includes(seat.id)}
                              onToggle={handleToggleSeat}
                            />
                          ))}
                        </div>

                        {/* Aisle Path */}
                        <div className="flex-1 flex flex-col items-center justify-center px-1 sm:px-2">
                          <span className="text-[10px] font-mono text-slate-300 dark:text-slate-700 select-none">
                            {row}
                          </span>
                        </div>

                        {/* Right Side (C, D) */}
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          {rightSeats.map(seat => (
                            <BusSeat
                              key={seat.id}
                              seat={seat}
                              isSelected={selectedSeatIds.includes(seat.id)}
                              onToggle={handleToggleSeat}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Back Rest / Rear of the bus */}
                <div className="mt-6 pt-3 border-t-2 border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-600">
                    Rear of Coach
                  </span>
                </div>
              </div>
            </div>

            {/* Info note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-charcoal-lighter dark:text-gray-400">
              <Info className="w-4 h-4 text-brand-primary" />
              <span>Free cancellation up to 6 hours before departure.</span>
            </div>
          </div>

          {/* Right: Booking Summary & Details */}
          <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark overflow-hidden lg:sticky lg:top-24">
              
              {/* Operator & Route Header */}
              <div className="p-5 bg-gradient-to-br from-charcoal to-[#0A0E1A] dark:from-[#111827] dark:to-[#0B1120] text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-brand-primary">
                    Trip Overview
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium">
                    {bus?.bus_type ? bus.bus_type.replace('_', ' ').toUpperCase() : 'A/C LUXURY'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{operatorName}</h3>
                <p className="text-xs text-gray-300 mt-0.5">{busName}</p>

                {/* Times & Route */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-white">{departureTime}</p>
                    <p className="text-xs text-gray-300 truncate max-w-[100px]">{fromCity}</p>
                  </div>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-[10px] text-gray-400 font-medium">Direct</span>
                    <div className="flex items-center gap-1 my-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                      <div className="w-10 sm:w-14 h-0.5 bg-gradient-to-r from-brand-primary to-emerald-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">{arrivalTime}</p>
                    <p className="text-xs text-gray-300 truncate max-w-[100px]">{toCity}</p>
                  </div>
                </div>
              </div>

              {/* Form Selectors & Fare Calculation */}
              <div className="p-5 space-y-4">
                {/* Boarding Point */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                    Boarding Point
                  </label>
                  <select
                    value={selectedBoarding}
                    onChange={(e) => setSelectedBoarding(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-surface dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  >
                    {boardingPoints.map((bp, i) => (
                      <option key={i} value={bp}>{bp}</option>
                    ))}
                  </select>
                </div>

                {/* Dropping Point */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                    Dropping Point
                  </label>
                  <select
                    value={selectedDropping}
                    onChange={(e) => setSelectedDropping(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-surface dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  >
                    {droppingPoints.map((dp, i) => (
                      <option key={i} value={dp}>{dp}</option>
                    ))}
                  </select>
                </div>

                {/* Selected Seats Chips */}
                <div className="pt-3 border-t border-border dark:border-border-dark">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-400">
                      Selected Seats
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-light dark:bg-brand-primary/15 text-brand-primary">
                      {selectedSeatIds.length} {selectedSeatIds.length === 1 ? 'Seat' : 'Seats'}
                    </span>
                  </div>

                  {selectedSeatIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeatDetails.map(seat => (
                        <span
                          key={seat.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-light dark:bg-brand-primary/15 text-brand-primary border border-brand-primary/20"
                        >
                          Seat {seat.id} {seat.type === 'premium' && '★'}
                          <button
                            type="button"
                            onClick={() => handleToggleSeat(seat)}
                            className="hover:opacity-75 transition-opacity ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-charcoal-lighter dark:text-gray-400 italic">
                      Please click on any seat in the bus layout to select.
                    </p>
                  )}
                </div>

                {/* Fare Breakdown */}
                {selectedSeatIds.length > 0 && (
                  <div className="pt-3 border-t border-border dark:border-border-dark space-y-2 text-xs text-charcoal-lighter dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Base Fare ({selectedSeatIds.length} × ₹{baseFarePerSeat})</span>
                      <span className="font-semibold text-charcoal dark:text-white">₹{baseFare}</span>
                    </div>

                    {premiumFees > 0 && (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400">
                        <span>Premium Seat Upgrades</span>
                        <span className="font-semibold">+₹{premiumFees}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span className="font-semibold text-charcoal dark:text-white">₹{taxes}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span className="font-semibold text-charcoal dark:text-white">₹{serviceFee}</span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-base pt-2 border-t border-border dark:border-border-dark text-charcoal dark:text-white">
                      <span>Total Fare</span>
                      <span className="text-xl font-black text-brand-primary">₹{totalFare}</span>
                    </div>
                  </div>
                )}

                {/* Proceed Button */}
                <div className="pt-2">
                  <Button
                    onClick={handleProceed}
                    disabled={selectedSeatIds.length === 0}
                    variant="primary"
                    size="lg"
                    fullWidth
                    rightIcon={<ChevronRight size={18} />}
                    className="shadow-brand-lg"
                  >
                    {selectedSeatIds.length === 0
                      ? 'Select Seats to Proceed'
                      : `Proceed to Passengers (₹${totalFare})`}
                  </Button>
                </div>

                {/* Trust badge */}
                <div className="mt-3 flex items-center gap-2 text-xs text-charcoal-lighter dark:text-gray-400 bg-surface dark:bg-surface-muted-dark p-3 rounded-xl border border-border dark:border-border-dark">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Reserved seats held securely for 10 minutes.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
