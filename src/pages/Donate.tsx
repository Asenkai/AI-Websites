import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { DonationPresetCard } from '@/components/shared/DonationPresetCard';
import { toast } from 'sonner';
import { QrCode, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { MetaTags } from '@/components/shared/MetaTags';

interface DonationPreset {
  amount: number;
  description: string;
}

interface DonatePageContent {
  hero_title: string;
  hero_subtitle: string;
  donation_presets: DonationPreset[];
  upi_qr_image: { url: string; alt: string };
  upi_id: string;
  razorpay_button: { text: string; link: string };
  ketto_button: { text: string; link: string };
  giveindia_button: { text: string; link: string };
  legal_note: string;
}

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [content, setContent] = useState<Partial<DonatePageContent>>({});
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentAndKey = async () => {
      setLoading(true);
      // Fetch page content
      const { data: pageData, error: pageError } = await supabase
        .from('page_content')
        .select('element_id, content_data')
        .eq('page_slug', 'donate');

      if (pageError) {
        console.error("Error fetching donate page content:", pageError);
      } else {
        const formattedContent = pageData.reduce((acc, item) => {
          if (item.element_id.includes('_image') || item.element_id.includes('_button')) {
            acc[item.element_id] = item.content_data;
          } else if (item.element_id === 'donation_presets') {
            acc[item.element_id] = item.content_data.presets;
          } else {
            acc[item.element_id] = item.content_data.text;
          }
          return acc;
        }, {} as any);
        setContent(formattedContent);
      }

      // Fetch Razorpay Key ID
      const { data: keyData, error: keyError } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'razorpay_key_id')
        .single();
      
      if (keyError && keyError.code !== 'PGRST116') {
        console.error("Error fetching Razorpay Key ID:", keyError);
        toast.error("Could not initialize payment gateway.");
      } else if (keyData) {
        setRazorpayKeyId(keyData.value);
      }

      setLoading(false);
    };

    fetchContentAndKey();
  }, []);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  const handleDonate = async () => {
    if (finalAmount <= 0) {
      toast.error('Please enter a valid donation amount.');
      return;
    }
    if (!razorpayKeyId) {
      toast.error('Payment gateway is not configured. Please contact support.');
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Initializing payment...');

    try {
      const { data: order, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: finalAmount },
      });

      if (error) throw new Error(error.message);
      if (order.error) throw new Error(order.error);

      toast.dismiss(loadingToast);

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Aadiv Care Foundation',
        description: `Donation for ${isMonthly ? 'Monthly Support' : 'a Cause'}`,
        order_id: order.id,
        handler: function (response: any) {
          toast.success('Thank you! Your donation was successful.');
          console.log('Payment successful:', response);
          // Here you would typically save the payment details to your database
        },
        prefill: {
          name: '', // You can prefill user details if they are logged in
          email: '',
          contact: '',
        },
        notes: {
          type: isMonthly ? 'monthly_donation' : 'one_time_donation',
        },
        theme: {
          color: '#0F766E', // primary-teal color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error('Payment failed. Please try again.');
        console.error('Payment failed:', response.error);
      });
      rzp.open();

    } catch (error: any) {
      console.error('Donation process error:', error);
      toast.error(`Failed to initiate payment: ${error.message}`);
      toast.dismiss(loadingToast);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="font-sans">
      <MetaTags
        title="Donate Now"
        description="Your contribution can change lives. Make a secure one-time or monthly donation to support our mission at Aadiv Care Foundation. All donations are 80G tax-exempt."
      />
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-24">
        <div className="container text-center relative z-10">
          {loading ? (
            <>
              <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                {content.hero_title || 'Every ₹100 Counts — Give Now'}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                {content.hero_subtitle || 'Your generosity fuels our mission and brings hope to those who need it most.'}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <SectionTitle
            subtitle="Support Our Cause"
            title="Choose Your Donation Amount"
            titleClassName="text-primary-teal"
            className="mb-8"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))
            ) : (
              (content.donation_presets || []).map((preset) => (
                <DonationPresetCard
                  key={preset.amount}
                  amount={preset.amount}
                  description={preset.description}
                  isSelected={selectedAmount === preset.amount}
                  onClick={handleAmountSelect}
                />
              ))
            )}
          </div>

          <div className="mb-8">
            <Label htmlFor="custom-amount" className="text-lg font-semibold text-gray-800 mb-2 block">
              Or Enter Custom Amount
            </Label>
            <Input
              id="custom-amount"
              type="text"
              placeholder="e.g., 5000"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full text-lg p-3 border-2 border-gray-300 focus:border-primary-teal focus:ring-primary-teal"
            />
          </div>

          <div className="flex items-center space-x-2 mb-10">
            <Checkbox
              id="monthly-gift"
              checked={isMonthly}
              onCheckedChange={(checked) => setIsMonthly(!!checked)}
              className="h-5 w-5 border-primary-teal data-[state=checked]:bg-primary-teal data-[state=checked]:text-white"
            />
            <Label htmlFor="monthly-gift" className="text-base font-medium text-gray-700">
              Make this a Monthly Gift
            </Label>
          </div>

          <Button
            onClick={handleDonate}
            className="w-full bg-cta-green hover:bg-green-700 text-white font-bold py-4 rounded-lg text-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={finalAmount <= 0 || isProcessing || loading}
          >
            {isProcessing ? 'Processing...' : `Donate Now (₹${finalAmount.toLocaleString('en-IN')})`}
          </Button>

          <div className="mt-10 text-center">
            <h3 className="font-serif text-2xl font-bold text-primary-teal mb-6">Other Ways to Donate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-100 rounded-lg shadow-sm flex flex-col items-center">
                <QrCode size={48} className="text-primary-teal mb-4" />
                <h4 className="font-semibold text-xl text-gray-800 mb-2">UPI / Paytm QR</h4>
                <p className="text-gray-600 text-sm mb-4">Scan to donate instantly via any UPI app or Paytm.</p>
                {loading ? (
                  <Skeleton className="w-32 h-32 mb-4" />
                ) : (
                  <img src={content.upi_qr_image?.url || '/placeholder.svg'} alt={content.upi_qr_image?.alt || 'UPI QR Code'} className="w-32 h-32 object-contain mb-4" />
                )}
                {loading ? (
                  <Skeleton className="h-4 w-2/3" />
                ) : (
                  <p className="text-sm text-gray-500">UPI ID: {content.upi_id || 'aadivcare@upi'}</p>
                )}
              </div>
              <div className="p-6 bg-gray-100 rounded-lg shadow-sm flex flex-col items-center justify-center">
                <Wallet size={48} className="text-primary-teal mb-4" />
                <h4 className="font-semibold text-xl text-gray-800 mb-2">Fundraisers</h4>
                <p className="text-gray-600 text-sm mb-4">Start or contribute to a fundraiser on our partner platforms.</p>
                <div className="flex gap-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </>
                  ) : (
                    <>
                      <a href={content.ketto_button?.link || "https://www.ketto.org/aadivcarefoundation"} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-primary-teal">
                          {content.ketto_button?.text || 'Ketto'}
                        </Button>
                      </a>
                      <a href={content.giveindia_button?.link || "https://www.giveindia.org/aadivcarefoundation"} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-primary-teal">
                          {content.giveindia_button?.text || 'GiveIndia'}
                        </Button>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-12 w-full mx-auto mt-12" />
          ) : (
            <p className="text-sm text-gray-600 mt-12 text-center">
              <span className="font-bold text-primary-teal">Legal Note:</span> {content.legal_note || 'All donations to Aadiv Care Foundation are eligible for 80G tax exemption under the Income Tax Act, 1961.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Donate;