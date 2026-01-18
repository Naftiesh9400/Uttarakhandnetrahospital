import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Trash2, Calendar, Clock, RotateCcw } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  doctor: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

const AdminAppointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadAppointments();
  }, [navigate]);

  const loadAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const list = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      } as Appointment;
    });
    // Sort by date descending
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setAppointments(list);
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    await updateDoc(doc(db, "appointments", id), { status });
    loadAppointments();
    toast({ title: `Appointment ${status}` });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      await deleteDoc(doc(db, "appointments", id));
      loadAppointments();
      toast({ title: 'Appointment deleted' });
    }
  };

  const handleLoadDefaults = async () => {
    if (!confirm('This will add sample appointments. Continue?')) return;
    
    const sampleAppointments = [
      { patientName: "Amit Kumar", phone: "+91 9988776655", email: "amit@test.com", preferredDate: "2024-05-20", preferredTime: "10:00 AM", doctor: "Dr. Ananya Sharma", message: "Regular checkup", status: "pending", createdAt: new Date() },
      { patientName: "Sita Devi", phone: "+91 8877665544", email: "sita@test.com", preferredDate: "2024-05-21", preferredTime: "2:00 PM", doctor: "Dr. Rajesh Patel", message: "Eye pain", status: "approved", createdAt: new Date() },
    ];

    try {
      await Promise.all(sampleAppointments.map(a => addDoc(collection(db, "appointments"), a)));
      toast({ title: 'Sample appointments added' });
      loadAppointments();
    } catch (error) {
      console.error("Error loading defaults:", error);
      toast({ title: 'Error adding samples', variant: 'destructive' });
    }
  };

  const filteredAppointments = appointments.filter(a => 
    filter === 'all' ? true : a.status === filter
  );

  const getStatusBadge = (status: Appointment['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return <Badge className={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Manage patient appointment requests</p>
          </div>
          <Button variant="outline" onClick={handleLoadDefaults} className="mr-2">
            <RotateCcw className="w-4 h-4 mr-2" /> Load Defaults
          </Button>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Appointments ({filteredAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {appointment.preferredDate}
                        <Clock className="w-3 h-3 ml-2" />
                        {appointment.preferredTime}
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="text-right">
                      {appointment.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, 'approved')}
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, 'rejected')}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAppointments;
