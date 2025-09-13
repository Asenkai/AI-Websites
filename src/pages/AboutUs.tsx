import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { TrustBadges } from '@/components/shared/TrustBadges';

const AboutUs = () => {
  return (
    <div className="font-sans">
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-24">
        <div className="container text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            About Aadiv Care Foundation
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Our Journey of Compassion and Impact
          </p>
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
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Aadiv Care Foundation was born from a deep-seated commitment to uplift the most vulnerable sections of society. Founded as a Section 8 NGO, our journey began with a simple yet powerful belief: every individual deserves healing, hope, and dignity. We started with grassroots initiatives, addressing immediate needs like food and hygiene, and quickly expanded our scope to include long-term solutions in education, mental health, and elder care.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Over the years, we have grown into a recognized force for good, driven by the unwavering support of our donors, volunteers, and partners. Our story is one of collective action, where small acts of kindness multiply into significant, life-changing impact for thousands.
          </p>
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
              <p className="text-gray-700 leading-relaxed">
                "To uplift underprivileged communities through comprehensive welfare programs encompassing therapy, education, hygiene, food security, and elder care, fostering a society where everyone can thrive with dignity."
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="font-serif text-2xl font-bold text-primary-teal mb-3">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                "To impact over 1,00,000+ lives within the next five years, creating sustainable change and building resilient communities across India."
              </p>
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
          <a href="/Aadiv_Certificates.pdf" download>
            <Button className="bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Download Certificates →
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;