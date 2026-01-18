import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Video, RotateCcw, Shield } from 'lucide-react';

const AdminHomeSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState({
    videoUrl: '',
    title: '',
    description: ''
  });
  const [whyUsData, setWhyUsData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadSettings();
  }, [navigate]);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'home_video');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVideoData(docSnap.data() as any);
      }

      const whyUsRef = doc(db, 'settings', 'why_choose_us');
      const whyUsSnap = await getDoc(whyUsRef);
      if (whyUsSnap.exists()) {
        setWhyUsData(whyUsSnap.data() as any);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'home_video'), videoData);
      await setDoc(doc(db, 'settings', 'why_choose_us'), whyUsData);
      toast({ title: 'Home settings updated successfully' });
    } catch (error) {
      toast({ title: 'Error updating settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDefaults = async () => {
    if (!confirm('This will load default settings. Continue?')) return;
    
    const defaultVideo = {
      videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      title: 'Experience Advanced Eye Care',
      description: 'Discover our state-of-the-art facilities and expert team dedicated to your vision.'
    };

    const defaultWhyUs = {
      title: 'Why Choose Uttarakhand Netra Hospital?',
      description: "We're committed to providing exceptional eye care with a personal touch"
    };

    setVideoData(defaultVideo);
    setWhyUsData(defaultWhyUs);
    try {
      await setDoc(doc(db, 'settings', 'home_video'), defaultVideo);
      await setDoc(doc(db, 'settings', 'why_choose_us'), defaultWhyUs);
      toast({ title: 'Default settings loaded' });
    } catch (error) {
      toast({ title: 'Error loading defaults', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Home Page Settings</h1>
            <p className="text-muted-foreground">Manage homepage video and other content</p>
          </div>
          <Button variant="outline" onClick={handleLoadDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" /> Load Defaults
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Featured Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube Video URL</Label>
                <Input 
                  id="videoUrl" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={videoData.videoUrl}
                  onChange={(e) => setVideoData({...videoData, videoUrl: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Paste the full YouTube URL here. (Instagram support coming soon)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Video Section Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Discover Our Hospital" 
                  value={videoData.title}
                  onChange={(e) => setVideoData({...videoData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Short description below the video" 
                  value={videoData.description}
                  onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                "Why Choose Us" Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whyTitle">Section Title</Label>
                <Input 
                  id="whyTitle" 
                  placeholder="e.g., Why Choose Uttarakhand Netra Hospital?" 
                  value={whyUsData.title}
                  onChange={(e) => setWhyUsData({...whyUsData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whyDescription">Description</Label>
                <Input 
                  id="whyDescription" 
                  placeholder="Short description below the title" 
                  value={whyUsData.description}
                  onChange={(e) => setWhyUsData({...whyUsData, description: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminHomeSettings;