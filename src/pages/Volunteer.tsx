import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface VolunteerPageContent {
  hero_title: string;
  hero_subtitle: string;
  intro_text: string;
  whatsapp_button: { text: string; link: string };
}

const Volunteer = () => {
  const [content, setContent] = useState<Partial<VolunteerPageContent>>({});
  const [volunteerRoles, setVolunteerRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'volunteer');

      if (error) {
        console.error("Error fetching volunteer page content:", error);
      } else {
        const formattedContent = data.reduce((acc, item) => {
          if (item.element_id.includes('_button')) {
            acc[item.element_id] = item.content_data;
          } else if (item.element_id === 'volunteer_roles') {
            acc[item.element_id] = item.content_data.text?.split('\n').filter(Boolean) || [];
          }
          else {
            acc[item.element_id] = item.content_data.text;
          }
          return acc;
        }, {} as any);
        setContent(formattedContent);
        setVolunteerRoles(formattedContent.volunteer_roles || []);
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
                {content.hero_title || 'Join Us in Spreading Hope'}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                {content.hero_subtitle || 'Your time and passion can create a ripple effect of positive change.'}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto">
          <SectionTitle
            subtitle="Be the Change"
            title="Volunteer Opportunities"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          {loading ? (
            <Skeleton className="h-24 w-full mx-auto mb-8" />
          ) : (
            <p className="text-lg text-gray-700 mb-8 leading-relaxed text-center">
              {content.intro_text || 'Aadiv Care Foundation thrives on the dedication of our volunteers. Whether you have a few hours a week or can commit to a specific project, your contribution is invaluable. We have diverse roles to match your skills and interests:'}
            </p>
          )}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc list-inside text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))
            ) : (
              volunteerRoles.map((role, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-primary-teal font-bold">&bull;</span> {role}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <SectionTitle
            subtitle="Get Involved"
            title="Become an Aadiv Care Volunteer"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <VolunteerForm />
          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-4">
              Have questions or want to connect directly? Join our volunteer WhatsApp group!
            </p>
            {loading ? (
              <Skeleton className="h-12 w-64 mx-auto rounded-full" />
            ) : (
              <a
                href={content.whatsapp_button?.link || "https://chat.whatsapp.com/your-whatsapp-group-link"} // Replace with actual WhatsApp group link
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 mx-auto">
                  <MessageCircle size={24} /> {content.whatsapp_button?.text || 'Join WhatsApp Group'}
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;