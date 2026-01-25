import { Calendar, MessageSquare, Star, FileText } from 'lucide-react';

export const RecentActivity = () => {
  // Mock data - in a real app, this would come from your backend/firebase
  const activities = [
    {
      id: 1,
      user: "Rahul Kumar",
      action: "booked an appointment",
      time: "2 hours ago",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      id: 2,
      user: "Priya Singh",
      action: "sent a message",
      time: "4 hours ago",
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      id: 3,
      user: "Amit Patel",
      action: "left a 5-star review",
      time: "1 day ago",
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    {
      id: 4,
      user: "Dr. Sharma",
      action: "updated a patient record",
      time: "1 day ago",
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-100"
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
          <div className={`p-2 rounded-full ${activity.bg} ${activity.color} mt-1`}>
            <activity.icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm text-gray-800">
              <span className="font-medium">{activity.user}</span> {activity.action}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};