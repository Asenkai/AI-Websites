import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { TrustBadges } from '@/components/shared/TrustBadges';

export const Footer = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Work', path: '/our-work' },
    { name: 'Impact', path: '/impact' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Download Certificates', path: '/about#certificates' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/aadivcarefoundation' },
    { icon: Twitter, href: 'https://twitter.com/aadivcarefoundation' },
    { icon: Instagram, href: 'https://instagram.com/aadivcarefoundation' },
    { icon: Linkedin, href: 'https://linkedin.com/company/aadivcarefoundation' },
  ];

  return (
    <footer className="bg-gray-50 py-12 border-t">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/placeholder.svg" alt="Aadiv Care Foundation Logo" className="h-8 w-8" />
            <span className="font-serif text-xl font-bold text-primary-teal">Aadiv Care Foundation</span>
          </Link>
          <p className="text-sm text-gray-600">
            Healing, Hope & Dignity — Together. Your support transforms lives.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-teal transition-colors"
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-sm text-gray-600 hover:text-primary-teal transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Legal & Resources</h3>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-sm text-gray-600 hover:text-primary-teal transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/csr-partnership" className="text-sm text-gray-600 hover:text-primary-teal transition-colors">
                CSR Partnership
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
          <p className="text-sm text-gray-600">C-51, Mathurapur Village, Omicron 1,</p>
          <p className="text-sm text-gray-600">Greater Noida, UP 201310</p>
          <p className="text-sm text-gray-600 mt-2">Email: <a href="mailto:aadivcarefoundation@gmail.com" className="hover:text-primary-teal">aadivcarefoundation@gmail.com</a></p>
          <p className="text-sm text-gray-600">Phone: <a href="tel:+918826275206" className="hover:text-primary-teal">+91 8826275206</a></p>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t border-gray-200 text-center">
        <TrustBadges className="mb-4" />
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Aadiv Care Foundation. All rights reserved.</p>
      </div>
    </footer>
  );
};