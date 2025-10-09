import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { TrustBadges } from '@/components/shared/TrustBadges';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface AboutPageContent {
  hero_title: string;
  hero_subtitle: string;
  story_p1: string;
  story_p2: string;
  mission: string;
  vision: string;
  certificates_button: { text: string; link: string };
}

const AboutUs = () => {
  const [content, setContent] = useState<Partial<AboutPageContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'about');

      if (error) {
        console.error("Error fetching content:", error);
      } else {
        const formattedContent = data.reduce((acc, item) => {
          if (item.element_id.includes('_button')) {
            acc[item.element_id] = item.content_data;
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
                {content.hero_title || 'About Aadiv Care Foundation'}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                {content.hero_subtitle || 'Our Journey of Compassion and Impact'}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto">
          <SectionTitle
            subtitle="Our Roots"
            title="The Aadiv Care Story"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {content.story_p1}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {content.story_p2}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container max-w-4xl mx-auto text-center">
          <SectionTitle
            subtitle="Our Purpose"
            title="Mission & Vision"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="font-serif text-2xl font-bold text-primary-teal mb-3">Our Mission</h3>
              {loading ? <Skeleton className="h-20 w-full" /> : (
                <p className="text-gray-700 leading-relaxed">
                  "{content.mission}"
                </p>
              )}
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="font-serif text-2xl font-bold text-primary-teal mb-3">Our Vision</h3>
              {loading ? <Skeleton className="h-20 w-full" /> : (
                <p className="text-gray-700 leading-relaxed">
                  "{content.vision}"
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="certificates" className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto text-center">
          <SectionTitle
            subtitle="Our Credibility"
            title="Legal Recognition & Compliance"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Aadiv Care Foundation operates with full transparency and adherence to all legal frameworks. We are proud to be:
          </p>
          <TrustBadges className="mb-10 text-lg" />
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            These certifications ensure that your contributions are utilized effectively and are eligible for tax exemptions as per Indian laws. We are committed to maintaining the highest standards of governance and accountability.
          </p>
          {loading ? (
            <Skeleton className="h-12 w-64 mx-auto rounded-full" />
          ) : (
            <a href={content.certificates_button?.link || '#'} download>
              <Button disabled={loading} className="bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                {content.certificates_button?.text || 'Download Certificates →'}
              </Button>
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;