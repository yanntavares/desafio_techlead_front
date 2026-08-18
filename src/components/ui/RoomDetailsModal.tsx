'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { CapacityIcon, CloseIcon } from './Icons';
import { AvailabilityGrid, buildSchedule } from './AvailabilityGrid';
import { createReservation, getRoomReservations, type Reservation } from '@/app/api/api';
import { getCurrentUser } from '@/utils/lib/auth';

type RoomDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  name: string;
  capacity: number;
  description?: string;
  onReserved?: (reservation: Reservation) => void;
};

const durationOptions = ['1h','2h','3h'] as const;
const durationHours: Record<(typeof durationOptions)[number], number> = {
  '1h': 1,
  '2h': 2,
  '3h': 3,
};

function formatHour(hour: number) {
  const wholeHours = Math.floor(hour);
  const minutes = hour - wholeHours === 0.5 ? '30' : '';
  return minutes ? `${wholeHours}h${minutes}` : `${wholeHours}h`;
}

export function RoomDetailsModal({
  isOpen,
  onClose,
  roomId,
  name,
  capacity,
  description,
  onReserved,
}: RoomDetailsModalProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<(typeof durationOptions)[number]>('1h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ponytail: GET /room/active never includes reservations, so fetch this room's own
  // reservations fresh whenever the modal opens instead of trusting a stale/empty prop.
  const [reservations, setReservations] = useState<Reservation[]>([]);
  useEffect(() => {
    if (!isOpen) return;
    getRoomReservations(roomId).then(setReservations).catch(() => setReservations([]));
  }, [isOpen, roomId]);
  const { schedule, dateByDay } = useMemo(() => buildSchedule(reservations), [reservations]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectSlot = (day: string, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
  };

  const handleReserve = async () => {
    if (!selectedDay || !selectedTime) return;
    const userId = getCurrentUser()?.sub;
    if (!userId) {
      setError('Não foi possível identificar o usuário logado.');
      return;
    }

    const day = dateByDay[selectedDay];
    const hour = Number(selectedTime.split(':')[0]);
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start.getTime() + durationHours[duration] * 3_600_000);

    setError(null);
    setLoading(true);
    try {
      const reservation = await createReservation({
        userId,
        roomId,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
      });
      setReservations((prev) => [...prev, reservation]);
      onReserved?.(reservation);
      onClose();
      setSelectedDay(null);
      setSelectedTime(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a reserva');
    } finally {
      setLoading(false);
    }
  };

  const startHour = selectedTime ? Number(selectedTime.split(':')[0]) : null;

  return (
    <div
      id="room-details-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="room-details-modal"
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
            src='/images/placeholder.png'
            alt={name}
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover"
          />
        </div>

        <div id="room-details-content" className="flex flex-col w-full p-6 lg:p-8 gap-6 overflow-y-auto">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#191C1E] pr-8">{name}</h2>
            <div className="flex items-center gap-1 mt-2 text-[#505F76]">
              <CapacityIcon />
              <span className="text-sm font-semibold">{capacity} pessoas</span>
            </div>
          </div>

          {description && (
            <div id="room-details-description">
              <p className="text-xs font-semibold text-normal uppercase tracking-wide">Descrição</p>
              <p className="text-sm text-[#191C1E] mt-1">{description}</p>
            </div>
          )}

          <div id="room-details-duration">
            <p className="text-xs font-semibold text-normal uppercase tracking-wide mb-2">Duração</p>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((option) => (
                <Button
                  key={option}
                  variant={duration === option ? 'primary' : 'hollow'}
                  label={option}
                  onClick={() => setDuration(option)}
                  className="px-3 py-1 text-sm font-medium"
                />
              ))}
            </div>
          </div>

          <div id="room-details-availability">
            <p className="text-xs font-semibold text-normal uppercase tracking-wide mb-2">Disponibilidade</p>
            <AvailabilityGrid
              schedule={schedule}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              onSelectSlot={handleSelectSlot}
            />
          </div>

          {selectedDay && selectedTime && startHour !== null && (
            <p className="text-sm text-normal border-t border-border/30 pt-4">
              Selecionado: {selectedDay}, {formatHour(startHour)} - {formatHour(startHour + durationHours[duration])}
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-auto flex justify-end">
            <Button
              label={loading ? 'Reservando...' : 'Reservar'}
              variant="primary"
              disabled={!selectedDay || !selectedTime || loading}
              onClick={handleReserve}
              className="w-full md:w-40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
