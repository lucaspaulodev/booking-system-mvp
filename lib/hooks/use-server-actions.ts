import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  createBooking, 
  getAvailableSlots,
  getCenters, 
  getCenter,
  getCenterServices 
} from '@/app/actions';
import { Booking, Center, Service } from '@/lib/types';

export const serverActionKeys = {
  centers: ['centers'] as const,
  center: (slug: string) => ['center', slug] as const,
  centerServices: (centerId: string) => ['centerServices', centerId] as const,
  availableTimeSlots: (centerId: string, date: string, serviceId: string) => 
    ['availableTimeSlots', centerId, date, serviceId] as const,
};


export function useCenters() {
  return useQuery({
    queryKey: serverActionKeys.centers,
    queryFn: async () => {
      const result = await getCenters();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data || [];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}


export function useCenter(slug: string) {
  return useQuery({
    queryKey: serverActionKeys.center(slug),
    queryFn: async () => {
      const result = await getCenter(slug);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data as Center;
    },
    enabled: !!slug,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useCenterServices(centerId: string) {
  return useQuery({
    queryKey: serverActionKeys.centerServices(centerId),
    queryFn: async () => {
      const result = await getCenterServices(centerId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data || [];
    },
    enabled: !!centerId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useCenterWithServices(slug: string) {
  const centerQuery = useCenter(slug);
  const servicesQuery = useCenterServices(centerQuery.data?.id ?? '');

  return {
    center: centerQuery.data,
    services: servicesQuery.data,
    isLoading: centerQuery.isLoading || servicesQuery.isLoading,
    error: centerQuery.error || servicesQuery.error,
  };
}

export function useAvailableTimeSlots(centerId: string, date: string, serviceId: string) {
  return useQuery({
    queryKey: serverActionKeys.availableTimeSlots(centerId, date, serviceId),
    queryFn: async () => {
      const result = await getAvailableSlots(centerId, date, serviceId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data || [];
    },
    enabled: !!centerId && !!date && !!serviceId,
    staleTime: 60 * 1000,     
    gcTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await createBooking(booking);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data as Booking;
    },
    onSuccess: (_, variables) => {    
      queryClient.invalidateQueries({
        queryKey: serverActionKeys.availableTimeSlots(variables.center_id, '', '')
      });
    },
  });
}
