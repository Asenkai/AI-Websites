// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RAZORPAY_KEY_ID = 'razorpay_key_id';
const RAZORPAY_KEY_SECRET = 'razorpay_key_secret';

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return new Response(JSON.stringify({ error: 'A valid amount is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create a Supabase client with the service role key for elevated privileges
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

    // Fetch Razorpay keys from the site_settings table
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET]);

    if (settingsError) throw settingsError;

    const razorpayConfig = (settings || []).reduce((acc: Record<string, string>, { key, value }: { key: string, value: any }) => {
      acc[key] = value;
      return acc;
    }, {});

    const keyId = razorpayConfig[RAZORPAY_KEY_ID];
    const keySecret = razorpayConfig[RAZORPAY_KEY_SECRET];

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials are not configured in site settings.');
    }

    // Create an order with Razorpay
    const orderPayload = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${keyId}:${keySecret}`),
      },
      body: JSON.stringify(orderPayload),
    });

    if (!razorpayResponse.ok) {
      const errorBody = await razorpayResponse.json();
      console.error('Razorpay API Error:', errorBody);
      throw new Error(errorBody.error.description || 'Failed to create Razorpay order.');
    }

    const orderData = await razorpayResponse.json();

    return new Response(JSON.stringify(orderData), {
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