import { getAllClientInfo } from '@/actions';
import PageHeader from '@/components/composed/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function ClientManagementPage() {
  const clients = await getAllClientInfo();
  return (
    <>
      <PageHeader headerText='Client Managment' />
      {clients.length > 0 && (
        <div className='inline-block'>
          <Link href='/admin/client/new' className='inline-block -mt-4'>
            <Button className='mt-4'>Add Client</Button>
          </Link>
        </div>
      )}

      {clients.length === 0 && (
        <>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h3 className='text-2xl font-bold tracking-tight'>
              You have no client
            </h3>

            <Link href='/admin/client/new'>
              {' '}
              <Button className='mt-4'>Add Client</Button>{' '}
            </Link>
          </div>
        </>
      )}
      <DataTable columns={columns} data={clients} />
    </>
  );
}
