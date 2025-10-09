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

const Login = () => {
  const { session, user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!sessionLoading) {
      if (session && user?.profile?.role === 'admin') {
        navigate('/admin');
      } else if (session && user?.profile?.role !== 'admin') {
        // If logged in but not admin, redirect to home
        navigate('/');
      }
    }
  }, [session, user, sessionLoading, navigate]);

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

  if (sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">Loading authentication...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <img src="/placeholder.svg" alt="Aadiv Care Foundation Logo" className="h-12 w-12 mx-auto mb-4" />
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