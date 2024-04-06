'use client';
import {
  AvailableRoom,
  getAvailableRooms,
  getClientInfo,
  getWings,
  isClientInRoom,
} from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
import { ClientRoomForm } from './ClientRoomForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FieldErrorClient from '@/components/composed/FieldErrorClient';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const locationSchema = z.object({
  wing: z.string().min(1, 'Please select a wing'),
  room: z.string().min(1, 'Please select a room'),
});

const StepForm = ({ clientId }: { clientId: string }) => {
  const [wings, setWings] = useState([] as Wing[]);
  const [client, setClient] = useState({} as Client);
  const [rooms, setRooms] = useState([] as AvailableRoom[]);

  const [isClientAlreadyInRoom, setIsClientAlreadyInRoom] = useState(false);

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      wing: '',
      room: '',
    },
  });

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
    })();
  };

  const onSubmit = (values: z.infer<typeof locationSchema>) => {
    console.log(values);
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
            <div className='grid grid-cols-1 md:grid-cols-1 gap-6 md:w-1/2 m-auto'>
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
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='wing'
                    render={({ field }) => (
                      <FormItem>
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
                </div>
                {rooms.length > 0 && (
                  <>
                    <div className='grid gap-3'>
                      <FormField
                        control={form.control}
                        name='room'
                        render={({ field }) => (
                          <FormItem>
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
                    </div>
                  </>
                )}
                {form.getValues('room') && (
                  <>
                    <div className='flex gap-4'>
                      <ClientRoomForm
                        mode={'permanent'}
                        client={client}
                        selectedRoom={form.getValues('room')}
                        selectedWing={form.getValues('wing').toString()}
                      />
                      <ClientRoomForm
                        mode={'temporary'}
                        client={client}
                        selectedRoom={form.getValues('room')}
                        selectedWing={form.getValues('wing').toString()}
                      />
                    </div>
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
