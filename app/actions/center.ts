'use server';

import { supabase } from '@/lib/supabase/database';
import { Center } from '@/lib/types';

const CENTER_FIELDS = 'id, name, slug, description, image_url, created_at';

export async function getCenters(): Promise<{ data: Center[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('centers')
      .select(CENTER_FIELDS)
      .order('name');

    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as Center[], error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function getCenter(slug: string): Promise<{ data: Center | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('centers')
      .select(CENTER_FIELDS)
      .eq('slug', slug)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as Center, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}
