import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';

const Login = () => {
  const { session, user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && user?.profile?.role === 'admin') {
      navigate('/admin');
    } else if (session && user?.profile?.role !== 'admin') {
      // If logged in but not admin, redirect to home
      navigate('/');
    }
  }, [session, user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <img src="/placeholder.svg" alt="Aadiv Care Foundation Logo" className="h-12 w-12 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-primary-teal">Admin Login</h2>
        </div>
        <Auth
          supabaseClient={supabase}
          providers={[]} // Only allow email/password for admin login
          appearance={{ theme: ThemeSupa }}
          view="sign_in"
          theme="light"
          showLinks={false} // Hide sign-up and magic link options
        />
      </div>
    </div>
  );
};

export default Login;