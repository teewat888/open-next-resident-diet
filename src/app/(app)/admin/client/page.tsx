import PageHeader from '@/components/composed/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClientManagementPage() {
  return (
    <>
      <PageHeader headerText='Client Managment' />
      <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'>
        <div className='flex flex-col items-center gap-1 text-center'>
          <h3 className='text-2xl font-bold tracking-tight'>
            You have no products
          </h3>
          <p className='text-sm text-muted-foreground'>
            You can start selling as soon as you add a product.
          </p>
          <Link href='/admin/client/new'>
            {' '}
            <Button className='mt-4'>Add Client</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
