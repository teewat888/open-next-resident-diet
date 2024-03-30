import { StepMenu } from '@/components/composed/StepMenu';
import StepForm from './StepForm';
import PageHeader from '@/components/composed/PageHeader';

export default function AddClient() {
  return (
    <>
      <PageHeader headerText='Add a client' />
      <StepMenu currentStep='General Info' />
      <StepForm />
    </>
  );
}
