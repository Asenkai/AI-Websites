import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentItem {
  id: string;
  page_slug: string;
  element_id: string;
  content_data: { text?: string; url?: string; alt?: string };
}

const AdminPanel = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug, element_id');

      if (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content.');
      } else {
        setContent(data as ContentItem[]);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const handleContentChange = (id: string, field: 'text' | 'alt', value: string) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.id === id ? { ...item, content_data: { ...item.content_data, [field]: value } } : item
      )
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, item: ContentItem) => {
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
      content_data: { ...item.content_data, url: publicUrl },
    };

    await handleSave(updatedItem, `File for ${item.element_id.replace(/_/g, ' ')} uploaded and saved.`);
    
    // Refresh content from DB to get the latest state
    const { data } = await supabase.from('page_content').select('*').order('page_slug, element_id');
    if (data) setContent(data as ContentItem[]);

    setUploading(null);
  };

  const handleSave = async (item: ContentItem, successMessage?: string) => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const renderContentItem = (item: ContentItem) => {
    const isFile = item.element_id.includes('_pdf') || item.element_id.includes('_image');
    
    return (
      <div key={item.id} className="space-y-2 p-4 border rounded-md">
        <Label htmlFor={item.id} className="capitalize font-medium text-gray-800">{item.element_id.replace(/_/g, ' ')}</Label>
        <div className="flex flex-col gap-2">
          {item.content_data.text !== undefined && (
            <Textarea
              id={item.id}
              value={item.content_data.text}
              onChange={(e) => handleContentChange(item.id, 'text', e.target.value)}
              rows={3}
            />
          )}
          {isFile && (
            <div className="flex items-center gap-4">
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, item)}
                disabled={uploading === item.id}
              />
              {uploading === item.id && <p className="text-sm text-gray-500">Uploading...</p>}
              {item.content_data.url && (
                <a href={item.content_data.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline whitespace-nowrap">
                  View Current
                </a>
              )}
            </div>
          )}
          {item.element_id.includes('_image') && (
             <Input
                placeholder="Image Alt Text"
                value={item.content_data.alt || ''}
                onChange={(e) => handleContentChange(item.id, 'alt', e.target.value)}
              />
          )}
          <Button onClick={() => handleSave(item)} className="self-end" size="sm">Save</Button>
        </div>
      </div>
    );
  };

  const groupedContent = content.reduce((acc, item) => {
    const group = item.page_slug;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  if (loading) return <div className="p-8">Loading content editor...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-teal font-serif">Admin Panel</h1>
          <div>
            <Button variant="outline" onClick={() => navigate('/')} className="mr-4">View Site</Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {Object.entries(groupedContent).map(([pageSlug, items]) => (
          <Card key={pageSlug}>
            <CardHeader>
              <CardTitle className="capitalize text-primary-teal">{pageSlug.replace(/_/g, ' ')} Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map(renderContentItem)}
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default AdminPanel;