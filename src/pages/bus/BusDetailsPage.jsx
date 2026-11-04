import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import StarRating from '../../components/common/StarRating';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import { Bus, ShieldCheck, ChevronRight } from 'lucide-react';

const MOCK_BUS_DATA = {
  id: 'b1',
  name: 'Volvo 9400 / Scania Multi-Axle',
  operator: 'Orange Travels',
  amenities: ['wifi', 'charging', 'blanket', 'water', 'ac', 'reading_light', 'entertainment', 'gps', 'cctv'],
  boardingPoints: ['Koyambedu (06:30 AM)', 'Tambaram (07:15 AM)', 'Chrompet (07:30 AM)'],
  droppingPoints: ['Electronic City (01:00 PM)', 'Silk Board (01:15 PM)', 'Majestic (01:45 PM)'],
  timings: [
    { id: 't1', type: 'Morning', dep: '06:30 AM', arr: '01:00 PM', fare: 850, seats: 18 },
    { id: 't2', type: 'Afternoon', dep: '01:30 PM', arr: '08:00 PM', fare: 750, seats: 25 },
    { id: 't3', type: 'Night', dep: '10:00 PM', arr: '04:30 AM', fare: 950, seats: 12 },
  ],
  reviews: [
    { id: 1, name: 'Rahul S.', rating: 4.5, comment: 'Very comfortable journey, started on time.', date: '2023-10-12' },
    { id: 2, name: 'Priya K.', rating: 5.0, comment: 'Clean bus, AC was working perfectly. Recommended!', date: '2023-11-05' },
    { id: 3, name: 'Amit V.', rating: 3.5, comment: 'Good driving but delayed by 30 mins.', date: '2024-01-20' },
  ],
  images: [
    '/real-bus.png',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&q=80',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&q=80',
  ],
  policies: {
    cancellation: '100% refund if cancelled 24 hrs before departure. 50% refund if cancelled 12 hrs before. No refund within 12 hrs.',
    luggage: 'Maximum 15kg per passenger in the luggage compartment. 5kg cabin baggage allowed.',
    child: 'Children above 3 years require a full ticket. Infants travel free without a separate seat.',
  }
};

