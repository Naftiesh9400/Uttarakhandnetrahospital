import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { Briefcase, Send, User, Mail, Phone, FileText, CheckCircle2, X, Sparkles, GraduationCap, HeartHandshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const JobApply = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [jobPositions, setJobPositions] = useState<{id: string, title: string}[]>([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'job_positions'));
        const positions = querySnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title }));
        setJobPositions(positions);
      } catch (error) {
        console.error("Error fetching job positions:", error);
      }
    };
    fetchPositions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'job_applications'), {
        ...formData,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', position: '', experience: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Could not submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="py-24 relative overflow-hidden" id="careers">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <Sparkles className="w-4 h-4" />
                  <span>We are Hiring</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                    Join the Future of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Eye Care Excellence</span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                    Be part of a compassionate team at Uttarakhand Netra Hospital. We offer a collaborative environment where your skills can truly make a difference in patients' lives.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => setIsOpen(true)} 
                    size="xl"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-lg rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 relative">
                {[
                  { icon: User, title: "Expert Team", desc: "Collaborate with specialists" },
                  { icon: GraduationCap, title: "Learning", desc: "Continuous growth opportunities" },
                  { icon: HeartHandshake, title: "Impact", desc: "Transform lives daily" },
                  { icon: Briefcase, title: "Culture", desc: "Supportive work environment" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-background border border-border/50 p-6 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute right-4 top-4 p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex flex-col md:flex-row">
            <div className="bg-primary p-8 md:w-1/3 text-primary-foreground flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6">Why Join Us?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-primary-foreground/90">Professional Growth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-primary-foreground/90">Expert Team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-primary-foreground/90">State-of-the-art Facility</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <p className="text-primary-foreground/80 text-sm">
                  "Working here has been a transformative experience for my career."
                </p>
              </div>
            </div>

            <div className="p-8 md:w-2/3 bg-card">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Application Sent!</h3>
                  <p className="text-muted-foreground">Thank you for your interest. Our HR team will review your application and get back to you shortly.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6">
                    Submit Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" /> Full Name
                      </label>
                      <input
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" /> Position
                      </label>
                      <select
                        required
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="">Select Position</option>
                        {jobPositions.map((job) => (
                          <option key={job.id} value={job.title}>
                            {job.title}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Experience (Years)</label>
                    <input
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="e.g. 2 years"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Cover Letter / Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-xl shadow-lg shadow-primary/20"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : (
                      <span className="flex items-center gap-2">
                        Submit Application <Send className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
};