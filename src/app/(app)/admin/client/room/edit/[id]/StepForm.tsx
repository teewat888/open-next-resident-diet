'use client';
import {
  AvailableRoom,
  createClientRoom,
  getAvailableRooms,
  getClientInfo,
  getWings,
  isClientInRoom,
} from '@/app/actions';

import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Client, Wing } from '@/lib/db/schema';

import { useEffect, useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/composed/DatePicker';
import {
  ADMIT_DATE_REQUIRED,
  DISCHARGE_DATE_MUST_GREATER_THAN_ADMIT_DATE,
} from '@/constant/validation';
import { useFormState } from 'react-dom';
import { EMPTY_FORM_STATE } from '@/lib/utils/fromErrorToFormState';

const locationSchema = z
  .object({
    wing: z.string().min(1, 'Please select a wing'),
    room: z.string().min(1, 'Please select a room'),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine((data) => (data.room ? !!data.start_date : true), {
    message: ADMIT_DATE_REQUIRED,
    path: ['start_date'],
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return startDate < endDate;
      }
      return true;
    },
    {
      message: DISCHARGE_DATE_MUST_GREATER_THAN_ADMIT_DATE,
      path: ['end_date'],
    }
  );

const StepForm = ({ clientId }: { clientId: string }) => {
  const [wings, setWings] = useState([] as Wing[]);
  const [client, setClient] = useState({} as Client);
  const [rooms, setRooms] = useState([] as AvailableRoom[]);
  const [formState] = useFormState(createClientRoom, EMPTY_FORM_STATE);
  const [currentSchema, setCurrentSchema] = useState(locationSchema);

  const [isClientAlreadyInRoom, setIsClientAlreadyInRoom] = useState(false);

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      wing: '',
      room: '',
      start_date: '',
      end_date: '',
    },
  });

  const clientRoomStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(form.getValues('start_date') as string);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(form.getValues('end_date') as string);
    endDate.setHours(0, 0, 0, 0);
    let status = 'scheduled';
    if (startDate.getTime() <= today.getTime()) {
      status = 'active';
    } else if (endDate.getTime() < today.getTime()) {
      status = 'completed';
    }
    return status;
  };

  const wingOptions = wings.map((wing) => (
    <SelectItem key={wing.id} value={wing.id.toString()}>
      {wing.name}
    </SelectItem>
  ));

  const roomOptions = rooms.map((room) => (
    <SelectItem key={room.room_id} value={room.room_id.toString()}>
      {room.room_number}{' '}
      {room.next_available_date ? `(${room.next_available_date})` : ''}
    </SelectItem>
  ));

  const handleSelectWing = (value: string) => {
    (async () => {
      const rooms = await getAvailableRooms(value);
      setRooms(rooms);
      form.setValue('room', '');
    })();
  };

  const onSubmit = async (values: z.infer<typeof locationSchema>) => {
    const formData = new FormData();
    for (const key in values) {
      if (values.hasOwnProperty(key) && key !== 'wing') {
        const value = values[key as keyof typeof values];
        if (value !== undefined) {
          formData.append(key, value);
        }
      }
    }
    // add client id
    formData.append('client_id', clientId);
    formData.append('status', clientRoomStatus());

    await createClientRoom(formState, formData);
  };

  useEffect(() => {
    (async () => {
      const isClientAlreadyInRoom = await isClientInRoom(clientId);
      setIsClientAlreadyInRoom(isClientAlreadyInRoom);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const wings = await getWings();
      const client = await getClientInfo(clientId);
      setWings(wings);
      setClient(client[0]);
    })();
  }, []);

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
                  {client.firstName ? (
                    `Location for ${client.firstName} ${client.lastName}`
                  ) : (
                    <Skeleton className='h-4 w-[200px]' />
                  )}
                </legend>
                <FormField
                  control={form.control}
                  name='wing'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wing</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          name={field.name}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleSelectWing(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder='Select a wing'
                              ref={field.ref}
                            />
                          </SelectTrigger>
                          <SelectContent>{wingOptions}</SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {rooms.length > 0 && (
                  <>
                    <FormField
                      control={form.control}
                      name='room'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              name={field.name}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder='Select a room'
                                  ref={field.ref}
                                />
                              </SelectTrigger>
                              <SelectContent>{roomOptions}</SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {form.getValues('room') && (
                  <>
                    <FormField
                      control={form.control}
                      name='start_date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admit date</FormLabel> <br />
                          <FormControl>
                            <DatePicker
                              name={field.name}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='end_date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discharge date</FormLabel>
                          <br />
                          <FormControl>
                            <DatePicker
                              name={field.name}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            />
                          </FormControl>
                          <FormDescription>
                            Leave discharge date blank for permanent stay.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </fieldset>
              <div className='flex justify-end gap-4'>
                <Button type='button' className='w-1/2' variant={'secondary'}>
                  Skip
                </Button>
                <Button type='submit' className='w-1/2'>
                  Next
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
export default StepForm;
