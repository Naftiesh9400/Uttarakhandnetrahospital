import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Scan, 
  Sparkles, 
  Activity, 
  Baby, 
  Target,
  Glasses,
  Syringe,
  Shield,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Service } from "./admin/AdminServices";
import { SEO } from "@/components/SEO";

const iconMap: Record<string, any> = {
  Eye, Scan, Sparkles, Activity, Baby, Target, Glasses, Syringe, Shield
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const querySnapshot = await getDocs(collection(db, "services"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setServices(list);
    };
    fetchServices();
  }, []);

  return (
    <Layout>
      <SEO pageId="services" defaultTitle="Our Services | Uttarakhand Netra Hospital" />
      {/* Hero Section */}
      <section className="section-padding gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Comprehensive Eye Care Services
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From routine eye exams to advanced surgical procedures, we offer a full 
              spectrum of ophthalmology services to protect and enhance your vision.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Eye;
              const featuresList = service.features ? service.features.split('\n') : [];
              
              return (
                <div
                  key={service.id}
                  className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      {featuresList.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {featuresList.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          {service.price}
                        </span>
                        <Link to="/appointment">
                          <Button variant="outline" size="sm">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Schedule a comprehensive eye examination and our specialists will recommend 
            the best treatment options for your condition.
          </p>
          <Link to="/appointment">
            <Button 
              size="xl" 
              className="bg-card text-primary hover:bg-card/90 shadow-lg"
            >
              Schedule Consultation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
