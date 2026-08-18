'use client';

import { useState } from 'react';
import { Button } from './Button';
import { CapacityIcon } from './Icons';
import { RoomDetailsModal } from './RoomDetailsModal';
import { ReservationConfirmedModal } from './ReservationConfirmedModal';
import Image from 'next/image';
import { type Reservation } from '@/app/api/api';
import { formatDate, formatTimeRange } from '@/utils/lib/format';

type CardProps = {
  id: string;
  name: string;
  variant?: 'primary' | 'secondary'; // Removido o reservation
  description?: string;
  capacity: number;
  className?: string;
};

export function Card({ id, name, description, capacity, variant = 'primary', className }: CardProps) {
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const styles = {
    wrapper: {
      primary:
        'w-full h-auto md:h-96 bg-[#FAFAFA] border-2 border-border/30 rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center md:pr-6',
      secondary: 'w-full h-96 bg-[#FAFAFA] border-2 border-border/30 rounded-lg overflow-hidden flex flex-col',
    },
    image: {
      primary: 'relative w-full h-48 md:w-72 lg:w-[560px] md:h-full bg-gray-200 shrink-0',
      secondary: 'relative w-full h-48 bg-gray-200 shrink-0',
    },
    content: {
      primary: 'flex flex-col items-start justify-center gap-4 w-full p-4 md:p-0 md:pl-6',
      secondary: 'flex flex-col items-start justify-start gap-2 p-4 w-full h-full',
    },
  };

  return (
    <div className={`${styles.wrapper[variant]} ${className || ''}`}>
      <div className={styles.image[variant]}>
        <Image
          src="/images/placeholder.png"
          alt={name}
          fill
          sizes="288px"
          className="object-cover"
        />
      </div>

      <div className={styles.content[variant]}>
        <div className={variant === 'primary' ? 'md:h-64' : 'h-24'}>
          <div className="flex flex-col gap-3 w-full">
            <span className={`font-bold text-[#191C1E] ${variant === 'primary' ? 'text-xl md:text-3xl' : 'text-xl'}`}>
              {name}
            </span>

            {variant === 'primary' && description && (
              <span className="text-md text-[#505F76]">{description}</span>
            )}
          </div>

          <div className="flex items-center mt-1 w-12 gap-1 text-lg text-[#505F76] bg-[#ECEEF0] p-1 rounded-xl self-start">
            <CapacityIcon />
            <span className="text-[#505F76] text-sm font-semibold">{capacity}</span>
          </div>
        </div>

        <Button
          className={`w-full h-10 ${variant === 'primary' ? 'mt-3' : ''}`}
          label="Reservar →"
          onClick={() => setIsRoomDetailsOpen(true)}
        />
      </div>

      <RoomDetailsModal
        isOpen={isRoomDetailsOpen}
        onClose={() => setIsRoomDetailsOpen(false)}
        roomId={id}
        name={name}
        capacity={capacity}
        description={description}
        onReserved={setConfirmedReservation}
      />

      <ReservationConfirmedModal
        isOpen={confirmedReservation !== null}
        onClose={() => setConfirmedReservation(null)}
        roomName={name}
        day={confirmedReservation ? formatDate(confirmedReservation.startDateTime) : ''}
        time={
          confirmedReservation
            ? formatTimeRange(confirmedReservation.startDateTime, confirmedReservation.endDateTime)
            : ''
        }
      />
    </div>
  );
}