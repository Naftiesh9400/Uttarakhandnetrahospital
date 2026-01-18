import { UserCheck, Microscope, Heart, BadgeCheck, Users } from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Experienced Eye Specialists",
    description: "Our team of board-certified ophthalmologists brings decades of combined experience.",
  },
  {
    icon: Microscope,
    title: "Advanced Diagnostic Technology",
    description: "State-of-the-art equipment for accurate diagnosis and treatment planning.",
  },
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description: "We prioritize your comfort and well-being at every step of your journey.",
  },
  {
    icon: BadgeCheck,
    title: "Affordable Treatment Plans",
    description: "Quality eye care accessible to all with flexible payment options.",
  },
  {
    icon: Users,
    title: "Trusted by Thousands",
    description: "Join our community of satisfied patients who've regained their clear vision.",
  },
];

export function WhyNetraSection() {
  return (
    <section className="section-padding gradient-section">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Uttarakhand Netra Hospital?
          </h2>
          <p className="text-muted-foreground text-lg">
            We're committed to providing exceptional eye care with a personal touch
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}