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
import { Plus, Pencil, Trash2, Star, RotateCcw } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadTestimonials();
  }, [navigate]);

  const loadTestimonials = async () => {
    const querySnapshot = await getDocs(collection(db, "testimonials"));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    setTestimonials(list);
  };

  const handleOpenDialog = (item?: Testimonial) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        role: item.role,
        content: item.content,
        rating: item.rating,
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', content: '', rating: 5 });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "testimonials", editingId), formData);
      toast({ title: 'Testimonial updated' });
    } else {
      await addDoc(collection(db, "testimonials"), formData);
      toast({ title: 'Testimonial added' });
    }
    loadTestimonials();
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      await deleteDoc(doc(db, "testimonials", id));
      loadTestimonials();
      toast({ title: 'Testimonial deleted' });
    }
  };

  const handleLoadDefaults = async () => {
    if (!confirm('This will add sample testimonials to your database. Continue?')) return;
    
    const defaultTestimonials = [
      {
        name: "Ramesh Kumar",
        role: "Patient",
        content: "The cataract surgery was painless and the recovery was very fast. I am very happy with the results.",
        rating: 5
      },
      {
        name: "Sunita Singh",
        role: "Teacher",
        content: "Dr. Ananya is very polite and explained everything clearly. Best eye hospital in the region.",
        rating: 5
      },
      {
        name: "Amit Verma",
        role: "Software Engineer",
        content: "Got my LASIK done here. No more glasses! The technology used is top-notch.",
        rating: 4
      }
    ];

    try {
      await Promise.all(defaultTestimonials.map(t => addDoc(collection(db, "testimonials"), t)));
      toast({ title: 'Default testimonials added successfully' });
      loadTestimonials();
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
          <h1 className="text-3xl font-bold">Manage Testimonials</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLoadDefaults}><RotateCcw className="w-4 h-4 mr-2" /> Load Defaults</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Add Testimonial</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Testimonial</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <Label>Role/Location</Label>
                  <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Patient, Mumbai" required />
                </div>
                <div>
                  <Label>Rating (1-5)</Label>
                  <Input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} required />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full">{editingId ? 'Update' : 'Add'}</Button>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>All Testimonials ({testimonials.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {item.rating} <Star className="w-3 h-3 ml-1 fill-primary text-primary" />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{item.content}</TableCell>
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
                {testimonials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No testimonials found.
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

export default AdminTestimonials;