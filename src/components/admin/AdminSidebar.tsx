import { useState } from 'react';
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
  Instagram,
  Briefcase,
  FileText,
  Glasses,
  Pill,
  Eye,
  Dumbbell,
  ChevronRight,
  Smartphone,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminLogout } from '@/lib/adminAuth';
import logo from "../../../assets/Images/logo.png";

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Doctors', href: '/admin/doctors', icon: Users },
  { name: 'Services', href: '/admin/services', icon: Stethoscope },
  {
    name: 'Mobile App',
    icon: Smartphone,
    children: [
      { name: 'Optical Shop', href: '/admin/optical', icon: Glasses },
      { name: 'Medicines', href: '/admin/medicines', icon: Pill },
      { name: 'Vision Tests', href: '/admin/vision-tests', icon: Eye },
      { name: 'Exercises', href: '/admin/exercises', icon: Dumbbell },
    ]
  },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { name: 'Why Choose Us', href: '/admin/features', icon: Shield },
  { name: 'SEO', href: '/admin/seo', icon: Globe },
  { name: 'Home Video', href: '/admin/home-settings', icon: Video },
  { name: 'Insta Reels', href: '/admin/reels', icon: Instagram },
  { name: 'Admins', href: '/admin/users', icon: Lock },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { name: 'Contact Requests', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Job Openings', href: '/admin/job-positions', icon: Briefcase },
  { name: 'Job Applications', href: '/admin/jobs', icon: FileText },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string[]>(() => {
    const activeParent = navigation.find(item => 
      item.children?.some(child => location.pathname === child.href)
    );
    return activeParent ? [activeParent.name] : [];
  });

  const toggleExpand = (name: string) => {
    setExpanded(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-72 bg-card border-r border-border/40 min-h-screen flex flex-col sticky top-0 h-screen shadow-xl shadow-black/5 z-50">
      <div className="p-6 flex items-center gap-4 border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="relative group">
          <div className="absolute -inset-2 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain relative" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-foreground">Netra Care</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Admin Portal</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">Main Menu</div>
        {navigation.map((item) => {
          if (item.children) {
            const isExpanded = expanded.includes(item.name);
            const hasActiveChild = item.children.some(child => location.pathname === child.href);
            
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={`w-full group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent ${
                    hasActiveChild || isExpanded
                      ? 'text-foreground bg-secondary/50'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4.5 h-4.5 transition-colors ${hasActiveChild || isExpanded ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-75" /> : <ChevronRight className="w-3.5 h-3.5 opacity-75" />}
                </button>
                
                {isExpanded && (
                  <div className="pl-4 space-y-1 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-border/50">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`group flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ml-2 ${
                            isChildActive
                              ? 'bg-primary/10 text-primary shadow-sm shadow-primary/10'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <child.icon className={`w-4 h-4 transition-colors ${isChildActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                            <span>{child.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href!}
              className={`group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 border-primary/10'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-75" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40 bg-secondary/5">
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Administrator</p>
              <p className="text-xs text-muted-foreground truncate">admin@hospital.com</p>
            </div>
          </div>
          <Button
            variant="destructive"
            className="w-full justify-center gap-2 h-9 text-xs font-medium rounded-lg shadow-sm hover:shadow transition-all"
            onClick={handleLogout}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;