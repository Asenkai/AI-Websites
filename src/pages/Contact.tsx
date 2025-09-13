import React from 'react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ContactForm } from '@/components/forms/ContactForm';
import { MapPin, Mail, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="font-sans">
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-24">
        <div className="container text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto">
          <SectionTitle
            subtitle="Connect With Us"
            title="Our Contact Information"
            titleClassName="text-primary-teal"
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center">
              <MapPin size={36} className="text-primary-teal mb-4" />
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Address</h3>
              <p className="text-gray-700">C-51, Mathurapur Village, Omicron 1,</p>
              <p className="text-gray-700">Greater Noida, UP 201310</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center">
              <Mail size={36} className="text-primary-teal mb-4" />
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Email</h3>
              <a href="mailto:aadivcarefoundation@gmail.com" className="text-primary-teal hover:underline">
                aadivcarefoundation@gmail.com
              </a>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center">
              <Phone size={36} className="text-primary-teal mb-4" />
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Phone</h3>
              <a href="tel:+918826275206" className="text-primary-teal hover:underline">
                +91 8826275206
              </a>
            </div>
          </div>

          {/* Google Map Embed */}
          <div className="mb-12">
            <SectionTitle
              subtitle="Find Us"
              title="Our Location"
              titleClassName="text-primary-teal"
              className="mb-8"
            />
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.7000000000005!2d77.53700000000001!3d28.487000000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce57000000001%3A0x390ce57000000001!2sMathurapur%20Village%2C%20Omicron%201%2C%20Greater%20Noida%2C%20Uttar%20Pradesh%20201310!5e0!3m2!1sen!2sin!4v1678912345678!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Aadiv Care Foundation Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <SectionTitle
              subtitle="Send Us a Message"
              title="Contact Form"
              titleClassName="text-primary-teal"
              className="mb-8"
            />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;