import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export const SectionTitle = ({ title, subtitle, className, titleClassName, subtitleClassName }: SectionTitleProps) => {
  return (
    <div className={cn("text-center py-8 md:py-12", className)}>
      {subtitle && (
        <p className={cn("text-primary-teal text-lg font-semibold mb-2", subtitleClassName)}>
          {subtitle}
        </p>
      )}
      <h2 className={cn("font-serif text-3xl md:text-4xl font-bold text-gray-900", titleClassName)}>
        {title}
      </h2>
    </div>
  );
};