import { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="text-xl font-semibold">{service.name}</h3>
        <p className="text-gray-600 mt-2">{service.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-lg font-medium">${service.price}</p>
            <p className="text-sm text-gray-500">{service.duration} minutes</p>
          </div>
          <Button onClick={() => onBook(service)}>Book Now</Button>
        </div>
      </div>
    </div>
  );
} 