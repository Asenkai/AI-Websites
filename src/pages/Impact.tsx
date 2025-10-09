import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { StatCard } from '@/components/shared/StatCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { MetaTags } from '@/components/shared/MetaTags';

interface ImpactPageContent {
  hero_title: string;
  hero_subtitle: string;
  annual_report_button: { text: string; link: string; url?: string }; // Added url for PDF
  video_url: string;
}

const impactStats = [
  { value: '10,842+', label: 'Families Fed' },
  { value: '2,137+', label: 'Therapy Sessions Delivered' },
  { value: '1,006+', label: 'Hygiene Kits Distributed' },
  { value: '2,000+', label: 'Children & Elderly Supported' },
  { value: '15+', label: 'Projects Running' },
  { value: '500+', label: 'Active Volunteers' },
];

const successStories = [
  {
    id: 1,
    name: 'Rohit, 9',
    story: 'Rohit, 9, once dropped out due to poverty. With your support, he now attends school daily and dreams of becoming a teacher.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
  {
    id: 2,
    name: 'Smt. Devi, 72',
    story: 'Abandoned by her family, Smt. Devi found a new home and loving care at our elder care facility. She now enjoys daily activities and medical support.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
  {
    id: 3,
    name: 'Priya, 16',
    story: 'Struggling with anxiety, Priya received free counseling and found the strength to pursue her studies. She is now a confident and aspiring artist.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
];

const Impact = () => {
  const [content, setContent] = useState<Partial<ImpactPageContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'impact');

      if (error) {
        console.error("Error fetching impact page content:", error);
      } else {
        const formattedContent = data.reduce((acc, item) => {
          if (item.element_id.includes('_button')) {
            acc[item.element_id] = item.content_data;
          } else if (item.element_id === 'video_url') {
            acc[item.element_id] = item.content_data.url;
          }
          else {
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
      <MetaTags
        title="Our Impact"
        description="See the tangible impact of your support through success stories, detailed statistics, and our annual reports. Witness the change we create together."
      />
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
                {content.hero_title || 'Our Impact: Stories of Change'}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                {content.hero_subtitle || 'See how your support is transforming lives and building a better future.'}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Infographic Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <SectionTitle
            subtitle="Numbers That Speak"
            title="Aadiv Care Foundation's Impact at a Glance"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-8">
            {impactStats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Annual Report Download */}
      <section className="py-16 bg-white">
        <div className="container text-center max-w-3xl mx-auto">
          <SectionTitle
            subtitle="Transparency & Accountability"
            title="Download Our Annual Report"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <p className="text-lg text-gray-700 mb-8">
            Access our detailed annual reports to understand our financial transparency, project progress, and future plans. Your trust is our greatest asset.
          </p>
          {loading ? (
            <Skeleton className="h-12 w-64 mx-auto rounded-full" />
          ) : (
            <a href={content.annual_report_button?.url || '#'} download>
              <Button disabled={loading} className="bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                {content.annual_report_button?.text || 'Download Annual Report (PDF)'}
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Success Stories Carousel */}
      <section id="stories" className="py-16 bg-gray-100">
        <div className="container">
          <SectionTitle
            subtitle="Voices of Hope"
            title="Inspiring Success Stories"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {successStories.map((story, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <img src={story.imageUrl} alt={story.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-accent-yellow" />
                        <h4 className="font-serif text-xl font-bold text-primary-teal mb-2">{story.name}</h4>
                        <p className="text-gray-700 text-base italic">"{story.story}"</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Video Block */}
      <section className="py-16 bg-white">
        <div className="container text-center max-w-4xl mx-auto">
          <SectionTitle
            subtitle="See Our Work in Action"
            title="Aadiv Care Foundation: Our Journey"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={content.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ"} // Placeholder YouTube video
                title="Aadiv Care Foundation Impact Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Watch our video to get a glimpse of the lives we touch and the communities we empower.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Impact;