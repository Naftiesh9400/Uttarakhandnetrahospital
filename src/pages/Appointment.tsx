import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { SEO } from "@/components/SEO";
const doctors = [
  "Dr. Ananya Sharma - Cataract & LASIK",
  "Dr. Rajesh Patel - Retina Specialist",
  "Dr. Priya Mehta - Pediatric Ophthalmologist",
  "Dr. Vikram Singh - Glaucoma Specialist",
  "Dr. Neha Kapoor - Cornea Specialist",
  "Dr. Amit Verma - Oculoplasty",
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM",
];

const Appointment = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedTime) {
      toast({
        title: "Please complete all fields",
        description: "Select a doctor and preferred time slot.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to Firestore
      await addDoc(collection(db, "appointments"), {
        patientName: formData.name,
        phone: formData.phone,
        email: formData.email,
        preferredDate: formData.date,
        preferredTime: selectedTime,
        doctor: selectedDoctor,
        message: formData.message,
        status: 'pending',
        createdAt: new Date(),
      });
      
      toast({
        title: "Appointment Request Submitted!",
        description: "We'll confirm your appointment shortly via phone or email.",
      });
      
      setFormData({ name: "", phone: "", email: "", date: "", message: "" });
      setSelectedDoctor("");
      setSelectedTime("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO pageId="appointment" defaultTitle="Book Appointment | Uttarakhand Netra Hospital" />
      {/* Hero Section */}
      <section className="section-padding gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Book Appointment
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Schedule Your Visit
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Book an appointment with our expert ophthalmologists. 
              Choose your preferred doctor, date, and time.
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 lg:p-10 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="tel"
                          required
                          placeholder="+91 75350 21231"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12 pl-10"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-12 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Select Doctor */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Select Doctor *
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor}
                        type="button"
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedDoctor === doctor
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedDoctor === doctor && (
                            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                          )}
                          <span className="text-sm font-medium text-foreground">
                            {doctor}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Preferred Date & Time *
                  </h3>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Date
                    </label>
                    <Input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="h-12 max-w-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Select Time Slot
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedTime === time
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Additional Information
                  </h3>
                  <Textarea
                    placeholder="Please describe your symptoms or reason for visit (optional)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="xl" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Book Appointment"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By booking an appointment, you agree to our terms and conditions. 
                  We'll contact you to confirm your appointment.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Appointment;
