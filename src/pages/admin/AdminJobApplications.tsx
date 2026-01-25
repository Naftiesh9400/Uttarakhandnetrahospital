import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, XCircle, Clock, Mail, Phone, Briefcase, Calendar, FileText } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  message: string;
  status: 'Pending' | 'Reviewed' | 'Interview' | 'Rejected';
  createdAt: any;
}

const AdminJobApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    const q = query(collection(db, 'job_applications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobApplication[];
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications.",
        variant: "destructive"
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, toast]);

  const updateStatus = async (id: string, newStatus: JobApplication['status']) => {
    try {
      const appRef = doc(db, 'job_applications', id);
      await updateDoc(appRef, { status: newStatus });
      toast({ title: "Status Updated", description: `Application marked as ${newStatus}` });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const deleteApplication = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await deleteDoc(doc(db, 'job_applications', id));
      toast({ title: "Application Deleted", description: "The application has been removed." });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({ title: "Error", description: "Failed to delete application", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Interview': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Job Applications</h1>
              <p className="text-slate-500">Manage incoming career applications</p>
            </div>
            <div className="ml-auto bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
              <span className="font-semibold text-slate-700">{applications.length}</span> Total
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">Loading applications...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{app.fullName}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Briefcase className="w-3 h-3" /> {app.position}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${app.email}`} className="hover:text-blue-600">{app.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${app.phone}`} className="hover:text-blue-600">{app.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{app.experience} Experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</span>
                    </div>
                    
                    {app.message && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
                        "{app.message}"
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-between items-center">
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={() => updateStatus(app.id, 'Reviewed')}
                        title="Mark as Reviewed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-purple-600 hover:bg-purple-50"
                        onClick={() => updateStatus(app.id, 'Interview')}
                        title="Schedule Interview"
                      >
                        <Clock className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        onClick={() => updateStatus(app.id, 'Rejected')}
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteApplication(app.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && applications.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No applications yet</h3>
              <p className="text-slate-500">When people apply, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobApplications;