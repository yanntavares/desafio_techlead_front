'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { WarningIcon } from './Icons';
import { deleteReservation, type Reservation } from '@/app/api/api';

type CancelReservationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onCanceled: (reservation: Reservation) => void;
};

export function CancelReservationModal({ isOpen, onClose, id, onCanceled }: CancelReservationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      const reservation = await deleteReservation(id);
      onCanceled(reservation);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível cancelar a reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="cancel-reservation-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="cancel-reservation-modal"
        className="w-full max-w-sm bg-white rounded-xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 bg-red-50 px-6 py-4">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <WarningIcon width={16} height={16} className="text-red-700" />
          </div>
          <h2 className="font-bold text-lg text-[#191C1E]">Cancelar Reserva</h2>
        </div>

        <div className="px-6 py-4 flex flex-col gap-2">
          <p className="text-sm text-normal">
            Tem certeza que deseja cancelar sua reserva? Esta ação não pode ser desfeita.
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 px-6 py-4 border-t border-border/30">
          <Button variant="hollow" label="Manter Reserva" onClick={onClose} className="w-full sm:w-auto" disabled={loading} />
          <Button
            variant="danger"
            label={loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
