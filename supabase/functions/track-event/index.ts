// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
// @ts-ignore
import { crypto } from "https://deno.land/std@0.204.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to hash user data
async function sha256(message: string) {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventName, userData } = await req.json();
    const { email, phone, firstName, lastName, value, currency } = userData;

    const supabaseAdmin = createClient(
      // @ts-ignore
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['meta_pixel_id', 'meta_access_token', 'ga4_measurement_id', 'ga4_api_secret']);

    if (settingsError) throw settingsError;

    const config = (settings || []).reduce((acc: Record<string, string>, { key, value }: { key: string, value: any }) => {
      acc[key] = value;
      return acc;
    }, {});

    const eventTimestamp = Math.floor(Date.now() / 1000);
    const promises = [];

    // Meta Conversions API
    if (config.meta_pixel_id && config.meta_access_token) {
      const metaPayload = {
        data: [{
          event_name: eventName,
          event_time: eventTimestamp,
          action_source: 'system_generated',
          user_data: {
            em: email ? await sha256(email) : undefined,
            ph: phone ? await sha256(phone) : undefined,
            fn: firstName ? await sha256(firstName) : undefined,
            ln: lastName ? await sha256(lastName) : undefined,
          },
          custom_data: {
            value: value,
            currency: currency,
          },
        }],
      };

      promises.push(fetch(`https://graph.facebook.com/v19.0/${config.meta_pixel_id}/events?access_token=${config.meta_access_token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaPayload),
      }));
    }

    // Google Analytics Measurement Protocol
    if (config.ga4_measurement_id && config.ga4_api_secret) {
      const gaPayload = {
        client_id: `${Date.now()}.${Math.random()}`, // Generate a unique client_id
        events: [{
          name: eventName,
          params: {
            currency: currency,
            value: value,
            email: email, // GA can handle PII if configured correctly
          },
        }],
      };

      promises.push(fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${config.ga4_measurement_id}&api_secret=${config.ga4_api_secret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gaPayload),
      }));
    }

    await Promise.all(promises);

    return new Response(JSON.stringify({ success: true, message: "Events tracked." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Tracking error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});