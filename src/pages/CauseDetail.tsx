import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/shared/SectionTitle';

// Dummy data for cause details
const causeDetailsData: { [key: string]: any } = {
  'education': {
    title: 'Education for Every Child',
    heroImage: '/placeholder.svg',
    problem: 'Millions of children in India lack access to quality education due to poverty, lack of infrastructure, and social barriers. This perpetuates a cycle of disadvantage, limiting their future opportunities.',
    solution: 'Aadiv Care Foundation provides comprehensive educational support, including school enrollment, distribution of learning materials, after-school tuition, and mentorship programs. We also work to create child-friendly learning environments.',
    impact: 'Our efforts have enabled over 2,000 children to attend school regularly, improving their literacy rates and fostering a love for learning. Many now dream of higher education and breaking the cycle of poverty.',
    unitCost: [
      { amount: '₹1,999', description: 'School kit + tuition for one child for a month' },
      { amount: '₹5,000', description: 'Sponsor a child\'s education for 3 months' },
      { amount: '₹10,000', description: 'Set up a mini-library for a community learning center' },
    ],
    galleryImages: [
      { src: '/placeholder.svg', alt: 'Children studying' },
      { src: '/placeholder.svg', alt: 'Classroom session' },
      { src: '/placeholder.svg', alt: 'Distributing school supplies' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder YouTube video
  },
  'mental-health': {
    title: 'Mental Health & Therapy',
    heroImage: '/placeholder.svg',
    problem: 'Mental health issues are often stigmatized and overlooked in underprivileged communities, leading to untreated conditions and severe distress. Access to professional psychological support is scarce.',
    solution: 'We provide free and confidential counseling, group therapy sessions, and workshops on stress management and emotional well-being. Our trained counselors work to destigmatize mental health and offer a safe space for healing.',
    impact: 'Over 2,100 therapy sessions have been delivered, helping individuals cope with trauma, anxiety, and depression. We\'ve seen significant improvements in mental well-being and community resilience.',
    unitCost: [
      { amount: '₹499', description: 'One therapy session for an individual' },
      { amount: '₹2,500', description: 'Support a mental health awareness workshop' },
      { amount: '₹5,000', description: 'Provide a month of counseling for a family' },
    ],
    galleryImages: [
      { src: '/placeholder.svg', alt: 'Therapy session' },
      { src: '/placeholder.svg', alt: 'Group counseling' },
      { src: '/placeholder.svg', alt: 'Mental health workshop' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  'hygiene': {
    title: 'Hygiene & Sanitization',
    heroImage: '/placeholder.svg',
    problem: 'Lack of access to basic hygiene facilities and knowledge leads to preventable diseases and poor health outcomes in many communities.',
    solution: 'We conduct hygiene drives, distribute essential hygiene kits (soap, sanitizers, sanitary pads), and educate communities on proper sanitation practices. We also support the construction of clean water and toilet facilities.',
    impact: 'More than 1,000 hygiene kits have been distributed, significantly reducing the incidence of water-borne diseases and improving overall community health.',
    unitCost: [
      { amount: '₹199', description: 'One hygiene kit for a family' },
      { amount: '₹1,000', description: 'Provide hygiene education for a village' },
      { amount: '₹10,000', description: 'Contribute to a community toilet project' },
    ],
    galleryImages: [
      { src: '/placeholder.svg', alt: 'Hygiene kit distribution' },
      { src: '/placeholder.svg', alt: 'Sanitation awareness' },
      { src: '/placeholder.svg', alt: 'Clean water access' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  'food-needs': {
    title: 'Food & Basic Needs',
    heroImage: '/placeholder.svg',
    problem: 'Food insecurity and lack of basic necessities are pressing issues for countless families, especially during crises or for daily wage earners.',
    solution: 'We run regular food distribution drives, provide nutritious meals to children and the elderly, and distribute ration kits to families. We also ensure access to essential non-food items like blankets and clothing.',
    impact: 'Over 10,800 families have received food and basic needs support, alleviating hunger and providing comfort during difficult times.',
    unitCost: [
      { amount: '₹199', description: 'Feed a family for one day' },
      { amount: '₹999', description: 'Provide a ration kit for a week' },
      { amount: '₹5,000', description: 'Sponsor a community meal drive' },
    ],
    galleryImages: [
      { src: '/placeholder.svg', alt: 'Food distribution' },
      { src: '/placeholder.svg', alt: 'Ration kit' },
      { src: '/placeholder.svg', alt: 'Community kitchen' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  'elder-care': {
    title: 'Elder Care & Rehabilitation',
    heroImage: '/placeholder.svg',
    problem: 'Many elderly individuals face neglect, abandonment, and lack of proper care, leading to isolation and health deterioration.',
    solution: 'We provide compassionate care, medical assistance, and rehabilitation services for the elderly. This includes shelter, nutritious food, regular health check-ups, and engaging activities to promote their well-being.',
    impact: 'We have supported over 2,000 elderly individuals, offering them a safe and dignified environment, improving their health, and restoring their sense of community.',
    unitCost: [
      { amount: '₹999', description: 'Elder care for one day' },
      { amount: '₹5,000', description: 'Provide medical check-up and medicines for a month' },
      { amount: '₹15,000', description: 'Sponsor an elderly person\'s care for a month' },
    ],
    galleryImages: [
      { src: '/placeholder.svg', alt: 'Elderly care' },
      { src: '/placeholder.svg', alt: 'Rehabilitation activities' },
      { src: '/placeholder.svg', alt: 'Medical support for elderly' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  'animal-welfare': {
    title: 'Animal & Environment Welfare',
    heroImage: '/placeholder.svg',
    problem: 'Stray animals often suffer from neglect, injury, and lack of food, while environmental degradation impacts both wildlife and human communities.',
    solution: 'We engage in animal rescue and rehabilitation, provide veterinary care, and conduct feeding drives. We also organize tree plantation campaigns, waste management initiatives, and environmental awareness programs.',
    impact: 'Our efforts have rescued numerous animals and contributed to local environmental conservation, fostering a more harmonious coexistence between humans and nature.',
    unitCost: [
      { amount: '₹299', description: 'Feed a stray animal for a week' },
      { amount: '₹1,500', description: 'Sponsor a tree plantation drive' },
      { amount: '₹5,000', description: 'Support animal rescue and medical care' },
    ],
    galleryImages: [
      { src: '/placeholder.svg', alt: 'Animal rescue' },
      { src: '/placeholder.svg', alt: 'Tree plantation' },
      { src: '/placeholder.svg', alt: 'Animal care' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
};

const CauseDetail = () => {
  const { causeId } = useParams<{ causeId: string }>();
  const cause = causeDetailsData[causeId || ''];

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
      <section className="relative h-64 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url(${cause.heroImage})` }}>
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
            <p className="text-lg text-gray-700 leading-relaxed">{cause.problem}</p>
          </div>

          <div className="mb-12">
            <SectionTitle
              subtitle="Our Approach"
              title="Our Solution & Strategy"
              titleClassName="text-primary-teal"
              className="mb-6"
            />
            <p className="text-lg text-gray-700 leading-relaxed">{cause.solution}</p>
          </div>

          <div className="mb-12">
            <SectionTitle
              subtitle="Real Change"
              title="Impact & Achievements"
              titleClassName="text-primary-teal"
              className="mb-6"
            />
            <p className="text-lg text-gray-700 leading-relaxed">{cause.impact}</p>
          </div>

          {/* Unit Cost Block */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-12 text-center">
            <h3 className="font-serif text-2xl font-bold text-primary-teal mb-6">How Your Donation Helps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cause.unitCost.map((item: { amount: string; description: string }, index: number) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <p className="text-2xl font-bold text-accent-yellow mb-1">{item.amount}</p>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
            <Link to="/donate">
              <Button className="mt-8 bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Donate to this Cause
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
              {cause.galleryImages.map((image: { src: string; alt: string }, index: number) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
            {cause.videoUrl && (
              <div className="mt-8 aspect-video w-full rounded-lg overflow-hidden shadow-md">
                <iframe
                  width="100%"
                  height="100%"
                  src={cause.videoUrl}
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
              <Link to="/donate">
                <Button className="bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                  Donate Now
                </Button>
              </Link>
              <a href="https://www.ketto.org/aadivcarefoundation" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-2 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                  Start Fundraiser on Ketto
                </Button>
              </a>
              <a href="https://www.giveindia.org/aadivcarefoundation" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-2 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                  Start Fundraiser on GiveIndia
                </Button>
              </a>
              <Link to="/volunteer">
                <Button variant="outline" className="border-2 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                  Volunteer
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