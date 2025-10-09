import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { loading: sessionLoading } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Skeleton className="h-20 w-64" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-teal font-serif">Admin Panel</h1>
            <div>
              <Link to="/">
                <Button variant="outline" className="mr-4">View Site</Button>
              </Link>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </header>
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};