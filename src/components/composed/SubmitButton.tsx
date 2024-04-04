import { useFormStatus } from 'react-dom';
import { Button, buttonVariants } from '../ui/button';
import { type VariantProps } from 'class-variance-authority';

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

type SubmitButtonProps = {
  label: string;
  loading: React.ReactNode;
  variant: ButtonVariant;
};

export const SubmitButton = ({
  label,
  loading,
  variant,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button variant={variant} disabled={pending} type='submit'>
      {pending ? loading : label}
    </Button>
  );
};
