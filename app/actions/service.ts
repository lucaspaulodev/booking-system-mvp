'use server';

import { supabase } from '@/lib/supabase/database';
import { Service } from '@/lib/types';

const SERVICE_FIELDS = 'id, name, description, duration, price, center_id, created_at';


export async function getCenterServices(centerId: string): Promise<{ data: Service[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(SERVICE_FIELDS)
      .eq('center_id', centerId);

    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as Service[], error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function getServiceDuration(serviceId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single();

    if (error) {
      return null;
    }
    
    return data.duration;
  } catch (error) {
    return null;
  }
}
