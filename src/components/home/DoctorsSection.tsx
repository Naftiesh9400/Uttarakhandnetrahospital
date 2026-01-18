import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { Doctor } from "@/pages/admin/AdminDoctors";

const DUMMY_IMAGE = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop";
const DIRECTOR_DUMMY_IMAGE = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop";

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(collection(db, "doctors"), limit(3));
      const querySnapshot = await getDocs(q);
      const doctorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
      setDoctors(doctorsList);
    };
    fetchDoctors();
  }, []);

  return (
    <section className="section-padding gradient-section">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Expert Doctors & Directors
          </h2>
          <p className="text-muted-foreground text-lg">
            Highly qualified specialists dedicated to your eye health
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={doctor.image || (doctor.role === 'Director' ? DIRECTOR_DUMMY_IMAGE : DUMMY_IMAGE)}
                  alt={doctor.name}
                  className="w-full h-72 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                  {doctor.experience} Experience
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {doctor.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-2">
                  {doctor.specialization}
                </p>
                <p className="text-muted-foreground text-sm">
                  {doctor.qualification}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/team">
            <Button variant="outline" size="lg">
              View All Doctors
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
