'use client';

import { useEffect, useState } from 'react';
import { 
  getCustomers, 
  getBookings, 
  getEnquiries, 
  getPackages,
  getBlogs,
  getSubscribers,
  getGalleryImages
} from '@/lib/firestore';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  MapPinned,
  BookOpen,
  Mail,
  Image as ImageIcon,
  IndianRupee,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Booking, Package, Enquiry, BlogPost } from '@/types';

interface AnalyticsData {
  customers: { total: number };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
  enquiries: {
    total: number;
    new: number;
    inProgress: number;
    responded: number;
  };
  packages: {
    total: number;
    published: number;
    draft: number;
  };
  blogs: {
    total: number;
    published: number;
    draft: number;
  };
  subscribers: { total: number };
  gallery: { total: number };
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        customersRes, 
        bookingsRes, 
        enquiriesRes, 
        packagesRes,
        blogsRes,
        subscribersRes,
        galleryRes
      ] = await Promise.all([
        getCustomers(),
        getBookings(),
        getEnquiries(),
        getPackages(),
        getBlogs(),
        getSubscribers(),
        getGalleryImages()
      ]);

      const bookings = bookingsRes.docs.map(d => d.data() as Booking);
      const enquiries = enquiriesRes.docs.map(d => d.data() as Enquiry);
      const packages = packagesRes.docs.map(d => d.data() as Package);
      const blogs = blogsRes.docs.map(d => d.data() as BlogPost);

      // Bookings aggregations
      let pendingBookings = 0;
      let confirmedBookings = 0;
      let completedBookings = 0;
      let cancelledBookings = 0;
      let totalRevenue = 0;

      bookings.forEach(b => {
        if (b.status === 'pending') pendingBookings++;
        if (b.status === 'confirmed') confirmedBookings++;
        if (b.status === 'completed') completedBookings++;
        if (b.status === 'cancelled') cancelledBookings++;

        if (b.status === 'confirmed' || b.status === 'completed') {
          totalRevenue += (Number(b.totalPrice) || 0);
        }
      });

      // Enquiries aggregations
      let newEnquiries = 0;
      let inProgressEnquiries = 0;
      let respondedEnquiries = 0;
      enquiries.forEach(e => {
        if (e.status === 'new') newEnquiries++;
        if (e.status === 'in_progress') inProgressEnquiries++;
        if (e.status === 'responded') respondedEnquiries++;
      });

      // Packages aggregations
      let pubPackages = 0;
      let draftPackages = 0;
      packages.forEach(p => {
        if (p.status === 'published') pubPackages++;
        else draftPackages++;
      });

      // Blogs aggregations
      let pubBlogs = 0;
      let draftBlogs = 0;
      blogs.forEach(b => {
        if (b.status === 'published') pubBlogs++;
        else draftBlogs++;
      });

      setStats({
        customers: { total: customersRes.size },
        bookings: {
          total: bookingsRes.size,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          revenue: totalRevenue
        },
        enquiries: {
          total: enquiriesRes.size,
          new: newEnquiries,
          inProgress: inProgressEnquiries,
          responded: respondedEnquiries
        },
        packages: {
          total: packagesRes.size,
          published: pubPackages,
          draft: draftPackages
        },
        blogs: {
          total: blogsRes.size,
          published: pubBlogs,
          draft: draftBlogs
        },
        subscribers: { total: subscribersRes.size },
        gallery: { total: galleryRes.size }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const primaryStats = [
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.bookings.revenue) : '₹0',
      icon: IndianRupee,
      bgColor: 'bg-emerald-50 text-emerald-600 dark:bg-[#1E2824] dark:text-emerald-400',
    },
    {
      title: 'Total Bookings',
      value: stats?.bookings.total.toString() || '0',
      icon: Calendar,
      bgColor: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400',
    },
    {
      title: 'Total Customers',
      value: stats?.customers.total.toString() || '0',
      icon: Users,
      bgColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
    },
    {
      title: 'Total Enquiries',
      value: stats?.enquiries.total.toString() || '0',
      icon: MessageSquare,
      bgColor: 'bg-amber-50 text-amber-600 dark:bg-[#2A2315] dark:text-amber-400',
    },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#221E2A] dark:text-white font-heading">Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comprehensive overview of the platform operations</p>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-[#1A1625] rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-white/5 flex items-center justify-between transition-transform duration-300 hover:-translate-y-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                {loading ? (
                  <div className="h-8 w-24 bg-gray-100 dark:bg-white/5 rounded animate-pulse mt-2" />
                ) : (
                  <h3 className="text-3xl font-bold text-[#221E2A] dark:text-white">{stat.value}</h3>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Content & Community Overview */}
        <div className="bg-white dark:bg-[#1A1625] rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-white/5 lg:col-span-1 border-t-4 border-t-teal-600">
          <div className="flex items-center gap-2 mb-6">
             <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
             <h2 className="text-lg font-bold text-[#221E2A] dark:text-white">Content Overview</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <MapPinned className="w-4 h-4" /> Packages
              </span>
              {loading ? <div className="w-16 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold dark:text-white">{stats?.packages.published} Active <span className="text-gray-300 dark:text-gray-600 mx-1">|</span> {stats?.packages.draft} Draft</span>}
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Blog Posts
              </span>
              {loading ? <div className="w-16 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold dark:text-white">{stats?.blogs.published} Pub <span className="text-gray-300 dark:text-gray-600 mx-1">|</span> {stats?.blogs.draft} Draft</span>}
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Gallery
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold dark:text-white">{stats?.gallery.total} Images</span>}
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Newsletter
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold dark:text-white">{stats?.subscribers.total} Subscribers</span>}
            </div>
          </div>
        </div>

        {/* Bookings Breakdown */}
        <div className="bg-white dark:bg-[#1A1625] rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-white/5 lg:col-span-1 border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-2 mb-6">
             <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
             <h2 className="text-lg font-bold text-[#221E2A] dark:text-white">Bookings Status</h2>
          </div>
          
          <div className="space-y-4 pt-1">
             <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold text-[#221E2A] dark:text-white">{stats?.bookings.pending}</span>}
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Confirmed
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold text-[#221E2A] dark:text-white">{stats?.bookings.confirmed}</span>}
            </div>
             <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold text-[#221E2A] dark:text-white">{stats?.bookings.completed}</span>}
            </div>
             <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Cancelled
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold text-[#221E2A] dark:text-white">{stats?.bookings.cancelled}</span>}
            </div>
          </div>
        </div>

        {/* Enquiries Breakdown */}
        <div className="bg-white dark:bg-[#1A1625] rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-white/5 lg:col-span-1 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 mb-6">
             <MessageSquare className="w-5 h-5 text-amber-500 dark:text-amber-400" />
             <h2 className="text-lg font-bold text-[#221E2A] dark:text-white">Enquiries Pipeline</h2>
          </div>
          
          <div className="space-y-4 pt-1">
             <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> New / Unread
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold text-[#221E2A] dark:text-white">{stats?.enquiries.new}</span>}
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Progress
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold text-[#221E2A] dark:text-white">{stats?.enquiries.inProgress}</span>}
            </div>
             <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Responded
              </span>
              {loading ? <div className="w-8 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse"/> : 
              <span className="text-sm font-semibold text-[#221E2A] dark:text-white">{stats?.enquiries.responded}</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
