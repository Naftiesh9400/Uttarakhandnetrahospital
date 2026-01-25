import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { VisitorStats } from '@/components/admin/VisitorStats';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MessageSquare, Users } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    const fetchChartData = async () => {
      try {
        // Fetch recent appointments
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        
        // Initialize last 7 days data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = subDays(new Date(), i);
          return {
            date: startOfDay(d),
            name: format(d, 'MMM dd'),
            count: 0
          };
        }).reverse();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt) {
            const createdDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
            // Find matching day in our last7Days array
            const dayStat = last7Days.find(day => 
              createdDate >= day.date && createdDate < new Date(day.date.getTime() + 86400000)
            );
            if (dayStat) {
              dayStat.count++;
            }
          }
        });

        setChartData(last7Days.map(({ name, count }) => ({ name, count })));
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back to the admin panel.</p>
          </div>
          
          <VisitorStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Appointment Trends (Last 7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                  onClick={() => navigate('/admin/doctors')}
                >
                  <Plus className="w-6 h-6" />
                  Add Doctor
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all"
                  onClick={() => navigate('/admin/appointments')}
                >
                  <Calendar className="w-6 h-6" />
                  View Appointments
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all"
                  onClick={() => navigate('/admin/contacts')}
                >
                  <MessageSquare className="w-6 h-6" />
                  Check Messages
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all"
                  onClick={() => navigate('/admin/jobs')}
                >
                  <Users className="w-6 h-6" />
                  Job Applications
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;