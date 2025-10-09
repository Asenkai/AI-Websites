import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CauseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  className?: string;
}

export const CauseCard = ({ id, title, description, imageUrl, className }: CauseCardProps) => {
  return (
    <Card className={cn("overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300", className)}>
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle className="font-serif text-xl text-primary-teal">{title}</CardTitle>
        <CardDescription className="text-gray-600 text-sm line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <Link to={`/our-work/${id}`}>
          <Button variant="outline" className="w-full border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white transition-colors">
            Learn More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};