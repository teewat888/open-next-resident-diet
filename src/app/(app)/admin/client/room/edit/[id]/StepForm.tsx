'use client';
import { getAvailableRooms, getClientInfo, getWings } from '@/app/actions';

import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Client, Room, Wing } from '@/lib/db/schema';
import { useEffect, useState } from 'react';

const StepForm = ({ clientId }: { clientId: string }) => {
  const [wings, setWings] = useState([] as Wing[]);
  const [client, setClient] = useState({} as Client);
  const [rooms, setRooms] = useState([] as Room[]);

  const wingOptions = wings.map((wing) => (
    <SelectItem key={wing.id} value={wing.id.toString()}>
      {wing.name}
    </SelectItem>
  ));

  const roomOptions = rooms.map((room) => (
    <SelectItem key={room.id} value={room.id.toString()}>
      {room.room_number}
    </SelectItem>
  ));

  const handleSelectWing = (value: string) => {
    (async () => {
      const rooms = await getAvailableRooms(value);
      setRooms(rooms);
    })();
  };

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
        <form className='grid w-full items-start gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-1 gap-6 md:w-1/2 m-auto'>
            <fieldset
              className={`grid gap-6 rounded-lg border p-4 
              }`}
            >
              <legend className='-ml-1 px-1 text-sm font-medium'>
                Location for {client.firstName} {client.lastName}
              </legend>
              <div className='grid gap-3'>
                <Label htmlFor='wing'>Select a wing</Label>
                <Select onValueChange={handleSelectWing}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a wing' />
                  </SelectTrigger>
                  <SelectContent>{wingOptions}</SelectContent>
                </Select>
              </div>
              {rooms.length > 0 && (
                <div className='grid gap-3'>
                  <Label htmlFor='room'>Select a room</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a room' />
                    </SelectTrigger>
                    <SelectContent>{roomOptions}</SelectContent>
                  </Select>
                </div>
              )}
            </fieldset>
            <div className='flex justify-end gap-4'>
              <Button type='button' className='w-1/2' variant={'outline'}>
                Skip
              </Button>
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
export default StepForm;
