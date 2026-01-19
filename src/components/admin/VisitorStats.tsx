import { useEffect, useState } from 'react';
import { Users, Eye, Activity, TrendingUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface VisitorData {
  totalVisitors: number;
  activeNow: number;
  todayVisits: number;
  monthlyGrowth: number;
}

export const VisitorStats = () => {
  const [stats, setStats] = useState<VisitorData>({
    totalVisitors: 0,
    activeNow: 0,
    todayVisits: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Note: In a production environment, you would fetch this data from a 
        // dedicated 'stats' collection or use a cloud function to aggregate 'visitors'.
        // For now, we are simulating the data structure.
        
        // Example fetch:
        // const statsDoc = await getDoc(doc(db, 'admin_stats', 'visitors'));
        // if (statsDoc.exists()) setStats(statsDoc.data() as VisitorData);

        // Mock data for display
        setStats({
          totalVisitors: 15420,
          activeNow: 8,
          todayVisits: 142,
          monthlyGrowth: 12.5
        });
      } catch (error) {
        console.error("Error fetching visitor stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        title="Total Visitors"
        value={stats.totalVisitors.toLocaleString()}
        icon={<Users className="h-5 w-5 text-blue-600" />}
        description="All time visits"
        trend="+12% this month"
        trendUp={true}
      />
      <StatCard
        title="Active Now"
        value={stats.activeNow.toString()}
        icon={<Activity className="h-5 w-5 text-green-600" />}
        description="Current active users"
        trend="Live"
        trendUp={true}
      />
      <StatCard
        title="Today's Visits"
        value={stats.todayVisits.toLocaleString()}
        icon={<Eye className="h-5 w-5 text-purple-600" />}
        description="Unique visits today"
        trend="+5% from yesterday"
        trendUp={true}
      />
      <StatCard
        title="Growth"
        value={`${stats.monthlyGrowth}%`}
        icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
        description="Monthly growth rate"
        trend="Consistent growth"
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