'use client';

import { useState } from 'react';
import { Service } from '@/lib/types';
import { useCenter, useCenterServices } from '@/lib/hooks/use-server-actions';
import { ServiceCard } from './service-card';
import { BookingModal } from './booking-modal';

interface CenterPageClientProps {
  slug: string;
}

export function CenterPageClient({ slug }: CenterPageClientProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const { 
    data: center, 
    isLoading: isLoadingCenter, 
    error: centerError 
  } = useCenter(slug);

  const { 
    data: services, 
    isLoading: isLoadingServices, 
    error: servicesError 
  } = useCenterServices(center?.id || '');

  if (isLoadingCenter) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading center details...</p>
        </div>
      </div>
    );
  }

  if (centerError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Error loading center details</p>
        <p className="text-sm text-muted-foreground">
          {centerError instanceof Error ? centerError.message : 'Please try again later'}
        </p>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-2">Center Not Found</h2>
        <p className="text-muted-foreground">The center you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (isLoadingServices) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{center.name}</h1>
          <p className="text-muted-foreground">{center.description}</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{center.name}</h1>
          <p className="text-muted-foreground">{center.description}</p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Error loading services</p>
          <p className="text-sm text-muted-foreground">
            {servicesError instanceof Error ? servicesError.message : 'Please try again later'}
          </p>
        </div>
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{center.name}</h1>
          <p className="text-muted-foreground">{center.description}</p>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No services available at this center.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{center.name}</h1>
        <p className="text-muted-foreground">{center.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onBook={() => setSelectedService(service)}
          />
        ))}
      </div>

      {selectedService && (
        <BookingModal
          service={selectedService}
          centerId={center.id}
          onClose={() => setSelectedService(null)}
          open={!!selectedService}
        />
      )}
    </div>
  );
} 