import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const GTM_KEY = 'gtm_id';
const GA4_MEASUREMENT_ID_KEY = 'ga4_measurement_id';
const GA4_API_SECRET_KEY = 'ga4_api_secret';

const GoogleTagPage = () => {
  const [gtmId, setGtmId] = useState('');
  const [measurementId, setMeasurementId] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [GTM_KEY, GA4_MEASUREMENT_ID_KEY, GA4_API_SECRET_KEY]);

      if (error) {
        console.error('Error fetching Google settings:', error);
        toast.error('Failed to load Google settings.');
      } else if (data) {
        const settings = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        setGtmId(settings[GTM_KEY] || '');
        setMeasurementId(settings[GA4_MEASUREMENT_ID_KEY] || '');
        setApiSecret(settings[GA4_API_SECRET_KEY] || '');
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
        { key: GTM_KEY, value: gtmId },
        { key: GA4_MEASUREMENT_ID_KEY, value: measurementId },
        { key: GA4_API_SECRET_KEY, value: apiSecret },
      ], { onConflict: 'key' });

    if (error) {
      toast.error('Failed to save Google settings.');
      console.error('Error saving Google settings:', error);
    } else {
      toast.success('Google settings saved successfully!');
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary-teal">Google Analytics & Tag Manager</CardTitle>
        <CardDescription>
          Manage your Google tracking IDs. The GTM ID is for client-side scripts, while the GA4 settings are for server-side conversion tracking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="gtm-id">GTM Container ID</Label>
              <Input
                id="gtm-id"
                placeholder="GTM-XXXXXXX"
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ga4-measurement-id">GA4 Measurement ID</Label>
              <Input
                id="ga4-measurement-id"
                placeholder="G-XXXXXXXXXX"
                value={measurementId}
                onChange={(e) => setMeasurementId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ga4-api-secret">GA4 API Secret</Label>
              <Input
                id="ga4-api-secret"
                type="password"
                placeholder="Enter your API Secret"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
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

export default GoogleTagPage;