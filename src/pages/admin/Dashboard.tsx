import { VisitorStats } from "@/components/admin/VisitorStats";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back to the admin panel.</p>
      </div>

      <VisitorStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400">
            Activity Chart Placeholder
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400">
            Quick Actions Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;