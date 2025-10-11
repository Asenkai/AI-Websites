import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const WHATSAPP_PHONE_ID_KEY = 'whatsapp_phone_id';
const WHATSAPP_ACCESS_TOKEN_KEY = 'whatsapp_access_token';

const WhatsAppSettingsPage = () => {
  const [phoneId, setPhoneId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchWhatsAppSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [WHATSAPP_PHONE_ID_KEY, WHATSAPP_ACCESS_TOKEN_KEY]);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching WhatsApp settings:', error);
        toast.error('Failed to load WhatsApp settings.');
      } else if (data) {
        const settings = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        setPhoneId(settings[WHATSAPP_PHONE_ID_KEY] || '');
        setAccessToken(settings[WHATSAPP_ACCESS_TOKEN_KEY] || '');
      }
      setLoading(false);
    };

    fetchWhatsAppSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert([
        { key: WHATSAPP_PHONE_ID_KEY, value: phoneId },
        { key: WHATSAPP_ACCESS_TOKEN_KEY, value: accessToken },
      ], { onConflict: 'key' });

    if (error) {
      toast.error('Failed to save WhatsApp settings.');
      console.error('Error saving WhatsApp settings:', error);
    } else {
      toast.success('WhatsApp settings saved successfully!');
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary-teal">WhatsApp Business API Integration</CardTitle>
        <CardDescription>
          Configure your Meta (Facebook) WhatsApp Business API credentials here. These are required to send messages to donors.
          You can find these in your Facebook Developer account under your WhatsApp Business App.
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
              <Label htmlFor="whatsapp-phone-id">WhatsApp Business Phone Number ID</Label>
              <Input
                id="whatsapp-phone-id"
                placeholder="e.g., 100000000000000"
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-access-token">WhatsApp Business API Access Token</Label>
              <Input
                id="whatsapp-access-token"
                type="password"
                placeholder="EAAG..."
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
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

export default WhatsAppSettingsPage;