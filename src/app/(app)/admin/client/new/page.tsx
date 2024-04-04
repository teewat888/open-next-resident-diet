import { Stepper } from '@/components/composed/Stepper';
import StepForm from './StepForm';
import PageHeader from '@/components/composed/PageHeader';

export default function AddClient() {
  return (
    <>
      <PageHeader headerText='Add a client' />
      <Stepper currentStep='General Info' />
      <StepForm />
    </>
  );
}
