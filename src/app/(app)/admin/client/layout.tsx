import { ReactNode } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
        {children}
      </main>
    </>
  );
}
