import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function VideoSection() {
  const [videoData, setVideoData] = useState({
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    title: 'Experience Advanced Eye Care',
    description: 'Discover our state-of-the-art facilities and expert team dedicated to your vision.'
  });

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const docRef = doc(db, 'settings', 'home_video');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVideoData(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideo();
  }, []);

  if (!videoData.videoUrl) return null;

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // Handle standard YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {videoData.title || "Our Hospital Tour"}
          </h2>
          {videoData.description && (
            <p className="text-muted-foreground text-lg">
              {videoData.description}
            </p>
          )}
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
          <iframe
            src={getEmbedUrl(videoData.videoUrl)}
            title="Hospital Video"
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}