import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const META_PIXEL_KEY = 'meta_pixel_id';

const MetaPixelPage = () => {
  const [pixelId, setPixelId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPixelId = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', META_PIXEL_KEY)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: 'single' row not found
        console.error('Error fetching Meta Pixel ID:', error);
        toast.error('Failed to load Meta Pixel ID.');
      } else if (data) {
        setPixelId(data.value || '');
      }
      setLoading(false);
    };

    fetchPixelId();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: META_PIXEL_KEY, value: pixelId });

    if (error) {
      toast.error('Failed to save Meta Pixel ID.');
      console.error('Error saving Meta Pixel ID:', error);
    } else {
      toast.success('Meta Pixel ID saved successfully!');
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary-teal">Meta (Facebook) Pixel</CardTitle>
        <CardDescription>
          Enter your Meta Pixel ID here. This will add the Facebook tracking pixel to your site for analytics and ad campaign tracking.
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
            <Label htmlFor="meta-pixel-id">Meta Pixel ID</Label>
            <Input
              id="meta-pixel-id"
              placeholder="Enter your Pixel ID"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
            />
          </div>
        )}
        <Button onClick={handleSave} disabled={loading || isSaving}>
          {isSaving ? 'Saving...' : 'Save ID'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MetaPixelPage;