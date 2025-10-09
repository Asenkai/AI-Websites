import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

// Define a more specific type for a cause to avoid 'any' and potential build errors
interface CauseData {
  id: string;
  title: string;
  hero_image_url: string;
  problem_statement: string;
  solution_description: string;
  impact_description: string;
  unit_costs: Array<{ amount: string; description: string }>;
  gallery_images: Array<{ src: string; alt: string }>;
  video_url: string;
  donate_button: { text: string; link: string };
  ketto_button: { text: string; link: string };
  giveindia_button: { text: string; link: string };
  volunteer_button: { text: string; link: string };
}

const CauseDetail = () => {
  const { causeId } = useParams<{ causeId: string }>();
  const [cause, setCause] = useState<CauseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCauseDetail = async () => {
      setLoading(true);
      if (!causeId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('causes') // Assuming a 'causes' table for dynamic cause data
        .select('*')
        .eq('id', causeId)
        .single();

      if (error) {
        console.error('Error fetching cause detail:', error);
        setCause(null);
      } else {
        setCause(data as CauseData);
      }
      setLoading(false);
    };

    fetchCauseDetail();
  }, [causeId]);

  if (loading) {
    return (
      <div className="container py-20">
        <Skeleton className="h-96 w-full mb-12" />
        <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
        <Skeleton className="h-24 w-full mb-12" />
        <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
        <Skeleton className="h-24 w-full mb-12" />
        <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
        <Skeleton className="h-24 w-full mb-12" />
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-16 w-full mx-auto" />
      </div>
    );
  }

  if (!cause) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-red-600">Cause Not Found</h1>
        <p className="text-lg text-gray-700 mt-4">The cause you are looking for does not exist.</p>
        <Link to="/our-work">
          <Button className="mt-8 bg-primary-teal hover:bg-teal-700 text-white">
            Back to Our Work
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* Hero Image & Title */}
      <section className="relative h-64 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url(${cause.hero_image_url || '/placeholder.svg'})` }}>
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-white text-center px-4">
            {cause.title}
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-12">
            <SectionTitle
              subtitle="The Challenge"
              title="Understanding the Problem"
              titleClassName="text-primary-teal"
              className="mb-6"
            />
            <p className="text-lg text-gray-700 leading-relaxed">{cause.problem_statement}</p>
          </div>

          <div className="mb-12">
            <SectionTitle
              subtitle="Our Approach"
              title="Our Solution & Strategy"
              titleClassName="text-primary-teal"
              className="mb-6"
            />
            <p className="text-lg text-gray-700 leading-relaxed">{cause.solution_description}</p>
          </div>

          <div className="mb-12">
            <SectionTitle
              subtitle="Real Change"
              title="Impact & Achievements"
              titleClassName="text-primary-teal"
              className="mb-6"
            />
            <p className="text-lg text-gray-700 leading-relaxed">{cause.impact_description}</p>
          </div>

          {/* Unit Cost Block */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-12 text-center">
            <h3 className="font-serif text-2xl font-bold text-primary-teal mb-6">How Your Donation Helps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cause.unit_costs?.map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <p className="text-2xl font-bold text-accent-yellow mb-1">{item.amount}</p>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
            <Link to={cause.donate_button?.link || '/donate'}>
              <Button className="mt-8 bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                {cause.donate_button?.text || 'Donate to this Cause'}
              </Button>
            </Link>
          </div>

          {/* Gallery */}
          <div className="mb-12">
            <SectionTitle
              subtitle="Moments of Change"
              title="Our Work in Action"
              titleClassName="text-primary-teal"
              className="mb-6"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cause.gallery_images?.map((image, index) => (
                <img
                  key={index}
                  src={image.src || '/placeholder.svg'}
                  alt={image.alt}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
            {cause.video_url && (
              <div className="mt-8 aspect-video w-full rounded-lg overflow-hidden shadow-md">
                <iframe
                  width="100%"
                  height="100%"
                  src={cause.video_url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* CTA Row */}
          <div className="py-8 text-center bg-primary-teal/10 rounded-lg">
            <h3 className="font-serif text-2xl font-bold text-primary-teal mb-6">Join Us in Making a Difference</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={cause.donate_button?.link || '/donate'}>
                <Button className="bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                  {cause.donate_button?.text || 'Donate Now'}
                </Button>
              </Link>
              <a href={cause.ketto_button?.link || 'https://www.ketto.org/aadivcarefoundation'} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-2 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                  {cause.ketto_button?.text || 'Start Fundraiser on Ketto'}
                </Button>
              </a>
              <a href={cause.giveindia_button?.link || 'https://www.giveindia.org/aadivcarefoundation'} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-2 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                  {cause.giveindia_button?.text || 'Start Fundraiser on GiveIndia'}
                </Button>
              </a>
              <Link to={cause.volunteer_button?.link || '/volunteer'}>
                <Button variant="outline" className="border-2 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                  {cause.volunteer_button?.text || 'Volunteer'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CauseDetail;