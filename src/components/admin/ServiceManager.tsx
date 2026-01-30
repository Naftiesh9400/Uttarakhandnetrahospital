import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
}

export const ServiceManager = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    title: '',
    description: '',
    iconUrl: ''
  });

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const fetchedServices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(fetchedServices);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast({ title: "Error", description: "Failed to fetch services", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'services', isEditing), formData);
        toast({ title: "Success", description: "Service updated successfully" });
      } else {
        await addDoc(collection(db, 'services'), formData);
        toast({ title: "Success", description: "Service added successfully" });
      }
      setFormData({ title: '', description: '', iconUrl: '' });
      setIsEditing(null);
      fetchServices();
    } catch (error: any) {
      console.error("Error saving service:", error);
      toast({ title: "Error", description: "Failed to save service", variant: "destructive" });
    }
  };

  const handleEdit = (service: Service) => {
    setIsEditing(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      iconUrl: service.iconUrl || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      toast({ title: "Success", description: "Service deleted successfully" });
      fetchServices();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ title: '', description: '', iconUrl: '' });
  };

  return (
    <div className="p-6 lg:p-8 bg-muted/10 min-h-screen space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Hospital Services</h1>
          <p className="text-muted-foreground mt-1">Manage treatments and offerings</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm">
          Total Services: {services.length}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
              {isEditing ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Service Title" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description..." required rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
                <input name="iconUrl" value={formData.iconUrl} onChange={handleInputChange} placeholder="Icon URL (Optional)" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                  {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditing ? 'Update' : 'Add Service'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading ? <p className="text-muted-foreground col-span-full text-center py-10">Loading services...</p> : services.length === 0 ? <p className="text-muted-foreground col-span-full text-center py-10">No services found.</p> : (
              services.map((service) => (
                <div key={service.id} className="group bg-card p-6 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      {service.iconUrl ? <img src={service.iconUrl} alt="" className="w-10 h-10 object-contain rounded-lg bg-primary/5 p-1.5" /> : <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-lg">{service.title.charAt(0)}</div>}
                      <h3 className="font-bold text-lg text-foreground leading-tight">{service.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3">{service.description}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border/50 mt-2">
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-primary" onClick={() => handleEdit(service)}><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(service.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};