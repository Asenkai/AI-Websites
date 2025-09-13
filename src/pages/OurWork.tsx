import React from 'react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { CauseCard } from '@/components/shared/CauseCard';

const causes = [
  {
    id: 'education',
    title: 'Education for Every Child',
    description: 'Providing access to quality education, school supplies, and tuition support for underprivileged children.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
  {
    id: 'mental-health',
    title: 'Mental Health & Therapy',
    description: 'Offering free counseling, therapy sessions, and mental health awareness programs to communities in need.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
  {
    id: 'hygiene',
    title: 'Hygiene & Sanitization',
    description: 'Distributing hygiene kits, promoting sanitation practices, and building community toilets for better health.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
  {
    id: 'food-needs',
    title: 'Food & Basic Needs',
    description: 'Ensuring food security through meal distribution, ration kits, and providing essential supplies to vulnerable families.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
  {
    id: 'elder-care',
    title: 'Elder Care & Rehabilitation',
    description: 'Providing shelter, medical care, and rehabilitation services for abandoned and needy elderly individuals.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
  {
    id: 'animal-welfare',
    title: 'Animal & Environment Welfare',
    description: 'Working towards animal rescue, care, and promoting environmental conservation and sustainability initiatives.',
    imageUrl: '/placeholder.svg', // Replace with actual image
  },
];

const OurWork = () => {
  return (
    <div className="font-sans">
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-24">
        <div className="container text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Our Work: Making a Difference
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Explore the various causes we champion to bring positive change.
          </p>
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
            {causes.map((cause) => (
              <CauseCard
                key={cause.id}
                id={cause.id}
                title={cause.title}
                description={cause.description}
                imageUrl={cause.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurWork;