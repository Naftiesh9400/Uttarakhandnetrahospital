import { Layout } from "@/components/layout/Layout";
import { Target, Heart, Lightbulb, Users, Award, CheckCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useEffect } from "react";

const values = [
  {
    icon: Heart,
    title: "Compassionate Care",
    description: "We treat every patient with empathy, respect, and personalized attention.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for the highest standards in eye care and patient outcomes.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace advanced technology to provide cutting-edge treatments.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Quality eye care should be accessible and affordable for everyone.",
  },
];

const milestones = [
  { year: "2009", title: "Founded", description: "Netra Eye Care opened its doors in Mumbai" },
  { year: "2012", title: "LASIK Center", description: "Launched advanced laser vision correction" },
  { year: "2016", title: "Expansion", description: "Opened second branch with expanded services" },
  { year: "2020", title: "50,000 Patients", description: "Milestone of successful treatments" },
  { year: "2024", title: "Excellence Award", description: "Recognized as top eye care center" },
];

const About = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in', 'fade-in', 'slide-in-from-bottom-8', 'duration-700');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
      el.classList.add('opacity-0', 'translate-y-8', 'transition-all');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <SEO pageId="about" defaultTitle="About Us | Uttarakhand Netra Hospital" />
      {/* Hero Section */}
      <section className="section-padding gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Vision, Our Mission
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Netra Eye Care, we're dedicated to delivering accurate diagnosis, 
              ethical treatment, and compassionate care. Our mission is to help 
              people see the world clearly and live confidently.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Modern Eye Care Center Built on Trust
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Netra Eye Care is a state-of-the-art ophthalmology center dedicated to providing 
                comprehensive eye care services. Founded in 2009, we have grown to become one of 
                the most trusted names in eye care, serving over 50,000 patients.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our team of experienced ophthalmologists, optometrists, and support staff work 
                together to ensure that every patient receives personalized care tailored to 
                their unique needs. We combine medical expertise with cutting-edge technology 
                to deliver the best possible outcomes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Board Certified Doctors", "Latest Technology", "Patient-First Approach", "Affordable Pricing"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary/10 rounded-3xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
                    <div className="text-4xl font-bold text-primary mb-2">15+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
                    <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                    <div className="text-sm text-muted-foreground">Happy Patients</div>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
                    <div className="text-4xl font-bold text-primary mb-2">10+</div>
                    <div className="text-sm text-muted-foreground">Expert Doctors</div>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
                    <div className="text-4xl font-bold text-primary mb-2">99%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding gradient-section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl p-8 lg:p-10 shadow-card">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide affordable, advanced, and ethical eye care services using modern 
                technology and expert medical professionals. We are committed to making quality 
                vision care accessible to all while maintaining the highest standards of 
                patient safety and satisfaction.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 lg:p-10 shadow-card">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become a trusted eye care brand delivering excellence in vision care across 
                communities. We envision a future where everyone has access to world-class 
                eye care services, and preventable blindness is eliminated through early 
                detection and treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Drives Us Every Day
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding gradient-section">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 scroll-animate">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Milestones That Define Us
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Center Line (Desktop) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2 hidden md:block" />
              
              {/* Left Line (Mobile) */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 md:hidden" />

              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.year} 
                  className={`relative flex flex-col md:flex-row items-center justify-between gap-8 mb-12 last:mb-0 scroll-animate ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${
                    index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                  }`}>
                    <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 relative group">
                      {/* Mobile Year Circle */}
                      <div className="absolute left-[-2.5rem] top-6 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg md:hidden z-10">
                        {milestone.year}
                      </div>
                      
                      <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {milestone.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Year Circle (Center) */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full gradient-primary hidden md:flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg z-10 border-4 border-background">
                    {milestone.year}
                  </div>

                  {/* Empty Space for Balance */}
                  <div className="hidden md:block w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
