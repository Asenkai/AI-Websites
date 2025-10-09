import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

const META_PIXEL_KEY = 'meta_pixel_id';

export const MetaPixel = () => {
  const [pixelId, setPixelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPixelId = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', META_PIXEL_KEY)
        .single();

      if (data && data.value) {
        setPixelId(data.value);
      } else if (error && error.code !== 'PGRST116') {
        console.error('Meta Pixel ID Fetch Error:', error.message);
      }
    };

    fetchPixelId();
  }, []);

  if (!pixelId) {
    return null;
  }

  return (
    <Helmet>
      <script id="meta-pixel-script">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </script>
      <noscript>
        {`
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
          />
        `}
      </noscript>
    </Helmet>
  );
};