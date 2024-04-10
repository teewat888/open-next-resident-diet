'use client';
import { createClient } from '@/app/actions';
import Loading from '@/components/composed/Loading';
import { SubmitButton } from '@/components/composed/SubmitButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { STATUS } from '@/constant';
import usePrepareFormData from '@/hooks/usePrepareFormData';
import { clientValidationSchema } from '@/lib/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useEffect, useState, useTransition } from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

const GeneralInfoStepForm = () => {
  const [photoSrc, setPhotoSrc] = useState('');

  const router = useRouter();

  const { prepareFormData } =
    usePrepareFormData<z.infer<typeof clientValidationSchema>>();

  const form = useForm<z.infer<typeof clientValidationSchema>>({
    resolver: zodResolver(clientValidationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      photo: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof clientValidationSchema>) => {
    startTransition(async () => {
      const formData = prepareFormData(values, {});
      const result = await createClient(formData);
      if (result.status === STATUS.SUCCESS) {
        router.push(`/admin/client/room/edit/${result.id}`);
      }
    });
  };
  useEffect(() => {
    console.log('formState', form.formState);
  }, [form.formState]);

  return (
    <>
      <div className='relative flex-col items-start gap-8 md:flex pt-6'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid w-full items-start gap-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-1 gap-6 md:w-3/4 w-full m-auto'>
              <fieldset
                className={`grid gap-6 rounded-lg border p-4 
              }`}
              >
                <legend className='-ml-1 px-1 text-sm font-medium'>
                  General info
                </legend>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='text'
                            placeholder='First name'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='text'
                            placeholder='First name'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='photo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='file'
                            onChange={handleFileChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {photoSrc && (
                  <Image src={photoSrc} alt='image' width={50} height={50} />
                )}
              </fieldset>
              <div className='flex justify-end'>
                <SubmitButton
                  variant={'default'}
                  loading={<Loading />}
                  label={'Next'}
                  isSubmmitting={isPending}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
export default GeneralInfoStepForm;
