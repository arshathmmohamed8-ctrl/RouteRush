import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Heart, 
  Settings, 
  Camera, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

// Mock Data
const MOCK_PASSENGERS = [
  { id: 1, name: 'Pooja Sharma', age: 26 },
  { id: 2, name: 'Robert Smith', age: 54 }
];

const MOCK_FAVORITE_ROUTES = [
  { id: 1, source: 'Bangalore', destination: 'Chennai' },
  { id: 2, source: 'Mumbai', destination: 'Pune' }
];

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  
  // States
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || user?.user_metadata?.full_name || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    dob: '1995-08-15',
    address: '123, Tech Park, Koramangala, Bangalore, 560034'
  });

  const [passengers, setPassengers] = useState(MOCK_PASSENGERS);
  const [favoriteRoutes, setFavoriteRoutes] = useState(MOCK_FAVORITE_ROUTES);
  const [settings, setSettings] = useState({
    emailNotif: true,
    whatsappNotif: true,
    promos: false
  });

  // Handlers
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSettingToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'personal':
        return (
          <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark p-6 sm:p-8">
            <h2 className="text-xl font-bold text-charcoal dark:text-white mb-6 border-b border-border dark:border-border-dark pb-4">
              Personal Information
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-brand-light dark:bg-brand-primary/10 border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center overflow-hidden">
                  <img src="/traveler-avatar.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 bg-brand-primary text-white p-2 rounded-full shadow-lg hover:bg-brand-hover transition">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-charcoal dark:text-white">{profileData.fullName}</h3>
                <p className="text-xs text-charcoal-lighter dark:text-gray-400 mb-2">Verified Traveler Account</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> Phone & Email Verified
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal-lighter opacity-70 cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Primary Mobile Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob"
                    value={profileData.dob}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-lighter dark:text-gray-300 mb-1.5">Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 border border-border dark:border-border-dark rounded-xl bg-surface dark:bg-surface-muted-dark text-sm font-medium text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" 
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" size="md">
                  <Save className="w-4 h-4 mr-2" /> Save Profile Details
                </Button>
              </div>
            </form>
          </div>
        );

      case 'passengers':
        return (
          <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-border dark:border-border-dark pb-4">
              <div>
                <h2 className="text-xl font-bold text-charcoal dark:text-white">Saved Co-Travelers</h2>
                <p className="text-xs text-charcoal-lighter dark:text-gray-400 mt-0.5">Quickly autofill passenger names during ticket checkout.</p>
              </div>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Passenger
              </Button>
            </div>

            <div className="space-y-3">
              {passengers.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-4 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark/40">
                  <div>
                    <h4 className="font-bold text-sm text-charcoal dark:text-white">{p.name}</h4>
                    <p className="text-xs text-charcoal-lighter dark:text-gray-400">Age: {p.age} Yrs</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-charcoal-lighter dark:text-gray-400 hover:text-brand-primary transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-charcoal-lighter dark:text-gray-400 hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark p-6 sm:p-8">
            <h2 className="text-xl font-bold text-charcoal dark:text-white mb-2">Favorite Routes</h2>
            <p className="text-xs text-charcoal-lighter dark:text-gray-400 mb-6">Frequently booked corridors for 1-click search.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteRoutes.map((r) => (
                <div 
                  key={r.id} 
                  onClick={() => navigate(`/search?from=${r.source}&to=${r.destination}&passengers=1`)}
                  className="p-4 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-muted-dark/40 hover:border-brand-primary/40 cursor-pointer transition-all hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-charcoal dark:text-white">{r.source} → {r.destination}</p>
                      <p className="text-xs text-charcoal-lighter dark:text-gray-400 mt-1">Book recurring ride</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark p-6 sm:p-8">
              <h2 className="text-xl font-bold text-charcoal dark:text-white mb-6 border-b border-border dark:border-border-dark pb-4">
                Notification Preferences
              </h2>
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-charcoal dark:text-white">Email Notifications</h4>
                    <p className="text-xs text-charcoal-lighter dark:text-gray-400">Receive booking confirmations and ticket PDF via email</p>
                  </div>
                  <button onClick={() => handleSettingToggle('emailNotif')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotif ? 'bg-brand-primary' : 'bg-gray-300 dark:bg-slate-700'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.emailNotif ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-charcoal dark:text-white">WhatsApp Updates</h4>
                    <p className="text-xs text-charcoal-lighter dark:text-gray-400">Receive live bus GPS tracking links on WhatsApp</p>
                  </div>
                  <button onClick={() => handleSettingToggle('whatsappNotif')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.whatsappNotif ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-700'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.whatsappNotif ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-charcoal dark:text-white">Promotional Discounts</h4>
                    <p className="text-xs text-charcoal-lighter dark:text-gray-400">Receive seasonal deals and festive discount codes</p>
                  </div>
                  <button onClick={() => handleSettingToggle('promos')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.promos ? 'bg-brand-primary' : 'bg-gray-300 dark:bg-slate-700'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.promos ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const TABS = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'passengers', label: 'Saved Passengers', icon: Users },
    { id: 'favorites', label: 'Favorite Routes', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <PageWrapper title="My Account">
      <div className="bg-surface dark:bg-surface-dark min-h-screen py-8 sm:py-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-charcoal dark:text-white font-display tracking-tight">
              My Account
            </h1>
            <p className="text-sm text-charcoal-lighter dark:text-gray-400 mt-1">
              Manage your profile details, co-travelers, and booking preferences.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card border border-border dark:border-border-dark overflow-hidden sticky top-24">
                <div className="p-6 border-b border-border dark:border-border-dark text-center bg-surface dark:bg-surface-muted-dark/40">
                  <div className="w-20 h-20 mx-auto rounded-full bg-brand-light dark:bg-brand-primary/10 border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden mb-3">
                    <img src="/traveler-avatar.jpg" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-sm text-charcoal dark:text-white">{profileData.fullName}</h3>
                  <p className="text-xs text-charcoal-lighter dark:text-gray-400 truncate">{profileData.email}</p>
                </div>
                <div className="p-3 space-y-1">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                          isActive 
                            ? 'bg-brand-light dark:bg-brand-primary/15 text-brand-primary' 
                            : 'text-charcoal-lighter dark:text-gray-400 hover:bg-surface dark:hover:bg-surface-muted-dark hover:text-charcoal dark:hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-gray-400'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content Panel */}
            <div className="flex-1 w-full">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
