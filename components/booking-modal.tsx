'use client';

import { Service } from '@/lib/types';
import { BookingFormSimple } from './booking-form-simple';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {service.name}</DialogTitle>
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