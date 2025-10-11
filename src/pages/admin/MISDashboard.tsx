import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from '@/components/shared/SectionTitle';

const MISDashboard = () => {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Management Information System (MIS) Dashboard"
        subtitle="Track your organization's performance"
        titleClassName="text-primary-teal"
        className="text-left py-0 mb-6"
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-primary-teal">Welcome to the MIS Dashboard!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            This section will provide insights into your daily, weekly, monthly, and financial year performance.
            You'll be able to analyze donations by cause, campaign, platform, and state.
          </p>
          <p className="text-gray-600 mt-4">
            Stay tuned for interactive charts, filters, and detailed reports coming soon!
          </p>
        </CardContent>
      </Card>
      {/* Placeholder for future charts and filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Donations</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹0</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Donations by Cause</CardTitle></CardHeader>
          <CardContent><p className="text-gray-500">Chart placeholder</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Donations by Platform</CardTitle></CardHeader>
          <CardContent><p className="text-gray-500">Chart placeholder</p></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MISDashboard;