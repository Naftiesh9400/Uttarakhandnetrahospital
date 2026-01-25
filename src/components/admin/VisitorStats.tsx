import { useEffect, useState } from 'react';
import { Users, Calendar, Activity, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';

interface VisitorData {
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  totalDoctors: number;
}

export const VisitorStats = () => {
  const [stats, setStats] = useState<VisitorData>({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    totalDoctors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Listen to Appointments
    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const total = snapshot.size;
      const pending = snapshot.docs.filter(doc => doc.data().status === 'pending').length;
      
      // Calculate today's appointments
      const today = snapshot.docs.filter(doc => {
        const data = doc.data();
        if (!data.createdAt) return false;
        const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        return date >= startOfToday;
      }).length;

      setStats(prev => ({
        ...prev,
        totalAppointments: total,
        pendingAppointments: pending,
        todayAppointments: today
      }));
      setLoading(false);
    });

    // Listen to Doctors
    const unsubDoctors = onSnapshot(collection(db, 'doctors'), (snapshot) => {
      setStats(prev => ({ ...prev, totalDoctors: snapshot.size }));
    });

    return () => {
      unsubAppointments();
      unsubDoctors();
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Appointments"
        value={stats.totalAppointments.toLocaleString()}
        icon={<Calendar className="h-5 w-5 text-blue-600" />}
        description="All time appointments"
        trend="Lifetime"
        trendUp={true}
      />
      <StatCard
        title="Pending Requests"
        value={stats.pendingAppointments.toString()}
        icon={<Clock className="h-5 w-5 text-orange-600" />}
        description="Awaiting approval"
        trend="Action needed"
        trendUp={false}
      />
      <StatCard
        title="Today's Appointments"
        value={stats.todayAppointments.toLocaleString()}
        icon={<Activity className="h-5 w-5 text-purple-600" />}
        description="New requests today"
        trend="Daily activity"
        trendUp={true}
      />
      <StatCard
        title="Total Doctors"
        value={stats.totalDoctors.toString()}
        icon={<Users className="h-5 w-5 text-green-600" />}
        description="Active medical staff"
        trend="Team size"
        trendUp={true}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon, description, trend, trendUp }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-500">{description}</p>
      <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </span>
    </div>
  </div>
);