import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface NavItem {
  id: string;
  label: string;
  path: string;
  order: number;
  is_external: boolean;
  parent_id: string | null;
}

export const Header = () => {
  const { session, user, loading: sessionLoading } = useSession();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [navLoading, setNavLoading] = useState(true);

  useEffect(() => {
    const fetchNavItems = async () => {
      setNavLoading(true);
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching navigation items:', error);
      } else {
        setNavItems(data || []);
      }
      setNavLoading(false);
    };

    fetchNavItems();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderNavLink = (item: NavItem) => {
    if (item.is_external) {
      return (
        <a
          key={item.id}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-700 hover:text-primary-teal transition-colors"
        >
          {item.label}
        </a>
      );
    } else {
      return (
        <Link
          key={item.id}
          to={item.path}
          className="text-sm font-medium text-gray-700 hover:text-primary-teal transition-colors"
        >
          {item.label}
        </Link>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/placeholder.svg" alt="Aadiv Care Foundation Logo" className="h-8 w-8" />
          <span className="font-serif text-xl font-bold text-primary-teal">Aadiv Care Foundation</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLoading ? (
            <>
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </>
          ) : (
            navItems.filter(item => !item.parent_id).map(renderNavLink)
          )}
          
          {session && user?.profile?.role === 'admin' && (
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