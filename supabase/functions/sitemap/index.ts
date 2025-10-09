// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

// IMPORTANT: Replace this with your actual website domain
const SITE_URL = 'https://www.your-domain.com';

serve(async (_req: Request) => {
  // Handle CORS preflight request
  if (_req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      // @ts-ignore
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Fetch dynamic cause pages
    const { data: causes, error } = await supabaseClient
      .from('causes')
      .select('id, updated_at');

    if (error) {
      throw error;
    }

    const staticPages = [
      '/',
      '/about',
      '/our-work',
      '/impact',
      '/donate',
      '/csr-partnership',
      '/volunteer',
      '/contact',
    ];

    const today = new Date().toISOString().split('T')[0];

    const sitemapEntries = staticPages.map(path => `
      <url>
        <loc>${SITE_URL}${path}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${path === '/' ? '1.0' : '0.8'}</priority>
      </url>
    `).join('');

    const causeEntries = (causes || []).map((cause: { id: string; updated_at: string }) => `
      <url>
        <loc>${SITE_URL}/our-work/${cause.id}</loc>
        <lastmod>${new Date(cause.updated_at).toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapEntries}
        ${causeEntries}
      </urlset>
    `;

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});