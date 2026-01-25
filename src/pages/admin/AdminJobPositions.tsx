import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { isAdminAuthenticated } from '@/lib/adminAuth';

interface JobPosition {
  id: string;
  title: string;
  department?: string;
  type?: string; // Full-time, Part-time
}

const AdminJobPositions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [newPosition, setNewPosition] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPositions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'job_positions'));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPosition));
      setPositions(list);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    fetchPositions();
  }, [navigate]);

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'job_positions'), {
        title: newPosition,
        createdAt: serverTimestamp()
      });
      setNewPosition('');
      fetchPositions();
      toast({
        title: "Position Added",
        description: "New job position has been created successfully.",
      });
    } catch (error: any) {
      console.error("Error adding position:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add position.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this position?")) return;
    try {
      await deleteDoc(doc(db, 'job_positions', id));
      setPositions(positions.filter(p => p.id !== id));
      toast({
        title: "Position Deleted",
        description: "Job position has been removed.",
      });
    } catch (error) {
      console.error("Error deleting position:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Job Openings</h1>
              <p className="text-slate-500">Manage available job positions for the website</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Add New Position</h2>
            <form onSubmit={handleAddPosition} className="flex gap-4">
              <Input
                placeholder="e.g. Senior Ophthalmologist"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {loading ? 'Adding...' : 'Add Position'}
              </Button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold">Active Positions ({positions.length})</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {positions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No job positions added yet.
                </div>
              ) : (
                positions.map((position) => (
                  <div key={position.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-slate-700">{position.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(position.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobPositions;