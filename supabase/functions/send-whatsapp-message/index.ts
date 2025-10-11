// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WHATSAPP_PHONE_ID_KEY = 'whatsapp_phone_id';
const WHATSAPP_ACCESS_TOKEN_KEY = 'whatsapp_access_token';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message } = await req.json();

    if (!to || !message) {
      return new Response(JSON.stringify({ error: 'Recipient phone number and message are required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(
      // @ts-ignore
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', [WHATSAPP_PHONE_ID_KEY, WHATSAPP_ACCESS_TOKEN_KEY]);

    if (settingsError) throw settingsError;

    const whatsappConfig = (settings || []).reduce((acc: Record<string, string>, { key, value }: { key: string, value: any }) => {
      acc[key] = value;
      return acc;
    }, {});

    const phoneId = whatsappConfig[WHATSAPP_PHONE_ID_KEY];
    const accessToken = whatsappConfig[WHATSAPP_ACCESS_TOKEN_KEY];

    if (!phoneId || !accessToken) {
      throw new Error('WhatsApp Business API credentials are not configured in site settings.');
    }

    // WhatsApp Business API endpoint
    const whatsappApiUrl = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

    const whatsappPayload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: {
        body: message,
      },
    };

    const whatsappResponse = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(whatsappPayload),
    });

    if (!whatsappResponse.ok) {
      const errorBody = await whatsappResponse.json();
      console.error('WhatsApp API Error:', errorBody);
      throw new Error(errorBody.error?.message || 'Failed to send WhatsApp message.');
    }

    const responseData = await whatsappResponse.json();

    return new Response(JSON.stringify({ message: 'WhatsApp message sent successfully!', data: responseData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});