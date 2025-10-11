import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label'; // Added import for Label

const MISDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30), // Default to last 30 days
    to: new Date(),
  });
  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [loadingData, setLoadingData] = useState(true);

  const fetchDonationSummary = async (from?: Date, to?: Date) => {
    setLoadingData(true);
    let query = supabase
      .from('donations')
      .select('amount')
      .eq('payment_status', 'successful'); // Only count successful donations

    if (from) {
      query = query.gte('created_at', format(startOfDay(from), 'yyyy-MM-dd HH:mm:ss'));
    }
    if (to) {
      query = query.lte('created_at', format(endOfDay(to), 'yyyy-MM-dd HH:mm:ss'));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching donation summary:', error);
      toast.error('Failed to load donation data.');
      setTotalDonations(0);
    } else {
      const sum = data.reduce((acc, donation) => acc + (donation.amount || 0), 0);
      setTotalDonations(sum);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchDonationSummary(dateRange?.from, dateRange?.to);
  }, [dateRange]);

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
          <CardTitle className="text-primary-teal">Donation Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Label htmlFor="date-range-picker" className="whitespace-nowrap">Filter by Date:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range-picker"
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader><CardTitle>Total Donations</CardTitle></CardHeader>
              <CardContent>
                {loadingData ? (
                  <Skeleton className="h-8 w-3/4" />
                ) : (
                  <p className="text-2xl font-bold text-primary-teal">
                    ₹{totalDonations.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
              </CardContent>
            </Card>
            {/* Placeholders for other metrics */}
            <Card>
              <CardHeader><CardTitle>Donations by Cause</CardTitle></CardHeader>
              <CardContent><p className="text-gray-500">Chart placeholder</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Donations by Platform</CardTitle></CardHeader>
              <CardContent><p className="text-gray-500">Chart placeholder</p></CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default MISDashboard;