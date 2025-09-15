import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrustBadges } from '@/components/shared/TrustBadges';
import { StatCard } from '@/components/shared/StatCard';
import { FocusAreaCard } from '@/components/shared/FocusAreaCard';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { BookOpen, Brain, Droplet, Soup, Home, PawPrint } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface HomePageContent {
  hero_title: string;
  hero_subtitle: string;
}

const Index = () => {
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'home');

      if (error) {
        console.error("Error fetching homepage content:", error);
      } else {
        const formattedContent = data.reduce((acc, item) => {
          acc[item.element_id] = item.content_data.text;
          return acc;
        }, {} as any);
        setContent(formattedContent);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const impactStats = [
    { value: '10,842+', label: 'Families Fed' },
    { value: '2,137+', label: 'Therapy Sessions Delivered' },
    { value: '1,006+', label: 'Hygiene Kits Distributed' },
    { value: '2,000+', label: 'Children & Elderly Supported' },
  ];

  const focusAreas = [
    { icon: BookOpen, title: 'Education for Every Child', description: 'Providing access to quality education and learning resources.' },
    { icon: Brain, title: 'Mental Health & Therapy', description: 'Offering counseling and support for mental well-being.' },
    { icon: Droplet, title: 'Hygiene & Sanitization', description: 'Distributing hygiene kits and promoting sanitation practices.' },
    { icon: Soup, title: 'Food & Basic Needs', description: 'Ensuring food security and essential supplies for families.' },
    { icon: Home, title: 'Elder Care & Rehabilitation', description: 'Supporting the elderly with care, shelter, and rehabilitation.' },
    { icon: PawPrint, title: 'Animal & Environment Welfare', description: 'Protecting animals and promoting environmental sustainability.' },
  ];

  return (
    <div className="font-sans">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-32 overflow-hidden">
        <div className="container text-center relative z-10">
          {loading ? (
            <>
              <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-8 w-1/2 mx-auto mb-8" />
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                {content?.hero_title || 'Healing, Hope & Dignity — Together'}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-in-up delay-100">
                {content?.hero_subtitle || 'Your small act today can feed a family, educate a child, or heal someone in need.'}
              </p>
            </>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-fade-in-up delay-200">
            <Link to="/donate">
              <Button className="bg-accent-yellow hover:bg-yellow-600 text-primary-teal font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Donate Now
              </Button>
            </Link>
            <Link to="/our-work">
              <Button className="bg-white text-primary-teal hover:bg-gray-100 border border-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Sponsor a Project
              </Button>
            </Link>
            <Link to="/csr-partnership">
              <Button className="bg-white text-primary-teal hover:bg-gray-100 border border-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                CSR Partnership
              </Button>
            </Link>
          </div>
          <TrustBadges className="animate-fade-in-up delay-300" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent-yellow rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cta-green rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Impact Snapshot */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <SectionTitle
            subtitle="Our Impact So Far"
            title="Transforming Lives, One Step at a Time"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {impactStats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-16 bg-white">
        <div className="container">
          <SectionTitle
            subtitle="What We Do"
            title="Our Core Focus Areas"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {focusAreas.map((area, index) => (
              <FocusAreaCard
                key={index}
                icon={area.icon}
                title={area.title}
                description={area.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Story Block */}
      <section className="py-16 bg-primary-teal text-white">
        <div className="container flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img
              src="/placeholder.svg"
              alt="Rohit, a child supported by Aadiv Care Foundation"
              className="w-full h-auto rounded-lg shadow-xl object-cover"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">A Story of Hope: Rohit's Journey</h3>
            <p className="text-lg mb-6">
              "Rohit, 9, once dropped out due to poverty. With your support, he now attends school daily and dreams of becoming a teacher."
            </p>
            <Link to="/impact#stories">
              <Button className="bg-accent-yellow hover:bg-yellow-600 text-primary-teal font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Read Full Story →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Monthly Giving Banner */}
      <section className="py-16 bg-gray-100">
        <div className="container text-center">
          <SectionTitle
            subtitle="Sustain Your Impact"
            title="Make Your Impact Monthly"
            titleClassName="text-primary-teal"
          />
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Your consistent support ensures continuous care and long-term change.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-2xl font-bold text-primary-teal mb-2">₹499/month</p>
              <p className="text-gray-600">= 1 therapy session</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-2xl font-bold text-primary-teal mb-2">₹999/month</p>
              <p className="text-gray-600">= 1 day elder care</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-2xl font-bold text-primary-teal mb-2">₹1,999/month</p>
              <p className="text-gray-600">= education kit</p>
            </div>
          </div>
          <Link to="/donate">
            <Button className="bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Start Monthly Support
            </Button>
          </Link>
        </div>
      </section>

      {/* CSR Teaser */}
      <section className="py-16 bg-white">
        <div className="container text-center">
          <SectionTitle
            subtitle="For Corporate Partners"
            title="Drive Social Change with Your CSR"
            titleClassName="text-primary-teal"
          />
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-8">
            Aadiv Care Foundation offers CSR-ready programs tailored to your company's values.
            Our projects range from ₹20 Lakhs to ₹5 Crores, are Schedule VII compliant, and come with quarterly reporting for full transparency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/Aadiv_CSR_Dossier.pdf" download>
              <Button className="bg-white text-primary-teal hover:bg-gray-100 border border-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Download CSR Dossier
              </Button>
            </a>
            <Link to="/contact">
              <Button className="bg-accent-yellow hover:bg-yellow-600 text-primary-teal font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Book a Call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;