export interface Center {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Service {
  id: string;
  center_id: string;
  name: string;
  description: string;
  duration: number; 
  price: number;
  created_at: string;
}

export interface Booking {
  id: string;
  center_id: string;
  service_id: string;
  name: string;
  email: string;
  scheduled: string;
  created_at: string;
  updated_at: string;
} 