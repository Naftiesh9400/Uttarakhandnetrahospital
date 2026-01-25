import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyNetraSection } from "@/components/home/WhyNetraSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { SEO } from "@/components/SEO";
import { VideoSection } from "@/components/home/VideoSection";
import { WhatsAppChat } from "@/components/home/WhatsAppChat";
import { InstaReel } from "@/components/InstaReel";
import DownloadApp from "@/components/DownloadApp";
import { JobApply } from "@/components/JobApply";

const Index = () => {
  return (
    <Layout>
      <SEO pageId="home" defaultTitle="Uttarakhand Netra Hospital | Home" />
      <HeroSection />
      <VideoSection />
      <WhyNetraSection />
      <ServicesSection />
      <DoctorsSection />
      <TestimonialsSection />
      <InstaReel />
      <DownloadApp />
      <JobApply />
      <CTASection />
      <WhatsAppChat />
    </Layout>
  );
};

export default Index;
