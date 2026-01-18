import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  MessageSquare, 
  LogOut,
  TrendingUp
} from 'lucide-react';
import { isAdminAuthenticated, adminLogout } from '@/lib/adminAuth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));
  const [stats, setStats] = useState({
    doctors: 0,
    services: 0,
    appointments: 0,
    pendingAppointments: 0,
    contacts: 0,
    unreadContacts: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    const unsubscribers: (() => void)[] = [];

    // Real-time listeners
    const unsubDoctors = onSnapshot(collection(db, "doctors"), (snap) => {
      setStats(prev => ({ ...prev, doctors: snap.size }));
    });
    unsubscribers.push(unsubDoctors);

    const unsubServices = onSnapshot(collection(db, "services"), (snap) => {
      setStats(prev => ({ ...prev, services: snap.size }));
    });
    unsubscribers.push(unsubServices);

    let isFirstApptLoad = true;
    const unsubAppointments = onSnapshot(collection(db, "appointments"), (snap) => {
      const appointments = snap.docs.map(d => d.data());
      
      setStats(prev => ({
        ...prev,
        appointments: snap.size,
        pendingAppointments: appointments.filter((a: any) => a.status === 'pending').length,
      }));

      // Process Chart Data
      const dateCounts: Record<string, number> = {};
      appointments.forEach((app: any) => {
        if (app.preferredDate) {
          dateCounts[app.preferredDate] = (dateCounts[app.preferredDate] || 0) + 1;
        }
      });
      const chart = Object.entries(dateCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7);
      setChartData(chart);

      // Process Recent Appointments
      const recent = [...appointments].sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
        const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      }).slice(0, 5);
      setRecentAppointments(recent);

      if (!isFirstApptLoad && snap.docChanges().some(change => change.type === 'added')) {
        audioRef.current.play().catch(() => {});
        toast({ title: "New Appointment!", description: "A new appointment request has been received." });
      }
      isFirstApptLoad = false;
    });
    unsubscribers.push(unsubAppointments);

    let isFirstContactLoad = true;
    const unsubContacts = onSnapshot(collection(db, "contact_requests"), (snap) => {
      const contacts = snap.docs.map(d => d.data());
      setStats(prev => ({
        ...prev,
        contacts: snap.size,
        unreadContacts: contacts.filter((c: any) => !c.isRead).length,
      }));

      if (!isFirstContactLoad && snap.docChanges().some(change => change.type === 'added')) {
        audioRef.current.play().catch(() => {});
        toast({ title: "New Contact Request!", description: "You have received a new message." });
      }
      isFirstContactLoad = false;
    });
    unsubscribers.push(unsubContacts);

    return () => unsubscribers.forEach(unsub => unsub());
  }, [navigate, toast]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const statCards = [
    { 
      title: 'Total Doctors', 
      value: stats.doctors, 
      icon: Users, 
      color: 'bg-blue-500',
      link: '/admin/doctors'
    },
    { 
      title: 'Services', 
      value: stats.services, 
      icon: Stethoscope, 
      color: 'bg-green-500',
      link: '/admin/services'
    },
    { 
      title: 'Appointments', 
      value: stats.appointments, 
      subtitle: `${stats.pendingAppointments} pending`,
      icon: Calendar, 
      color: 'bg-orange-500',
      link: '/admin/appointments'
    },
    { 
      title: 'Contact Requests', 
      value: stats.contacts, 
      subtitle: `${stats.unreadContacts} unread`,
      icon: MessageSquare, 
      color: 'bg-purple-500',
      link: '/admin/contacts'
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to Uttarkhand Netra Hospital Admin Portal</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card 
              key={stat.title} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(stat.link)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Appointment Trends
              </CardTitle>
              <CardDescription>Daily appointment requests (Last 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Appointments List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Appointments
              </CardTitle>
              <CardDescription>Latest 5 appointment requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((app, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{app.patientName}</p>
                      <p className="text-sm text-muted-foreground">{app.doctor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{app.preferredDate}</p>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
                {recentAppointments.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No appointments found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
