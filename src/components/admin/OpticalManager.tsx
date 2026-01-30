import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OpticalProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  brand: string;
  imageUrl?: string;
}

export const OpticalManager = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<OpticalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<OpticalProduct, 'id'>>({
    name: '',
    category: '',
    price: '',
    brand: '',
    imageUrl: ''
  });

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'optical_products'));
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OpticalProduct[];
      setProducts(fetchedProducts);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'optical_products', isEditing), formData);
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await addDoc(collection(db, 'optical_products'), formData);
        toast({ title: "Success", description: "Product added successfully" });
      }
      setFormData({ name: '', category: '', price: '', brand: '', imageUrl: '' });
      setIsEditing(null);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const handleEdit = (product: OpticalProduct) => {
    setIsEditing(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      brand: product.brand,
      imageUrl: product.imageUrl || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'optical_products', id));
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ name: '', category: '', price: '', brand: '', imageUrl: '' });
  };

  return (
    <div className="p-6 lg:p-8 bg-muted/10 min-h-screen space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Optical Shop</h1>
          <p className="text-muted-foreground mt-1">Manage frames, lenses, and accessories</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm">
          Total Products: {products.length}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
              {isEditing ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                  <option value="">Select Category</option>
                  <option value="Frames">Frames</option>
                  <option value="Lenses">Lenses</option>
                  <option value="Sunglasses">Sunglasses</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <input name="price" value={formData.price} onChange={handleInputChange} placeholder="Price (e.g. ₹1500)" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <input name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand Name" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="Product Image URL" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                  {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditing ? 'Update' : 'Add Product'}
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
            {loading ? <p className="text-muted-foreground col-span-full text-center py-10">Loading products...</p> : products.length === 0 ? <p className="text-muted-foreground col-span-full text-center py-10">No products found.</p> : (
              products.map((product) => (
                <div key={product.id} className="group bg-card p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col gap-4">
                  <div className="aspect-square rounded-lg bg-muted overflow-hidden relative">
                    {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>}
                    <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">{product.price}</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{product.name}</h3>
                    <p className="text-muted-foreground text-sm">{product.brand} • {product.category}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border/50 mt-auto">
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-primary" onClick={() => handleEdit(product)}><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
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