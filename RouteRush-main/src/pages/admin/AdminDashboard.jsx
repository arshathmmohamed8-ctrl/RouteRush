import React, { useState } from 'react';
import { 
  Users, UserCheck, Bus, Map as MapIcon, Calendar, Tag, Shield, 
  Search, Filter, ChevronRight, MoreVertical, TrendingUp, DollarSign
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const revenueData = [
  { name: 'Week 1', total: 45000 },
  { name: 'Week 2', total: 52000 },
  { name: 'Week 3', total: 48000 },
  { name: 'Week 4', total: 61000 },
];

const busTypeData = [
  { name: 'AC Sleeper', value: 400 },
  { name: 'Non-AC Sleeper', value: 300 },
  { name: 'AC Seater', value: 300 },
  { name: 'Non-AC Seater', value: 200 },
];
const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

const mockUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Traveler', status: 'Active', joined: '2026-01-15' },
  { id: 2, name: 'KPN Travels', email: 'contact@kpn.in', role: 'Operator', status: 'Active', joined: '2025-11-20' },
  { id: 3, name: 'Admin User', email: 'admin@routerush.in', role: 'Admin', status: 'Active', joined: '2025-10-01' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-xs font-medium text-green-600 flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" /> {subtitle}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-gray-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Shield className="w-6 h-6 text-blue-500 mr-2" />
          <span className="text-lg font-bold text-white tracking-wide">RouteRush Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 space-y-1">
            <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
            {[
              { id: 'overview', label: 'Overview', icon: DollarSign },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'operators', label: 'Operators', icon: UserCheck },
              { id: 'buses', label: 'Buses', icon: Bus },
              { id: 'routes', label: 'Routes', icon: MapIcon },
              { id: 'trips', label: 'Trips', icon: Calendar },
              { id: 'offers', label: 'Offers', icon: Tag },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="w-9 h-9 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {activeTab === 'overview' && (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="1,420" subtitle="+12% from last month" icon={Users} colorClass="bg-blue-500" />
                <StatCard title="Active Operators" value="8" subtitle="+2 new this week" icon={UserCheck} colorClass="bg-indigo-500" />
                <StatCard title="Today's Bookings" value="43" subtitle="+15% than yesterday" icon={Calendar} colorClass="bg-emerald-500" />
                <StatCard title="Daily Revenue" value="₹36,750" subtitle="+8% from avg" icon={DollarSign} colorClass="bg-amber-500" />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Revenue</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Bookings by Bus Type</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={busTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {busTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {busTypeData.map((item, i) => (
                        <div key={i} className="flex items-center text-xs text-gray-600">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }} />
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">User Management</h2>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Filter className="w-4 h-4" /> <span>Filter</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-gray-500 text-sm border-b border-gray-200">
                        <th className="px-6 py-4 font-semibold">User</th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Joined Date</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {mockUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-gray-500 text-xs">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'Operator' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center text-xs font-medium text-green-600">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-gray-700">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                  <span>Showing 1 to 3 of 1,420 entries</span>
                  <div className="flex space-x-1">
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['operators', 'buses', 'routes', 'trips', 'offers'].includes(activeTab) && (
             <div className="max-w-4xl mx-auto mt-12 text-center">
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">Manage {activeTab}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">This module is part of the comprehensive administration suite. Connects directly to Supabase {activeTab} tables.</p>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                  Access Module
                </button>
              </div>
             </div>
          )}

        </main>
      </div>
    </div>
  );
}
