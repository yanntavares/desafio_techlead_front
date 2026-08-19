'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { CapacityIcon, CloseIcon } from './Icons';
import { AvailabilityGrid, buildSchedule } from './AvailabilityGrid';
import { getRoomReservations, RoomStatus, type Reservation } from '@/app/api/api';

type AdminRoomDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  name: string;
  capacity: number;
  description?: string;
  status: RoomStatus;
  onRemove?: () => void;
  onEdit?: () => void;
  onReactivate?: () => void;
  reactivating?: boolean;
  reactivateError?: string | null;
};

export function AdminRoomDetailsModal({
  isOpen,
  onClose,
  roomId,
  name,
  capacity,
  description,
  status,
  onRemove,
  onEdit,
  onReactivate,
  reactivating,
  reactivateError,
}: AdminRoomDetailsModalProps) {
  // ponytail: mirrors RoomDetailsModal.tsx — GET /room/active never includes reservations,
  // so fetch this room's own reservations fresh whenever the modal opens.
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    setWeekOffset(0);
    getRoomReservations(roomId).then(setReservations).catch(() => setReservations([]));
  }, [isOpen, roomId]);
  const startDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 5);
    return d;
  }, [weekOffset]);
  const { schedule } = useMemo(() => buildSchedule(reservations, startDate), [reservations, startDate]);

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
      id="admin-room-details-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="admin-room-details-modal"
        className="relative w-full max-w-3xl lg:max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col md:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          variant="ghost"
          onClick={onClose}
          ariaLabel="Fechar"
          className="absolute top-4 right-4 z-10 p-0"
        >
          <CloseIcon />
        </Button>

        <div className="relative w-full h-48 md:h-auto md:w-72 lg:w-80 shrink-0 bg-gray-200">
          <Image
            src="/images/placeholder.png"
            alt={name}
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col w-full p-6 lg:p-8 gap-6 overflow-y-auto">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#191C1E] pr-8">{name}</h2>
            <div className="flex items-center gap-1 mt-2 text-[#505F76]">
              <CapacityIcon />
              <span className="text-sm font-semibold">{capacity} pessoas</span>
            </div>
          </div>

          {description && (
            <div id="admin-room-description">
              <p className="text-xs font-semibold text-normal uppercase tracking-wide">Descrição</p>
              <p className="text-sm text-[#191C1E] mt-1">{description}</p>
            </div>
          )}

          <div id="admin-room-availability">
            <p className="text-xs font-semibold text-normal uppercase tracking-wide mb-2">Disponibilidade</p>
            <AvailabilityGrid
              schedule={schedule}
              onPrevWeek={() => setWeekOffset((w) => Math.max(0, w - 1))}
              onNextWeek={() => setWeekOffset((w) => w + 1)}
              canGoPrev={weekOffset > 0}
            />
          </div>

          {reactivateError && <p className="text-sm text-red-600">{reactivateError}</p>}

          <div className="mt-auto flex flex-col sm:flex-row justify-end gap-2">
            {status === RoomStatus.REMOVED ? (
              <Button
                variant="hollow"
                label={reactivating ? 'Reativando...' : 'Reativar'}
                onClick={onReactivate ?? onClose}
                disabled={reactivating}
                className="w-full sm:w-auto"
              />
            ) : (
              <Button variant="hollow" label="Remover" onClick={onRemove ?? onClose} className="w-full sm:w-auto" />
            )}
            <Button variant="primary" label="Editar" onClick={onEdit ?? onClose} className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
