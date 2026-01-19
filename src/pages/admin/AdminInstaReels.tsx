import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Trash2, Plus, Video, Image as ImageIcon, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Reel } from "@/components/InstaReel";
import { isAdminAuthenticated } from '@/lib/adminAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export const AdminInstaReels = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reels, setReels] = useState<Reel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    fetchReels();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoUrl) {
      toast({
        title: "Error",
        description: "Please provide a video URL",
        variant: "destructive",
      });
      return;
    }

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
      setIsDialogOpen(false);
      fetchReels();
    } catch (error: any) {
      console.error("Error adding reel:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add reel. Check console for details.",
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

  const getEmbedUrl = (url: string) => {
    if (url.includes("instagram.com")) {
      let embedUrl = url.split("?")[0].replace(/\/$/, "");
      if (!embedUrl.endsWith("/embed")) {
        embedUrl += "/embed";
      }
      return embedUrl;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Insta Reels</h1>
            <p className="text-muted-foreground">Add or remove Instagram reels</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Reel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Reel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Instagram URL or Video Link</label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.instagram.com/reel/..."
                  className="pl-9"
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
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader><CardTitle>All Reels ({reels.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reels.map((reel) => (
                  <TableRow key={reel.id}>
                    <TableCell>
                      <div className="w-12 h-20 bg-black rounded overflow-hidden">
                        {reel.videoUrl.includes("instagram.com") ? (
                          <iframe
                            src={getEmbedUrl(reel.videoUrl)}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            scrolling="no"
                            title={reel.caption || "Instagram Post"}
                          />
                        ) : (
                          <video src={reel.videoUrl} poster={reel.thumbnailUrl} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{reel.caption || "No caption"}</TableCell>
                    <TableCell>{reel.views?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(reel.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {reels.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No reels found.
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

export default AdminInstaReels;