import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SEOProps {
  pageId: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultKeywords?: string;
}

interface SEOData {
  title: string;
  description: string;
  keywords: string;
}

export const SEO = ({ pageId, defaultTitle, defaultDescription, defaultKeywords }: SEOProps) => {
  const [seoData, setSeoData] = useState<SEOData | null>(null);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const docRef = doc(db, 'seo_settings', pageId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSeoData(docSnap.data() as SEOData);
        }
      } catch (error) {
        console.error("Error fetching SEO data:", error);
      }
    };

    fetchSEO();
  }, [pageId]);

  useEffect(() => {
    const title = seoData?.title || defaultTitle || "Uttarakhand Netra Hospital";
    const description = seoData?.description || defaultDescription || "Trusted Eye Care Hospital in Uttarakhand. Advanced treatment for Cataract, LASIK, Retina, and more.";
    const keywords = seoData?.keywords || defaultKeywords || "eye care, hospital, ophthalmology, uttarakhand, cataract, lasik";

    document.title = title;

    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
  }, [seoData, defaultTitle, defaultDescription, defaultKeywords]);

  return null;
};