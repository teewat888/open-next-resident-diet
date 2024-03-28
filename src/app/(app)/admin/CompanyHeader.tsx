import { Package2 } from 'lucide-react';
import Link from 'next/link';

const CompanyHeader = () => {
  return (
    <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
      <Link href='/' className='flex items-center gap-2 font-semibold'>
        <Package2 className='h-6 w-6' />
        <span className=''>Acme Inc</span>
      </Link>
    </div>
  );
};
export default CompanyHeader;
