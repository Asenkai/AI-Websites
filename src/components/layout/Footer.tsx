import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, LucideIcon } from 'lucide-react';
import { TrustBadges } from '@/components/shared/TrustBadges';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface FooterContent {
  footer_logo_image: { url: string; alt: string };
  footer_site_title: string;
  footer_legal_links: Array<{ text: string; link: string }>;
  footer_social_links: Array<{ icon: string; href: string }>;
  footer_address_line1: string;
  footer_address_line2: string;
  footer_email_address: string;
  footer_phone_number: string;
  footer_trust_badges: { presets: string[] };
}

const socialIconMap: { [key: string]: LucideIcon } = {
  Facebook: Facebook,
  Twitter: Twitter,
  Instagram: Instagram,
  Linkedin: Linkedin,
};

export const Footer = () => {
  const [footerContent, setFooterContent] = useState<Partial<FooterContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'footer');

      if (error) {
        console.error('Error fetching footer content:', error);
      } else {
        const formattedContent = data.reduce((acc, item) => {
          if (item.element_id.includes('_image')) {
            acc[item.element_id] = item.content_data;
          } else if (item.element_id.includes('_links') || item.element_id.includes('_badges')) {
            acc[item.element_id] = item.content_data;
          } else {
            acc[item.element_id] = item.content_data.text;
          }
          return acc;
        }, {} as any);
        setFooterContent(formattedContent);
      }
      setLoading(false);
    };

    fetchFooterContent();
  }, []);

  // Quick links will be dynamically fetched from navigation_items in Header,
  // so we'll just use a placeholder or remove if not needed here.
  // For now, let's keep a minimal set or rely on the main navigation.
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Work', path: '/our-work' },
    { name: 'Impact', path: '/impact' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-gray-50 py-12 border-t">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            {loading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <img src={footerContent.footer_logo_image?.url || '/placeholder.svg'} alt={footerContent.footer_logo_image?.alt || 'Aadiv Care Foundation Logo'} className="h-8 w-8" />
            )}
            {loading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="font-serif text-xl font-bold text-primary-teal">{footerContent.footer_site_title || 'Aadiv Care Foundation'}</span>
            )}
          </Link>
          <p className="text-sm text-gray-600">
            Healing, Hope & Dignity — Together. Your support transforms lives.
          </p>
          <div className="flex space-x-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-5 rounded-full" />)
            ) : (
              (footerContent.footer_social_links || []).map((link, index) => {
                const IconComponent = socialIconMap[link.icon];
                return IconComponent ? (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-teal transition-colors"
                  >
                    <IconComponent size={20} />
                  </a>
                ) : null;
              })
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-32" />)
            ) : (
              quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-600 hover:text-primary-teal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Legal & Resources</h3>
          <ul className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-5 w-40" />)
            ) : (
              (footerContent.footer_legal_links || []).map((link) => (
                <li key={link.text}>
                  <Link to={link.link} className="text-sm text-gray-600 hover:text-primary-teal transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))
            )}
            <li>
              <Link to="/csr-partnership" className="text-sm text-gray-600 hover:text-primary-teal transition-colors">
                CSR Partnership
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
          {loading ? (
            <>
              <Skeleton className="h-5 w-48 mb-1" />
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-5 w-56 mb-1" />
              <Skeleton className="h-5 w-48" />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">{footerContent.footer_address_line1 || 'C-51, Mathurapur Village, Omicron 1,'}</p>
              <p className="text-sm text-gray-600">{footerContent.footer_address_line2 || 'Greater Noida, UP 201310'}</p>
              <p className="text-sm text-gray-600 mt-2">Email: <a href={`mailto:${footerContent.footer_email_address || 'aadivcarefoundation@gmail.com'}`} className="hover:text-primary-teal">{footerContent.footer_email_address || 'aadivcarefoundation@gmail.com'}</a></p>
              <p className="text-sm text-gray-600">Phone: <a href={`tel:${footerContent.footer_phone_number || '+918826275206'}`} className="hover:text-primary-teal">{footerContent.footer_phone_number || '+91 8826275206'}</a></p>
            </>
          )}
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t border-gray-200 text-center">
        {loading ? (
          <Skeleton className="h-8 w-full mb-4" />
        ) : (
          <TrustBadges badges={footerContent.footer_trust_badges?.presets} className="mb-4" />
        )}
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Aadiv Care Foundation. All rights reserved.</p>
      </div>
    </footer>
  );
};