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
import FieldErrorClient from '@/components/composed/FieldErrorClient';

const locationSchema = z.object({
  wing: z.string().min(1, 'Select a wing'),
  room: z.string().min(1, 'Select a room'),
});

const StepForm = ({ clientId }: { clientId: string }) => {
  const [wings, setWings] = useState([] as Wing[]);
  const [client, setClient] = useState({} as Client);
  const [rooms, setRooms] = useState([] as AvailableRoom[]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedWing, setSelectedWing] = useState('' as Wing['id'] | '0');
  const [validationErrors, setValidationErrors] = useState(
    null as null | z.ZodIssue[]
  );
  const [isClientAlreadyInRoom, setIsClientAlreadyInRoom] = useState(false);

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
      setSelectedWing(value as Wing['id'] | '0');
    })();
  };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    const result = locationSchema.safeParse({
      wing: selectedWing.toString(),
      room: selectedRoom,
    });

    if (result.success) {
      setValidationErrors(null);
    } else {
      setValidationErrors(result.error.issues);
    }
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
  console.log('validationErrors', validationErrors);
  return (
    <>
      <div className='relative flex-col items-start gap-8 md:flex pt-6'>
        <form
          onSubmit={handleSubmission}
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
                <Label htmlFor='wing'>Select a wing</Label>
                <Select name={'wing'} onValueChange={handleSelectWing}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a wing' />
                  </SelectTrigger>
                  <SelectContent>{wingOptions}</SelectContent>
                </Select>
                <FieldErrorClient
                  fieldName='wing'
                  errors={validationErrors ?? []}
                />
              </div>
              {rooms.length > 0 && (
                <>
                  <div className='grid gap-3'>
                    <Label htmlFor='room'>Select a room</Label>
                    <Select
                      name={'room'}
                      onValueChange={(e: string) => {
                        setSelectedRoom(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a room' />
                      </SelectTrigger>
                      <SelectContent>{roomOptions}</SelectContent>
                    </Select>
                  </div>
                  <FieldErrorClient
                    fieldName='room'
                    errors={validationErrors ?? []}
                  />
                </>
              )}
              {selectedRoom && (
                <>
                  <div className='flex gap-4'>
                    <ClientRoomForm
                      mode={'permanent'}
                      client={client}
                      selectedRoom={selectedRoom}
                      selectedWing={selectedWing.toString()}
                    />
                    <ClientRoomForm
                      mode={'temporary'}
                      client={client}
                      selectedRoom={selectedRoom}
                      selectedWing={selectedWing.toString()}
                    />
                  </div>
                </>
              )}
            </fieldset>
            <div className='flex justify-end gap-4'>
              <Button type='button' className='w-1/2' variant={'secondary'}>
                Skip
              </Button>
              <Button
                type='submit'
                className='w-1/2'
                disabled={
                  !isClientAlreadyInRoom && !!selectedRoom && !!selectedWing
                }
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default StepForm;
