import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    fetchAdmins();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'admins'));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(list);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    try {
      await addDoc(collection(db, 'admins'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setFormData({
        email: '',
        password: ''
      });
      fetchAdmins();
      toast({ title: "Success", description: "New admin created successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'admins', id));
      setAdmins(admins.filter(a => a.id !== id));
      toast({ title: "Deleted", description: "Admin removed." });
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Manage Admins</h1>
              <p className="text-slate-500">Create and manage administrators</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Admin Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
                <h2 className="text-lg font-semibold mb-4">Create New Admin</h2>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="admin@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Password</label>
                    <Input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Secret123" />
                  </div>
                  <Button type="submit" className="w-full">Create Admin</Button>
                </form>
              </div>
            </div>

            {/* Admin List */}
            <div className="lg:col-span-2 space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{admin.email}</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(admin.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;