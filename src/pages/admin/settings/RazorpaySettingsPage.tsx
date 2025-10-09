import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const RAZORPAY_KEY_ID = 'razorpay_key_id';
const RAZORPAY_KEY_SECRET = 'razorpay_key_secret';

const RazorpaySettingsPage = () => {
  const [keyId, setKeyId] = useState('');
  const [keySecret, setKeySecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRazorpaySettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET]);

      if (error) {
        console.error('Error fetching Razorpay settings:', error);
        toast.error('Failed to load Razorpay settings.');
      } else if (data) {
        const settings = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        setKeyId(settings[RAZORPAY_KEY_ID] || '');
        setKeySecret(settings[RAZORPAY_KEY_SECRET] || '');
      }
      setLoading(false);
    };

    fetchRazorpaySettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert([
        { key: RAZORPAY_KEY_ID, value: keyId },
        { key: RAZORPAY_KEY_SECRET, value: keySecret },
      ], { onConflict: 'key' });

    if (error) {
      toast.error('Failed to save Razorpay settings.');
      console.error('Error saving Razorpay settings:', error);
    } else {
      toast.success('Razorpay settings saved successfully!');
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary-teal">Razorpay Integration</CardTitle>
        <CardDescription>
          Enter your Razorpay API Key ID and Key Secret to enable online payments. These keys can be found in your Razorpay dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="razorpay-key-id">Key ID</Label>
              <Input
                id="razorpay-key-id"
                placeholder="rzp_live_..."
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="razorpay-key-secret">Key Secret</Label>
              <Input
                id="razorpay-key-secret"
                type="password"
                placeholder="••••••••••••••••"
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
              />
            </div>
          </>
        )}
        <Button onClick={handleSave} disabled={loading || isSaving}>
          {isSaving ? 'Saving...' : 'Save Credentials'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RazorpaySettingsPage;