'use client';

import { Button } from '@/components/ui/button';
import { Client, MealSize } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export interface ClientWithDetails {
  client: Client;
  meal_size: MealSize | null;
}

export const columns: ColumnDef<ClientWithDetails>[] = [
  {
    accessorKey: 'client.firstName',
    id: 'firstName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          First name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'client.lastName',
    id: 'lastName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'meal_size.size_name',
    header: 'Meal size',
  },
];
