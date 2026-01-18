import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';

const iconOptions = [
  'UserCheck', 'Microscope', 'Shield', 'BadgeCheck', 'Heart', 'Clock', 'Award', 'Stethoscope', 'Users', 'Zap'
];

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const AdminFeatures = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Shield',
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadFeatures();
  }, [navigate]);

  const loadFeatures = async () => {
    const querySnapshot = await getDocs(collection(db, "features"));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature));
    setFeatures(list);
  };

  const handleOpenDialog = (item?: Feature) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        description: item.description,
        icon: item.icon,
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', icon: 'Shield' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "features", editingId), formData);
      toast({ title: 'Feature updated' });
    } else {
      await addDoc(collection(db, "features"), formData);
      toast({ title: 'Feature added' });
    }
    loadFeatures();
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this feature?')) {
      await deleteDoc(doc(db, "features", id));
      loadFeatures();
      toast({ title: 'Feature deleted' });
    }
  };

  const handleLoadDefaults = async () => {
    if (!confirm('This will add sample features to your database. Continue?')) return;
    
    const defaultFeatures = [
      {
        title: "Experienced Eye Specialists",
        description: "Our team of board-certified ophthalmologists brings decades of combined experience.",
        icon: "UserCheck"
      },
      {
        title: "Advanced Diagnostic Technology",
        description: "State-of-the-art equipment for accurate diagnosis and treatment planning.",
        icon: "Microscope"
      },
      {
        title: "Patient-Centered Care",
        description: "We prioritize your comfort and well-being at every step of your journey.",
        icon: "Heart"
      },
      {
        title: "Affordable Treatment Plans",
        description: "Quality eye care accessible to all with flexible payment options.",
        icon: "BadgeCheck"
      },
      {
        title: "Trusted by Thousands",
        description: "Join our community of satisfied patients who've regained their clear vision.",
        icon: "Users"
      }
    ];

    try {
      await Promise.all(defaultFeatures.map(f => addDoc(collection(db, "features"), f)));
      toast({ title: 'Default features added successfully' });
      loadFeatures();
    } catch (error) {
      console.error("Error loading defaults:", error);
      toast({ title: 'Error adding defaults', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
          <h1 className="text-3xl font-bold">Manage "Why Choose Us"</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLoadDefaults}><RotateCcw className="w-4 h-4 mr-2" /> Load Defaults</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Add Feature</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Feature</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Select value={formData.icon} onValueChange={(val) => setFormData({...formData, icon: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(icon => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">{editingId ? 'Update' : 'Add'}</Button>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>All Features ({features.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>{item.icon}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {features.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No features found.
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

export default AdminFeatures;