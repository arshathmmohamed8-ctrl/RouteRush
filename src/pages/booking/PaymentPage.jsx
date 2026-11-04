import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Building2, 
  Tag, 
  Check, 
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Lock
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import * as bookingService from '../../services/bookingService';
import Button from '../../components/common/Button';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { bookingData, applyCoupon, getFareBreakdown, confirmBooking } = useBooking();
  const selectedSeats = Array.isArray(bookingData?.selectedSeats) ? bookingData.selectedSeats : [];
  const couponDiscount = bookingData?.couponDiscount || 0;

  const [activeTab, setActiveTab] = useState('upi');
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // { type: 'success' | 'error', msg: string }
  const [isProcessing, setIsProcessing] = useState(false);
  const [fareSummary, setFareSummary] = useState({ baseFare: 0, taxes: 0, serviceFee: 0, total: 0 });

  useEffect(() => {
    if (selectedSeats.length === 0) {
      navigate('/search');
      return;
    }
    setFareSummary(getFareBreakdown());
  }, [selectedSeats, couponDiscount, getFareBreakdown, navigate]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;

    const code = couponInput.toUpperCase();
    let discount = 0;

    if (code === 'RUSH10') {
      discount = Math.round(fareSummary.baseFare * 0.1);
      setCouponStatus({ type: 'success', msg: '10% discount applied successfully!' });
    } else if (code === 'FLAT100') {
      discount = 100;
      setCouponStatus({ type: 'success', msg: '₹100 flat discount applied!' });
    } else if (code === 'WELCOME') {
      discount = 150;
      setCouponStatus({ type: 'success', msg: 'Welcome offer applied!' });
    } else {
      setCouponStatus({ type: 'error', msg: 'Invalid or expired coupon code' });
      applyCoupon(null, 0);
      return;
    }

    applyCoupon(code, discount);
  };

  const removeCoupon = () => {
    setCouponInput('');
    setCouponStatus(null);
    applyCoupon(null, 0);
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 1800));

    try {
      const bookingRecord = await bookingService.createBooking({
        userId: bookingData?.userId || bookingData?.user?.id,
        tripId: bookingData?.trip?.id || bookingData?.tripId,
        seats: selectedSeats,
        passengers: bookingData?.passengers || [],
        boardingPoint: bookingData?.boardingPoint,
        droppingPoint: bookingData?.droppingPoint,
        totalAmount: fareSummary.total,
        paymentMethod: activeTab,
        status: 'CONFIRMED',
      });

      confirmBooking(bookingRecord);
      navigate('/book/confirmation');
    } catch (error) {
      console.error("Booking fallback for sandbox/mock:", error);
      const mockBookingRecord = {
        id: 'RR-' + Math.random().toString(36).substring(2, 9),
        referenceNumber: 'RR' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        ...bookingData,
        amountPaid: fareSummary.total,
        paymentMethod: activeTab,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
      };
      confirmBooking(mockBookingRecord);
      navigate('/book/confirmation');
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex items-center justify-center px-4">
        <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark rounded-2xl shadow-card p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-charcoal dark:text-white">No active booking found</h2>
          <p className="text-charcoal-lighter dark:text-gray-400 mt-2 text-sm">Please select seats again to continue to checkout.</p>
          <Button onClick={() => navigate('/book/seats')} variant="primary" size="md" className="mt-6 w-full">
            Back to Seat Selection
          </Button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-surface-card-dark border border-border dark:border-border-dark p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm text-center">
          <Loader2 className="w-14 h-14 text-brand-primary animate-spin mb-4" />
          <h2 className="text-xl font-bold text-charcoal dark:text-white mb-2">Processing Payment</h2>
          <p className="text-xs text-charcoal-lighter dark:text-gray-400 mb-6">
            Connecting to secure banking gateway. Please do not refresh or press back.
          </p>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

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
                title="Seats"
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

            {/* Step 2 - Completed */}
            <div className="flex items-center">
              <div
                onClick={() => navigate('/book/passengers')}
                className="flex items-center gap-2 cursor-pointer group"
                title="Passengers"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  <Check className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Passengers
                </span>
              </div>
              <div className="w-10 sm:w-16 h-0.5 bg-emerald-500/40 mx-2" />
            </div>

            {/* Step 3 - Active */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white shadow-brand flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <span className="text-xs font-bold text-brand-primary">
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
              Payment Checkout
            </h1>
            <p className="text-sm text-charcoal-lighter dark:text-gray-400 mt-1">
              Select your preferred payment method and complete your secure booking.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/book/passengers')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-lighter dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Edit Passenger Details
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Payment Options */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Promo Codes & Coupons */}
            <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-sm border border-border dark:border-border-dark p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-brand-primary" />
                <h2 className="text-base font-bold text-charcoal dark:text-white">Coupons & Offers</h2>
              </div>
              <form onSubmit={handleApplyCoupon} className="flex gap-3">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code (e.g. WELCOME, FLAT100)"
                  disabled={couponDiscount > 0}
                  className="flex-1 px-4 py-2.5 text-sm uppercase font-semibold border border-border dark:border-border-dark rounded-xl bg-surface dark:bg-surface-muted-dark text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:opacity-60"
                />
                {couponDiscount > 0 ? (
                  <Button
                    type="button"
                    onClick={removeCoupon}
                    variant="outline"
                    size="md"
                    className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                  >
                    Apply Code
                  </Button>
                )}
              </form>

              {couponStatus && (
                <div className={`mt-3 flex items-center gap-2 text-xs font-medium ${couponStatus.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                  {couponStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{couponStatus.msg}</span>
                </div>
              )}

              {/* Quick coupons pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-charcoal-lighter dark:text-gray-400 font-medium">Available offers:</span>
                {[
                  { code: 'WELCOME', desc: 'Flat ₹150 off' },
                  { code: 'FLAT100', desc: 'Flat ₹100 off' },
                  { code: 'RUSH10', desc: '10% off' }
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setCouponInput(item.code)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-light dark:bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:scale-105 transition-transform"
                  >
                    {item.code} <span className="opacity-70 font-normal">({item.desc})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark overflow-hidden flex flex-col sm:flex-row">
              {/* Vertical Navigation Tabs */}
              <div className="w-full sm:w-1/3 bg-surface dark:bg-surface-muted-dark/40 border-b sm:border-b-0 sm:border-r border-border dark:border-border-dark p-3 space-y-1.5">
                {[
                  { id: 'upi', icon: Smartphone, label: 'UPI / QR Code', badge: 'Instant' },
                  { id: 'card', icon: CreditCard, label: 'Credit / Debit Card' },
                  { id: 'netbanking', icon: Building2, label: 'Net Banking' },
                  { id: 'wallet', icon: Wallet, label: 'Wallets' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 text-left rounded-xl transition-all font-semibold text-xs sm:text-sm ${
                        isActive
                          ? 'bg-white dark:bg-surface-card-dark text-brand-primary shadow-sm border border-border dark:border-border-dark'
                          : 'text-charcoal-lighter dark:text-gray-400 hover:bg-white/60 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-gray-400'}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Panel */}
              <div className="w-full sm:w-2/3 p-6 sm:p-8 min-h-[360px] flex flex-col justify-between">
                {activeTab === 'upi' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-charcoal dark:text-white mb-1">Pay via UPI</h3>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400">
                        Scan with any UPI app or enter your UPI Virtual Payment Address (VPA).
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {['GPay', 'PhonePe', 'Paytm'].map((app) => (
                        <div
                          key={app}
                          className="border border-border dark:border-border-dark rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-brand-light/30 dark:hover:bg-brand-primary/10 transition-all group"
                        >
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
                            alt={app}
                            className="h-6 object-contain mb-1.5 opacity-90 group-hover:scale-105 transition-transform"
                          />
                          <span className="text-xs font-bold text-charcoal dark:text-gray-200">{app}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                        UPI ID (VPA)
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl text-sm font-medium bg-surface dark:bg-surface-muted-dark text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-charcoal dark:text-white mb-1">Enter Card Details</h3>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400">
                        Visa, MasterCard, RuPay, and American Express accepted.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          className="w-full pl-10 pr-4 py-2.5 border border-border dark:border-border-dark rounded-xl text-sm font-medium bg-surface dark:bg-surface-muted-dark text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        />
                        <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          placeholder="08/28"
                          maxLength={5}
                          className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl text-sm font-medium bg-surface dark:bg-surface-muted-dark text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl text-sm font-medium bg-surface dark:bg-surface-muted-dark text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl text-sm font-medium bg-surface dark:bg-surface-muted-dark text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'netbanking' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-charcoal dark:text-white mb-1">Select Bank</h3>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400">
                        Choose your primary bank for net banking redirect.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                        <label
                          key={bank}
                          className="flex items-center gap-2.5 p-3 border border-border dark:border-border-dark rounded-xl cursor-pointer hover:bg-surface dark:hover:bg-surface-muted-dark transition-colors"
                        >
                          <input type="radio" name="bank" defaultChecked={bank === 'HDFC Bank'} className="accent-brand-primary" />
                          <span className="text-xs font-bold text-charcoal dark:text-white">{bank}</span>
                        </label>
                      ))}
                    </div>

                    <div className="pt-2">
                      <select className="w-full text-xs py-2.5 px-3 bg-surface dark:bg-surface-muted-dark border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white font-medium focus:outline-none">
                        <option>Select another bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Punjab National Bank</option>
                        <option>Bank of Baroda</option>
                        <option>Canara Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'wallet' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-charcoal dark:text-white mb-1">Select Digital Wallet</h3>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400">
                        Pay quickly using your pre-funded digital wallet balance.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {['Amazon Pay', 'Paytm Wallet', 'PhonePe Wallet'].map((wallet) => (
                        <label
                          key={wallet}
                          className="flex items-center justify-between p-3.5 border border-border dark:border-border-dark rounded-xl cursor-pointer hover:bg-surface dark:hover:bg-surface-muted-dark transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <input type="radio" name="wallet" defaultChecked={wallet === 'Amazon Pay'} className="accent-brand-primary" />
                            <span className="text-xs font-bold text-charcoal dark:text-white">{wallet}</span>
                          </div>
                          <span className="text-xs font-bold text-brand-primary">Link Account</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 flex items-center justify-between text-xs text-charcoal-lighter dark:text-gray-400 border-t border-border dark:border-border-dark mt-6">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>256-Bit SSL Encrypted Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking & Fare Summary */}
          <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark overflow-hidden lg:sticky lg:top-24">
              
              <div className="p-5 bg-gradient-to-br from-charcoal to-[#0A0E1A] dark:from-[#111827] dark:to-[#0B1120] text-white">
                <span className="text-xs font-bold tracking-wider uppercase text-brand-primary">
                  Order Summary
                </span>
                <h3 className="font-bold text-base text-white mt-1">
                  {bookingData?.operator?.company_name || 'RouteRush Express'}
                </h3>
                <p className="text-xs font-semibold text-brand-primary mt-0.5">
                  {bookingData?.route?.from_city?.name || bookingData?.trip?.from || 'Origin'} → {bookingData?.route?.to_city?.name || bookingData?.trip?.to || 'Destination'}
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  {selectedSeats.length} Seat(s): {selectedSeats.map(s => typeof s === 'string' ? s : (s.seatNumber || s.id)).join(', ')}
                </p>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2.5 text-xs text-charcoal-lighter dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Base Fare ({selectedSeats.length} seats)</span>
                    <span className="font-semibold text-charcoal dark:text-white">₹{fareSummary.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (5% GST)</span>
                    <span className="font-semibold text-charcoal dark:text-white">₹{fareSummary.taxes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span className="font-semibold text-charcoal dark:text-white">₹{fareSummary.serviceFee}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-border dark:border-border-dark">
                      <span>Promo Discount</span>
                      <span>- ₹{couponDiscount}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border dark:border-border-dark flex justify-between items-center">
                  <span className="text-sm font-bold text-charcoal dark:text-white">Total Payable</span>
                  <span className="text-2xl font-black text-brand-primary">₹{fareSummary.total}</span>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing}
                    variant="primary"
                    size="lg"
                    fullWidth
                    rightIcon={<ChevronRight size={18} />}
                    className="shadow-brand-lg"
                  >
                    Pay ₹{fareSummary.total} Now
                  </Button>
                </div>

                {/* Trust and Payment Gateway Badges */}
                <div className="pt-3 flex flex-col items-center gap-3 border-t border-border dark:border-border-dark">
                  <div className="flex items-center gap-2 text-xs text-charcoal-lighter dark:text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Safe & Secure Bank Checkout.</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3.5" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-3.5" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
