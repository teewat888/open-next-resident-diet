'use client';
import { createClient } from '@/app/actions';
import { FieldError } from '@/components/composed/FieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EMPTY_FORM_STATE } from '@/lib/utils/fromErrorToFormState';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

const StepForm1 = () => {
  const [photoSrc, setPhotoSrc] = useState('');
  const [formState, action] = useFormState(createClient, EMPTY_FORM_STATE);

  const router = useRouter();

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

  useEffect(() => {
    if (formState.status === 'SUCCESS') {
      console.log('id=', formState.id);
    }
  }, [formState, router]);

  return (
    <>
      <ul className='steps'>
        <li className='step step-neutral'>General Info</li>
        <li className='step '>Location</li>
        <li className='step'>Meal size and consistency</li>
        <li className='step'>Done</li>
      </ul>

      <div className='relative flex-col items-start gap-8 md:flex pt-6'>
        <form action={action} className='grid w-full items-start gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-1 gap-6 md:w-1/2 m-auto'>
            <fieldset
              className={`grid gap-6 rounded-lg border p-4 
              }`}
            >
              <legend className='-ml-1 px-1 text-sm font-medium'>
                General info
              </legend>
              <div className='grid gap-3'>
                <Label htmlFor='firstName'>First name</Label>
                <Input name='firstName' type='text' placeholder='First name' />
                <FieldError formState={formState} name='firstName' />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='lastName'>Last name</Label>
                <Input name='lastName' type='text' placeholder='Last name' />
                <FieldError formState={formState} name='lastName' />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='photo'>Photo</Label>
                <Input name='photo' type='file' onChange={handleFileChange} />
              </div>
              {photoSrc && (
                <Image src={photoSrc} alt='image' width={50} height={50} />
              )}
            </fieldset>
            <div className='flex justify-end'>
              <Button type='submit' className='w-1/2'>
                Next
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default StepForm1;
