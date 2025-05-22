'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Service } from '@/lib/types';
import { SuccessModal } from '@/components/success-modal';
import { formatTimeForDisplay } from '@/lib/utils/date';
import { useAvailableTimeSlots, useCreateBooking } from '@/lib/hooks/use-server-actions';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  service: Service;
  centerId: string;
  onCancel: () => void;
  onSubmit: (bookingData: {
    name: string;
    email: string;
    date: string;
    time: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function BookingForm({ service, centerId, onCancel, onSubmit }: BookingFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
  });

  const selectedDate = watch('date');
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const { data: availableSlots, isLoading: isLoadingSlots } = useAvailableTimeSlots(
    centerId,
    selectedDate || '',
    service.id
  );

  const createBooking = useCreateBooking();

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      await onSubmit(data);
      setShowSuccess(true);
      reset();
    } catch (err) {
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    onCancel();
  };

  const formattedSlots = useMemo(
    () =>
      availableSlots?.map((slotTime) => {
        const timeStr = new Date(slotTime).toTimeString().slice(0, 5);
        return { value: timeStr, label: formatTimeForDisplay(new Date(slotTime)) };
      }) || [],
    [availableSlots]
  );

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Duration: {service.duration} minutes
            <br />
            Price: ${service.price}
          </p>
        </div>

        <Input
          {...register('name')}
          placeholder="Your Name"
          error={errors.name?.message}
        />
        <Input
          {...register('email')}
          type="email"
          placeholder="Your Email"
          error={errors.email?.message}
        />
        <Input
          {...register('date')}
          type="date"
          min={minDate}
          error={errors.date?.message}
        />

        <div>
          {isLoadingSlots ? (
            <div className="text-sm text-muted-foreground">Loading available times...</div>
          ) : formattedSlots.length === 0 ? (
            <div className="text-sm text-muted-foreground">No available time slots for this date</div>
          ) : (
            <select
              {...register('time')}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select a time</option>
              {formattedSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          )}
          {errors.time?.message && (
            <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
          )}
        </div>

        {createBooking.isError && (
          <p className="text-sm text-red-500">
            {createBooking.error instanceof Error
              ? createBooking.error.message
              : 'Failed to create booking'}
          </p>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createBooking.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createBooking.isPending ||
              isLoadingSlots ||
              formattedSlots.length === 0 ||
              !isValid
            }
          >
            {createBooking.isPending ? 'Booking...' : 'Book Now'}
          </Button>
        </div>
      </form>

      {showSuccess && <SuccessModal onClose={handleClose} open={showSuccess} />}
    </>
  );
}