// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EMAIL_API_KEY = 'email_service_api_key';
const EMAIL_SENDER_ADDRESS = 'email_sender_address';

// NOTE: This example uses SendGrid's API. If you use a different service,
// you will need to adjust the API endpoint and payload accordingly.
const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: 'Recipient email, subject, and body are required.' }), {
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
      .in('key', [EMAIL_API_KEY, EMAIL_SENDER_ADDRESS]);

    if (settingsError) throw settingsError;

    const emailConfig = (settings || []).reduce((acc: Record<string, string>, { key, value }: { key: string, value: any }) => {
      acc[key] = value;
      return acc;
    }, {});

    const apiKey = emailConfig[EMAIL_API_KEY];
    const senderAddress = emailConfig[EMAIL_SENDER_ADDRESS];

    if (!apiKey || !senderAddress) {
      throw new Error('Email service credentials are not configured in site settings.');
    }

    const emailPayload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: senderAddress },
      subject: subject,
      content: [{ type: 'text/plain', value: body }],
    };

    const emailResponse = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.json();
      console.error('Email API Error:', errorBody);
      throw new Error(errorBody.errors?.[0]?.message || 'Failed to send email.');
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
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