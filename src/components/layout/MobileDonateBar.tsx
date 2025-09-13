import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const MobileDonateBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-teal p-3 shadow-lg z-50 md:hidden">
      <Link to="/donate" className="block w-full">
        <Button className="w-full bg-accent-yellow hover:bg-yellow-600 text-primary-teal font-bold py-3 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          Donate ₹199 →
        </Button>
      </Link>
    </div>
  );
};