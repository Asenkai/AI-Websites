import { cn } from '@/lib/utils';

interface TrustBadgesProps {
  className?: string;
  badges?: string[]; // Make badges prop optional and an array of strings
}

export const TrustBadges = ({ className, badges }: TrustBadgesProps) => {
  const defaultBadges = ["80G Certified", "12A Certified", "Section 8 NGO", "CSR Eligible"];
  const badgesToDisplay = badges && badges.length > 0 ? badges : defaultBadges;

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-600", className)}>
      {badgesToDisplay.map((badge, index) => (
        <span key={index} className="px-3 py-1 bg-gray-100 rounded-md shadow-sm">
          {badge}
        </span>
      ))}
    </div>
  );
};