import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisionTest {
  id: string;
  title: string;
  type: string;
  description: string;
  instructions: string;
}

export const VisionTestManager = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState<VisionTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<VisionTest, 'id'>>({
    title: '',
    type: '',
    description: '',
    instructions: ''
  });

  const fetchTests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vision_tests'));
      const fetchedTests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VisionTest[];
      setTests(fetchedTests);
    } catch (error: any) {
      console.error("Error fetching tests:", error);
      toast({ title: "Error", description: "Failed to fetch vision tests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'vision_tests', isEditing), formData);
        toast({ title: "Success", description: "Test updated successfully" });
      } else {
        await addDoc(collection(db, 'vision_tests'), formData);
        toast({ title: "Success", description: "Test added successfully" });
      }
      setFormData({ title: '', type: '', description: '', instructions: '' });
      setIsEditing(null);
      fetchTests();
    } catch (error: any) {
      console.error("Error saving test:", error);
      toast({ title: "Error", description: "Failed to save test", variant: "destructive" });
    }
  };

  const handleEdit = (test: VisionTest) => {
    setIsEditing(test.id);
    setFormData({
      title: test.title,
      type: test.type,
      description: test.description,
      instructions: test.instructions
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;
    try {
      await deleteDoc(doc(db, 'vision_tests', id));
      toast({ title: "Success", description: "Test deleted successfully" });
      fetchTests();
    } catch (error: any) {
      console.error("Error deleting test:", error);
      toast({ title: "Error", description: "Failed to delete test", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ title: '', type: '', description: '', instructions: '' });
  };

  return (
    <div className="p-6 lg:p-8 bg-muted/10 min-h-screen space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Vision Tests</h1>
          <p className="text-muted-foreground mt-1">Manage eye tests and instructions</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm">
          Total Tests: {tests.length}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
              {isEditing ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              {isEditing ? 'Edit Test' : 'Add New Test'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Test Title" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <select name="type" value={formData.type} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                  <option value="">Select Type</option>
                  <option value="Visual Acuity">Visual Acuity</option>
                  <option value="Color Blindness">Color Blindness</option>
                  <option value="Contrast Sensitivity">Contrast Sensitivity</option>
                  <option value="Astigmatism">Astigmatism</option>
                </select>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
                <textarea name="instructions" value={formData.instructions} onChange={handleInputChange} placeholder="Instructions for user" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                  {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditing ? 'Update' : 'Add Test'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          <div className="grid sm:grid-cols-2 gap-4">
            {loading ? <p className="text-muted-foreground col-span-full text-center py-10">Loading tests...</p> : tests.length === 0 ? <p className="text-muted-foreground col-span-full text-center py-10">No tests found.</p> : (
              tests.map((test) => (
                <div key={test.id} className="group bg-card p-6 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">{test.type}</span>
                    <h3 className="font-bold text-xl text-foreground mb-2">{test.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{test.description}</p>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Instructions</p>
                      <p className="text-sm text-foreground/80 line-clamp-2">{test.instructions}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border/50 mt-2">
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-primary" onClick={() => handleEdit(test)}><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(test.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
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