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
  DialogDescription,
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

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  description: string;
  image: string;
  role?: string;
}

const DUMMY_IMAGE = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop";
const DIRECTOR_DUMMY_IMAGE = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop";

const AdminDoctors = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    specialization: '',
    experience: '',
    description: '',
    image: '',
    role: 'Doctor',
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadDoctors();
  }, [navigate]);

  const loadDoctors = async () => {
    const querySnapshot = await getDocs(collection(db, "doctors"));
    const doctorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
    setDoctors(doctorsList);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      qualification: '',
      specialization: '',
      experience: '',
      description: '',
      image: '',
      role: 'Doctor',
    });
    setEditingDoctor(null);
  };

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        qualification: doctor.qualification,
        specialization: doctor.specialization,
        experience: doctor.experience,
        description: doctor.description,
        image: doctor.image,
        role: doctor.role || 'Doctor',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const defaultImage = formData.role === 'Director' ? DIRECTOR_DUMMY_IMAGE : DUMMY_IMAGE;
    const dataToSave = { ...formData, image: formData.image || defaultImage };

    if (editingDoctor) {
      await updateDoc(doc(db, "doctors", editingDoctor.id), dataToSave);
      toast({ title: 'Doctor updated successfully' });
    } else {
      await addDoc(collection(db, "doctors"), dataToSave);
      toast({ title: 'Doctor added successfully' });
    }
    
    loadDoctors();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      await deleteDoc(doc(db, "doctors", id));
      loadDoctors();
      toast({ title: 'Doctor deleted successfully' });
    }
  };

  const handleLoadDefaults = async () => {
    if (!confirm('This will add sample doctors to your database. Continue?')) return;
    
    const defaultDoctors = [
      {
        name: "Dr. Ananya Sharma",
        qualification: "MBBS, MS (Ophthalmology)",
        specialization: "Cataract & LASIK",
        experience: "15+ Years",
        description: "Expert in cataract surgery and refractive procedures with a focus on patient comfort and precise outcomes.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
        role: "Director"
      },
      {
        name: "Dr. Suresh Verma",
        qualification: "MBBS, MD (Ophthalmology)",
        specialization: "Cornea Specialist",
        experience: "20+ Years",
        description: "Renowned specialist in corneal transplants and anterior segment surgeries.",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
        role: "Director"
      },
      {
        name: "Dr. Rajesh Patel",
        qualification: "MBBS, DNB",
        specialization: "Retina Specialist",
        experience: "12+ Years",
        description: "Specializes in diabetic retinopathy, macular degeneration, and complex retinal surgeries.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
        role: "Doctor"
      },
      {
        name: "Dr. Priya Mehta",
        qualification: "MBBS, DO",
        specialization: "Pediatric Ophthalmology",
        experience: "10+ Years",
        description: "Dedicated to treating eye problems in children, including squint and amblyopia.",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop",
        role: "Doctor"
      }
    ];

    try {
      await Promise.all(defaultDoctors.map(doctor => addDoc(collection(db, "doctors"), doctor)));
      toast({ title: 'Default doctors added successfully' });
      loadDoctors();
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
            <h1 className="text-3xl font-bold text-foreground">Manage Doctors</h1>
            <p className="text-muted-foreground">Add, edit, or remove doctors from your team</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLoadDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Load Defaults
            </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
                <DialogDescription>
                  {editingDoctor ? 'Update doctor information' : 'Fill in the details to add a new doctor'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Director">Director</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g., MBBS, MS (Ophthalmology)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g., Senior Ophthalmologist"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 15+ Years"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image URL (Leave empty for dummy image)"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingDoctor ? 'Update' : 'Add'} Doctor
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Doctors ({doctors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.role || 'Doctor'}</TableCell>
                    <TableCell>{doctor.experience}</TableCell>
                    <TableCell>{doctor.qualification}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(doctor)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doctor.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {doctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No doctors added yet. Click "Add Doctor" to get started.
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

export default AdminDoctors;
