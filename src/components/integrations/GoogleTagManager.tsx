import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const GTM_KEY = 'gtm_id';

export const GoogleTagManager = () => {
  const [gtmId, setGtmId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGtmId = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', GTM_KEY)
        .single();

      if (data && data.value) {
        setGtmId(data.value);
      } else if (error && error.code !== 'PGRST116') {
        console.error('GTM Fetch Error:', error.message);
      }
    };

    fetchGtmId();
  }, []);

  useEffect(() => {
    if (gtmId) {
      // Add GTM script to head
      const script = document.createElement('script');
      script.id = 'gtm-script';
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(script);

      // Add GTM noscript to body
      const noScript = document.createElement('noscript');
      noScript.id = 'gtm-noscript';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noScript.appendChild(iframe);
      document.body.insertBefore(noScript, document.body.firstChild);

      // Cleanup function to remove scripts if component unmounts
      return () => {
        const existingScript = document.getElementById('gtm-script');
        if (existingScript) {
          existingScript.remove();
        }
        const existingNoScript = document.getElementById('gtm-noscript');
        if (existingNoScript) {
          existingNoScript.remove();
        }
      };
    }
  }, [gtmId]);

  return null; // This component does not render anything
};