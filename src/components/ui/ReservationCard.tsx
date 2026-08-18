'use client';

import { useState } from 'react';
import { Button } from './Button';
import { CapacityIcon, CalendarIcon } from './Icons';
import { ReservationDetailsModal } from './ReservationDetailsModal';
import { CancelReservationModal } from './CancelReservationModal';
import { CompleteReservationModal } from './CompleteReservationModal';
import Image from 'next/image';
import { type Reservation } from '@/app/api/api';

type ReservationCardProps = {
  id: string;
  name: string;
  capacity: number;
  date: string;
  time: string;
  status?: 'COMPLETED' | 'SCHEDULED' | 'CANCELED';
  description?: string;
  bookedBy?: { name: string; email: string; initials: string };
  onCanceled: (reservation: Reservation) => void;
  onCompleted: (reservation: Reservation) => void;
};

const defaultBookedBy = { name: 'Você', email: 'voce@example.com', initials: 'VC' };

export function ReservationCard({
  id,
  name,
  capacity,
  date,
  time,
  status = 'SCHEDULED',
  description,
  bookedBy = defaultBookedBy,
  onCanceled,
  onCompleted,
}: ReservationCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  return (
    <div className="w-full md:w-[448px] h-auto md:h-64 bg-[#FAFAFA] border-2 border-border/30 rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center md:pr-6">
      <div className="relative w-full h-40 md:w-[178px] md:h-full shrink-0">
        <Image
          src="/images/placeholder.png"
          alt={name}
          fill
          sizes="178px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-start justify-center gap-4 w-full p-4 md:p-0 md:pl-6">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-1 text-lg text-[#505F76] p-1 rounded-xl self-start">
            <CapacityIcon />
            <span className="text-[#505F76] text-sm font-semibold">{capacity}</span>
          </div>

          <span className="font-bold text-[#191C1E] text-2xl">{name}</span>
        </div>

        <div className="text-normal text-medium gap-2 items-center justify-start">
          <div className='flex gap-2 items-center font-semibold'>
            <CalendarIcon />
            <p>{date}</p>
          </div>
          <p className='pl-9'>{time}</p>
        </div>

        <div className="flex w-full gap-2 mt-2">
          <Button variant="hollow" className="w-full h-16" label="Cancelar" onClick={() => setIsCancelOpen(true)} />
          <Button className="w-full h-16" label="Ver Detalhes" onClick={() => setIsDetailsOpen(true)} />
        </div>
      </div>

      <ReservationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onCancelReservation={() => {
          setIsDetailsOpen(false);
          setIsCancelOpen(true);
        }}
        onCompleteReservation={() => {
          setIsDetailsOpen(false);
          setIsCompleteOpen(true);
        }}
        date={date}
        time={time}
        status={status}
        roomName={name}
        capacity={capacity}
        description={description}
        bookedBy={bookedBy}
      />

      <CancelReservationModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        id={id}
        onCanceled={onCanceled}
      />

      <CompleteReservationModal
        isOpen={isCompleteOpen}
        onClose={() => setIsCompleteOpen(false)}
        id={id}
        onCompleted={onCompleted}
      />
    </div>
  );
}
