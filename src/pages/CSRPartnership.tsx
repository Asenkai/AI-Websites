import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { TrustBadges } from '@/components/shared/TrustBadges';
import { CSRProjectTable } from '@/components/shared/CSRProjectTable';

const csrProjects = [
  { project: 'Education for Every Child', scheduleVIIClause: 'Item (ii)', description: 'Promoting education, including special education and employment enhancing vocation skills.' },
  { project: 'Mental Health & Therapy', scheduleVIIClause: 'Item (i)', description: 'Promoting healthcare including preventive healthcare and sanitation.' },
  { project: 'Hygiene & Sanitization Drives', scheduleVIIClause: 'Item (i)', description: 'Promoting healthcare including preventive healthcare and sanitation.' },
  { project: 'Food & Basic Needs', scheduleVIIClause: 'Item (i)', description: 'Eradicating hunger, poverty and malnutrition.' },
  { project: 'Elder Care & Rehabilitation', scheduleVIIClause: 'Item (i)', description: 'Promoting healthcare and ensuring well-being of senior citizens.' },
  { project: 'Animal & Environment Welfare', scheduleVIIClause: 'Item (iv)', description: 'Ensuring environmental sustainability, ecological balance, protection of flora and fauna, animal welfare.' },
];

const CSRPartnership = () => {
  return (
    <div className="font-sans">
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-24">
        <div className="container text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Partner With Us to Build a Healthier, Happier India
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Align your corporate social responsibility with impactful, compliant, and transparent programs.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto text-center">
          <SectionTitle
            subtitle="Strategic Alliances for Social Good"
            title="Why Partner with Aadiv Care Foundation?"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Aadiv Care Foundation offers robust and impactful CSR programs designed to meet your corporate objectives while creating tangible social change. We ensure seamless execution, transparent reporting, and full compliance with Schedule VII of the Companies Act, 2013.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="font-semibold text-xl text-primary-teal mb-2">Flexible Budgets</h3>
              <p className="text-gray-700 text-sm">Programs designed for CSR budgets ranging from ₹20 Lakhs to ₹5 Crores.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="font-semibold text-xl text-primary-teal mb-2">Schedule VII Compliant</h3>
              <p className="text-gray-700 text-sm">All projects are meticulously mapped to Schedule VII clauses for full compliance.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="font-semibold text-xl text-primary-teal mb-2">Transparent Reporting</h3>
              <p className="text-gray-700 text-sm">Receive detailed Quarterly MIS reports on project progress and impact.</p>
            </div>
          </div>
          <TrustBadges className="mb-10 text-lg" />
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container">
          <SectionTitle
            subtitle="Aligning Your Impact"
            title="Our Projects & Schedule VII Mapping"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <CSRProjectTable projects={csrProjects} className="max-w-5xl mx-auto" />
          <p className="text-sm text-gray-600 mt-8 text-center">
            Each of our projects is carefully designed to align with the specified activities under Schedule VII of the Companies Act, 2013, ensuring your CSR investments are both compliant and impactful.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container text-center max-w-3xl mx-auto">
          <SectionTitle
            subtitle="Ready to Partner?"
            title="Let's Create Lasting Change Together"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <p className="text-lg text-gray-700 mb-8">
            We invite you to explore a meaningful partnership with Aadiv Care Foundation. Download our comprehensive CSR dossier or schedule a call with our team to discuss tailored programs for your organization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/Aadiv_CSR_Dossier.pdf" download>
              <Button variant="outline" className="border-2 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
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

export default CSRPartnership;