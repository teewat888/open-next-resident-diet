'use client';

import { Client } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
];
