import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Papa from 'papaparse';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { PlusCircle, Upload, Download, Edit, Trash2 } from 'lucide-react';

// Define the donor type based on the database schema
interface Donor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: 'Potential' | 'Contacted' | 'Engaged' | 'Donated' | 'Inactive';
  amount_donated: number | null;
  notes: string | null;
  created_at: string;
}

// Zod schema for form validation
const donorFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['Potential', 'Contacted', 'Engaged', 'Donated', 'Inactive']),
  amount_donated: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().min(0).nullable()
  ),
  notes: z.string().optional(),
});

type DonorFormValues = z.infer<typeof donorFormSchema>;

const DonorManagementPage = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);

  const form = useForm<DonorFormValues>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'Potential',
      amount_donated: 0,
      notes: '',
    },
  });

  const fetchDonors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch donors.');
      console.error('Error fetching donors:', error);
    } else {
      setDonors(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const openEditDialog = (donor: Donor) => {
    setEditingDonor(donor);
    form.reset({
      id: donor.id,
      name: donor.name,
      email: donor.email || '',
      phone: donor.phone || '',
      status: donor.status,
      amount_donated: donor.amount_donated || 0,
      notes: donor.notes || '',
    });
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingDonor(null);
    form.reset({
      name: '',
      email: '',
      phone: '',
      status: 'Potential',
      amount_donated: 0,
      notes: '',
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: DonorFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading(editingDonor ? 'Updating donor...' : 'Adding new donor...');

    const donorData = {
      name: values.name,
      email: values.email || null,
      phone: values.phone || null,
      status: values.status,
      amount_donated: values.amount_donated,
      notes: values.notes || null,
    };

    let error;
    if (editingDonor) {
      ({ error } = await supabase.from('donors').update(donorData).eq('id', editingDonor.id));
    } else {
      ({ error } = await supabase.from('donors').insert(donorData));
    }

    if (error) {
      toast.error(`Failed to ${editingDonor ? 'update' : 'add'} donor.`, { id: toastId });
      console.error('Error submitting donor:', error);
    } else {
      toast.success(`Donor ${editingDonor ? 'updated' : 'added'} successfully!`, { id: toastId });
      setDialogOpen(false);
      fetchDonors(); // Refresh the list
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (donorId: string) => {
    if (!window.confirm('Are you sure you want to delete this donor?')) return;

    const toastId = toast.loading('Deleting donor...');
    const { error } = await supabase.from('donors').delete().eq('id', donorId);

    if (error) {
      toast.error('Failed to delete donor.', { id: toastId });
      console.error('Error deleting donor:', error);
    } else {
      toast.success('Donor deleted successfully.', { id: toastId });
      fetchDonors(); // Refresh the list
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('No file selected.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Uploading and processing CSV...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const requiredHeaders = ['name', 'status'];
        const headers = results.meta.fields || [];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
          toast.error(`CSV is missing required headers: ${missingHeaders.join(', ')}`, { id: toastId });
          setIsUploading(false);
          return;
        }

        const donorsToInsert = (results.data as any[])
          .map(row => ({
            name: row.name,
            email: row.email || null,
            phone: row.phone || null,
            status: row.status || 'Potential',
            amount_donated: row.amount_donated ? Number(row.amount_donated) : 0,
            notes: row.notes || null,
          }))
          .filter(donor => donor.name); // Ensure name is present

        if (donorsToInsert.length === 0) {
          toast.warning('No valid donor data found in the CSV.', { id: toastId });
          setIsUploading(false);
          return;
        }

        const { error } = await supabase.from('donors').insert(donorsToInsert);

        if (error) {
          toast.error('Failed to import donors from CSV.', { id: toastId, description: error.message });
          console.error('CSV import error:', error);
        } else {
          toast.success(`${donorsToInsert.length} donors imported successfully!`, { id: toastId });
          fetchDonors();
        }
        setIsUploading(false);
      },
      error: (error) => {
        toast.error('Failed to parse CSV file.', { id: toastId, description: error.message });
        setIsUploading(false);
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary-teal">Bulk Upload Donors</CardTitle>
          <CardDescription>
            Upload a CSV file to add multiple donors at once. The CSV must contain 'name' and 'status' columns.
            Allowed statuses are: Potential, Contacted, Engaged, Donated, Inactive.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <a href="/donor_template.csv" download>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </a>
          <div className="flex items-center gap-2">
            <Label htmlFor="csv-upload" className="cursor-pointer">
              <Button asChild variant="outline">
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </span>
              </Button>
            </Label>
            <Input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            {isUploading && <p className="text-sm text-gray-500">Processing...</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-primary-teal">Manage Donors</CardTitle>
            <CardDescription>Add, edit, or delete donor records.</CardDescription>
          </div>
          <Button onClick={openNewDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Donor
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount Donated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell className="text-right">
                        {donor.amount_donated?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '₹0.00'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(donor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(donor.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDonor ? 'Edit Donor' : 'Add New Donor'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Potential">Potential</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Engaged">Engaged</SelectItem>
                      <SelectItem value="Donated">Donated</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="amount_donated" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Donated (INR)</FormLabel>
                  <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonorManagementPage;