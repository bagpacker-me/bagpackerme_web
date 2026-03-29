'use client';

import { useEffect, useState } from 'react';
import { getCustomers, getBookings, getEnquiries, getPackages } from '@/lib/firestore';
import { Users, Calendar, MessageSquare, MapPinned } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    bookings: 0,
    enquiries: 0,
    packages: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [customersRes, bookingsRes, enquiriesRes, packagesRes] = await Promise.all([
        getCustomers(),
        getBookings(),
        getEnquiries(),
        getPackages(),
      ]);

      setStats({
        customers: customersRes.size,
        bookings: bookingsRes.size,
        enquiries: enquiriesRes.size,
        packages: packagesRes.size,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.customers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Bookings',
      value: stats.bookings,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Enquiries',
      value: stats.enquiries,
      icon: MessageSquare,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Active Packages',
      value: stats.packages,
      icon: MapPinned,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#221E2A] font-heading">Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your platform&apos;s performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2" />
                ) : (
                  <h3 className="text-3xl font-bold text-[#221E2A]">{stat.value}</h3>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* We can add a chart or more detailed tables here in the future if needed */}
    </div>
  );
}
