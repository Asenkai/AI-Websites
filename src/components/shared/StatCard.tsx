import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export const StatCard = ({ value, label, className }: StatCardProps) => {
  return (
    <Card className={cn("text-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300", className)}>
      <CardContent className="p-0 flex flex-col items-center justify-center">
        <p className="font-serif text-4xl md:text-5xl font-extrabold text-primary-teal mb-2">
          {value}
        </p>
        <p className="text-md md:text-lg font-medium text-gray-700">
          {label}
        </p>
      </CardContent>
    </Card>
  );
};