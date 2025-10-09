import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary-teal">Welcome to the Admin Panel!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Use the sidebar navigation to manage different sections of your website content, navigation, and causes.
          </p>
          <p className="text-gray-600 mt-4">
            Remember to save your changes after editing each section.
          </p>
        </CardContent>
      </Card>
      {/* You can add more dashboard widgets here later */}
    </div>
  );
};

export default AdminDashboard;