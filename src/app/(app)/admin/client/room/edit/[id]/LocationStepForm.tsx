'use client';
import {
  AvailableRoom,
  createClientRoom,
  getAvailableRooms,
  getClientInfo,
  getWings,
  isClientInRoom,
} from '@/actions';

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

import { useEffect, useState, useTransition } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useClientStore } from '@/store/client';

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
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/composed/SubmitButton';
import Loading from '@/components/composed/Loading';
import usePrepareFormData from '@/hooks/usePrepareFormData';
import { STATUS } from '@/constant';
import { format } from 'date-fns';

const locationSchema = z
  .object({
    wing: z.string().min(1, 'Please select a wing'),
    room_id: z.string().min(1, 'Please select a room'),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine((data) => (data.room_id ? !!data.start_date : true), {
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

const LocationStepForm = ({ clientId }: { clientId: string }) => {
  const [wings, setWings] = useState([] as Wing[]);
  const [rooms, setRooms] = useState([] as AvailableRoom[]);

  const clientInfo = useClientStore((state) => state.client);

  const [nextAvailableDate, setNextAvailableDate] = useState<
    string | undefined
  >(undefined);

  //TODO since we already got array of room and it info, use that to filter disabled range of calendar

  const router = useRouter();

  const { prepareFormData } =
    usePrepareFormData<z.infer<typeof locationSchema>>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      wing: undefined,
      room_id: undefined,
      start_date: undefined,
      end_date: undefined,
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
      {room.next_available_date
        ? `(will be available from ${format(room.next_available_date, 'PPP')})`
        : ''}
    </SelectItem>
  ));

  const handleSelectWing = (value: string) => {
    (async () => {
      const rooms = await getAvailableRooms(value);
      setRooms(rooms);
      form.setValue('room_id', '');
    })();
  };

  const handleSelectRoom = (roomId: string) => {
    const selectedRoom = rooms.find(
      (room) => room.room_id.toString() === roomId
    );
    if (selectedRoom && selectedRoom.next_available_date) {
      setNextAvailableDate(selectedRoom.next_available_date);
    } else {
      setNextAvailableDate(undefined);
    }
  };

  const onSubmit = async (values: z.infer<typeof locationSchema>) => {
    startTransition(async () => {
      const formData = prepareFormData(values, {
        excludeKeys: ['wing'],
        extraData: { client_id: clientId, status: clientRoomStatus() },
      });
      const result = await createClientRoom(formData);
      if (result.status === STATUS.SUCCESS) {
        router.push(`/admin/client/meal/default/edit/${result.id}`);
      }
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const [wings, client] = await Promise.all([
          getWings(),
          getClientInfo(clientId),
        ]);
        setWings(wings);
        if (!clientInfo || clientInfo.id !== client[0].id) {
          useClientStore.getState().setClient({
            id: client[0].id,
            firstName: client[0].firstName,
            lastName: client[0].lastName,
            photo: client[0].photo,
            default_meal_size_id: client[0].default_meal_size_id,
            default_food_consistency_id: client[0].default_food_consistency_id,
            default_liquid_consistency_id:
              client[0].default_liquid_consistency_id,
            createdAt: client[0].createdAt,
            updatedAt: client[0].updatedAt,
          });
        }
      } catch (error) {
        console.error(error);
      }
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
                  {clientInfo?.firstName ? (
                    `Location for ${clientInfo.firstName} ${clientInfo.lastName}`
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
                      name='room_id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              name={field.name}
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectRoom(value);
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
                {form.getValues('room_id') && (
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
                              nextAvailableDate={nextAvailableDate}
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
                              nextAvailableDate={nextAvailableDate}
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
                <Button type='button' variant={'secondary'}>
                  Skip
                </Button>
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
export default LocationStepForm;
