import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  imageUrl?: string;
}

export const DoctorManager = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Doctor, 'id'>>({
    name: '',
    specialty: '',
    qualification: '',
    experience: '',
    imageUrl: ''
  });

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const fetchedDoctors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      setDoctors(fetchedDoctors);
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      toast({ title: "Error", description: "Failed to fetch doctors", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'doctors', isEditing), formData);
        toast({ title: "Success", description: "Doctor updated successfully" });
      } else {
        await addDoc(collection(db, 'doctors'), formData);
        toast({ title: "Success", description: "Doctor added successfully" });
      }
      setFormData({ name: '', specialty: '', qualification: '', experience: '', imageUrl: '' });
      setIsEditing(null);
      fetchDoctors();
    } catch (error: any) {
      console.error("Error saving doctor:", error);
      toast({ title: "Error", description: "Failed to save doctor", variant: "destructive" });
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setIsEditing(doctor.id);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      imageUrl: doctor.imageUrl || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteDoc(doc(db, 'doctors', id));
      toast({ title: "Success", description: "Doctor deleted successfully" });
      fetchDoctors();
    } catch (error: any) {
      console.error("Error deleting doctor:", error);
      toast({ title: "Error", description: "Failed to delete doctor", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ name: '', specialty: '', qualification: '', experience: '', imageUrl: '' });
  };

  return (
    <div className="p-6 lg:p-8 bg-muted/10 min-h-screen space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctors Directory</h1>
          <p className="text-muted-foreground mt-1">Manage medical team profiles</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm">
          Total Doctors: {doctors.length}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
              {isEditing ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Doctor Name" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <input name="specialty" value={formData.specialty} onChange={handleInputChange} placeholder="Specialty (e.g. Retina Specialist)" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <input name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="Qualification (e.g. MBBS, MS)" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <input name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Experience (e.g. 10 Years)" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="Profile Image URL" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                  {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditing ? 'Update' : 'Add Doctor'}
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
            {loading ? <p className="text-muted-foreground col-span-full text-center py-10">Loading doctors...</p> : doctors.length === 0 ? <p className="text-muted-foreground col-span-full text-center py-10">No doctors found.</p> : (
              doctors.map((doctor) => (
                <div key={doctor.id} className="group bg-card p-6 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border group-hover:border-primary transition-colors">
                      {doctor.imageUrl ? <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">{doctor.name.charAt(0)}</div>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{doctor.name}</h3>
                    <p className="text-primary text-sm font-medium mb-1">{doctor.specialty}</p>
                    <p className="text-muted-foreground text-xs">{doctor.qualification} • {doctor.experience}</p>
                  </div>
                  <div className="flex gap-2 w-full pt-2 border-t border-border/50 mt-2">
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-primary" onClick={() => handleEdit(doctor)}><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(doctor.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
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