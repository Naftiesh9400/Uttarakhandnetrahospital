import { Smartphone, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DownloadApp = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container-custom">
        <div className="relative rounded-[2.5rem] overflow-hidden px-6 py-16 sm:px-12 sm:py-20 shadow-2xl">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/90" />

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <div className="flex-1 space-y-8 max-w-2xl text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground text-sm font-medium border border-primary-foreground/20 mx-auto lg:mx-0">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>New Mobile App</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
                  Healthcare at Your Fingertips
                </h2>
                <p className="text-lg text-primary-foreground/90 leading-relaxed">
                  Experience the best eye care services with the Uttarakhand Netra Hospital Android App. 
                  Book appointments, view medical records, and consult with doctors - all from your smartphone.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {[
                  "Easy Appointment Booking",
                  "Digital Health Records",
                  "Online Consultations",
                  "Medicine Reminders",
                  "24/7 Support Access",
                  "Secure Payments"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-primary-foreground/90 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  className="h-auto py-3 px-6 bg-primary-foreground hover:bg-primary-foreground/90 text-primary rounded-xl flex items-center gap-3 transition-all hover:scale-105 shadow-lg border-0"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = new URL('../assets/Netra Care.apk', import.meta.url).href;
                    link.setAttribute('download', 'Netra Care.apk');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Smartphone className="w-8 h-8" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary/60">Download Now</span>
                    <span className="text-xl font-bold leading-none">Android App</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex-1 flex justify-center lg:justify-end relative w-full max-w-[300px] lg:max-w-none mt-12 lg:mt-0">
              <div className="relative mx-auto border-gray-900 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl lg:rotate-[-6deg] lg:hover:rotate-0 transition-all duration-500">
                <div className="w-[148px] h-[18px] bg-gray-900 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[32px] w-[3px] bg-gray-900 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-900 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-900 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-900 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-background flex flex-col relative">
                  {/* Mock App UI */}
                  <div className="bg-primary p-6 pt-12 text-primary-foreground">
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-8 h-8 bg-primary-foreground/20 rounded-full"></div>
                      <div className="w-8 h-8 bg-primary-foreground/20 rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Hello, Patient</h3>
                    <p className="text-primary-foreground/80 text-sm">Find your specialist</p>
                  </div>
                  <div className="p-4 space-y-4 bg-muted/30 flex-1">
                    <div className="h-24 bg-card rounded-xl shadow-sm p-3 flex gap-3 items-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                        <div className="h-2 bg-muted/50 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-24 bg-card rounded-xl shadow-sm"></div>
                      <div className="h-24 bg-card rounded-xl shadow-sm"></div>
                    </div>
                    <div className="h-32 bg-primary/5 rounded-xl border border-primary/10 p-4">
                      <div className="h-4 bg-primary/20 rounded w-1/2 mb-3"></div>
                      <div className="h-2 bg-primary/10 rounded w-full mb-2"></div>
                      <div className="h-2 bg-primary/10 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;