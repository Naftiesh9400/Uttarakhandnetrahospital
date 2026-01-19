import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  views?: number;
}

const ReelCard = ({ reel }: { reel: Reel }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInstagram = reel.videoUrl.includes("instagram.com");

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes("instagram.com")) {
      let embedUrl = url.split("?")[0].replace(/\/$/, "");
      if (!embedUrl.endsWith("/embed")) {
        embedUrl += "/embed";
      }
      return embedUrl;
    }
    return url;
  };

  if (isInstagram) {
    return (
      <div className="group relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg bg-black transition-transform hover:-translate-y-1">
        <iframe
          src={getEmbedUrl(reel.videoUrl)}
          title={reel.caption || "Instagram Post"}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          scrolling="no"
        />
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.error("Play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="group relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg bg-black cursor-pointer transition-transform hover:-translate-y-1"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        className="w-full h-full object-cover"
        playsInline
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Play Icon Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'} pointer-events-none`}>
        <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>

      {/* Caption Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-medium text-sm line-clamp-2 mb-2">
            {reel.caption}
          </p>
          {reel.views && (
            <p className="text-white/80 text-xs flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {reel.views.toLocaleString()} views
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const InstaReel = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const q = query(collection(db, "insta_reels"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedReels = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reel[];
        setReels(fetchedReels);
      } catch (error) {
        console.error("Error fetching reels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[9/16] bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1F2C] mb-4 text-center">
            Our Instagram Stories
          </h2>
          <p className="text-gray-600 text-center max-w-2xl">
            Follow our latest updates, success stories, and eye care tips on Instagram.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {reels.slice(0, visibleCount).map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          {visibleCount < reels.length && (
            <Button 
              onClick={handleLoadMore} 
              variant="outline" 
              size="lg"
              className="min-w-[200px]"
            >
              Load More
            </Button>
          )}
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};