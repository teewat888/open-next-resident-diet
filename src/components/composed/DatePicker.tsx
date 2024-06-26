'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({
  name,
  onChange,
  value,
  nextAvailableDate,
}: {
  name: string;
  onChange: (value: string) => void;
  value?: string;
  nextAvailableDate?: string;
}) {
  const [date, setDate] = React.useState<Date | undefined>(() =>
    value ? new Date(value) : undefined
  );
  const [isVisible, setIsVisible] = React.useState(false);

  const handleDaySelect = (day: Date | undefined) => {
    setDate(day);
    setIsVisible(false);
    if (onChange && day) onChange(day.toISOString());
  };

  const toggleCalendar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <input type='hidden' name={name} value={date ? date.toISOString() : ''} />
      <Popover open={isVisible}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              `w-full justify-start text-left font-normal`,
              !date && 'text-muted-foreground'
            )}
            onClick={toggleCalendar}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={handleDaySelect}
            initialFocus
            disabled={
              nextAvailableDate
                ? { before: new Date(nextAvailableDate) }
                : false
            }
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
