import { StepMenu } from '@/components/composed/StepMenu';
import StepForm from './StepForm';

export default async function editRoom({ params }: { params: { id: string } }) {
  return (
    <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <div className='flex items-center'>
        <h1 className='text-lg font-semibold md:text-2xl'>Add a client</h1>
      </div>
      <StepMenu currentStep='Location' />
      <StepForm clientId={params.id} />
    </main>
  );
}
