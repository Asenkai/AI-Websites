import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  page_slug: string;
  element_id: string;
  content_data: { text?: string; url?: string; alt?: string; link?: string; variant?: string; presets?: Array<{ amount: number; description: string }> };
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  order: number;
  is_external: boolean;
  parent_id: string | null;
}

interface CauseData {
  id: string;
  title: string;
  hero_image_url: string;
  problem_statement: string;
  solution_description: string;
  impact_description: string;
  unit_costs: Array<{ amount: string; description: string }>;
  gallery_images: Array<{ src: string; alt: string }>;
  video_url: string;
  donate_button: { text: string; link: string };
  ketto_button: { text: string; link: string };
  giveindia_button: { text: string; link: string };
  volunteer_button: { text: string; link: string };
  order: number;
}

const AdminPanel = () => {
  const [pageContent, setPageContent] = useState<ContentItem[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [causes, setCauses] = useState<CauseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: contentData, error: contentError } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug, element_id');

      if (contentError) {
        console.error('Error fetching page content:', contentError);
        toast.error('Failed to load page content.');
      } else {
        setPageContent(contentData as ContentItem[]);
      }

      const { data: navData, error: navError } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order', { ascending: true });

      if (navError) {
        console.error('Error fetching navigation items:', navError);
        toast.error('Failed to load navigation items.');
      } else {
        setNavItems(navData || []);
      }

      const { data: causesData, error: causesError } = await supabase
        .from('causes')
        .select('*')
        .order('order', { ascending: true });

      if (causesError) {
        console.error('Error fetching causes:', causesError);
        toast.error('Failed to load causes.');
      } else {
        setCauses(causesData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleContentChange = (id: string, field: 'text' | 'url' | 'alt' | 'link' | 'variant' | 'presets', value: any) => {
    setPageContent(prevContent =>
      prevContent.map(item =>
        item.id === id ? { ...item, content_data: { ...item.content_data, [field]: value } } : item
      )
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, item: ContentItem | CauseData, field: 'url' | 'hero_image_url' | 'src', index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const itemId = 'page_slug' in item ? item.id : item.id + (index !== undefined ? `-gallery-${index}` : '');
    setUploading(itemId);
    const fileExt = file.name.split('.').pop();
    const filePath = `public/${'page_slug' in item ? item.page_slug : 'causes'}/${'element_id' in item ? item.element_id : item.id}${index !== undefined ? `-gallery-${index}` : ''}-${Date.now()}.${fileExt}`;

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

    if ('page_slug' in item) { // It's a ContentItem
      const updatedItem = {
        ...item,
        content_data: { ...item.content_data, [field]: publicUrl },
      };
      await handleSaveContent(updatedItem as ContentItem, `File for ${item.element_id.replace(/_/g, ' ')} uploaded and saved.`);
    } else { // It's a CauseData
      if (field === 'src' && index !== undefined) {
        const updatedGalleryImages = [...(item.gallery_images || [])];
        updatedGalleryImages[index] = { ...updatedGalleryImages[index], src: publicUrl };
        const updatedItem = { ...item, gallery_images: updatedGalleryImages };
        await handleSaveCause(updatedItem as CauseData, `Gallery image for ${item.title} uploaded and saved.`);
      } else {
        const updatedItem = {
          ...item,
          [field]: publicUrl,
        };
        await handleSaveCause(updatedItem as CauseData, `Image for ${item.title} uploaded and saved.`);
      }
    }
    
    // Refresh data from DB to get the latest state
    const { data: contentData } = await supabase.from('page_content').select('*').order('page_slug, element_id');
    if (contentData) setPageContent(contentData as ContentItem[]);
    const { data: causesData } = await supabase.from('causes').select('*').order('order', { ascending: true });
    if (causesData) setCauses(causesData as CauseData[]);

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

  const handleNavItemChange = (id: string, field: keyof NavItem, value: any) => {
    setNavItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveNavItem = async (item: NavItem) => {
    const { error } = await supabase
      .from('navigation_items')
      .update(item)
      .eq('id', item.id);

    if (error) {
      toast.error(`Failed to save navigation item: ${item.label}.`);
      console.error('Error saving navigation item:', error);
    } else {
      toast.success(`${item.label} navigation item saved successfully!`);
    }
  };

  const handleAddNavItem = async () => {
    const newNavItem: Omit<NavItem, 'id' | 'created_at' | 'updated_at'> = {
      label: 'New Item',
      path: '/',
      order: navItems.length > 0 ? Math.max(...navItems.map(item => item.order)) + 1 : 0,
      is_external: false,
      parent_id: null,
    };
    const { data, error } = await supabase
      .from('navigation_items')
      .insert(newNavItem)
      .select()
      .single();

    if (error) {
      toast.error('Failed to add new navigation item.');
      console.error('Error adding navigation item:', error);
    } else if (data) {
      setNavItems(prevItems => [...prevItems, data]);
      toast.success('New navigation item added!');
    }
  };

  const handleDeleteNavItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this navigation item?')) return;

    const { error } = await supabase
      .from('navigation_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete navigation item.');
      console.error('Error deleting navigation item:', error);
    } else {
      setNavItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success('Navigation item deleted!');
    }
  };

  const handleCauseChange = (id: string, field: keyof CauseData, value: any) => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === id ? { ...cause, [field]: value } : cause
      )
    );
  };

  const handleSaveCause = async (cause: CauseData, successMessage?: string) => {
    const { error } = await supabase
      .from('causes')
      .update(cause)
      .eq('id', cause.id);

    if (error) {
      toast.error(`Failed to save cause: ${cause.title}.`);
      console.error('Error saving cause:', error);
    } else {
      toast.success(successMessage || `${cause.title} cause saved successfully!`);
    }
  };

  const handleAddCause = async () => {
    const newCause: Omit<CauseData, 'created_at' | 'updated_at'> = {
      id: `new-cause-${Date.now()}`, // Unique ID for the slug
      title: 'New Cause',
      hero_image_url: '/placeholder.svg',
      problem_statement: 'Problem statement...',
      solution_description: 'Solution description...',
      impact_description: 'Impact description...',
      unit_costs: [],
      gallery_images: [],
      video_url: '',
      donate_button: { text: 'Donate Now', link: '/donate' },
      ketto_button: { text: 'Ketto', link: 'https://www.ketto.org' },
      giveindia_button: { text: 'GiveIndia', link: 'https://www.giveindia.org' },
      volunteer_button: { text: 'Volunteer', link: '/volunteer' },
      order: causes.length > 0 ? Math.max(...causes.map(c => c.order)) + 1 : 0,
    };
    const { data, error } = await supabase
      .from('causes')
      .insert(newCause)
      .select()
      .single();

    if (error) {
      toast.error('Failed to add new cause.');
      console.error('Error adding cause:', error);
    } else if (data) {
      setCauses(prevCauses => [...prevCauses, data]);
      toast.success('New cause added!');
    }
  };

  const handleDeleteCause = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this cause?')) return;

    const { error } = await supabase
      .from('causes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete cause.');
      console.error('Error deleting cause:', error);
    } else {
      setCauses(prevCauses => prevCauses.filter(cause => cause.id !== id));
      toast.success('Cause deleted!');
    }
  };

  const handleAddUnitCost = (causeId: string) => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === causeId
          ? { ...cause, unit_costs: [...(cause.unit_costs || []), { amount: '₹0', description: '' }] }
          : cause
      )
    );
  };

  const handleUpdateUnitCost = (causeId: string, index: number, field: 'amount' | 'description', value: string) => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === causeId
          ? {
              ...cause,
              unit_costs: cause.unit_costs?.map((uc, i) =>
                i === index ? { ...uc, [field]: value } : uc
              ),
            }
          : cause
      )
    );
  };

  const handleRemoveUnitCost = (causeId: string, index: number) => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === causeId
          ? { ...cause, unit_costs: cause.unit_costs?.filter((_, i) => i !== index) }
          : cause
      )
    );
  };

  const handleAddGalleryImage = (causeId: string) => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === causeId
          ? { ...cause, gallery_images: [...(cause.gallery_images || []), { src: '/placeholder.svg', alt: '' }] }
          : cause
      )
    );
  };

  const handleUpdateGalleryImage = (causeId: string, index: number, field: 'src' | 'alt', value: string) => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === causeId
          ? {
              ...cause,
              gallery_images: cause.gallery_images?.map((img, i) =>
                i === index ? { ...img, [field]: value } : img
              ),
            }
          : cause
      )
    );
  };

  const handleRemoveGalleryImage = (causeId: string, index: number) => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === causeId
          ? { ...cause, gallery_images: cause.gallery_images?.filter((_, i) => i !== index) }
          : cause
      )
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const renderContentItem = (item: ContentItem) => {
    const isFile = item.element_id.includes('_pdf') || item.element_id.includes('_image');
    const isButton = item.element_id.includes('_button');
    const isDonationPresets = item.element_id === 'donation_presets';
    const isVolunteerRoles = item.element_id === 'volunteer_roles';
    const isMapEmbed = item.element_id === 'map_embed_url';
    const isVideoUrl = item.element_id === 'video_url';

    return (
      <div key={item.id} className="space-y-2 p-4 border rounded-md bg-gray-50">
        <Label htmlFor={item.id} className="capitalize font-medium text-gray-800">{item.element_id.replace(/_/g, ' ')}</Label>
        <div className="flex flex-col gap-2">
          {item.content_data.text !== undefined && !isVolunteerRoles && (
            <Textarea
              id={item.id}
              value={item.content_data.text}
              onChange={(e) => handleContentChange(item.id, 'text', e.target.value)}
              rows={3}
            />
          )}
          {isVolunteerRoles && (
            <Textarea
              id={item.id}
              value={item.content_data.text || ''}
              onChange={(e) => handleContentChange(item.id, 'text', e.target.value)}
              placeholder="Enter each role on a new line"
              rows={5}
            />
          )}
          {isFile && (
            <div className="flex items-center gap-4">
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, item, 'url')}
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
          {(isButton || isMapEmbed || isVideoUrl) && (
            <Input
              placeholder={isButton ? "Button Link (e.g., /donate or https://external.com)" : isMapEmbed ? "Google Maps Embed URL" : "YouTube Video URL"}
              value={item.content_data.link || item.content_data.url || ''}
              onChange={(e) => handleContentChange(item.id, isButton ? 'link' : 'url', e.target.value)}
            />
          )}
          {isDonationPresets && (
            <div className="space-y-2">
              <Label>Donation Presets</Label>
              {(item.content_data.presets || []).map((preset, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={preset.amount}
                    onChange={(e) => {
                      const newPresets = [...(item.content_data.presets || [])];
                      newPresets[index].amount = parseInt(e.target.value) || 0;
                      handleContentChange(item.id, 'presets', newPresets);
                    }}
                    className="w-24"
                  />
                  <Input
                    placeholder="Description"
                    value={preset.description}
                    onChange={(e) => {
                      const newPresets = [...(item.content_data.presets || [])];
                      newPresets[index].description = e.target.value;
                      handleContentChange(item.id, 'presets', newPresets);
                    }}
                    className="flex-grow"
                  />
                  <Button variant="destructive" size="sm" onClick={() => {
                    const newPresets = (item.content_data.presets || []).filter((_, i) => i !== index);
                    handleContentChange(item.id, 'presets', newPresets);
                  }}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => {
                const newPresets = [...(item.content_data.presets || []), { amount: 0, description: '' }];
                handleContentChange(item.id, 'presets', newPresets);
              }}>
                <PlusCircle size={16} className="mr-2" /> Add Preset
              </Button>
            </div>
          )}
          <Button onClick={() => handleSaveContent(item)} className="self-end" size="sm">Save</Button>
        </div>
      </div>
    );
  };

  const groupedPageContent = pageContent.reduce((acc, item) => {
    const group = item.page_slug;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  if (loading) return <div className="p-8 text-center text-lg text-gray-700">Loading admin panel...</div>;

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
        {/* Navigation Items Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="capitalize text-primary-teal">Navigation Menu</CardTitle>
            <Button onClick={handleAddNavItem} size="sm">Add New Item</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {navItems.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-3 border rounded-md bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-grow w-full">
                  <div className="space-y-1">
                    <Label htmlFor={`nav-label-${item.id}`}>Label</Label>
                    <Input
                      id={`nav-label-${item.id}`}
                      value={item.label}
                      onChange={(e) => handleNavItemChange(item.id, 'label', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`nav-path-${item.id}`}>Path/URL</Label>
                    <Input
                      id={`nav-path-${item.id}`}
                      value={item.path}
                      onChange={(e) => handleNavItemChange(item.id, 'path', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`nav-order-${item.id}`}>Order</Label>
                    <Input
                      id={`nav-order-${item.id}`}
                      type="number"
                      value={item.order}
                      onChange={(e) => handleNavItemChange(item.id, 'order', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6 md:mt-0">
                    <Switch
                      id={`nav-external-${item.id}`}
                      checked={item.is_external}
                      onCheckedChange={(checked) => handleNavItemChange(item.id, 'is_external', checked)}
                    />
                    <Label htmlFor={`nav-external-${item.id}`}>External Link</Label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
                  <Button onClick={() => handleSaveNavItem(item)} size="sm">Save</Button>
                  <Button variant="destructive" onClick={() => handleDeleteNavItem(item.id)} size="sm">Delete</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Causes Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="capitalize text-primary-teal">Causes</CardTitle>
            <Button onClick={handleAddCause} size="sm">Add New Cause</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {causes.map((cause) => (
              <div key={cause.id} className="space-y-4 p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-lg text-gray-800">{cause.title}</h4>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveCause(cause)} size="sm">Save Cause</Button>
                    <Button variant="destructive" onClick={() => handleDeleteCause(cause.id)} size="sm">Delete Cause</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={`cause-id-${cause.id}`}>ID (Slug)</Label>
                    <Input id={`cause-id-${cause.id}`} value={cause.id} onChange={(e) => handleCauseChange(cause.id, 'id', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`cause-title-${cause.id}`}>Title</Label>
                    <Input id={`cause-title-${cause.id}`} value={cause.title} onChange={(e) => handleCauseChange(cause.id, 'title', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`cause-order-${cause.id}`}>Order</Label>
                    <Input id={`cause-order-${cause.id}`} type="number" value={cause.order} onChange={(e) => handleCauseChange(cause.id, 'order', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`cause-hero-image-${cause.id}`}>Hero Image URL</Label>
                    <div className="flex items-center gap-2">
                      <Input id={`cause-hero-image-${cause.id}`} value={cause.hero_image_url} onChange={(e) => handleCauseChange(cause.id, 'hero_image_url', e.target.value)} />
                      <Input type="file" onChange={(e) => handleFileChange(e, cause, 'hero_image_url')} disabled={uploading === cause.id} className="w-auto" />
                      {uploading === cause.id && <p className="text-sm text-gray-500">Uploading...</p>}
                    </div>
                    {cause.hero_image_url && <img src={cause.hero_image_url} alt="Hero Preview" className="w-24 h-auto rounded-md mt-2" />}
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor={`cause-problem-${cause.id}`}>Problem Statement</Label>
                    <Textarea id={`cause-problem-${cause.id}`} value={cause.problem_statement} onChange={(e) => handleCauseChange(cause.id, 'problem_statement', e.target.value)} rows={4} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor={`cause-solution-${cause.id}`}>Solution Description</Label>
                    <Textarea id={`cause-solution-${cause.id}`} value={cause.solution_description} onChange={(e) => handleCauseChange(cause.id, 'solution_description', e.target.value)} rows={4} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor={`cause-impact-${cause.id}`}>Impact Description</Label>
                    <Textarea id={`cause-impact-${cause.id}`} value={cause.impact_description} onChange={(e) => handleCauseChange(cause.id, 'impact_description', e.target.value)} rows={4} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label>Unit Costs</Label>
                    {(cause.unit_costs || []).map((uc, index) => (
                      <div key={index} className="flex gap-2 items-center mb-2">
                        <Input placeholder="Amount (e.g., ₹1,999)" value={uc.amount} onChange={(e) => handleUpdateUnitCost(cause.id, index, 'amount', e.target.value)} className="w-32" />
                        <Input placeholder="Description" value={uc.description} onChange={(e) => handleUpdateUnitCost(cause.id, index, 'description', e.target.value)} className="flex-grow" />
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveUnitCost(cause.id, index)}><Trash2 size={16} /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => handleAddUnitCost(cause.id)}><PlusCircle size={16} className="mr-2" /> Add Unit Cost</Button>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label>Gallery Images</Label>
                    {(cause.gallery_images || []).map((img, index) => (
                      <div key={index} className="flex gap-2 items-center mb-2">
                        <Input placeholder="Image URL" value={img.src} onChange={(e) => handleUpdateGalleryImage(cause.id, index, 'src', e.target.value)} />
                        <Input type="file" onChange={(e) => handleFileChange(e, cause, 'src', index)} disabled={uploading === `${cause.id}-gallery-${index}`} className="w-auto" />
                        {uploading === `${cause.id}-gallery-${index}` && <p className="text-sm text-gray-500">Uploading...</p>}
                        <Input placeholder="Alt Text" value={img.alt} onChange={(e) => handleUpdateGalleryImage(cause.id, index, 'alt', e.target.value)} />
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveGalleryImage(cause.id, index)}><Trash2 size={16} /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => handleAddGalleryImage(cause.id)}><PlusCircle size={16} className="mr-2" /> Add Gallery Image</Button>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor={`cause-video-${cause.id}`}>Video URL (YouTube Embed)</Label>
                    <Input id={`cause-video-${cause.id}`} value={cause.video_url} onChange={(e) => handleCauseChange(cause.id, 'video_url', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Donate Button</Label>
                    <Input placeholder="Text" value={cause.donate_button?.text || ''} onChange={(e) => handleCauseChange(cause.id, 'donate_button', { ...cause.donate_button, text: e.target.value })} />
                    <Input placeholder="Link" value={cause.donate_button?.link || ''} onChange={(e) => handleCauseChange(cause.id, 'donate_button', { ...cause.donate_button, link: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Ketto Button</Label>
                    <Input placeholder="Text" value={cause.ketto_button?.text || ''} onChange={(e) => handleCauseChange(cause.id, 'ketto_button', { ...cause.ketto_button, text: e.target.value })} />
                    <Input placeholder="Link" value={cause.ketto_button?.link || ''} onChange={(e) => handleCauseChange(cause.id, 'ketto_button', { ...cause.ketto_button, link: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>GiveIndia Button</Label>
                    <Input placeholder="Text" value={cause.giveindia_button?.text || ''} onChange={(e) => handleCauseChange(cause.id, 'giveindia_button', { ...cause.giveindia_button, text: e.target.value })} />
                    <Input placeholder="Link" value={cause.giveindia_button?.link || ''} onChange={(e) => handleCauseChange(cause.id, 'giveindia_button', { ...cause.giveindia_button, link: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Volunteer Button</Label>
                    <Input placeholder="Text" value={cause.volunteer_button?.text || ''} onChange={(e) => handleCauseChange(cause.id, 'volunteer_button', { ...cause.volunteer_button, text: e.target.value })} />
                    <Input placeholder="Link" value={cause.volunteer_button?.link || ''} onChange={(e) => handleCauseChange(cause.id, 'volunteer_button', { ...cause.volunteer_button, link: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Page Content Management */}
        {Object.entries(groupedPageContent).map(([pageSlug, items]) => (
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