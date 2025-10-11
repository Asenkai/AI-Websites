import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Donor } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';
import { DonorDialog, DonorFormValues } from '@/components/admin/DonorDialog';

const DonorManagementPage = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      setIsDialogOpen(false);
      fetchDonors();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="capitalize text-primary-teal">Donor & Lead Management</CardTitle>
          <Button onClick={handleAddNew} size="sm">
            <PlusCircle size={16} className="mr-2" /> Add New Donor
          </Button>
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