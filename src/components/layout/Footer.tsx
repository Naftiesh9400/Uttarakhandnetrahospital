import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import logo from "../../../assets/Images/logo.png";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Our Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "Eye Examination", href: "/services" },
  { name: "Cataract Surgery", href: "/services" },
  { name: "LASIK Surgery", href: "/services" },
  { name: "Retina Care", href: "/services" },
  { name: "Glaucoma Treatment", href: "/services" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Uttarakhand Netra Hospital" className="w-32 h-32 object-contain" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">Uttarakhand </span>
                <span className="text-sm opacity-70">Netra Hospital</span>
              </div>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Your trusted partner for advanced eye care. We combine medical excellence with cutting-edge technology to protect and enhance your vision.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm opacity-80">
                  Tanakpur Road, Amoun Khatima<br />
                  (Udham Singh Nagar) Uttarakhand - 262308
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+917535021231" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  +91 75350 21231
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:uttarakhandnetrahospitalktm@gmail.com" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  uttarakhandnetrahospitalktm@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm opacity-80">
                  Mon - Sat: 9:00 AM - 7:00 PM<br />
                  Sunday: 10:00 AM - 2:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} Uttarakhand Netra Hospital. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
