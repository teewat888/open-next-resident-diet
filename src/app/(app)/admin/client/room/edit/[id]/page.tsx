import { Stepper } from '@/components/composed/Stepper';
import StepForm from './LocationStepForm';
import ModifyRoomForm from './LocationModifyForm';
import { isClientInRoom } from '@/actions';

export default async function editRoom({ params }: { params: { id: string } }) {
  const isClientAlreadyInRoom = await isClientInRoom(params.id);

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <div className='flex items-center'>
        <h1 className='text-lg font-semibold md:text-2xl'>
          {isClientAlreadyInRoom ? 'Edit a client room' : 'Add a client'}
        </h1>
      </div>

      {isClientAlreadyInRoom ? (
        <ModifyRoomForm clientId={params.id} />
      ) : (
        <>
          <Stepper currentStep='Location' />
          <StepForm clientId={params.id} />
        </>
      )}
    </main>
  );
}
