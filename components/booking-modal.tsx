'use client';

import { Service } from '@/lib/types';
import { BookingFormSimple } from './booking-form-simple';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface BookingModalProps {
  service: Service;
  centerId: string;
  onClose: () => void;
  open: boolean;
}

export function BookingModal({ service, centerId, onClose, open }: BookingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] rounded-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-xl font-semibold text-center sm:text-left">
            Book {service.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {service.description}
          </DialogDescription>
        </DialogHeader>
        <BookingFormSimple
          service={service}
          centerId={centerId}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}