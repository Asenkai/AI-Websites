import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';

export const Header = () => {
  const { session } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Work', path: '/our-work' },
    { name: 'Impact', path: '/impact' },
    { name: 'CSR Partnership', path: '/csr-partnership' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/placeholder.svg" alt="Aadiv Care Foundation Logo" className="h-8 w-8" />
          <span className="font-serif text-xl font-bold text-primary-teal">Aadiv Care Foundation</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-sm font-medium text-gray-700 hover:text-primary-teal transition-colors"
            >
              {item.name}
            </Link>
          ))}
          {session && (
            <Link to="/admin">
              <Button variant="outline">Admin Panel</Button>
            </Link>
          )}
          <Link to="/donate">
            <Button className="bg-cta-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Donate Now
            </Button>
          </Link>
        </nav>
        {/* Mobile navigation will be handled by a separate component or a sheet */}
        <div className="md:hidden">
          <Link to="/donate">
            <Button className="bg-cta-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Donate
            </Button>
          </Link>
          {/* TODO: Add a mobile menu icon/button here */}
        </div>
      </div>
    </header>
  );
};