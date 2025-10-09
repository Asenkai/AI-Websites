import { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ContactForm } from '@/components/forms/ContactForm';
import { MapPin, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactPageContent {
  hero_title: string;
  hero_subtitle: string;
  address_line1: string;
  address_line2: string;
  email_address: string;
  phone_number: string;
  map_embed_url: string;
}

const Contact = () => {
  const [content, setContent] = useState<Partial<ContactPageContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'contact');

      if (error) {
        console.error("Error fetching contact page content:", error);
      } else {
        const formattedContent = data.reduce((acc, item) => {
          if (item.element_id === 'map_embed_url') {
            acc[item.element_id] = item.content_data.url;
          } else {
            acc[item.element_id] = item.content_data.text;
          }
          return acc;
        }, {} as any);
        setContent(formattedContent);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  return (
    <div className="font-sans">
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-24">
        <div className="container text-center relative z-10">
          {loading ? (
            <>
              <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                {content.hero_title || 'Get in Touch'}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                {content.hero_subtitle || 'We\'d love to hear from you. Reach out with any questions or inquiries.'}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto">
          <SectionTitle
            subtitle="Connect With Us"
            title="Our Contact Information"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center">
              <MapPin size={36} className="text-primary-teal mb-4" />
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Address</h3>
              {loading ? (
                <>
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-5 w-1/2" />
                </>
              ) : (
                <>
                  <p className="text-gray-700">{content.address_line1 || 'C-51, Mathurapur Village, Omicron 1,'}</p>
                  <p className="text-gray-700">{content.address_line2 || 'Greater Noida, UP 201310'}</p>
                </>
              )}
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center">
              <Mail size={36} className="text-primary-teal mb-4" />
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Email</h3>
              {loading ? (
                <Skeleton className="h-5 w-3/4" />
              ) : (
                <a href={`mailto:${content.email_address || 'aadivcarefoundation@gmail.com'}`} className="text-primary-teal hover:underline">
                  {content.email_address || 'aadivcarefoundation@gmail.com'}
                </a>
              )}
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center">
              <Phone size={36} className="text-primary-teal mb-4" />
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Phone</h3>
              {loading ? (
                <Skeleton className="h-5 w-3/4" />
              ) : (
                <a href={`tel:${content.phone_number || '+918826275206'}`} className="text-primary-teal hover:underline">
                  {content.phone_number || '+91 8826275206'}
                </a>
              )}
            </div>
          </div>

          {/* Google Map Embed */}
          <div className="mb-12">
            <SectionTitle
              subtitle="Find Us"
              title="Our Location"
              titleClassName="text-primary-teal"
              className="mb-8"
            />
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <iframe
                  src={content.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.7000000000005!2d77.53700000000001!3d28.487000000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce57000000001%3A0x390ce57000000001!2sMathurapur%20Village%2C%20Omicron%201%2C%20Greater%20Noida%2C%20Uttar%20Pradesh%20201310!5e0!3m2!1sen!2sin!4v1678912345678!5m2!1sen!2sin"}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aadiv Care Foundation Location"
                ></iframe>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <SectionTitle
              subtitle="Send Us a Message"
              title="Contact Form"
              titleClassName="text-primary-teal"
              className="mb-8"
            />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;