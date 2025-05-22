'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase/database';
import { getServiceDuration } from '@/app/actions/service';
import { Booking } from '@/lib/types';

const BOOKING_FIELDS = 'id, center_id, service_id, scheduled, name, email, created_at, updated_at';

const BUSINESS_HOURS_START = 9;
const BUSINESS_HOURS_END = 18;

export async function createBooking(
  booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Booking | null; error: string | null }> {
  try {
    const bookingStart = new Date(booking.scheduled);
    const now = new Date();

    if (bookingStart <= now) {
      return { data: null, error: 'Booking must be in the future.' };
    }
    
    const hour = bookingStart.getHours();
    if (hour < 9 || hour >= 18) {
      return { data: null, error: 'Bookings must be between 9 AM and 6 PM.' };
    }

    const duration = await getServiceDuration(booking.service_id);
    if (!duration) {
      return { data: null, error: 'Service not found.' };
    }
    
    const availableSlots = await getAvailableSlots(
      booking.center_id,
      bookingStart.toISOString().split('T')[0],
      booking.service_id
    );
    
    if (!availableSlots.data || !availableSlots.data.includes(booking.scheduled)) {
      return {
        data: null,
        error: 'The selected time slot is not available. Please choose another time.'
      };
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select(BOOKING_FIELDS)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath(`/${booking.center_id}`);
    
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function getAvailableSlots(
  centerId: string,
  date: string,
  serviceId: string
): Promise<{ data: string[] | null; error: string | null }> {
  try {
    const duration = await getServiceDuration(serviceId);
    if (!duration) {
      return { data: null, error: 'Service not found or has no duration set.' };
    }
    const [year, month, day] = date.split('-').map(Number);
    
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const { data: existingBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('id, scheduled, service_id, services(duration)')
      .eq('center_id', centerId)
      .like('scheduled', `${formattedDate}%`);
      
    if (fetchError) {
      return { data: null, error: 'Error fetching existing bookings.' };
    }
    
    const bookedRanges = [];
    for (const booking of existingBookings || []) {
      const bookingDate = new Date(booking.scheduled);
      
      const hours = bookingDate.getHours();
      const minutes = bookingDate.getMinutes();
      
      let bookingDuration = 0;
      if (booking.services && 'duration' in booking.services) {
        bookingDuration = Number(booking.services.duration) || 0;
      } else {
        const duration = await getServiceDuration(booking.service_id);
        if (duration !== null) {
          bookingDuration = duration;
        }
      }
      
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + bookingDuration;
      
      bookedRanges.push({
        startMinutes,
        endMinutes,
        serviceId: booking.service_id
      });
    }

    const availableTimeSlots = [];
    const slotInterval = 30;
    const serviceDurationMinutes = duration;
    
    const startMinutes = BUSINESS_HOURS_START * 60;
    const endMinutes = BUSINESS_HOURS_END * 60;
    
    for (let slotStart = startMinutes; slotStart < endMinutes; slotStart += slotInterval) {
      if (slotStart + serviceDurationMinutes > endMinutes) {
        continue;
      }
      
      const slotEnd = slotStart + serviceDurationMinutes;
      
      const isConflicting = bookedRanges.some(range => {
        return (slotStart < range.endMinutes && slotEnd > range.startMinutes);
      });
      
      if (!isConflicting) {
        const slotHour = Math.floor(slotStart / 60);
        const slotMinute = slotStart % 60;
        
        const timeString = `${String(slotHour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}:00`;
        const formattedSlot = `${formattedDate}T${timeString}.000Z`;
        
        availableTimeSlots.push(formattedSlot);
      }
    }

    return { data: availableTimeSlots, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}
