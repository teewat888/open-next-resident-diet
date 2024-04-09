import { FieldValues } from 'react-hook-form';

interface PrepareFormDataOptions<TFieldValues extends FieldValues> {
  excludeKeys?: Array<keyof TFieldValues>;
  extraData?: Record<string, string>;
}

function usePrepareFormData<TFieldValues extends FieldValues>() {
  const prepareFormData = (
    values: TFieldValues,
    options: PrepareFormDataOptions<TFieldValues> = {}
  ): FormData => {
    const { excludeKeys = [], extraData = {} } = options;
    const formData = new FormData();

    // Append form values, excluding specified keys
    for (const key in values) {
      if (
        Object.hasOwnProperty.call(values, key) &&
        !excludeKeys.includes(key as keyof TFieldValues) &&
        values[key] !== undefined
      ) {
        formData.append(key, values[key]);
      }
    }

    // Append extra data
    for (const key in extraData) {
      if (Object.hasOwnProperty.call(extraData, key)) {
        formData.append(key, extraData[key]);
      }
    }

    return formData;
  };

  return { prepareFormData };
}

export default usePrepareFormData;
