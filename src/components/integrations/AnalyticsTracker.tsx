import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Augment the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// This component sends page view events to Google Tag Manager's dataLayer
// for Single Page Application (SPA) tracking.
export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Ensure dataLayer is initialized on the window object
    if (typeof window.dataLayer === 'undefined') {
      window.dataLayer = [];
    }
    
    // Push a virtual page view event to the dataLayer
    window.dataLayer.push({
      event: 'page_view',
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null; // This component does not render anything
};