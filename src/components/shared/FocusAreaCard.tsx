import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FocusAreaCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FocusAreaCard = ({ icon: Icon, title, description, className }: FocusAreaCardProps) => {
  return (
    <Card className={cn("text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center", className)}>
      <CardHeader className="p-0 mb-4">
        <div className="bg-accent-yellow/20 p-3 rounded-full inline-flex items-center justify-center mb-3">
          <Icon size={36} className="text-accent-yellow" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};