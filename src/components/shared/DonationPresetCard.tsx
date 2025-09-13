import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DonationPresetCardProps {
  amount: number;
  description: string;
  isSelected: boolean;
  onClick: (amount: number) => void;
  className?: string;
}

export const DonationPresetCard = ({ amount, description, isSelected, onClick, className }: DonationPresetCardProps) => {
  return (
    <Card
      className={cn(
        "cursor-pointer p-4 text-center border-2 transition-all duration-200",
        isSelected ? "border-primary-teal bg-primary-teal/10 shadow-lg" : "border-gray-200 hover:border-primary-teal/50 hover:shadow-md",
        className
      )}
      onClick={() => onClick(amount)}
    >
      <CardContent className="p-0">
        <p className={cn("font-serif text-3xl font-bold mb-2", isSelected ? "text-primary-teal" : "text-gray-800")}>
          ₹{amount.toLocaleString('en-IN')}
        </p>
        <p className={cn("text-gray-600 text-sm", isSelected && "text-primary-teal/90")}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
};