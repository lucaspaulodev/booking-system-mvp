'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase/database';
import { getServiceDuration } from '@/app/actions/service';
import { Booking } from '@/lib/types';

const BOOKING_FIELDS = 'id, center_id, service_id, scheduled, name, email, created_at, updated_at';


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

    const durationMs = duration * 60_000;
    const bookingEnd = new Date(bookingStart.getTime() + durationMs);

    const { data: existingBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('id, scheduled, service_id, services(duration)')
      .eq('center_id', booking.center_id);

    if (fetchError) {
      return { data: null, error: 'Error checking booking conflicts.' };
    }

    const conflicts = await Promise.all((existingBookings || []).map(async (existingBooking) => {
      const existingStart = new Date(existingBooking.scheduled);
      
      let existingDuration = 0; 
      if (existingBooking.services && 'duration' in existingBooking.services) {
        existingDuration = Number(existingBooking.services.duration) || 0;
      } else {
        const duration = await getServiceDuration(existingBooking.service_id);
        if (duration !== null) {
          existingDuration = duration;
        }
      }
      
      const existingEnd = new Date(existingStart.getTime() + (existingDuration * 60_000));
      
      return (bookingStart < existingEnd && bookingEnd > existingStart);
    }));

    if (conflicts.some(conflict => conflict)) {
      return { data: null, error: 'Time slot is already booked.' };
    }

    const { data: newBooking, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select(BOOKING_FIELDS)
      .single();

    if (error) {
      return { data: null, error: 'Failed to create booking.' };
    }

    revalidatePath('/bookings');
    
    return { data: newBooking as Booking, error: null };
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
    
    // Create dates using explicit local time representation to ensure consistency
    // Use the Date constructor with separate arguments to ensure local timezone interpretation
    // This ensures the time is always 9AM to 6PM in the local timezone regardless of server location
    const startOfDay = new Date(year, month - 1, day, 9, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 18, 0, 0);
    
    // Store timestamps to use for time slot display formatting
    const startHour = 9;
    const endHour = 18;


    const { data: existingBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('id, scheduled, service_id, services(duration)')
      .eq('center_id', centerId)
      .gte('scheduled', startOfDay.toISOString())
      .lt('scheduled', endOfDay.toISOString());
      
    if (fetchError) {
      return { data: null, error: 'Error fetching existing bookings.' };
    }

    const bookedRanges = await Promise.all((existingBookings || []).map(async (booking) => {
      const start = new Date(booking.scheduled);
      
      let bookingDuration = 0;
      if (booking.services && 'duration' in booking.services) {
        bookingDuration = Number(booking.services.duration) || 0;
      } else {
        const duration = await getServiceDuration(booking.service_id);
        if (duration !== null) {
          bookingDuration = duration;
        }
      }
      
      const end = new Date(start.getTime() + (bookingDuration * 60_000));
      
      return {
        start,
        end,
        serviceId: booking.service_id
      };
    }));


    const availableTimeSlots: string[] = [];
    const slotInterval = 30; 
    const serviceDurationMinutes = duration;
    
    let currentSlot = new Date(startOfDay);
    const lastSlotStart = new Date(endOfDay.getTime() - (serviceDurationMinutes * 60_000));
    
    while (currentSlot <= lastSlotStart) {
      const slotEnd = new Date(currentSlot.getTime() + (serviceDurationMinutes * 60_000));
      
      const isConflicting = bookedRanges.some(range => {
        const hasOverlap = (currentSlot < range.end && slotEnd > range.start);
        
        return hasOverlap;
      });
      
      if (!isConflicting) {
        // Format the date in ISO format but preserve the exact time we want
        // This ensures consistent 9AM-6PM display regardless of server timezone
        const slotDate = new Date(
          currentSlot.getFullYear(),
          currentSlot.getMonth(),
          currentSlot.getDate(),
          currentSlot.getHours(),
          currentSlot.getMinutes()
        );
        availableTimeSlots.push(slotDate.toISOString());
      }
      
      currentSlot = new Date(currentSlot.getTime() + (slotInterval * 60_000));
    }

    return { data: availableTimeSlots, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}
