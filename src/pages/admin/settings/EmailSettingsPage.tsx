import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const EMAIL_API_KEY = 'email_service_api_key';
const EMAIL_SENDER_ADDRESS = 'email_sender_address';

const EmailSettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchEmailSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [EMAIL_API_KEY, EMAIL_SENDER_ADDRESS]);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching email settings:', error);
        toast.error('Failed to load email settings.');
      } else if (data) {
        const settings = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        setApiKey(settings[EMAIL_API_KEY] || '');
        setSenderAddress(settings[EMAIL_SENDER_ADDRESS] || '');
      }
      setLoading(false);
    };

    fetchEmailSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert([
        { key: EMAIL_API_KEY, value: apiKey },
        { key: EMAIL_SENDER_ADDRESS, value: senderAddress },
      ], { onConflict: 'key' });

    if (error) {
      toast.error('Failed to save email settings.');
      console.error('Error saving email settings:', error);
    } else {
      toast.success('Email settings saved successfully!');
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary-teal">Email Service Integration</CardTitle>
        <CardDescription>
          Configure your email sending service (e.g., SendGrid, Mailgun, Resend) API key and sender address.
          This will be used to send emails to donors.
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
              <Label htmlFor="email-api-key">Email Service API Key</Label>
              <Input
                id="email-api-key"
                type="password"
                placeholder="SG.xxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-sender-address">Sender Email Address</Label>
              <Input
                id="email-sender-address"
                type="email"
                placeholder="noreply@yourdomain.com"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
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

export default EmailSettingsPage;