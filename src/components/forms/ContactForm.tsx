import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
// No direct import of supabase needed for its URL here, as we use the env var
// import { supabase } from '@/integrations/supabase/client'; 

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export const ContactForm = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      // Directly use the environment variable for the Supabase URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL is not defined.');
      }
      const SUPABASE_PROJECT_ID = supabaseUrl.split('.')[0].split('//')[1];
      const EDGE_FUNCTION_NAME = 'contact-form';
      
      const response = await fetch(
        `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/${EDGE_FUNCTION_NAME}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // No Authorization header needed for this public form,
            // as the Edge Function uses the service role key internally.
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message.');
      }

      toast.success('Your message has been sent! We will get back to you shortly.');
      form.reset();
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Inquiry about..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your message here..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary-teal hover:bg-teal-700 text-white">
          Send Message
        </Button>
      </form>
    </Form>
  );
};