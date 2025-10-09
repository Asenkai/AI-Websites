import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Menu, Globe, HandHeart, Home, Info, Briefcase, Gift, Users, Mail, FileText, Settings, CreditCard, BarChart3 } from 'lucide-react';

interface AdminSidebarProps {
  className?: string;
}

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const navLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/navigation-menu', icon: Menu, label: 'Navigation Menu' },
    { to: '/admin/causes', icon: HandHeart, label: 'Causes' },
    { to: '/admin/content/home', icon: Home, label: 'Home Page Content' },
    { to: '/admin/content/about', icon: Info, label: 'About Us Page Content' },
    { to: '/admin/content/our-work', icon: Globe, label: 'Our Work Page Content' },
    { to: '/admin/content/impact', icon: FileText, label: 'Impact Page Content' },
    { to: '/admin/content/donate', icon: Gift, label: 'Donate Page Content' },
    { to: '/admin/content/volunteer', icon: Users, label: 'Volunteer Page Content' },
    { to: '/admin/content/csr-partnership', icon: Briefcase, label: 'CSR Partnership Content' },
    { to: '/admin/content/contact', icon: Mail, label: 'Contact Page Content' },
    { to: '/admin/settings/google-tag', icon: Settings, label: 'Google Tag' },
    { to: '/admin/settings/meta-pixel', icon: BarChart3, label: 'Meta Pixel' },
    { to: '/admin/settings/razorpay', icon: CreditCard, label: 'Razorpay Settings' },
  ];

  return (
    <aside className={cn("w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-4 flex flex-col", className)}>
      <h2 className="font-serif text-2xl font-bold text-sidebar-primary mb-6">Admin</h2>
      <nav className="flex-grow space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'} // Ensure only dashboard is exact match
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
              )
            }
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};