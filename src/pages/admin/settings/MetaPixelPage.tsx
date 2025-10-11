import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const META_PIXEL_KEY = 'meta_pixel_id';
const META_ACCESS_TOKEN_KEY = 'meta_access_token';

const MetaPixelPage = () => {
  const [pixelId, setPixelId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [META_PIXEL_KEY, META_ACCESS_TOKEN_KEY]);

      if (error) {
        console.error('Error fetching Meta settings:', error);
        toast.error('Failed to load Meta settings.');
      } else if (data) {
        const settings = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        setPixelId(settings[META_PIXEL_KEY] || '');
        setAccessToken(settings[META_ACCESS_TOKEN_KEY] || '');
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert([
        { key: META_PIXEL_KEY, value: pixelId },
        { key: META_ACCESS_TOKEN_KEY, value: accessToken },
      ], { onConflict: 'key' });

    if (error) {
      toast.error('Failed to save Meta settings.');
      console.error('Error saving Meta settings:', error);
    } else {
      toast.success('Meta settings saved successfully!');
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary-teal">Meta (Facebook) Pixel & Conversions API</CardTitle>
        <CardDescription>
          Enter your Meta Pixel ID for browser-side tracking and your Conversions API Access Token for server-side event tracking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="meta-pixel-id">Meta Pixel ID</Label>
              <Input
                id="meta-pixel-id"
                placeholder="Enter your Pixel ID"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-access-token">Conversions API Access Token</Label>
              <Input
                id="meta-access-token"
                type="password"
                placeholder="Enter your Access Token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </div>
          </>
        )}
        <Button onClick={handleSave} disabled={loading || isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MetaPixelPage;