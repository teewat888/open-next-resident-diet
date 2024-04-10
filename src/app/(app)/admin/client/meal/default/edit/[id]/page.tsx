import { Stepper } from '@/components/composed/Stepper';
// import StepForm from './StepForm';

export default async function DefaultMealPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <div className='flex items-center'>
        <h1 className='text-lg font-semibold md:text-2xl'>Add a client</h1>
      </div>
      <Stepper currentStep='Meal size and consistency' />
      {/* <StepForm clientId={params.id} /> */}
    </main>
  );
}
