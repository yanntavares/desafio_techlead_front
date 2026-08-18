'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { CalendarIcon, CapacityIcon, CheckIcon, ClockIcon, CloseIcon } from './Icons';

type ReservationStatus = 'COMPLETED' | 'SCHEDULED' | 'CANCELED';

type ReservationDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCancelReservation?: () => void;
  onCompleteReservation?: () => void;
  date: string;
  time: string;
  status: ReservationStatus;
  roomName: string;
  capacity: number;
  description?: string;
  bookedBy: { name: string; email: string; initials: string };
};

function getStatusStyle(status: ReservationStatus) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}

const statusLabel: Record<ReservationStatus, string> = {
  COMPLETED: 'Completed',
  SCHEDULED: 'Scheduled',
  CANCELED: 'Canceled',
};

export function ReservationDetailsModal({
  isOpen,
  onClose,
  onCancelReservation,
  onCompleteReservation,
  date,
  time,
  status,
  roomName,
  capacity,
  description,
  bookedBy,
}: ReservationDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="reservation-details-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="reservation-details-modal"
        className="w-full max-w-md md:max-w-lg max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h2 className="text-xl font-bold text-darkest-blue">Detalhes da Reserva</h2>
          <Button variant="ghost" onClick={onClose} ariaLabel="Fechar" className="p-0">
            <CloseIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-6 p-6 overflow-y-auto">
          <div id="reservation-details-summary" className="flex items-start justify-between gap-4 bg-[#F7F9FB] rounded-lg p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-darkest-blue">
                <CalendarIcon width={18} height={18} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-darkest-blue">
                <ClockIcon width={18} height={18} />
                <span>{time}</span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${getStatusStyle(status)}`}>
              {status === 'COMPLETED' && <CheckIcon width={12} height={12} />}
              {statusLabel[status]}
            </span>
          </div>

          <div id="reservation-details-room" className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full h-32 sm:w-24 sm:h-24 shrink-0 bg-gray-200 rounded-lg overflow-hidden">
              <Image src="/images/placeholder.png" alt={roomName} fill sizes="96px" className="object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-lg text-[#191C1E]">{roomName}</span>
              <div className="flex items-center gap-1 text-[#505F76]">
                <CapacityIcon />
                <span className="text-sm font-semibold">Capacidade: {capacity} pessoas</span>
              </div>
              {description && (
                <div>
                  <p className="text-xs font-semibold text-darkest-blue uppercase tracking-wide">Descrição</p>
                  <p className="text-sm text-[#191C1E] mt-0.5">{description}</p>
                </div>
              )}
            </div>
          </div>

          <div id="reservation-details-booked-by" className="flex flex-col gap-2 border-t border-border/30 pt-4">
            <p className="text-xs font-semibold text-darkest-blue uppercase tracking-wide">Agendado por</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-darkest-blue text-white flex items-center justify-center text-sm font-bold shrink-0">
                {bookedBy.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#191C1E]">{bookedBy.name}</p>
                <p className="text-sm text-[#505F76]">{bookedBy.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            {status === 'SCHEDULED' ? (
              <>
                <Button variant="hollow" label="Cancelar reserva" onClick={onCancelReservation} className="w-full sm:w-auto" />
                <Button variant="primary" label="Concluir" onClick={onCompleteReservation} className="w-full sm:w-auto" />
              </>
            ) : (
              <Button variant="primary" label="Fechar" onClick={onClose} className="w-full sm:w-auto" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
