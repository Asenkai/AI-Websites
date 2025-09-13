import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { DonationPresetCard } from '@/components/shared/DonationPresetCard';
import { toast } from 'sonner';
import { QrCode, CreditCard, Banknote, Wallet } from 'lucide-react';

const donationPresets = [
  { amount: 199, description: 'Feed a family' },
  { amount: 499, description: 'Fund therapy session' },
  { amount: 999, description: 'Elder care for a day' },
  { amount: 1999, description: 'School kit + tuition' },
];

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState<boolean>(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow digits
      setCustomAmount(value);
      setSelectedAmount(null); // Deselect presets if custom amount is typed
    }
  };

  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  const handleDonate = () => {
    if (finalAmount <= 0) {
      toast.error('Please enter a valid donation amount.');
      return;
    }
    // Simulate donation process
    toast.success(`Thank you for your donation of ₹${finalAmount.toLocaleString('en-IN')}!`);
    console.log(`Donating ₹${finalAmount} ${isMonthly ? 'monthly' : 'once'}`);
    // In a real app, this would trigger payment gateway
    // For now, we'll just reset the form
    setSelectedAmount(null);
    setCustomAmount('');
    setIsMonthly(false);
  };

  return (
    <div className="font-sans">
      <section className="relative bg-gradient-to-r from-primary-teal to-teal-700 text-white py-20 md:py-24">
        <div className="container text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Every ₹100 Counts — Give Now
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Your generosity fuels our mission and brings hope to those who need it most.
          </p>
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
            {donationPresets.map((preset) => (
              <DonationPresetCard
                key={preset.amount}
                amount={preset.amount}
                description={preset.description}
                isSelected={selectedAmount === preset.amount}
                onClick={handleAmountSelect}
              />
            ))}
          </div>

          <div className="mb-8">
            <Label htmlFor="custom-amount" className="text-lg font-semibold text-gray-800 mb-2 block">
              Or Enter Custom Amount
            </Label>
            <Input
              id="custom-amount"
              type="text" // Use text to control input, then parse to int
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
            disabled={finalAmount <= 0}
          >
            Donate Now (₹{finalAmount.toLocaleString('en-IN')})
          </Button>

          <div className="mt-10 text-center">
            <h3 className="font-serif text-2xl font-bold text-primary-teal mb-6">Other Ways to Donate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-100 rounded-lg shadow-sm flex flex-col items-center">
                <QrCode size={48} className="text-primary-teal mb-4" />
                <h4 className="font-semibold text-xl text-gray-800 mb-2">UPI / Paytm QR</h4>
                <p className="text-gray-600 text-sm mb-4">Scan to donate instantly via any UPI app or Paytm.</p>
                <img src="/placeholder.svg" alt="UPI QR Code" className="w-32 h-32 object-contain mb-4" />
                <p className="text-sm text-gray-500">UPI ID: aadivcare@upi</p>
              </div>
              <div className="p-6 bg-gray-100 rounded-lg shadow-sm flex flex-col items-center">
                <CreditCard size={48} className="text-primary-teal mb-4" />
                <h4 className="font-semibold text-xl text-gray-800 mb-2">Cards / NetBanking / Razorpay</h4>
                <p className="text-gray-600 text-sm mb-4">Securely donate using your credit/debit card or net banking.</p>
                <Button variant="outline" className="w-full border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white">
                  Pay via Razorpay (Simulated)
                </Button>
              </div>
              <div className="p-6 bg-gray-100 rounded-lg shadow-sm flex flex-col items-center">
                <Wallet size={48} className="text-primary-teal mb-4" />
                <h4 className="font-semibold text-xl text-gray-800 mb-2">Fundraisers</h4>
                <p className="text-gray-600 text-sm mb-4">Start or contribute to a fundraiser on our partner platforms.</p>
                <div className="flex gap-4">
                  <a href="https://www.ketto.org/aadivcarefoundation" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-primary-teal">
                      Ketto
                    </Button>
                  </a>
                  <a href="https://www.giveindia.org/aadivcarefoundation" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-primary-teal">
                      GiveIndia
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-12 text-center">
            <span className="font-bold text-primary-teal">Legal Note:</span> All donations to Aadiv Care Foundation are eligible for 80G tax exemption under the Income Tax Act, 1961.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Donate;