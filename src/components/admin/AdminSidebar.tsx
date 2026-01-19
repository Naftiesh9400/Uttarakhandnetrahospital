import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Star,
  Shield,
  Globe,
  Video,
  Lock,
  Calendar,
  MessageSquare,
  LogOut,
  Instagram
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminLogout } from '@/lib/adminAuth';
import logo from "../../../assets/Images/logo.png";

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Doctors', href: '/admin/doctors', icon: Users },
  { name: 'Services', href: '/admin/services', icon: Stethoscope },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { name: 'Why Choose Us', href: '/admin/features', icon: Shield },
  { name: 'SEO', href: '/admin/seo', icon: Globe },
  { name: 'Home Video', href: '/admin/home-settings', icon: Video },
  { name: 'Insta Reels', href: '/admin/reels', icon: Instagram },
  { name: 'Admins', href: '/admin/users', icon: Lock },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { name: 'Contact Requests', href: '/admin/contacts', icon: MessageSquare },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        <span className="font-bold text-lg">Admin Panel</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;