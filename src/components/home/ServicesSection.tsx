import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Scan, Sparkles, Activity, Baby, Target, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Eye,
    title: "Comprehensive Eye Check-up",
    description: "Complete vision and eye health evaluation with advanced diagnostic tools.",
  },
  {
    icon: Scan,
    title: "Cataract Surgery",
    description: "Advanced, painless cataract treatment with quick recovery time.",
  },
  {
    icon: Sparkles,
    title: "LASIK & Refractive Surgery",
    description: "Freedom from glasses with safe laser vision correction technology.",
  },
  {
    icon: Activity,
    title: "Retina Treatment",
    description: "Specialized care for diabetic retinopathy and retinal disorders.",
  },
  {
    icon: Baby,
    title: "Pediatric Eye Care",
    description: "Gentle, specialized eye care designed for children of all ages.",
  },
  {
    icon: Target,
    title: "Glaucoma Management",
    description: "Early detection and long-term management of glaucoma conditions.",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Eye Care Services
          </h2>
          <p className="text-muted-foreground text-lg">
            From routine check-ups to advanced surgical procedures, we've got your vision covered
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden"
            >
              {/* Hover Background */}
              <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center mb-6 transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary-foreground mb-3 transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-primary-foreground/80 leading-relaxed transition-colors">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline" size="lg">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}