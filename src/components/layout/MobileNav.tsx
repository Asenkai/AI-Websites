import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface NavItem {
  id: string;
  label: string;
  path: string;
  is_external: boolean;
}

interface HeaderContent {
  header_logo_image: { url: string; alt: string };
  header_site_title: string;
}

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [headerContent, setHeaderContent] = useState<Partial<HeaderContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('navigation_items')
        .select('id, label, path, is_external')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching navigation items for mobile:', error);
      } else {
        setNavItems(data || []);
      }

      // Fetch header content for logo and title
      const { data: contentData, error: contentError } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'header');

      if (contentError) {
        console.error('Error fetching header content for mobile nav:', contentError);
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

    fetchNavItems();
  }, []);

  const renderNavLink = (item: NavItem) => {
    const commonProps = {
      key: item.id,
      onClick: () => setIsOpen(false),
      className: "block py-2 text-lg font-medium text-gray-700 hover:text-primary-teal transition-colors",
    };

    if (item.is_external) {
      return (
        <a href={item.path} target="_blank" rel="noopener noreferrer" {...commonProps}>
          {item.label}
        </a>
      );
    } else {
      return (
        <Link to={item.path} {...commonProps}>
          {item.label}
        </Link>
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-3/4">
        <div className="p-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 mb-8">
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
          <nav className="flex flex-col space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-8 w-3/4" />
              </>
            ) : (
              navItems.map(renderNavLink)
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};