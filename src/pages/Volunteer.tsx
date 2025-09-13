import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { MessageCircle } from 'lucide-react';

const Volunteer = () => {
  const volunteerRoles = [
    'Teaching & Mentorship for children',
    'Organizing Hygiene & Sanitation Drives',
    'Fundraising & Campaign Support',
    'Assisting in Therapy Sessions',
    'Elder Care Support & Companionship',
    'Animal Rescue & Environmental Clean-ups',
    'Administrative & Event Support',
  ];

  return (
    <div className="font-sans">
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-24">
        <div className="container text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Join Us in Spreading Hope
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Your time and passion can create a ripple effect of positive change.
          </p>
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
          <p className="text-lg text-gray-700 mb-8 leading-relaxed text-center">
            Aadiv Care Foundation thrives on the dedication of our volunteers. Whether you have a few hours a week or can commit to a specific project, your contribution is invaluable. We have diverse roles to match your skills and interests:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc list-inside text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            {volunteerRoles.map((role, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-primary-teal font-bold">&bull;</span> {role}
              </li>
            ))}
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
            <a
              href="https://chat.whatsapp.com/your-whatsapp-group-link" // Replace with actual WhatsApp group link
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 mx-auto">
                <MessageCircle size={24} /> Join WhatsApp Group
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;