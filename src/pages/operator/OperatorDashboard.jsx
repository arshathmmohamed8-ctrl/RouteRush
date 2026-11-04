import React, { useState } from 'react';
import { 
  Bus, Calendar, CreditCard, Users, Settings, 
  BarChart2, Map, Plus, Edit2, Trash2, CheckCircle, XCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, LineChart, Line, ResponsiveContainer 
} from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 8900 },
  { name: 'Sat', revenue: 10000 },
  { name: 'Sun', revenue: 9500 },
];

const bookingsData = [
  { name: 'Mon', bookings: 24 },
  { name: 'Tue', bookings: 13 },
  { name: 'Wed', bookings: 38 },
  { name: 'Thu', bookings: 39 },
  { name: 'Fri', bookings: 48 },
  { name: 'Sat', bookings: 68 },
  { name: 'Sun', bookings: 55 },
];

const mockBuses = [
  { id: 1, name: 'Volvo 9400', number: 'TN 01 AB 1234', type: 'AC Sleeper', capacity: 36, status: 'Active' },
  { id: 2, name: 'Scania Metrolink', number: 'TN 02 XY 5678', type: 'AC Seater', capacity: 45, status: 'Active' },
  { id: 3, name: 'Ashok Leyland', number: 'TN 03 CD 9012', type: 'Non-AC Seater', capacity: 50, status: 'Inactive' },
  { id: 4, name: 'BharatBenz', number: 'TN 04 EF 3456', type: 'AC Sleeper', capacity: 40, status: 'Active' },
];

const mockBookings = [
  { id: 'BKG001', user: 'Rahul Kumar', trip: 'Chennai - Bangalore', date: '2026-07-20', seats: 'A1, A2', status: 'Confirmed' },
  { id: 'BKG002', user: 'Priya Sharma', trip: 'Madurai - Chennai', date: '2026-07-21', seats: 'B4', status: 'Checked In' },
  { id: 'BKG003', user: 'Amit Singh', trip: 'Coimbatore - Kochi', date: '2026-07-22', seats: 'C1, C2, C3', status: 'Cancelled' },
];

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [buses, setBuses] = useState(mockBuses);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 bg-white flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:flex md:flex-col">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Operator Portal</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart2 },
            { id: 'buses', label: 'Manage Buses', icon: Bus },
            { id: 'trips', label: 'Schedules', icon: Map },
            { id: 'bookings', label: 'Bookings', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Welcome, KPN Travels</span>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Buses" value="4" icon={Bus} color="bg-blue-500" />
                <StatCard title="Scheduled Trips" value="12" icon={Map} color="bg-green-500" />
                <StatCard title="Today's Bookings" value="8" icon={Users} color="bg-purple-500" />
                <StatCard title="Total Revenue" value="₹14,250" icon={CreditCard} color="bg-orange-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Revenue (Last 7 Days)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                        <RechartsTooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Bookings Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bookingsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="bookings" stroke="#8B5CF6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manage Buses View */}
          {activeTab === 'buses' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Bus Fleet</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add New Bus</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                      <th className="p-4 font-medium">Bus Details</th>
                      <th className="p-4 font-medium">Registration</th>
                      <th className="p-4 font-medium">Capacity</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {buses.map(bus => (
                      <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{bus.name}</div>
                          <div className="text-gray-500 text-xs">{bus.type}</div>
                        </td>
                        <td className="p-4 text-gray-600">{bus.number}</td>
                        <td className="p-4 text-gray-600">{bus.capacity} Seats</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bus.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {bus.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings View */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                      <th className="p-4 font-medium">Booking ID</th>
                      <th className="p-4 font-medium">Passenger</th>
                      <th className="p-4 font-medium">Route & Date</th>
                      <th className="p-4 font-medium">Seats</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {mockBookings.map(bkg => (
                      <tr key={bkg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{bkg.id}</td>
                        <td className="p-4 text-gray-700">{bkg.user}</td>
                        <td className="p-4">
                          <div className="text-gray-900">{bkg.trip}</div>
                          <div className="text-gray-500 text-xs">{bkg.date}</div>
                        </td>
                        <td className="p-4 text-gray-600 font-medium">{bkg.seats}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 flex items-center w-max space-x-1 rounded-full text-xs font-medium ${
                            bkg.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                            bkg.status === 'Checked In' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {bkg.status === 'Cancelled' ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            <span>{bkg.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Schedule View Placeholder */}
          {activeTab === 'trips' && (
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Management</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">Create and manage your bus trips, set departure times, define routes, and manage fare structures.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Create New Schedule
              </button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
