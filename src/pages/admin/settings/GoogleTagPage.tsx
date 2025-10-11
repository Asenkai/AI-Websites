import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const GTM_KEY = 'gtm_id';

const GoogleTagPage = () => {
  const [gtmId, setGtmId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchGtmId = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', GTM_KEY)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: 'single' row not found
        console.error('Error fetching GTM ID:', error);
        toast.error('Failed to load Google Tag Manager ID.');
      } else if (data) {
        setGtmId(data.value || '');
      }
      setLoading(false);
    };

    fetchGtmId();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: GTM_KEY, value: gtmId });

    if (error) {
      toast.error('Failed to save GTM ID.');
      console.error('Error saving GTM ID:', error);
    } else {
      toast.success('Google Tag Manager ID saved successfully!');
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary-teal">Google Tag Manager</CardTitle>
        <CardDescription>
          Enter your Google Tag Manager (GTM) Container ID here. This will inject the necessary tracking scripts across the entire site.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="gtm-id">GTM Container ID</Label>
            <Input
              id="gtm-id"
              placeholder="GTM-XXXXXXX"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
            />
          </div>
        )}
        <Button onClick={handleSave} disabled={loading || isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoogleTagPage;