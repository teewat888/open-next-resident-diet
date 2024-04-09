'use client';

import { Button, buttonVariants } from '../ui/button';
import { type VariantProps } from 'class-variance-authority';

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

type SubmitButtonProps = {
  label: string;
  loading: React.ReactNode;
  variant: ButtonVariant;
  isSubmmitting?: boolean;
};

export const SubmitButton = ({
  label,
  loading,
  variant,
  isSubmmitting,
}: SubmitButtonProps) => {
  return (
    <Button variant={variant} disabled={isSubmmitting} type='submit'>
      {isSubmmitting ? loading : label}
    </Button>
  );
};
