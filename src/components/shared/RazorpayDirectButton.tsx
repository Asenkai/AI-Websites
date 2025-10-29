import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface RazorpayDirectButtonProps {
  paymentButtonId: string;
}

export const RazorpayDirectButton = ({ paymentButtonId }: RazorpayDirectButtonProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.async = true;
      script.dataset.payment_button_id = paymentButtonId;
      formRef.current.appendChild(script);
    }
  }, [paymentButtonId]);

  return (
    <Card className="p-6 bg-gray-100 rounded-lg shadow-sm flex flex-col items-center justify-center">
      <Wallet size={48} className="text-primary-teal mb-4" />
      <h4 className="font-semibold text-xl text-gray-800 mb-2">Direct Payment</h4>
      <p className="text-gray-600 text-sm mb-4">Click to donate directly via Razorpay.</p>
      <form ref={formRef}></form>
    </Card>
  );
};