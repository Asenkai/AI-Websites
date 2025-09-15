import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ContentItem {
  id: string;
  page_slug: string;
  element_id: string;
  content_data: { text?: string; url?: string; alt?: string };
}

const AdminPanel = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('element_id');

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

  const handleContentChange = (id: string, newText: string) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.id === id ? { ...item, content_data: { ...item.content_data, text: newText } } : item
      )
    );
  };

  const handleSave = async (item: ContentItem) => {
    const { error } = await supabase
      .from('page_content')
      .update({ content_data: item.content_data, updated_at: new Date().toISOString() })
      .eq('id', item.id);

    if (error) {
      toast.error(`Failed to save ${item.element_id}.`);
      console.error('Error saving content:', error);
    } else {
      toast.success(`${item.element_id} saved successfully!`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="p-8">Loading content editor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-teal font-serif">Admin Panel</h1>
          <div>
            <Button variant="outline" onClick={() => navigate('/')} className="mr-4">View Site</Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Homepage Content</h2>
          <div className="space-y-6">
            {content.filter(c => c.page_slug === 'home').map(item => (
              <div key={item.id} className="space-y-2">
                <Label htmlFor={item.id} className="capitalize font-medium">{item.element_id.replace(/_/g, ' ')}</Label>
                <div className="flex items-center gap-4">
                  <Textarea
                    id={item.id}
                    value={item.content_data.text || ''}
                    onChange={(e) => handleContentChange(item.id, e.target.value)}
                    className="flex-grow"
                    rows={3}
                  />
                  <Button onClick={() => handleSave(item)}>Save</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;