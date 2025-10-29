import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ContentItem } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';

interface PageContentEditorProps {
  pageSlug: string;
  title: string;
}

const PageContentEditor = ({ pageSlug, title }: PageContentEditorProps) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('element_id');

      if (error) {
        console.error(`Error fetching ${pageSlug} content:`, error);
        toast.error(`Failed to load ${title} content.`);
      } else {
        setContentItems(data || []);
      }
      setLoading(false);
    };

    fetchContent();
  }, [pageSlug, title]);

  const handleContentChange = (id: string, field: 'text' | 'url' | 'alt' | 'link' | 'variant' | 'presets', value: any) => {
    setContentItems(prevContent =>
      prevContent.map(item =>
        item.id === id ? { ...item, content_data: { ...item.content_data, [field]: value } } : item
      )
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, item: ContentItem, field: 'url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(item.id);
    const fileExt = file.name.split('.').pop();
    const filePath = `public/${item.page_slug}/${item.element_id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('site_assets')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(`Failed to upload ${file.name}.`);
      console.error('Upload error:', uploadError);
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site_assets')
      .getPublicUrl(filePath);

    const updatedItem = {
      ...item,
      content_data: { ...item.content_data, [field]: publicUrl },
    };
    await handleSaveContent(updatedItem as ContentItem, `File for ${item.element_id.replace(/_/g, ' ')} uploaded and saved.`);
    
    // Refresh data from DB to get the latest state
    const { data: contentData } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('element_id');
    if (contentData) setContentItems(contentData as ContentItem[]);

    setUploading(null);
  };

  const handleSaveContent = async (item: ContentItem, successMessage?: string) => {
    const { error } = await supabase
      .from('page_content')
      .update({ content_data: item.content_data, updated_at: new Date().toISOString() })
      .eq('id', item.id);

    if (error) {
      toast.error(`Failed to save ${item.element_id}.`);
      console.error('Error saving content:', error);
    } else {
      toast.success(successMessage || `${item.element_id.replace(/_/g, ' ')} saved successfully!`);
    }
  };

  const handleAddPreset = (itemId: string) => {
    setContentItems(prevContent =>
      prevContent.map(item =>
        item.id === itemId
          ? { ...item, content_data: { ...item.content_data, presets: [...(item.content_data.presets || []), { amount: 0, description: '' }] } }
          : item
      )
    );
  };

  const handleUpdatePreset = (itemId: string, presetIndex: number, field: 'amount' | 'description', value: any) => {
    setContentItems(prevContent =>
      prevContent.map(item =>
        item.id === itemId
          ? {
              ...item,
              content_data: {
                ...item.content_data,
                presets: item.content_data.presets?.map((preset: { amount: number; description: string }, i: number) =>
                  i === presetIndex ? { ...preset, [field]: value } : preset
                ),
              },
            }
          : item
      )
    );
  };

  const handleRemovePreset = (itemId: string, presetIndex: number) => {
    setContentItems(prevContent =>
      prevContent.map(item =>
        item.id === itemId
          ? { ...item, content_data: { ...item.content_data, presets: item.content_data.presets?.filter((_preset: { amount: number; description: string }, i: number) => i !== presetIndex) } }
          : item
      )
    );
  };

  const renderContentItem = (item: ContentItem) => {
    const isImage = item.element_id.includes('_image');
    const isPdf = item.element_id.includes('_pdf') || 
                  item.element_id === 'csr_dossier_button' || 
                  item.element_id === 'certificates_button' || 
                  item.element_id === 'annual_report_button';
    const isButton = item.element_id.includes('_button');
    const isDonationPresets = item.element_id === 'donation_presets';
    const isVolunteerRoles = item.element_id === 'volunteer_roles';
    const isMapEmbed = item.element_id === 'map_embed_url'; // This is the key
    const isVideoUrl = item.element_id === 'video_url';
    const isRazorpayDirectButtonId = item.element_id === 'razorpay_direct_button_id';

    return (
      <div key={item.id} className="space-y-2 p-4 border rounded-md bg-gray-50">
        <Label htmlFor={item.id} className="capitalize font-medium text-gray-800">{item.element_id.replace(/_/g, ' ')}</Label>
        <div className="flex flex-col gap-2">
          {/* Textarea for general text content, excluding specific types */}
          {item.content_data.text !== undefined && !isVolunteerRoles && !isPdf && !isRazorpayDirectButtonId && !isMapEmbed && !isButton && (
            <Textarea
              id={item.id}
              value={item.content_data.text}
              onChange={(e) => handleContentChange(item.id, 'text', e.target.value)}
              rows={3}
            />
          )}
          {/* Specific Textarea for Volunteer Roles */}
          {isVolunteerRoles && (
            <Textarea
              id={item.id}
              value={item.content_data.text || ''}
              onChange={(e) => handleContentChange(item.id, 'text', e.target.value)}
              placeholder="Enter each role on a new line"
              rows={5}
            />
          )}
          {/* Input for Razorpay Direct Button ID */}
          {isRazorpayDirectButtonId && (
            <Input
              id={item.id}
              value={item.content_data.text || ''}
              onChange={(e) => handleContentChange(item.id, 'text', e.target.value)}
              placeholder="Enter Razorpay Payment Button ID (e.g., pl_RYntgiwyug2I3D)"
            />
          )}
          {/* File input for Images and PDFs */}
          {(isImage || isPdf) && (
            <div className="flex items-center gap-4">
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, item, 'url')}
                disabled={uploading === item.id}
                accept={isPdf ? ".pdf" : "image/*"}
              />
              {uploading === item.id && <p className="text-sm text-gray-500">Uploading...</p>}
              {item.content_data.url && (
                <a href={item.content_data.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline whitespace-nowrap">
                  View Current {isPdf ? 'PDF' : 'Image'}
                </a>
              )}
            </div>
          )}
          {/* Input for Image Alt Text */}
          {isImage && (
             <Input
                placeholder="Image Alt Text"
                value={item.content_data.alt || ''}
                onChange={(e) => handleContentChange(item.id, 'alt', e.target.value)}
              />
          )}
          {/* Inputs for Button Text and Link */}
          {isButton && (
            <>
              <Input
                placeholder="Button Text"
                value={item.content_data.text || ''}
                onChange={(e) => handleContentChange(item.id, 'text', e.target.value)}
              />
              <Input
                placeholder="Button Link (e.g., /donate or https://external.com)"
                value={item.content_data.link || ''}
                onChange={(e) => handleContentChange(item.id, 'link', e.target.value)}
              />
            </>
          )}
          {/* Textarea for Map Embed HTML */}
          {isMapEmbed && (
            <Textarea
              placeholder="Google Maps Embed HTML (iframe code)"
              value={item.content_data.text || ''} // Use text for HTML
              onChange={(e) => handleContentChange(item.id, 'text', e.target.value)} // Save to text
              rows={6}
            />
          )}
          {/* Input for Video URL */}
          {isVideoUrl && (
            <Input
              placeholder="YouTube Video URL"
              value={item.content_data.url || ''}
              onChange={(e) => handleContentChange(item.id, 'url', e.target.value)}
            />
          )}
          {/* Donation Presets editor */}
          {isDonationPresets && (
            <div className="space-y-2">
              <Label>Donation Presets</Label>
              {(item.content_data.presets || []).map((preset: { amount: number; description: string }, index: number) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={preset.amount}
                    onChange={(e) => handleUpdatePreset(item.id, index, 'amount', parseInt(e.target.value) || 0)}
                    className="w-24"
                  />
                  <Input
                    placeholder="Description"
                    value={preset.description}
                    onChange={(e) => handleUpdatePreset(item.id, index, 'description', e.target.value)}
                    className="flex-grow"
                  />
                  <Button variant="destructive" size="sm" onClick={() => handleRemovePreset(item.id, index)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => handleAddPreset(item.id)}>
                <PlusCircle size={16} className="mr-2" /> Add Preset
              </Button>
            </div>
          )}
          <Button onClick={() => handleSaveContent(item)} className="self-end" size="sm">Save</Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize text-primary-teal">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contentItems.map(renderContentItem)}
      </CardContent>
    </Card>
  );
};

export default PageContentEditor;