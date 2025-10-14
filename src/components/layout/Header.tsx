import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { MobileNav } from './MobileNav';

interface NavItem {
  id: string;
  label: string;
  path: string;
  order: number;
  is_external: boolean;
  parent_id: string | null;
}

interface HeaderContent {
  header_logo_image: { url: string; alt: string };
  header_site_title: string;
}

export const Header = () => {
  const { session, user, loading: _sessionLoading } = useSession();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [headerContent, setHeaderContent] = useState<Partial<HeaderContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeaderData = async () => {
      setLoading(true);
      // Fetch navigation items
      const { data: navData, error: navError } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order', { ascending: true });

      if (navError) {
        console.error('Error fetching navigation items:', navError);
      } else {
        setNavItems(navData || []);
      }

      // Fetch header content
      const { data: contentData, error: contentError } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'header');

      if (contentError) {
        console.error('Error fetching header content:', contentError);
      } else {
        const formattedContent = contentData.reduce((acc, item) => {
          if (item.element_id.includes('_image')) {
            acc[item.element_id] = item.content_data;
          } else {
            acc[item.element_id] = item.content_data.text;
          }
          return acc;
        }, {} as any);
        setHeaderContent(formattedContent);
      }
      setLoading(false);
    };

    fetchHeaderData();
  }, []);

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
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            <img src={headerContent.header_logo_image?.url || '/placeholder.svg'} alt={headerContent.header_logo_image?.alt || 'Aadiv Care Foundation Logo'} className="h-8 w-8" />
          )}
          {loading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <span className="font-serif text-xl font-bold text-primary-teal">{headerContent.header_site_title || 'Aadiv Care Foundation'}</span>
          )}
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {loading ? (
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
        <div className="md:hidden flex items-center gap-2">
          <Link to="/donate">
            <Button size="sm" className="bg-cta-green hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Donate
            </Button>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};