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

const iconOptions = [
  'Eye', 'Sparkles', 'Zap', 'Target', 'Baby', 'Shield', 
  'Heart', 'Star', 'Check', 'Activity', 'Glasses'
];

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
  features?: string; // Stored as newline separated string
}

const AdminServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Eye',
    price: '',
    features: '',
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadServices();
  }, [navigate]);

  const loadServices = async () => {
    const querySnapshot = await getDocs(collection(db, "services"));
    const servicesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    setServices(servicesList);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'Eye',
      price: '',
      features: '',
    });
    setEditingService(null);
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        price: service.price || '',
        features: service.features || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.price && isNaN(Number(formData.price))) {
      toast({ 
        title: "Invalid Price", 
        description: "Price must be a valid number",
        variant: "destructive" 
      });
      return;
    }
    
    if (editingService) {
      await updateDoc(doc(db, "services", editingService.id), formData);
      toast({ title: 'Service updated successfully' });
    } else {
      await addDoc(collection(db, "services"), formData);
      toast({ title: 'Service added successfully' });
    }
    
    loadServices();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteDoc(doc(db, "services", id));
      loadServices();
      toast({ title: 'Service deleted successfully' });
    }
  };

  const handleLoadDefaults = async () => {
    if (!confirm('This will add sample services to your database. Continue?')) return;
    
    const defaultServices = [
      {
        title: "Comprehensive Eye Check-up",
        description: "Complete vision and eye health evaluation with advanced diagnostic tools.",
        icon: "Eye",
        price: "500",
        features: "Visual Acuity Test\nEye Pressure Check\nRetina Examination"
      },
      {
        title: "Cataract Surgery",
        description: "Advanced, painless cataract treatment with quick recovery time.",
        icon: "Activity",
        price: "25000",
        features: "Micro-incision technique\nPremium IOLs\nQuick recovery"
      },
      {
        title: "LASIK & Refractive Surgery",
        description: "Freedom from glasses with safe laser vision correction technology.",
        icon: "Glasses",
        price: "45000",
        features: "Blade-free procedure\nCustomized treatment\nHigh precision"
      },
      {
        title: "Retina Treatment",
        description: "Specialized care for diabetic retinopathy and retinal disorders.",
        icon: "Target",
        price: "2000",
        features: "OCT Imaging\nLaser treatment\nIntravitreal injections"
      },
      {
        title: "Pediatric Eye Care",
        description: "Gentle, specialized eye care designed for children of all ages.",
        icon: "Baby",
        price: "800",
        features: "Squint correction\nAmblyopia treatment\nFriendly environment"
      },
      {
        title: "Glaucoma Management",
        description: "Early detection and long-term management of glaucoma conditions.",
        icon: "Shield",
        price: "1500",
        features: "IOP measurement\nVisual field test\nMedical & surgical management"
      }
    ];

    try {
      await Promise.all(defaultServices.map(service => addDoc(collection(db, "services"), service)));
      toast({ title: 'Default services added successfully' });
      loadServices();
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
            <h1 className="text-3xl font-bold text-foreground">Manage Services</h1>
            <p className="text-muted-foreground">Add, edit, or remove eye care services</p>
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
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogDescription>
                  {editingService ? 'Update service information' : 'Fill in the details to add a new service'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Cataract Surgery"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the service..."
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Optional)</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features">Features (One per line)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingService ? 'Update' : 'Add'} Service
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Services ({services.length})</CardTitle>
          </CardHeader>
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
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                    <TableCell>{service.icon}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(service)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {services.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No services added yet. Click "Add Service" to get started.
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

export default AdminServices;
