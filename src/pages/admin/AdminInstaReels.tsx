import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Trash2, Plus, Video, Image as ImageIcon, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Reel } from "@/components/InstaReel";

export const AdminInstaReels = () => {
  const { toast } = useToast();
  const [reels, setReels] = useState<Reel[]>([]);
  const [formData, setFormData] = useState({
    videoUrl: "",
    thumbnailUrl: "",
    caption: "",
    views: "",
  });

  const fetchReels = async () => {
    try {
      const q = query(collection(db, "insta_reels"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reel[];
      setReels(data);
    } catch (error) {
      console.error("Error fetching reels:", error);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoUrl) return;

    try {
      await addDoc(collection(db, "insta_reels"), {
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        caption: formData.caption,
        views: parseInt(formData.views) || 0,
        createdAt: new Date(),
      });

      toast({
        title: "Success",
        description: "Reel added successfully",
      });

      setFormData({ videoUrl: "", thumbnailUrl: "", caption: "", views: "" });
      fetchReels();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reel",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reel?")) return;

    try {
      await deleteDoc(doc(db, "insta_reels", id));
      toast({
        title: "Success",
        description: "Reel deleted successfully",
      });
      fetchReels();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reel",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Reel
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Video URL</label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://..."
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Thumbnail URL (Optional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Caption</label>
              <Input
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Enter caption..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Views Count</label>
              <div className="relative">
                <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  placeholder="1000"
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          <Button type="submit">Add Reel</Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reels.map((reel) => (
          <div key={reel.id} className="bg-card rounded-xl overflow-hidden border shadow-sm group">
            <div className="aspect-[9/16] relative bg-black">
              <video
                src={reel.videoUrl}
                poster={reel.thumbnailUrl}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(reel.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-sm truncate">{reel.caption || "No caption"}</p>
              <p className="text-xs text-muted-foreground mt-1">{reel.views?.toLocaleString()} views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};