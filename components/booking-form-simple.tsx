'use client';

import { useState, useTransition } from 'react';
import { createBooking } from '@/app/actions';
import { useAvailableTimeSlots } from '@/lib/hooks/use-server-actions';
import { Service } from '@/lib/types';
import { formatTimeForDisplay } from '@/lib/utils/date';


type BookingFormData = {
  name: string;
  email: string;
  date: string;
  time: string;
};

interface BookingFormProps {
  centerId: string;
  service: Service;
  onCancel: () => void;
}

export function BookingFormSimple({ centerId, service, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    date: '',
    time: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const minDate = new Date().toISOString().split('T')[0];
  

  const { data: availableSlots, isLoading: isLoadingSlots } = useAvailableTimeSlots(
    centerId,
    formData.date || '',
    service.id
  );
  

  const formattedSlots = availableSlots?.map((slotTime) => {
    try {
      const slotDate = new Date(slotTime);
      return { 
        value: slotTime, 
        label: formatTimeForDisplay(slotDate) 
      };
    } catch (error) {
      return null;  
    }
  }).filter(slot => slot !== null) || [];
  

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    

    startTransition(async () => {
      try {

        if (!formData.name || !formData.email || !formData.date || !formData.time) {
          setError('All fields are required');
          return;
        }
        

        const bookingData = {
          center_id: centerId,
          service_id: service.id,
          scheduled: formData.time,
          name: formData.name,
          email: formData.email,
        };
        

        const result = await createBooking(bookingData);
        
        if (result.error) {
          setError(result.error);
        } else {

          setShowSuccess(true);
          setFormData({
            name: '',
            email: '',
            date: '',
            time: ''
          });
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    });
  };
  
  const handleClose = () => {
    setShowSuccess(false);
    onCancel();
  };
  
  return (
    <>
      <div className="space-y-6 p-4">
        <h2 className="text-xl font-semibold">Book {service.name}</h2>
        <p className="text-sm text-gray-500">{service.description}</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={minDate}
              className="w-full rounded-md border p-2"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              disabled={!formData.date || isLoadingSlots || formattedSlots.length === 0}
              className="w-full rounded-md border p-2"
            >
              <option value="">Select a time slot</option>
              {formattedSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
            {isLoadingSlots && formData.date && (
              <p className="text-sm text-blue-500">Loading available time slots...</p>
            )}
            {formattedSlots.length === 0 && formData.date && !isLoadingSlots && (
              <p className="text-sm text-gray-500">No available slots for this date</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
            >
              {isPending ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
      
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Booking Confirmed!</h3>
            <p className="mb-4">Your appointment for {service.name} has been booked. You will receive a confirmation email shortly.</p>
            <button 
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
