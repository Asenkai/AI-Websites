import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Donor } from '@/types/admin';

const donorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['Potential', 'Contacted', 'In Process', 'Donated', 'Not Interested']),
  amount_donated: z.preprocess(
    (val) => (String(val).trim() === "" ? null : Number(val)),
    z.number().nonnegative("Amount must be a positive number.").nullable()
  ),
  notes: z.string().optional(),
});

export type DonorFormValues = z.infer<typeof donorFormSchema>;

interface DonorDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  donor: Donor | null;
  onSave: (data: DonorFormValues) => void;
  isSaving: boolean;
}

export const DonorDialog = ({ isOpen, setIsOpen, donor, onSave, isSaving }: DonorDialogProps) => {
  const form = useForm<DonorFormValues>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'Potential',
      amount_donated: null,
      notes: '',
    },
  });

  useEffect(() => {
    if (donor) {
      form.reset({
        name: donor.name,
        email: donor.email || '',
        phone: donor.phone || '',
        status: donor.status,
        amount_donated: donor.amount_donated,
        notes: donor.notes || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        status: 'Potential',
        amount_donated: null,
        notes: '',
      });
    }
  }, [donor, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{donor ? 'Edit Donor' : 'Add New Donor'}</DialogTitle>
          <DialogDescription>
            {donor ? 'Update the details for this donor.' : 'Enter the details for the new donor or lead.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input placeholder="+91 12345 67890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Potential">Potential</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="In Process">In Process</SelectItem>
                      <SelectItem value="Donated">Donated</SelectItem>
                      <SelectItem value="Not Interested">Not Interested</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount_donated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Donated (₹)</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl><Textarea placeholder="Add any relevant notes here..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Donor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};