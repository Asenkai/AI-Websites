import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface HeaderContent {
  header_logo_image: { url: string; alt: string };
}

const Login = () => {
  const { session, user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headerContent, setHeaderContent] = useState<Partial<HeaderContent>>({});
  const [contentLoading, setContentLoading] = useState(true);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const fetchHeaderContent = async () => {
      setContentLoading(true);
      const { data: contentData, error: contentError } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'header')
        .eq('element_id', 'header_logo_image')
        .single();

      if (contentError && contentError.code !== 'PGRST116') { // PGRST116: 'single' row not found
        console.error('Error fetching header logo for login page:', contentError);
      } else if (contentData) {
        setHeaderContent({ header_logo_image: contentData.content_data as { url: string; alt: string } });
      }
      setContentLoading(false);
    };

    fetchHeaderContent();
  }, []);

  useEffect(() => {
    if (!sessionLoading && !contentLoading) {
      if (session && user?.profile?.role === 'admin') {
        navigate('/admin');
      } else if (session && user?.profile?.role !== 'admin') {
        // If logged in but not admin, redirect to home
        navigate('/');
      }
    }
  }, [session, user, sessionLoading, contentLoading, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged in successfully!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionLoading || contentLoading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">Loading authentication...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <img src={headerContent.header_logo_image?.url || '/placeholder.svg'} alt={headerContent.header_logo_image?.alt || 'Aadiv Care Foundation Logo'} className="h-12 w-12 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-primary-teal">Admin Login</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary-teal hover:bg-teal-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;