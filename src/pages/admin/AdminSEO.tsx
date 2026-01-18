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
import { Pencil, Globe, RotateCcw } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';

const pages = [
  { id: 'home', name: 'Home Page' },
  { id: 'about', name: 'About Us' },
  { id: 'services', name: 'Services' },
  { id: 'team', name: 'Our Team' },
  { id: 'contact', name: 'Contact Us' },
  { id: 'why-netra', name: 'Why Uttarakhand Netra?' },
  { id: 'appointment', name: 'Book Appointment' },
];

const AdminSEO = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleEdit = async (page: any) => {
    setSelectedPage(page);
    setFormData({ title: '', description: '', keywords: '' }); // Reset
    
    // Fetch existing data
    try {
      const docRef = doc(db, 'seo_settings', page.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          keywords: data.keywords || '',
        });
      }
    } catch (error) {
      console.error("Error fetching SEO:", error);
    }
    
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    try {
      await setDoc(doc(db, 'seo_settings', selectedPage.id), formData);
      toast({ title: 'SEO settings updated successfully' });
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error updating settings', variant: 'destructive' });
    }
  };

  const handleLoadDefaults = async () => {
    if (!confirm('This will reset SEO settings for all pages to default. Continue?')) return;

    const defaultSEO = [
      { id: 'home', title: 'Uttarakhand Netra Hospital | Home', description: 'Best eye hospital in Uttarakhand offering Cataract, LASIK, and Retina services.', keywords: 'eye hospital, uttarakhand, ophthalmologist, cataract, lasik' },
      { id: 'about', title: 'About Us | Uttarakhand Netra Hospital', description: 'Learn about our history, mission, and experienced team of doctors.', keywords: 'about us, doctors, history, mission' },
      { id: 'services', title: 'Our Services | Uttarakhand Netra Hospital', description: 'Comprehensive eye care services including Cataract, Glaucoma, and Retina treatment.', keywords: 'services, cataract surgery, lasik, glaucoma' },
      { id: 'team', title: 'Our Team | Uttarakhand Netra Hospital', description: 'Meet our team of expert eye specialists and surgeons.', keywords: 'doctors, team, specialists, surgeons' },
      { id: 'contact', title: 'Contact Us | Uttarakhand Netra Hospital', description: 'Get in touch with us for appointments and inquiries.', keywords: 'contact, appointment, address, phone' },
      { id: 'why-netra', title: 'Why Choose Us | Uttarakhand Netra Hospital', description: 'Why Uttarakhand Netra Hospital is the best choice for your eye care.', keywords: 'why choose us, best hospital, features' },
      { id: 'appointment', title: 'Book Appointment | Uttarakhand Netra Hospital', description: 'Schedule an appointment with our expert doctors online.', keywords: 'book appointment, schedule, online booking' },
    ];

    try {
      await Promise.all(defaultSEO.map(page => setDoc(doc(db, 'seo_settings', page.id), page)));
      toast({ title: 'Default SEO settings loaded successfully' });
    } catch (error) {
      console.error("Error loading defaults:", error);
      toast({ title: 'Error loading defaults', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">SEO Management</h1>
            <p className="text-muted-foreground">Manage meta tags and titles for your pages</p>
          </div>
          <Button variant="outline" onClick={handleLoadDefaults}><RotateCcw className="w-4 h-4 mr-2" /> Load Defaults</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Pages</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      {page.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{page.id}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit SEO
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit SEO: {selectedPage?.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Page Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Home | Uttarakhand Netra Hospital" />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief summary of the page..." rows={3} />
              </div>
              <div>
                <Label>Keywords (comma separated)</Label>
                <Input value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} placeholder="eye, hospital, doctor..." />
              </div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminSEO;