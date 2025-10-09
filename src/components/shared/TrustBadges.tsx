import { cn } from '@/lib/utils';

interface TrustBadgesProps {
  className?: string;
}

export const TrustBadges = ({ className }: TrustBadgesProps) => {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-600", className)}>
      <span className="px-3 py-1 bg-gray-100 rounded-md shadow-sm">80G Certified</span>
      <span className="px-3 py-1 bg-gray-100 rounded-md shadow-sm">12A Certified</span>
      <span className="px-3 py-1 bg-gray-100 rounded-md shadow-sm">Section 8 NGO</span>
      <span className="px-3 py-1 bg-gray-100 rounded-md shadow-sm">CSR Eligible</span>
    </div>
  );
};