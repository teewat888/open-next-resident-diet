'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const ClientForm = () => {
  const [activeFieldset, setActiveFieldset] = useState('');
  return (
    <>
      <div className='flex gap-2'>
        <Button
          variant={'outline'}
          size={'sm'}
          onClick={() => setActiveFieldset('generalInfo')}
          className={`${activeFieldset === 'generalInfo' ? 'bg-gray-100' : ''}`}
        >
          General info
        </Button>
        <Button
          variant={'outline'}
          size={'sm'}
          onClick={() => setActiveFieldset('mealInfo')}
          className={`${activeFieldset === 'mealInfo' ? 'bg-gray-100' : ''}`}
        >
          Meal info
        </Button>
        <Button
          variant={'outline'}
          size={'sm'}
          onClick={() => setActiveFieldset('preferences')}
          className={`${activeFieldset === 'preferences' ? 'bg-gray-100' : ''}`}
        >
          Preferences
        </Button>
      </div>
      <div className='relative flex-col items-start gap-8 md:flex'>
        <form className='grid w-full items-start gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <fieldset
              className={`grid gap-6 rounded-lg border p-4 ${
                activeFieldset === 'generalInfo' ? 'highlight-fieldSet' : ''
              }`}
            >
              <legend className='-ml-1 px-1 text-sm font-medium'>
                General info
              </legend>
              <div className='grid gap-3'>
                <Label htmlFor='firstName'>First name</Label>
                <Input id='firstName' type='text' placeholder='First name' />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='lastName'>Last name</Label>
                <Input id='lastName' type='text' placeholder='Last name' />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='photo'>Photo</Label>
                <Input id='photo' type='file' />
              </div>
              <div className='grid gap-3'>
                <div className='flex flex-col gap-3'>
                  <Button variant={'outline'}>Manage Room / Wing</Button>
                </div>
              </div>
            </fieldset>

            <fieldset
              className={`grid gap-6 rounded-lg border p-4 ${
                activeFieldset === 'mealInfo' ? 'highlight-fieldSet' : ''
              }`}
            >
              <legend className='-ml-1 px-1 text-sm font-medium'>
                Meal info
              </legend>
              <div className='grid gap-3'>
                <Label htmlFor='meal_size'>Meal size</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a meal size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='system'>Small</SelectItem>
                    <SelectItem value='user'>User</SelectItem>
                    <SelectItem value='assistant'>Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='food_consistency'>Food consistency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a food consistency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='system'>System</SelectItem>
                    <SelectItem value='user'>User</SelectItem>
                    <SelectItem value='assistant'>Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='drink_consistency'>Liquid consistency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a liquid consistency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='system'>System</SelectItem>
                    <SelectItem value='user'>User</SelectItem>
                    <SelectItem value='assistant'>Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </fieldset>
            <fieldset
              className={`grid gap-6 col-span-2 rounded-lg border p-4 ${
                activeFieldset === 'preferences' ? 'highlight-fieldSet' : ''
              }`}
            >
              <legend className='-ml-1 px-1 text-sm font-medium'>
                Preferences
              </legend>
              <div className='flex  gap-2'>
                <div className='grid gap-3'>
                  <Button variant={'outline'}>Manage Food Preferences</Button>
                </div>
                <div className='grid gap-3'>
                  <Button variant={'outline'}>Manage Drink Preferences</Button>
                </div>
                {/* display area */}
              </div>
            </fieldset>
            <fieldset
              className={`grid gap-6 rounded-lg border p-4 ${
                activeFieldset === 'generalInfo' ? 'highlight-fieldSet' : ''
              }`}
            >
              <legend className='-ml-1 px-1 text-sm font-medium'>
                General info
              </legend>
              <div className='grid gap-3'>
                <Label htmlFor='firstName'>First name</Label>
                <Input id='firstName' type='text' placeholder='First name' />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='lastName'>Last name</Label>
                <Input id='lastName' type='text' placeholder='Last name' />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='photo'>Photo</Label>
                <Input id='photo' type='file' />
              </div>
            </fieldset>
          </div>
          <Button className='w-full'>Add Client</Button>
        </form>
      </div>
    </>
  );
};
export default ClientForm;
