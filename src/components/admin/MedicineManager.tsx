import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: string;
  manufacturer: string;
  description: string;
}

export const MedicineManager = () => {
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    name: '',
    category: '',
    price: '',
    manufacturer: '',
    description: ''
  });

  const fetchMedicines = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'medicines'));
      const fetchedMedicines = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medicine[];
      setMedicines(fetchedMedicines);
    } catch (error: any) {
      console.error("Error fetching medicines:", error);
      toast({ title: "Error", description: "Failed to fetch medicines", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'medicines', isEditing), formData);
        toast({ title: "Success", description: "Medicine updated successfully" });
      } else {
        await addDoc(collection(db, 'medicines'), formData);
        toast({ title: "Success", description: "Medicine added successfully" });
      }
      setFormData({ name: '', category: '', price: '', manufacturer: '', description: '' });
      setIsEditing(null);
      fetchMedicines();
    } catch (error: any) {
      console.error("Error saving medicine:", error);
      toast({ title: "Error", description: "Failed to save medicine", variant: "destructive" });
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setIsEditing(medicine.id);
    setFormData({
      name: medicine.name,
      category: medicine.category,
      price: medicine.price,
      manufacturer: medicine.manufacturer,
      description: medicine.description
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await deleteDoc(doc(db, 'medicines', id));
      toast({ title: "Success", description: "Medicine deleted successfully" });
      fetchMedicines();
    } catch (error: any) {
      console.error("Error deleting medicine:", error);
      toast({ title: "Error", description: "Failed to delete medicine", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ name: '', category: '', price: '', manufacturer: '', description: '' });
  };

  return (
    <div className="p-6 lg:p-8 bg-muted/10 min-h-screen space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Medicines Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage pharmacy stock and details</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm">
          Total Items: {medicines.length}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
              {isEditing ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Medicine Name" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                  <option value="">Select Category</option>
                  <option value="Eye Drops">Eye Drops</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Ointment">Ointment</option>
                </select>
                <input name="price" value={formData.price} onChange={handleInputChange} placeholder="Price (e.g. ₹150)" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <input name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} placeholder="Manufacturer" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description / Usage" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                  {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditing ? 'Update' : 'Add Medicine'}
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
            {loading ? <p className="text-muted-foreground col-span-full text-center py-10">Loading medicines...</p> : medicines.length === 0 ? <p className="text-muted-foreground col-span-full text-center py-10">No medicines found.</p> : (
              medicines.map((medicine) => (
                <div key={medicine.id} className="group bg-card p-5 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{medicine.category}</span>
                      <span className="font-semibold text-foreground">{medicine.price}</span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{medicine.name}</h3>
                    <p className="text-muted-foreground text-xs font-medium mb-2">{medicine.manufacturer}</p>
                    <p className="text-muted-foreground/80 text-sm line-clamp-2">{medicine.description}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border/50 mt-2">
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-primary" onClick={() => handleEdit(medicine)}><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(medicine.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
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