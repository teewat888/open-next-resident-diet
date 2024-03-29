import { FormState } from '@/lib/utils/fromErrorToFormState';

type FieldErrorProps = {
  formState: FormState;
  name: string;
};

const FieldError = ({ formState, name }: FieldErrorProps) => {
  return (
    <span className='text-xs text-red-400'>{formState.fieldErrors[name]}</span>
  );
};

export { FieldError };
