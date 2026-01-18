import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  UserCheck, 
  Microscope, 
  Shield, 
  BadgeCheck, 
  Heart, 
  Clock,
  Award,
  Stethoscope,
  ArrowRight,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Feature } from "./admin/AdminFeatures";
import { SEO } from "@/components/SEO";

const iconMap: Record<string, any> = {
  UserCheck, Microscope, Shield, BadgeCheck, Heart, Clock, Award, Stethoscope, Zap
};

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "50,000+", label: "Patients Treated" },
  { value: "10+", label: "Expert Specialists" },
  { value: "99%", label: "Patient Satisfaction" },
];

const WhyNetra = () => {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      const querySnapshot = await getDocs(collection(db, "features"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature));
      setFeatures(list);
    };
    fetchFeatures();
  }, []);

  return (
    <Layout>
      <SEO pageId="why-netra" defaultTitle="Why Choose Us | Uttarakhand Netra Hospital" />
      {/* Hero Section */}
      <section className="section-padding gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Why Uttarakhand Netra ?
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              What Makes Us Different
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose Netra Eye Care for a unique blend of expertise, technology, 
              and compassionate care that puts your vision first.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-primary/5">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding gradient-section">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Commitment to Excellence
            </h2>
            <p className="text-muted-foreground text-lg">
              Every aspect of Netra Eye Care is designed with your well-being in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = iconMap[feature.icon] || Shield;
              return (
                <div
                  key={feature.id}
                  className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                    <IconComponent className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  Accreditations
                </span>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Recognized for Excellence
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our commitment to quality has earned us recognition from leading healthcare 
                  organizations. These accreditations reflect our adherence to the highest 
                  standards in eye care.
                </p>
                <div className="space-y-4">
                  {[
                    "NABH Accredited Eye Care Center",
                    "ISO 9001:2015 Certified",
                    "Member of All India Ophthalmological Society",
                    "JCI Standards Compliant",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 rounded-full gradient-primary flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <Stethoscope className="w-20 h-20 mx-auto mb-4" />
                    <div className="text-xl font-semibold">Quality Assured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-section">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Experience the Netra Difference
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who have trusted us with their vision
          </p>
          <Link to="/appointment">
            <Button variant="hero" size="xl">
              Book Your Appointment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default WhyNetra;
