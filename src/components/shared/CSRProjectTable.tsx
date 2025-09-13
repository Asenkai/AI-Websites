import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface CSRProject {
  project: string;
  scheduleVIIClause: string;
  description: string;
}

interface CSRProjectTableProps {
  projects: CSRProject[];
  className?: string;
}

export const CSRProjectTable = ({ projects, className }: CSRProjectTableProps) => {
  return (
    <div className={cn("overflow-x-auto rounded-lg border shadow-sm", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary-teal/10">
            <TableHead className="w-[200px] text-primary-teal font-bold">Aadiv Project</TableHead>
            <TableHead className="w-[150px] text-primary-teal font-bold">Schedule VII Clause</TableHead>
            <TableHead className="text-primary-teal font-bold">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium text-gray-800">{project.project}</TableCell>
              <TableCell className="text-gray-700">{project.scheduleVIIClause}</TableCell>
              <TableCell className="text-gray-600">{project.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};