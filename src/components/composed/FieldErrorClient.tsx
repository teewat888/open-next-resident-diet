import { z } from 'zod';

const FieldErrorClient = ({
  fieldName,
  errors,
}: {
  fieldName: string;
  errors: z.ZodIssue[];
}) => {
  const issues = errors || [];

  const errorMessage = issues.find((issue) =>
    issue.path.includes(fieldName)
  )?.message;

  // If there's an error message, render it, otherwise render nothing
  if (errorMessage) {
    return <span className='text-xs text-red-400'>{errorMessage}</span>;
  }

  return null;
};

export default FieldErrorClient;
