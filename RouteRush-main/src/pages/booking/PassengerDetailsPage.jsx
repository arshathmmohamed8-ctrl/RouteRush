import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  ShieldCheck,
  Check,
  Bus,
  AlertCircle
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import Button from '../../components/common/Button';

const passengerSchema = z.object({
  passengers: z.array(
    z.object({
      seatNumber: z.string(),
      fullName: z
        .string()
        .trim()
        .min(2, 'Full name must be at least 2 characters')
        .max(60, 'Name is too long'),
      age: z
        .coerce
        .number({ invalid_type_error: 'Age must be a valid number' })
        .int('Age must be a whole number')
        .min(1, 'Please enter a valid age')
        .max(120, 'Please enter a valid age'),
    })
  ),
  contactInfo: z.object({
    primaryPhone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    alternatePhone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
      .optional()
      .or(z.literal('')),
  }),
});

const PassengerDetailsPage = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData, getFareBreakdown, setBookingStep } = useBooking();
  const selectedSeats = Array.isArray(bookingData?.selectedSeats) ? bookingData.selectedSeats : [];
  const trip = bookingData?.trip || {};
  const bus = bookingData?.bus || {};
  const operator = bookingData?.operator || {};

  const [fareSummary, setFareSummary] = useState({ baseFare: 0, taxes: 0, serviceFee: 0, total: 0 });

  const defaultValues = useMemo(() => {
    return {
      passengers: selectedSeats.map((seat) => ({
        seatNumber: typeof seat === 'string' ? seat : (seat.seatNumber || seat.seat_number || seat.id),
        fullName: '',
        age: '',
      })),
      contactInfo: {
        primaryPhone: bookingData?.contactInfo?.mobile || bookingData?.contactInfo?.primaryPhone || '',
        alternatePhone: bookingData?.contactInfo?.alternateMobile || bookingData?.contactInfo?.alternatePhone || '',
      },
    };
  }, [selectedSeats, bookingData?.contactInfo]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(passengerSchema),
    defaultValues,
  });

  const { fields: passengerFields } = useFieldArray({
    control,
    name: 'passengers',
  });

  useEffect(() => {
    if (selectedSeats.length === 0) {
      navigate('/search');
      return;
    }
    setFareSummary(getFareBreakdown());
  }, [selectedSeats, navigate, getFareBreakdown]);

  const onSubmit = (data) => {
    updateBookingData({
      passengers: data.passengers.map((p) => ({
        fullName: p.fullName,
        name: p.fullName,
        age: p.age,
        seatNumber: p.seatNumber,
        gender: 'Not Specified',
      })),
      contactInfo: {
        mobile: data.contactInfo.primaryPhone,
        primaryPhone: data.contactInfo.primaryPhone,
        alternateMobile: data.contactInfo.alternatePhone || '',
        alternatePhone: data.contactInfo.alternatePhone || '',
      },
    });
    setBookingStep(2);
    navigate('/book/payment');
  };

  if (selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex items-center justify-center px-4">
        <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl shadow-card p-8 text-center max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
            <Bus className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-charcoal dark:text-white">No seats selected</h2>
          <p className="text-charcoal-lighter dark:text-gray-400 mt-2 text-sm">
            Please choose your seats first to continue adding passenger details.
          </p>
          <Button
            onClick={() => navigate('/book/seats')}
            variant="primary"
            size="md"
            className="mt-6 w-full"
          >
            Back to Seat Selection
          </Button>
        </div>
      </div>
    );
  }

  const fromCityName = bookingData?.route?.from_city?.name || trip?.from || 'Origin';
  const toCityName = bookingData?.route?.to_city?.name || trip?.to || 'Destination';
  const depTimeFormatted = trip?.departure_time
    ? new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : trip?.dep || '06:30 AM';
  const arrTimeFormatted = trip?.arrival_time
    ? new Date(trip.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : trip?.arr || '01:30 PM';
  const departureDateFormatted = trip?.departure_time
    ? new Date(trip.departure_time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
    : 'Upcoming Trip';

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Stepper Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {/* Step 1 - Completed */}
            <div className="flex items-center">
              <div
                onClick={() => navigate('/book/seats')}
                className="flex items-center gap-2 cursor-pointer group"
                title="Change seats"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  <Check className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Seats
                </span>
              </div>
              <div className="w-10 sm:w-16 h-0.5 bg-emerald-500/40 mx-2" />
            </div>

            {/* Step 2 - Active */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white shadow-brand flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <span className="text-xs font-bold text-brand-primary">
                  Passengers
                </span>
              </div>
              <div className="w-10 sm:w-16 h-0.5 bg-border dark:bg-border-dark mx-2" />
            </div>

            {/* Step 3 - Upcoming */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 opacity-50">
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

        {/* Page Title & Context */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal dark:text-white font-display tracking-tight">
              Passenger Details
            </h1>
            <p className="text-sm text-charcoal-lighter dark:text-gray-400 mt-1">
              Quickly enter traveler names and primary contact number for ticket delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/book/seats')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-lighter dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Modify Seat Selection
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Form Area */}
          <div className="flex-1 w-full space-y-6">
            <form id="passenger-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Passenger Cards Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-primary" />
                    <h2 className="text-base font-bold text-charcoal dark:text-white">
                      Travelers Information ({passengerFields.length})
                    </h2>
                  </div>
                  <span className="text-xs text-charcoal-lighter dark:text-gray-400">
                    Govt ID required at boarding
                  </span>
                </div>

                {passengerFields.map((field, index) => {
                  const nameErr = errors.passengers?.[index]?.fullName?.message;
                  const ageErr = errors.passengers?.[index]?.age?.message;

                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-card transition-all"
                    >
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/80 dark:border-border-dark">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-bold text-sm text-charcoal dark:text-white">
                            Passenger {index + 1}
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-light dark:bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                          <span>Seat {field.seatNumber}</span>
                        </div>
                      </div>

                      {/* Compact Inputs: ONLY Full Name and Age */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-8">
                          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                            Full Name <span className="text-brand-primary">*</span>
                          </label>
                          <input
                            {...register(`passengers.${index}.fullName`)}
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 bg-surface dark:bg-surface-muted-dark text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 ${
                              nameErr
                                ? 'border-red-400 focus:ring-red-400/20'
                                : 'border-border dark:border-border-dark focus:border-brand-primary focus:ring-brand-primary/20'
                            }`}
                          />
                          {nameErr && (
                            <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>{nameErr}</span>
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                            Age <span className="text-brand-primary">*</span>
                          </label>
                          <input
                            {...register(`passengers.${index}.age`)}
                            type="number"
                            min="1"
                            max="120"
                            placeholder="e.g. 28"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 bg-surface dark:bg-surface-muted-dark text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 ${
                              ageErr
                                ? 'border-red-400 focus:ring-red-400/20'
                                : 'border-border dark:border-border-dark focus:border-brand-primary focus:ring-brand-primary/20'
                            }`}
                          />
                          {ageErr && (
                            <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>{ageErr}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Contact Information Card */}
              <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-brand-primary" />
                  <h2 className="text-base font-bold text-charcoal dark:text-white">
                    Contact Information
                  </h2>
                </div>
                <p className="text-xs text-charcoal-lighter dark:text-gray-400 mb-5">
                  Your ticket details, boarding gates, and trip tracking link will be sent via SMS.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                      Primary Mobile Number <span className="text-brand-primary">*</span>
                    </label>
                    <div className="relative flex rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary transition-all">
                      <span className="inline-flex items-center px-3.5 text-xs font-bold text-charcoal-lighter dark:text-gray-400 border-r border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark/80 select-none">
                        +91
                      </span>
                      <input
                        {...register('contactInfo.primaryPhone')}
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        className="flex-1 px-3.5 py-2.5 text-sm font-medium bg-transparent text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                    {errors.contactInfo?.primaryPhone?.message ? (
                      <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.contactInfo.primaryPhone.message}</span>
                      </p>
                    ) : (
                      <p className="mt-1.5 text-[11px] text-charcoal-lighter dark:text-gray-400">
                        Required for driver contact & SMS tickets
                      </p>
                    )}
                  </div>

                  {/* Alternate Phone (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300">
                        Alternate Mobile Number
                      </label>
                      <span className="text-[11px] font-medium text-charcoal-lighter dark:text-gray-400">Optional</span>
                    </div>
                    <div className="relative flex rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary transition-all">
                      <span className="inline-flex items-center px-3.5 text-xs font-bold text-charcoal-lighter dark:text-gray-400 border-r border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark/80 select-none">
                        +91
                      </span>
                      <input
                        {...register('contactInfo.alternatePhone')}
                        type="tel"
                        maxLength={10}
                        placeholder="Optional backup number"
                        className="flex-1 px-3.5 py-2.5 text-sm font-medium bg-transparent text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                    {errors.contactInfo?.alternatePhone?.message ? (
                      <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.contactInfo.alternatePhone.message}</span>
                      </p>
                    ) : (
                      <p className="mt-1.5 text-[11px] text-charcoal-lighter dark:text-gray-400">
                        Optional backup contact in case primary is unavailable
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Proceed Bar */}
              <div className="block lg:hidden pt-2">
                <Button
                  type="submit"
                  form="passenger-form"
                  disabled={!isValid || isSubmitting}
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ChevronRight size={18} />}
                  className="shadow-brand-lg"
                >
                  Proceed to Payment (₹{fareSummary.total})
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar Booking Summary */}
          <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark overflow-hidden lg:sticky lg:top-24">
              
              {/* Trip Header Banner */}
              <div className="p-5 bg-gradient-to-br from-charcoal to-[#0A0E1A] dark:from-[#111827] dark:to-[#0B1120] text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-brand-primary">
                    Trip Summary
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium">
                    {bus?.bus_type ? bus.bus_type.replace('_', ' ').toUpperCase() : 'A/C LUXURY'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">
                  {operator?.company_name || trip?.operator || 'RouteRush Travels'}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">{bus?.name || 'Multi-Axle Coach'}</p>

                {/* Route visualization */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-white">{depTimeFormatted}</p>
                    <p className="text-xs text-gray-300 truncate max-w-[100px]">{fromCityName}</p>
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
                    <p className="text-lg font-black text-white">{arrTimeFormatted}</p>
                    <p className="text-xs text-gray-300 truncate max-w-[100px]">{toCityName}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{departureDateFormatted}</span>
                </div>
              </div>

              {/* Seats & Fare Breakdown */}
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-400 mb-2">
                    <span>Selected Seats</span>
                    <span className="text-charcoal dark:text-white">{selectedSeats.length} Seat(s)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map((seat, i) => {
                      const seatNo = typeof seat === 'string' ? seat : (seat.seatNumber || seat.seat_number || seat.id);
                      return (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-light dark:bg-brand-primary/15 text-brand-primary border border-brand-primary/20"
                        >
                          Seat {seatNo}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {bookingData?.boardingPoint && (
                  <div className="pt-3 border-t border-border dark:border-border-dark text-xs space-y-1">
                    <div className="flex justify-between text-charcoal-lighter dark:text-gray-400">
                      <span>Boarding:</span>
                      <span className="font-semibold text-charcoal dark:text-white text-right truncate max-w-[180px]">
                        {bookingData.boardingPoint}
                      </span>
                    </div>
                    {bookingData?.droppingPoint && (
                      <div className="flex justify-between text-charcoal-lighter dark:text-gray-400">
                        <span>Dropping:</span>
                        <span className="font-semibold text-charcoal dark:text-white text-right truncate max-w-[180px]">
                          {bookingData.droppingPoint}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-border dark:border-border-dark space-y-2 text-xs text-charcoal-lighter dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Base Fare ({selectedSeats.length} seats)</span>
                    <span className="font-semibold text-charcoal dark:text-white">₹{fareSummary.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-semibold text-charcoal dark:text-white">₹{fareSummary.taxes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span className="font-semibold text-charcoal dark:text-white">₹{fareSummary.serviceFee}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border dark:border-border-dark flex justify-between items-center">
                  <span className="text-sm font-bold text-charcoal dark:text-white">Total Amount</span>
                  <span className="text-xl font-black text-brand-primary">₹{fareSummary.total}</span>
                </div>

                {/* Desktop Proceed Button */}
                <div className="pt-2 hidden lg:block">
                  <Button
                    type="submit"
                    form="passenger-form"
                    disabled={!isValid || isSubmitting}
                    variant="primary"
                    size="lg"
                    fullWidth
                    rightIcon={<ChevronRight size={18} />}
                    className="shadow-brand-lg"
                  >
                    Proceed to Payment
                  </Button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-charcoal-lighter dark:text-gray-400 bg-surface dark:bg-surface-muted-dark p-3 rounded-xl border border-border dark:border-border-dark">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Instant ticket SMS & zero hidden fees.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetailsPage;
