import React, { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { CauseCard } from '@/components/shared/CauseCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Cause {
  id: string;
  title: string;
  description: string;
  hero_image_url: string; // Changed from imageUrl to hero_image_url
  order: number;
}

interface OurWorkPageContent {
  hero_title: string;
  hero_subtitle: string;
}

const OurWork = () => {
  const [pageContent, setPageContent] = useState<Partial<OurWorkPageContent>>({});
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data: pageData, error: pageError } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'our_work');

      if (pageError) {
        console.error("Error fetching Our Work page content:", pageError);
      } else {
        const formattedPageContent = pageData.reduce((acc, item) => {
          acc[item.element_id] = item.content_data.text;
          return acc;
        }, {} as any);
        setPageContent(formattedPageContent);
      }

      const { data: causesData, error: causesError } = await supabase
        .from('causes') // Assuming a 'causes' table for dynamic cause data
        .select('id, title, problem_statement, hero_image_url, order') // Select relevant fields
        .order('order', { ascending: true });

      if (causesError) {
        console.error("Error fetching causes:", causesError);
      } else {
        // Map problem_statement to description for CauseCard
        setCauses(causesData?.map(cause => ({
          id: cause.id,
          title: cause.title,
          description: cause.problem_statement, // Using problem_statement as description
          hero_image_url: cause.hero_image_url,
          order: cause.order,
        })) || []);
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
                {pageContent.hero_title || 'Our Work: Making a Difference'}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                {pageContent.hero_subtitle || 'Explore the various causes we champion to bring positive change.'}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container">
          <SectionTitle
            subtitle="Our Initiatives"
            title="Areas Where We Create Impact"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-72 rounded-lg" />
              ))
            ) : (
              causes.map((cause) => (
                <CauseCard
                  key={cause.id}
                  id={cause.id}
                  title={cause.title}
                  description={cause.description}
                  imageUrl={cause.hero_image_url || '/placeholder.svg'}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurWork;