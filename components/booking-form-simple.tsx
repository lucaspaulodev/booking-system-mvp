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
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border p-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border p-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date</label>
            <input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={minDate}
              className="w-full rounded-md border p-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Time</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              disabled={!formData.date || isLoadingSlots || formattedSlots.length === 0}
              className="w-full rounded-md border p-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="">Select a time slot</option>
              {formattedSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
            {isLoadingSlots && formData.date && (
              <p className="text-xs text-blue-500 mt-1">Loading available time slots...</p>
            )}
            {formattedSlots.length === 0 && formData.date && !isLoadingSlots && (
              <p className="text-xs text-gray-500 mt-1">No available slots for this date</p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 mt-2">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-2.5 border rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto text-base sm:text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-md disabled:bg-blue-300 hover:bg-blue-700 w-full sm:w-auto text-base sm:text-sm"
            >
              {isPending ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
      
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl max-w-xs sm:max-w-md w-full shadow-xl">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Booking Confirmed!</h3>
              <p className="text-sm text-gray-500">Your appointment for {service.name} has been booked. You will receive a confirmation email shortly.</p>
            </div>
            <button 
              onClick={handleClose}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-md w-full hover:bg-blue-700 text-base sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
