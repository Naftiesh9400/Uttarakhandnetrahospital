import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to See the World Clearly?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book your comprehensive eye examination today and take the first step 
            towards better vision and eye health.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/appointment">
              <Button 
                size="xl" 
                className="bg-card text-primary hover:bg-card/90 shadow-elevated"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="tel:+917535021231">
              <Button 
                size="xl" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
