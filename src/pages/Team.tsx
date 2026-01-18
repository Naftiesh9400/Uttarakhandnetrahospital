import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Doctor } from "./admin/AdminDoctors";
import { SEO } from "@/components/SEO";

const DUMMY_IMAGE = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop";
const DIRECTOR_DUMMY_IMAGE = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop";

const Team = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
      setDoctors(doctorsList);
    };
    fetchDoctors();
  }, []);

  const directors = doctors.filter(d => d.role === 'Director');
  const regularDoctors = doctors.filter(d => d.role !== 'Director');

  return (
    <Layout>
      <SEO pageId="team" defaultTitle="Our Team | Uttarakhand Netra Hospital" />
      {/* Hero Section */}
      <section className="section-padding gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Team
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our Expert Doctors & Directors
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our team of highly qualified ophthalmologists brings decades of combined 
              experience and specialized expertise to provide you with the best eye care.
            </p>
          </div>
        </div>
      </section>

      {/* Directors Section */}
      {directors.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Meet the Directors
              </h2>
              <p className="text-muted-foreground">
                Visionary leaders guiding our mission for excellence in eye care
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 justify-center max-w-5xl mx-auto">
              {directors.map((doctor) => (
                <div
                  key={doctor.name}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group border-2 border-primary/10 flex flex-col"
                >
                  <div className="relative overflow-hidden h-80 shrink-0">
                    <img
                      src={doctor.image || DIRECTOR_DUMMY_IMAGE}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg">
                        <Award className="w-3 h-3" />
                        Director
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-primary font-medium text-base mb-2">
                      {doctor.specialization}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 font-medium">
                      {doctor.qualification}
                    </p>
                    <div className="text-muted-foreground leading-relaxed flex-1">
                      {doctor.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Doctors Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Doctors
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularDoctors.map((doctor) => (
              <div
                key={doctor.name}
                className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={doctor.image || DUMMY_IMAGE}
                    alt={doctor.name}
                    className="w-full h-72 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-primary text-xs font-medium">
                      <Award className="w-3 h-3" />
                      {doctor.experience}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-2">
                    {doctor.specialization}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {doctor.qualification}
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                    {doctor.specialization}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {doctor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="section-padding gradient-section">
        <div className="container-custom">
          <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Join Our Team
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Are you a passionate eye care professional looking to make a difference? 
                  We're always looking for talented individuals to join our growing team. 
                  Send us your resume and let's create a vision for the future together.
                </p>
              </div>
              <div className="lg:text-right">
                <Link to="/contact">
                  <Button variant="hero" size="lg">
                    Contact Us
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
