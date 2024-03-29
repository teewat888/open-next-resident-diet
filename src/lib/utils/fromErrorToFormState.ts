import { ZodError } from 'zod';

export type FormState = {
  status: 'UNSET' | 'SUCCESS' | 'ERROR';
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
  id: string;
};

export const EMPTY_FORM_STATE: FormState = {
  status: 'UNSET' as const,
  message: '',
  fieldErrors: {},
  timestamp: Date.now(),
  id: '',
};

export const toFormState = (
  status: FormState['status'],
  message: string,
  id: string
): FormState => {
  return {
    status,
    message,
    fieldErrors: {},
    timestamp: Date.now(),
    id,
  };
};

export const fromErrorToFormState = (error: unknown) => {
  if (error instanceof ZodError) {
    const fieldErrors = error.errors.reduce<Record<string, string[]>>(
      (acc, error) => {
        const fieldName = error.path.join('.');
        if (fieldName) {
          if (!acc[fieldName]) acc[fieldName] = [];
          acc[fieldName].push(error.message);
        }
        return acc;
      },
      {}
    );
    return {
      status: 'ERROR' as const,
      message: '',
      fieldErrors: fieldErrors,
      timestamp: Date.now(),
      id: '',
    };
  } else if (error instanceof Error) {
    return {
      status: 'ERROR' as const,
      message: error.message,
      fieldErrors: {},
      timestamp: Date.now(),
      id: '',
    };
  } else {
    return {
      status: 'ERROR' as const,
      message: 'An unknown error occurred',
      fieldErrors: {},
      timestamp: Date.now(),
      id: '',
    };
  }
};
