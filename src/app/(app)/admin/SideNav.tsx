import { Badge } from '@/components/ui/badge';
import { Home, LineChart, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';

const SideNav = () => {
  return (
    <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
      <Link
        href='/admin/dashboard'
        className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
      >
        <Home className='h-4 w-4' />
        Dashboard
      </Link>

      <Link
        href='/admin/client'
        className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
      >
        <Users className='h-4 w-4' />
        Clients
        <Badge className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
          6
        </Badge>
      </Link>
      <Link
        href='#'
        className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
      >
        <LineChart className='h-4 w-4' />
        Wings / Rooms
      </Link>
      <Link
        href='#'
        className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
      >
        <LineChart className='h-4 w-4' />
        Respite management
      </Link>
      <Link
        href='#'
        className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
      >
        <LineChart className='h-4 w-4' />
        Day centre managment
      </Link>
    </nav>
  );
};
export default SideNav;