export default function BusDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookingContext = useBooking?.() || {}; 
  const { setTrip } = bookingContext;

  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTiming, setSelectedTiming] = useState(MOCK_BUS_DATA.timings[0]);
  
  // Review form state
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewsList, setReviewsList] = useState(MOCK_BUS_DATA.reviews);

  useEffect(() => {
    const fetchBusDetails = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        setBusData(MOCK_BUS_DATA);
        setSelectedTiming(MOCK_BUS_DATA.timings[0]);
        setReviewsList(MOCK_BUS_DATA.reviews);
      } catch (err) {
        console.error('Error fetching bus details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [id]);

  if (loading) {
    return (
      <PageWrapper title="Loading Coach Details">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (!busData) {
    return (
      <PageWrapper title="Coach Not Found">
        <div className="flex items-center justify-center min-h-[60vh] text-center p-6">
          <p className="text-lg font-bold text-red-500">Bus operator details not found.</p>
        </div>
      </PageWrapper>
    );
  }

  const handleTimingSelect = (timing) => {
    setSelectedTiming(timing);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    
    const addedReview = {
      id: Date.now(),
      name: 'Verified Traveler',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviewsList([addedReview, ...reviewsList]);
    setNewReview({ rating: 5, comment: '' });
  };

  const handleBookNow = () => {
    const tripForContext = {
      fare: selectedTiming.fare,
      dep: selectedTiming.dep,
      arr: selectedTiming.arr,
      boarding_points: busData.boardingPoints,
      dropping_points: busData.droppingPoints,
    };
    const busForContext = { name: busData.name, bus_type: 'ac_luxury' };
    const routeForContext = { from_city: { name: 'Chennai' }, to_city: { name: 'Bangalore' } };
    const operatorForContext = { company_name: busData.operator };

    if (setTrip) {
      setTrip(tripForContext, busForContext, routeForContext, operatorForContext);
    }
    navigate('/book/seats');
  };

  return (
    <PageWrapper title={`${busData.name} | Coach Details`}>
      <div className="bg-surface dark:bg-surface-dark min-h-screen py-8 sm:py-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Header Section */}
            <div className="bg-white dark:bg-surface-card-dark p-6 sm:p-7 rounded-2xl shadow-card border border-border dark:border-border-dark">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-brand-primary">
                <Bus className="w-4 h-4" />
                <span>Verified Intercity Operator</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-charcoal dark:text-white font-display">{busData.name}</h1>
              <p className="text-sm font-semibold text-charcoal-lighter dark:text-gray-400 mt-1">{busData.operator}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {busData.amenities.map((amenity, index) => (
                  <span key={index} className="px-3 py-1 bg-surface dark:bg-surface-muted-dark border border-border dark:border-border-dark text-charcoal dark:text-gray-300 text-xs font-bold rounded-lg capitalize">
                    {amenity.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Timings Selection */}
            <div className="bg-white dark:bg-surface-card-dark p-6 sm:p-7 rounded-2xl shadow-card border border-border dark:border-border-dark">
              <h2 className="text-lg font-bold text-charcoal dark:text-white mb-4">Select Departure Time</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {busData.timings.map(timing => (
                  <div 
                    key={timing.id}
                    onClick={() => handleTimingSelect(timing)}
                    className={`cursor-pointer border rounded-xl p-4 transition-all ${
                      selectedTiming.id === timing.id 
                        ? 'border-brand-primary bg-brand-light/30 dark:bg-brand-primary/10 shadow-sm ring-2 ring-brand-primary/20' 
                        : 'border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark/40 hover:border-brand-primary/40'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase tracking-wider text-brand-primary">{timing.type}</div>
                    <div className="text-sm font-black text-charcoal dark:text-white mt-1">{timing.dep} - {timing.arr}</div>
                    <div className="mt-3 flex justify-between items-center pt-2 border-t border-border dark:border-border-dark">
                      <span className="font-black text-base text-charcoal dark:text-white">₹{timing.fare}</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{timing.seats} seats</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white dark:bg-surface-card-dark p-6 sm:p-7 rounded-2xl shadow-card border border-border dark:border-border-dark">
              <h2 className="text-lg font-bold text-charcoal dark:text-white mb-4">Coach Gallery</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {busData.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Bus Coach ${idx + 1}`} 
                    className="w-64 h-40 object-cover rounded-xl snap-center flex-shrink-0 border border-border dark:border-border-dark shadow-sm"
                  />
                ))}
              </div>
            </div>

            {/* Policies Section */}
            <div className="bg-white dark:bg-surface-card-dark p-6 sm:p-7 rounded-2xl shadow-card border border-border dark:border-border-dark">
              <h2 className="text-lg font-bold text-charcoal dark:text-white mb-4">Travel Policies</h2>
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white">Cancellation Policy</h3>
                  <p className="text-charcoal-lighter dark:text-gray-400 mt-0.5">{busData.policies.cancellation}</p>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white">Luggage Policy</h3>
                  <p className="text-charcoal-lighter dark:text-gray-400 mt-0.5">{busData.policies.luggage}</p>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white">Child Policy</h3>
                  <p className="text-charcoal-lighter dark:text-gray-400 mt-0.5">{busData.policies.child}</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-surface-card-dark p-6 sm:p-7 rounded-2xl shadow-card border border-border dark:border-border-dark">
              <h2 className="text-lg font-bold text-charcoal dark:text-white mb-4">Traveler Reviews & Ratings</h2>
              
              {/* Write a Review */}
              <form onSubmit={handleReviewSubmit} className="mb-6 bg-surface dark:bg-surface-muted-dark/40 p-4 rounded-xl border border-border dark:border-border-dark">
                <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal dark:text-white mb-2">Write a Review</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-charcoal-lighter dark:text-gray-400">Rating:</span>
                  <select 
                    value={newReview.rating} 
                    onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                    className="border border-border dark:border-border-dark rounded-lg p-1.5 text-xs bg-white dark:bg-surface-card-dark text-charcoal dark:text-white font-bold focus:outline-none"
                  >
                    {[5, 4.5, 4, 3.5, 3, 2, 1].map(r => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                </div>
                <textarea 
                  rows="2" 
                  placeholder="Share your travel experience with this operator..." 
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full border border-border dark:border-border-dark rounded-xl p-3 text-xs bg-white dark:bg-surface-card-dark text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                  required
                />
                <Button 
                  type="submit" 
                  variant="primary"
                  size="sm"
                  className="mt-2"
                >
                  Submit Review
                </Button>
              </form>

              <div className="space-y-4">
                {reviewsList.map(review => (
                  <div key={review.id} className="border-b border-border dark:border-border-dark pb-3.5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-charcoal dark:text-white">{review.name}</h4>
                        <div className="flex items-center mt-1">
                          <StarRating rating={review.rating} size={12} />
                          <span className="text-xs text-charcoal-lighter dark:text-gray-400 ml-1.5">{review.rating} / 5</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-charcoal-lighter dark:text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-charcoal-lighter dark:text-gray-300 text-xs mt-1.5">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar / CTA */}
          <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark p-6 lg:sticky lg:top-24">
              <h3 className="text-base font-bold text-charcoal dark:text-white mb-4">Trip Summary</h3>
              
              <div className="space-y-3 mb-6 text-xs sm:text-sm">
                <div className="flex justify-between text-charcoal-lighter dark:text-gray-400">
                  <span>Departure Time</span>
                  <span className="font-bold text-charcoal dark:text-white">{selectedTiming.dep}</span>
                </div>
                <div className="flex justify-between text-charcoal-lighter dark:text-gray-400">
                  <span>Arrival Time</span>
                  <span className="font-bold text-charcoal dark:text-white">{selectedTiming.arr}</span>
                </div>
                <div className="flex justify-between border-t border-border dark:border-border-dark pt-3 text-charcoal-lighter dark:text-gray-400">
                  <span>Fare per Seat</span>
                  <span className="font-black text-xl text-brand-primary">₹{selectedTiming.fare}</span>
                </div>
                <div className="flex justify-between text-charcoal-lighter dark:text-gray-400">
                  <span>Seat Availability</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedTiming.seats} Seats Available</span>
                </div>
              </div>

              <Button 
                onClick={handleBookNow}
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ChevronRight size={18} />}
                className="shadow-brand-lg"
              >
                Select Seats
              </Button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-charcoal-lighter dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Free cancellation up to 6 hours before departure</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
