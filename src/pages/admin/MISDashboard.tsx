import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner'; // Added import for toast

interface Donation {
  id: string;
  amount: number;
  currency: string;
  platform: string;
  cause_id: string | null;
  created_at: string;
}

interface Cause {
  id: string;
  title: string;
}

interface DonationsByCause {
  causeTitle: string;
  totalAmount: number;
  count: number;
}

const MISDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [donations, setDonations] = useState<Donation[]>([]);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDonationsAmount, setTotalDonationsAmount] = useState<number>(0);
  const [donationsGroupedByCause, setDonationsGroupedByCause] = useState<DonationsByCause[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    processDonationData(donations, causes);
  }, [donations, causes]);

  const fetchData = async (from?: Date, to?: Date) => {
    setLoading(true);

    // Fetch causes
    const { data: causesData, error: causesError } = await supabase
      .from('causes')
      .select('id, title');

    if (causesError) {
      console.error('Error fetching causes:', causesError);
      toast.error('Failed to load causes data.');
      setLoading(false);
      return;
    }
    setCauses(causesData || []);

    // Fetch donations with optional date filtering
    let query = supabase
      .from('donations')
      .select('*')
      .eq('payment_status', 'successful')
      .order('created_at', { ascending: false });

    if (from) {
      query = query.gte('created_at', format(from, 'yyyy-MM-dd'));
    }
    if (to) {
      query = query.lte('created_at', format(to, 'yyyy-MM-dd'));
    }

    const { data: donationsData, error: donationsError } = await query;

    if (donationsError) {
      console.error('Error fetching donations:', donationsError);
      toast.error('Failed to load donations data.');
    } else {
      setDonations(donationsData || []);
    }
    setLoading(false);
  };

  const processDonationData = (donationsList: Donation[], causesList: Cause[]) => {
    const totalAmount = donationsList.reduce((sum, donation) => sum + Number(donation.amount), 0);
    setTotalDonationsAmount(totalAmount);

    const causeMap = new Map(causesList.map(cause => [cause.id, cause.title]));
    const groupedByCause: { [key: string]: { totalAmount: number; count: number } } = {};

    donationsList.forEach(donation => {
      const causeId = donation.cause_id || 'unassigned';
      const causeTitle = causeMap.get(causeId) || 'General / Unassigned';

      if (!groupedByCause[causeTitle]) {
        groupedByCause[causeTitle] = { totalAmount: 0, count: 0 };
      }
      groupedByCause[causeTitle].totalAmount += Number(donation.amount);
      groupedByCause[causeTitle].count += 1;
    });

    const formattedGroupedByCause = Object.entries(groupedByCause)
      .map(([causeTitle, data]) => ({
        causeTitle,
        totalAmount: data.totalAmount,
        count: data.count,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount); // Sort by total amount descending

    setDonationsGroupedByCause(formattedGroupedByCause);
  };

  const handleApplyFilter = () => {
    fetchData(dateRange?.from, dateRange?.to);
  };

  const handleResetFilter = () => {
    setDateRange(undefined);
    fetchData(); // Fetch all data again
  };

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
          <CardTitle className="text-primary-teal">Filter Donations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleApplyFilter} disabled={loading}>
            Apply Filter
          </Button>
          <Button variant="outline" onClick={handleResetFilter} disabled={loading}>
            Reset Filter
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Donations</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <p className="text-2xl font-bold text-primary-teal">
                ₹{totalDonationsAmount.toLocaleString('en-IN')}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Donations by Cause</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : donationsGroupedByCause.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cause</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donationsGroupedByCause.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.causeTitle}</TableCell>
                        <TableCell className="text-right">₹{item.totalAmount.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500">No donations found for the selected period.</p>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Placeholder for future charts and filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Donations by Platform</CardTitle></CardHeader>
          <CardContent><p className="text-gray-500">Chart placeholder</p></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MISDashboard;