import { DatePicker } from '@/components/composed/DatePicker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Client } from '@/lib/db/schema';

type ClientRoomFormProps = {
  mode: 'permanent' | 'temporary';
  client: Client;
  selectedRoom: string;
  selectedWing: string;
};

export const ClientRoomForm = ({
  mode,
  client,
  selectedRoom,
  selectedWing,
}: ClientRoomFormProps) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='secondary' className='w-1/2'>
            {mode === 'permanent' ? 'Permanent stay' : 'Temporary stay'}
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {mode === 'permanent' ? 'Permanent stay' : 'Temporary stay'}
            </DialogTitle>
            <DialogDescription>
              Please setup the room for the{' '}
              <b>
                {client.firstName} {client.lastName}
              </b>
              .
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='start_date' className='text-left'>
                Admit date
              </Label>
              <DatePicker name={'start_date'} />
            </div>
            {mode === 'temporary' && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='end_date' className='text-left '>
                  Discharge date
                </Label>
                <DatePicker name={'end_date'} inputWidth={'w-[280px]'} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type='submit'>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
