'use client';

import { useEffect } from 'react';
import { Button } from './Button';
import { CalendarIcon, CheckIcon, ClockIcon } from './Icons';

type ReservationConfirmedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  day: string;
  time: string;
};

export function ReservationConfirmedModal({ isOpen, onClose, roomName, day, time }: ReservationConfirmedModalProps) {
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
      id="reservation-confirmed-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="reservation-confirmed-modal"
        className="w-full max-w-sm bg-white rounded-xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 bg-green-50 px-6 py-4">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckIcon width={16} height={16} className="text-green-700" />
          </div>
          <h2 className="font-bold text-lg text-[#191C1E]">Reserva Confirmada!</h2>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          <p className="text-sm text-normal">Sua reserva foi confirmada com sucesso.</p>

          <div id="reservation-confirmed-summary" className="flex flex-col gap-2 bg-[#F7F9FB] rounded-lg p-4">
            <span className="font-bold text-[#191C1E]">{roomName}</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-darkest-blue">
              <CalendarIcon width={18} height={18} />
              <span>{day}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-darkest-blue">
              <ClockIcon width={18} height={18} />
              <span>{time}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-border/30">
          <Button variant="primary" label="Fechar" onClick={onClose} className="w-full sm:w-auto" />
        </div>
      </div>
    </div>
  );
}
