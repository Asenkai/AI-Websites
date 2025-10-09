import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { CauseData } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';

const CausesPage = () => {
  const [causes, setCauses] = useState<CauseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const fetchCauses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('causes')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching causes:', error);
        toast.error('Failed to load causes.');
      } else {
        setCauses(data || []);
      }
      setLoading(false);
    };

    fetchCauses();
  }, []);

  const handleCauseChange = (id: string, field: keyof CauseData, value: any) => {
    setCauses(prevCauses =>
      prevCauses.map(cause =>
        cause.id === id ? { ...cause, [field]: value } : cause
      )
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, cause: CauseData, field: 'hero_image_url' | 'src', index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadId = cause.id + (index !== undefined ? `-gallery-${index}` : '');
    setUploading(uploadId);
    const fileExt = file.name.split('.').pop();
    const filePath = `public/causes/${cause.id}/${field}${index !== undefined ? `-${index}` : ''}-${Date.now()}.${fileExt}`;

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

    if (field === 'src' && index !== undefined) {
      const updatedGalleryImages = [...(cause.gallery_images || [])];
      updatedGalleryImages[index] = { ...updatedGalleryImages[index], src: publicUrl };
      const updatedCause = { ...cause, gallery_images: updatedGalleryImages };
      await handleSaveCause(updatedCause as CauseData, `Gallery image for ${cause.title} uploaded and saved.`);
    } else {
      const updatedCause = {
        ...cause,
        [field]: publicUrl,
      };
      await handleSaveCause(updatedCause as CauseData, `Image for ${cause.title} uploaded and saved.`);
    }
    
    // Refresh data from DB to get the latest state
    const { data: causesData } = await supabase.from('causes').select('*').order('order', { ascending: true });
    if (causesData) setCauses(causesData || []);

    setUploading(null);
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
              unit_costs: cause.unit_costs?.map((uc: { amount: string; description: string }, i: number) =>
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
          ? { ...cause, unit_costs: cause.unit_costs?.filter((_uc: { amount: string; description: string }, i: number) => i !== index) }
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
              gallery_images: cause.gallery_images?.map((img: { src: string; alt: string }, i: number) =>
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
          ? { ...cause, gallery_images: cause.gallery_images?.filter((_img: { src: string; alt: string }, i: number) => i !== index) }
          : cause
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="capitalize text-primary-teal">Causes</CardTitle>
        <Button onClick={handleAddCause} size="sm">
          <PlusCircle size={16} className="mr-2" /> Add New Cause
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {causes.map((cause) => (
          <div key={cause.id} className="space-y-4 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg text-gray-800">{cause.title}</h4>
              <div className="flex gap-2">
                <Button onClick={() => handleSaveCause(cause)} size="sm">Save Cause</Button>
                <Button variant="destructive" onClick={() => handleDeleteCause(cause.id)} size="sm">
                  <Trash2 size={16} />
                </Button>
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
                {(cause.unit_costs || []).map((uc: { amount: string; description: string }, index: number) => (
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
                {(cause.gallery_images || []).map((img: { src: string; alt: string }, index: number) => (
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
  );
};

export default CausesPage;