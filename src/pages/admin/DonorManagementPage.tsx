import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { PlusCircle, Pencil, Trash2, Upload, Download } from 'lucide-react';
import { Donor } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';
import { DonorDialog, DonorFormValues } from '@/components/admin/DonorDialog';
import Papa from 'papaparse';

const DonorManagementPage = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDonors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donors:', error);
      toast.error('Failed to load donors.');
    } else {
      setDonors(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const trackEvent = async (eventName: string, values: DonorFormValues) => {
    try {
      const nameParts = values.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      await supabase.functions.invoke('track-event', {
        body: {
          eventName,
          userData: {
            email: values.email,
            phone: values.phone,
            firstName: firstName,
            lastName: lastName,
            value: values.amount_donated,
            currency: 'INR',
          },
        },
      });
    } catch (error) {
      console.error('Failed to track event:', error);
      // Don't show a toast for this, as it's a background task
    }
  };

  const handleAddNew = () => {
    setSelectedDonor(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (donor: Donor) => {
    setSelectedDonor(donor);
    setIsDialogOpen(true);
  };

  const handleDelete = async (donorId: string) => {
    if (!window.confirm('Are you sure you want to delete this donor? This action cannot be undone.')) return;

    const toastId = toast.loading('Deleting donor...');
    const { error } = await supabase.from('donors').delete().eq('id', donorId);
    toast.dismiss(toastId);

    if (error) {
      toast.error(`Failed to delete donor: ${error.message}`);
    } else {
      toast.success('Donor deleted successfully!');
      fetchDonors();
    }
  };

  const handleSave = async (values: DonorFormValues) => {
    setIsSaving(true);
    const toastId = toast.loading(selectedDonor ? 'Updating donor...' : 'Adding donor...');

    const donorData = {
      ...values,
      amount_donated: values.amount_donated || 0,
      email: values.email || null,
    };

    let error;
    if (selectedDonor) {
      const { error: updateError } = await supabase.from('donors').update(donorData).eq('id', selectedDonor.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('donors').insert(donorData);
      error = insertError;
    }

    toast.dismiss(toastId);
    setIsSaving(false);

    if (error) {
      toast.error(`Failed to save donor: ${error.message}`);
    } else {
      toast.success(`Donor ${selectedDonor ? 'updated' : 'added'} successfully!`);
      
      if (!selectedDonor) {
        trackEvent(values.status === 'Donated' ? 'Purchase' : 'Lead', values);
      } else if (selectedDonor.status !== 'Donated' && values.status === 'Donated') {
        trackEvent('Purchase', values);
      }

      setIsDialogOpen(false);
      fetchDonors();
    }
  };

  const handleTemplateDownload = () => {
    const csvTemplate = [
      ['name', 'email', 'phone', 'status', 'amount_donated', 'notes'],
      ['Jane Smith', 'jane.smith@example.com', '9876543210', 'Potential', '5000', 'Met at fundraising event.'],
    ];
    const csvContent = csvTemplate.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'donors_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadToast = toast.loading('Parsing CSV file...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        toast.dismiss(uploadToast);
        const parsedData = results.data as any[];
        
        if (results.errors.length > 0) {
          toast.error(`Error parsing CSV: ${results.errors[0].message}`);
          setIsUploading(false);
          return;
        }

        const requiredFields = ['name', 'status'];
        const isValid = parsedData.every(row => requiredFields.every(field => row[field]));

        if (!isValid) {
          toast.error('CSV is missing required fields. Please ensure "name" and "status" columns are present for all rows.');
          setIsUploading(false);
          return;
        }

        const donorsToInsert = parsedData.map(row => ({
          name: row.name,
          email: row.email || null,
          phone: row.phone || null,
          status: row.status || 'Potential',
          amount_donated: row.amount_donated ? Number(row.amount_donated) : 0,
          notes: row.notes || null,
        }));

        const insertToast = toast.loading(`Inserting ${donorsToInsert.length} donors...`);
        const { error } = await supabase.from('donors').insert(donorsToInsert);
        toast.dismiss(insertToast);

        if (error) {
          toast.error(`Failed to import donors: ${error.message}`);
        } else {
          toast.success(`${donorsToInsert.length} donors imported successfully!`);
          fetchDonors();
        }
        setIsUploading(false);
      },
      error: (error) => {
        toast.dismiss(uploadToast);
        toast.error(`Failed to parse CSV: ${error.message}`);
        setIsUploading(false);
      }
    });

    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="capitalize text-primary-teal">Donor & Lead Management</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <Button onClick={handleTemplateDownload} size="sm" variant="outline">
              <Download size={16} className="mr-2" /> Download Template
            </Button>
            <Button onClick={handleImportClick} size="sm" variant="outline" disabled={isUploading}>
              {isUploading ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Import from CSV</>}
            </Button>
            <Button onClick={handleAddNew} size="sm">
              <PlusCircle size={16} className="mr-2" /> Add New Donor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount Donated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : donors.length > 0 ? (
                  donors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">{donor.name}</TableCell>
                      <TableCell>{donor.email}</TableCell>
                      <TableCell>{donor.status}</TableCell>
                      <TableCell>₹{donor.amount_donated?.toLocaleString('en-IN') || '0.00'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(donor)}>
                            <Pencil size={16} />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(donor.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No donors found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <DonorDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        donor={selectedDonor}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </>
  );
};

export default DonorManagementPage;